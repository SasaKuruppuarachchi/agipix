---
title: Flashing Jetson & Carrier
layout: doc
nav_title: Interfacing PX4 and Sensors
---

# Interfacing PX4 and Sensors

## 1)Wiring up PX4

TODO

---

## 2) Connecting Px4
### PX4 Parameter setup
List of all the updated parmeters
TODO


### Hardware wiring
The Px4 serial runs TTL level logic and the connecttech Hadron carier runs Rs-232 level logic. We need to use [RS-232 To TTL Conveter (MAX3232IDR)](https://www.seeedstudio.com/RS-232-To-TTL-Conveter-MAX3232IDR-p-2851.html?srsltid=AfmBOoorzzVt8cIBUow6n3hfHMCEcNNeEVksGzzTceETeoXjmvNJLtpT) to establish connection.

The wiring should look like below.
![Px4 Wiring](../../assets/images/real/wiring/px4_peer.png)
![Px4 Wiring](../../assets/images/real/wiring/rs232_converter.png)

> **Note:** In each connection, wire TX -> RX and RX -> TX

### Verify connection
To verify hardware level connections use ```minicom```. Set (Using the QgrundControl Parameter editer) and change port number and baudrates accordingly.
```bash
sudo MicroXRCEAgent serial --dev /dev/ttyTHS2 -b 921600
```

#### MicroXRCE DDS Primary link -> THS2
To verify primary control link to the Px4 Run this **AFTER** installing and launching ```agidocker```
```bash
# Inside agidocker
sudo MicroXRCEAgent serial --dev /dev/ttyTHS2 -b 921600
```
#### MavLink Secondary telemetry link -> THS1
This link is for routing the Mavlink Trafic to a Ground station in the local network or to internet

Install and follow [Mavlink Anywhere guide](https://github.com/alireza787b/mavlink-anywhere)

---

## 3) Interfacing and Verifying sensor connection


### Livox Lidar

Refer to the [Datasheets](../../assets/datasheets/Livox_Mid-360_User_Manual_EN.pdf)
![Lidar Wiring](../../assets/images/real/wiring/mid360_eth_wiring.png)
After the physical connection is made using the Lovix connecter to the Ethernet port of the Jetson a statis network has to be made with following command.

```bash
nmcli connection add type ethernet ifname eth0 con-name eth0-static ipv4.method manual ipv4.addresses 172.16.0.50/24 ipv4.gateway 255.255.255.0 ipv4.dns 8.8.8.8
nmcli connection up eth0-static

```

After the hardware connection is made the ```livox_viewer``` can be used to verify connection TODO

### Monocular Camera
Connect the camera to the USB interface and verify TODO

### Realsense Cameras
Connect the camera to the USB interface and verify TODO

### Depth AI setup for OAK-D cameras (Optional)

```bash
curl -fL https://docs.luxonis.com/install_dependencies.sh | bash

## later
cd isaac_ros_common/docker/
git clone https://github.com/luxonis/depthai-python.git
cd depthai-python/
git submodule update --init --recursive
```
---

## 7) Hardware Syncronisation

TODO

---