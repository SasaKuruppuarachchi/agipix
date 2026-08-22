---
title: Hardware & Communication Optimizations
layout: doc
nav_title: Hardware Optimizations
---

# Jetson & PX4 Hardware & Communication Optimizations

This guide provides the complete step-by-step procedure to implement the two critical system fixes documented in the hardware time synchronization investigation:

1. **Linux Kernel UDP Buffer & Ethernet NIC Tuning** (Prevents Livox Mid-360 UDP packet drops & frame jitter).
2. **PX4 Micro-XRCE-DDS Bridge & Jetson High-Speed Serial Tuning on `/dev/ttyTHS2`** (Eliminates IMU telemetry dropouts and DDS latency spikes).

---

```
                                  JETSON COMPANION COMPUTER
┌───────────────────────────┐     ┌─────────────────────────────────────────────────────────┐
│   Livox Mid-360 LiDAR     │     │  Kernel UDP Socket Buffer: 32 MB                        │
│   (10 Hz Cloud + 200Hz IMU│────►│  NIC RX Ring Buffer: 4096 Descriptors                   │
└───────────────────────────┘ UDP │  Network Backlog: 10,000 packets                        │
                              eth │                                                         │
                                  │  MicroXRCEAgent (Baud: 921600 / Low-Latency Mode)       │
┌───────────────────────────┐     │  /dev/ttyTHS2 (Tegra High-Speed UART)                   │
│   PX4 Flight Controller   │────►│  ▲                                                      │
│   (TELEM2 / DDS Client)   │UART │  │                                                      │
└───────────────────────────┘     └──┴──────────────────────────────────────────────────────┘
```

---

## Part 1: Livox UDP Kernel & NIC Ring Buffer Tuning

### 1.1 Problem Statement
The Livox Mid-360 streams dense point clouds and IMU data as unthrottled UDP packets. Linux default socket buffers (`~212 KB`) overflow during CPU spikes or thread preemption, resulting in dropped frames and distorted scan spans.

---

### 1.2 Permanent Kernel Sysctl Configuration

1. Create a dedicated sysctl configuration file:
   ```bash
   sudo nano /etc/sysctl.d/99-livox-udp.conf
   ```

2. Add the following parameters:
   ```ini
   # Increase maximum and default socket receive buffer sizes to 32 MB
   net.core.rmem_max = 33554432
   net.core.rmem_default = 33554432

   # Increase maximum and default socket send buffer sizes to 16 MB
   net.core.wmem_max = 16777216
   net.core.wmem_default = 16777216

   # Increase maximum amount of backlogged packets on the network card input queue
   net.core.netdev_max_backlog = 10000

   # Set minimum UDP receive buffer size to 16 KB
   net.ipv4.udp_rmem_min = 16384
   ```

3. Apply changes immediately without rebooting:
   ```bash
   sudo sysctl --system
   ```

---

### 1.3 Ethernet NIC Hardware RX Ring Buffer Expansion

Jetson onboard Ethernet controllers (e.g., `eth0` or `eth1`) typically default to a ring buffer of 256 or 512 descriptors. Maximize this to **4096** to absorb micro-bursts from the LiDAR.

1. Check current and maximum supported ring buffer sizes:
   ```bash
   sudo ethtool -g eth0
   ```

2. Expand the RX ring buffer to the hardware maximum (4096):
   ```bash
   sudo ethtool -G eth0 rx 4096
   ```

3. **Make the NIC setting permanent across reboots** by creating a systemd service:
   ```bash
   sudo nano /etc/systemd/system/nic-ring-buffer.service
   ```

   Add the following service definition:
   ```ini
   [Unit]
   Description=Set Ethernet RX Ring Buffer to 4096 for Livox LiDAR
   After=network.target

   [Service]
   Type=oneshot
   ExecStart=/usr/sbin/ethtool -G eth0 rx 4096
   RemainAfterExit=yes

   [Install]
   WantedBy=multi-user.target
   ```

4. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now nic-ring-buffer.service
   ```

---

### 1.4 Verification (UDP Stream)
To verify that no packets are being dropped by the kernel:
```bash
# Check UDP receive buffer errors (RcvbufErrors should remain 0 while streaming LiDAR)
netstat -su | grep "buffer errors"
```

---

## Part 2: PX4 Micro-XRCE-DDS Bridge & Jetson `/dev/ttyTHS2` Tuning

### 2.1 Jetson High-Speed Serial (`/dev/ttyTHS2`) Optimizations

Jetson uses the Tegra High-Speed UART driver (`ttyTHS*`). By default, the serial driver buffers incoming bytes in a FIFO for a timeout window before delivering them to userspace. For real-time IMU streaming at 100–200 Hz, we configure **low-latency mode** and elevated process priority.

#### Step 1: Install `setserial` & Configure User Permissions
```bash
sudo apt-get update && sudo apt-get install -y setserial

# Add user to dialout and tty groups
sudo usermod -aG dialout,tty $USER
```

#### Step 2: Create a Udev Rule for `/dev/ttyTHS2` Latency & Permissions
Create `/etc/udev/rules.d/99-tegra-uart-latency.rules`:
```bash
sudo nano /etc/udev/rules.d/99-tegra-uart-latency.rules
```

Add the following rule:
```udev
KERNEL=="ttyTHS2", MODE="0666", GROUP="dialout", RUN+="/bin/setserial /dev/ttyTHS2 low_latency"
```

Reload udev rules:
```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

#### Step 3: Verify Low-Latency Mode on `/dev/ttyTHS2`
```bash
setserial -g /dev/ttyTHS2
# Output should include: Flags: ... low_latency
```

---

### 2.2 Micro-XRCE-DDS Agent Setup on Jetson

Run the Micro-XRCE-DDS Agent at **921600 baud** (or up to 2,000,000 baud if PX4 hardware allows).

#### Run Interactively:
```bash
MicroXRCEAgent serial --dev /dev/ttyTHS2 -b 921600 -v 4
```

#### Make Micro-XRCE-DDS Agent a Persistent System Service:
1. Create `/etc/systemd/system/micro-xrce-agent.service`:
   ```bash
   sudo nano /etc/systemd/system/micro-xrce-agent.service
   ```

2. Add the configuration:
   ```ini
   [Unit]
   Description=Micro-XRCE-DDS Agent on /dev/ttyTHS2
   After=network.target

   [Service]
   Type=simple
   ExecStart=/usr/local/bin/MicroXRCEAgent serial --dev /dev/ttyTHS2 -b 921600
   Restart=always
   RestartSec=2
   CPUSchedulingPolicy=rr
   CPUSchedulingPriority=80
   Nice=-20

   [Install]
   WantedBy=multi-user.target
   ```
   > [!TIP]
   > `CPUSchedulingPolicy=rr` with `CPUSchedulingPriority=80` prevents Linux thread preemption from causing DDS transport drops when running heavy algorithms like LIO or mapping.

3. Enable and start:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now micro-xrce-agent.service
   ```

---

### 2.3 PX4 Autopilot Configuration

Connect the PX4 port (typically **TELEM2**) to the Jetson `/dev/ttyTHS2` RX/TX pins (Jetson Pin 8/10 on 40-pin header for UART2, with GND connected).

#### Parameter Configuration (via QGroundControl):

| Parameter | Value | Description |
|---|---|---|
| `UXRCE_DDS_CFG` | `TELEM2` (or `102`) | Assigns uXRCE-DDS Client to TELEM2 serial port |
| `SER_TEL2_BAUD` | `921600 8N1` | Sets TELEM2 baud rate to 921,600 |
| `UXRCE_DDS_PRT` | `0` (Default) | Client Domain ID |
| `UXRCE_DDS_KEY` | `0` (Default) | Client Key |

> [!IMPORTANT]
> Reboot PX4 after modifying `UXRCE_DDS_CFG` and `SER_TEL2_BAUD` for the port reassignment and baud rate to take effect.

---

### 2.4 Diagnostic & Verification Commands

#### 1. On PX4 (via MAVLink NSH Console):
```bash
# Check DDS Client status, connection health, and packet counters
uxrce_dds_client status
```
*Expected Output:*
```text
INFO  [uxrce_dds_client] Running, Connected: yes
INFO  [uxrce_dds_client] Device: /dev/ttyS3, Baudrate: 921600
INFO  [uxrce_dds_client] Received: ... bytes, Sent: ... bytes
```

#### 2. On Jetson (ROS 2 Humble):
```bash
# Check PX4 IMU publication rate and stability
ros2 topic hz /drone0/px4_imu
# Expected: steady rate (~100 Hz or configured rate) without gaps > 0.05s

# Check Livox Internal IMU publication rate
ros2 topic hz /drone0/livox/imu
# Expected: steady 200.0 Hz with 0 dropped frames
```

---

## Part 3: Quick Setup Verification Checklist

- [ ] `/etc/sysctl.d/99-livox-udp.conf` created and applied (`sysctl net.core.rmem_max` shows `33554432`).
- [ ] `ethtool -g eth0` shows RX ring buffer set to `4096`.
- [ ] `/dev/ttyTHS2` has `low_latency` flag set via udev or `setserial`.
- [ ] Jetson user has access to `dialout` and `tty` groups.
- [ ] PX4 parameters `UXRCE_DDS_CFG` and `SER_TEL2_BAUD` set to `TELEM2` and `921600`.
- [ ] `MicroXRCEAgent` running at 921600 baud with real-time priority.
- [ ] Zero packet errors reported in `netstat -su` and `uxrce_dds_client status`.