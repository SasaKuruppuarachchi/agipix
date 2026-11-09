---
title: Interfacing PX4 and Sensors
layout: doc
nav_title: PX4 and Sensors
---

# Interfacing PX4 and Sensors

## 1) Wiring up PX4
Wire the Pixhawk up as shown in the diagram. Refer to the [official guide](https://docs.px4.io/main/en/assembly/quick_start_pixhawk4)
![px4 wiring](../../../assets/images/real/wiring/px4_wiring.png)

---

## 2) Connecting Px4
### PX4 Parameter setup

Flash the Pixhawk with the latest stable branch using QGroundControl. PX4 `v1.17.0` is tested on the drone (Cube Orange+, `cubepilot_cubeorangeplus_default`). The drone runs a custom v1.17.0 build with three small patches; see [Custom PX4 firmware](#custom-px4-firmware-v1170--patches) below.

Parameters changed from the PX4 v1.17.0 defaults on the tested drone. Calibration values (`CAL_*`, `SENS_BOARD_*_OFF`, `RC*_MIN/MAX/TRIM`) are specific to each vehicle and are not listed. Run the QGroundControl calibrations instead.

| Group | Parameter | Value | Notes |
|---|---|---|---|
| Airframe | `SYS_AUTOSTART` | 4001 | Generic quadcopter |
| | `CA_ROTOR0_PX` / `_PY` | 0.10 / 0.1315 | |
| | `CA_ROTOR1_PX` / `_PY` | -0.10 / -0.13 | |
| | `CA_ROTOR2_PX` / `_PY` / `_KM` | 0.10 / -0.13 / -0.05 | |
| | `CA_ROTOR3_PX` / `_PY` / `_KM` | -0.10 / 0.13 / -0.05 | |
| Outputs | `PWM_MAIN_FUNC1-4` | 101-104 | Motors 1-4 (ESCs on MAIN). Tentative; see note |
| | `PWM_MAIN_MIN1-4` / `PWM_MAIN_MAX1-4` | 1100 / 1900 | Tentative; see note |
| | `PWM_AUX_FUNC5` | 2064 | AUX5 = PPS input (time sync) |
| Battery | `BAT1_N_CELLS` | 6 | |
| | `BAT1_V_CHARGED` / `BAT1_V_EMPTY` | 4.2 / 3.5 | |
| | `BAT1_A_PER_V` / `BAT1_V_DIV` | 17.0 / 12.27 | Calibrate against a multimeter |
| | `BAT_CRIT_THR` / `BAT_EMERGEN_THR` | 0.10 / 0.05 | |
| | `COM_LOW_BAT_ACT` | 2 | Land |
| RC | `RC_MAP_THROTTLE` / `YAW` / `PITCH` / `ROLL` | 1 / 2 / 3 / 4 | |
| | `RC_MAP_FLTMODE` / `ARM_SW` / `LOITER_SW` / `OFFB_SW` / `KILL_SW` | 5 / 6 / 7 / 8 / 9 | |
| | `MAN_ARM_GESTURE` | 0 | Arm with the switch only |
| Flight modes | `COM_FLTMODE1-6` | 8, 2, 10, 100, 101, 11 | Stabilized, Position, Takeoff, External 1, External 2, Land. Under review; see note |
| Uplink (Jetson) | `UXRCE_DDS_CFG` | 102 | TELEM2 |
| | `SER_TEL2_BAUD` | 1500000 | |
| | `UXRCE_DDS_DOM_ID` | 5 | |
| | `UXRCE_DDS_SYNCC` / `UXRCE_DDS_SYNCT` | 1 / 1 | |
| | `UXRCE_DDS_TX_TO` | 5 | |
| | `MAV_0_MODE` | 7 | |
| | `MAV_PROTO_VER` | 2 | |
| ESP32 link | `MAV_1_CONFIG` / `MAV_1_MODE` | 202 (GPS2) / 11 | |
| | `SER_GPS2_BAUD` | 57600 | |
| CAN sensors | `UAVCAN_ENABLE` | 2 | |
| | `UAVCAN_SUB_FLOW` / `UAVCAN_SUB_RNG` | 1 / 1 | HereFlow |
| | `UAVCAN_SUB_GPS` / `UAVCAN_SUB_GPS_R` / `UAVCAN_SUB_MAG` | 0 / 0 / 0 | |
| GPS-denied | `SYS_HAS_GPS` | 0 | |
| | `GPS_1_CONFIG` | 0 | |
| | `EKF2_GPS_CTRL` | 0 | |
| | see the time-sync / EKF2 table below | | |
| EKF2 | `EKF2_MULTI_IMU` | 3 | |
| | `EKF2_RNG_A_HMAX` / `EKF2_RNG_FOG` | 10 / 1.0 | |
| | `EKF2_OF_POS_X` | -0.115 | |
| | `EKF2_GPS_POS_X` / `_Z` | -0.055 / -0.05 | |
| | `EKF2_RNG_CTRL` / `EKF2_OF_CTRL` | 0 / 0 | |
| | `EKF2_NOAID_TOUT` | 2 s | |
| Sensors | `IMU_GYRO_RATEMAX` / `IMU_INTEG_RATE` | 800 / 250 | |
| | `SENS_IMU_MODE` | 0 | |
| Failsafe | `COM_RC_LOSS_T` / `NAV_RCL_ACT` | 1.0 s / 3 | Land on RC loss |
| | `COM_RC_IN_MODE` | 0 | |
| | `COM_FLTT_LOW_ACT` | 1 | |
| | `RTL_RETURN_ALT` / `RTL_DESCEND_ALT` | 3 / 10 | RTL is unavailable without GPS; values not tuned |
| Speed limits | `MPC_VEL_MANUAL` / `MPC_XY_VEL_MAX` | 2.0 / 2.0 | m/s |
| | `MPC_Z_VEL_MAX_UP` / `MPC_Z_VEL_MAX_DN` | 1.0 / 0.8 | m/s |
| | `MPC_Z_V_AUTO_UP` / `MPC_Z_V_AUTO_DN` | 1.0 / 0.7 | m/s |
| | `MPC_TKO_SPEED` | 0.8 | m/s |
| | `MPC_XY_CRUISE` | 1.0 | m/s |
| | `MPC_MAN_TILT_MAX` | 25 | Degrees |
| Mission | `MIS_TAKEOFF_ALT` | 1.5 | |
| | `NAV_ACC_RAD` | 2.0 | |
| Tuning | `MC_AT_EN` | 1 | |
| | `SYS_VEHICLE_RESP` | -0.46 | Sets the `MPC_ACC_*` / `MPC_JERK_*` values |
| | `MPC_MAN_Y_MAX` / `MPC_MAN_Y_TAU` | 158 / 0.32 | |
| Logging | `SDLOG_PROFILE` | 3 | |

> **Note:** the failsafe, speed-limit, battery-threshold and logging values were set on the drone and read back on 2026-11-09. The row marked "under review" records the flight-mode slots the drone ran on 2026-11-08, which are still changing. Rows marked "tentative" are awaiting the QGroundControl motor test.

Parameters set for the time sync and the GPS-denied EKF2 setup (2026-11):

| Parameter | Value | Why |
|---|---|---|
| `EKF2_MAG_TYPE` | 5 (None) | No magnetometer fusion; heading comes from the LIO external vision (see below) |
| `EKF2_EV_CTRL` | 11 | Fuse external-vision horizontal position, vertical position and yaw |
| `EKF2_HGT_REF` | 3 (Vision) | Height reference from the LIO |
| `EKF2_GPS_CTRL` | 0 | No GPS |
| `EKF2_EV_QMIN` | 0 | Accept every EV sample |
| `UXRCE_DDS_SYNCT` | 1 | uXRCE-DDS timesync with the Jetson |
| `PPS_CAP_ENABLE` | 1 | Custom build only: capture the ESP32 trigger edges (reboot needed) |
| `PWM_AUX_FUNC5` | 2064 | AUX5 = PPS input for `pps_capture` |

The ESP32 MAVLink link parameters (`MAV_1_CONFIG=GPS2`, `SER_GPS2_*`) are in [Hardware Synchronisation](./5_hardware_synchronisation.md).

### Compass and EKF2 heading (GPS-denied)

The drone flies GPS-denied, with the magnetometer **off** in EKF2 (`EKF2_MAG_TYPE=5`). The LIO (LiDAR-inertial odometry) is sent to PX4 as external vision in the **NED** frame, and EKF2 takes the heading from it. The preflight check passes with this setup.

Why not the compass:
- With the compass on, a magnetometer calibration change on the ground clears EKF2's yaw alignment and stops vision position fusion, so arming in Position mode is refused. It happens without any user action too: PX4 writes the EKF-learned magnetometer offsets back to the calibration at every disarm.
- Sending EV in the **FRD** frame also avoids it, but PX4's heading then stays "not aligned" (no yaw hold in Auto modes).
- FRD with the compass on was worst: in simulation, short vision dropouts caused heading resets of ±54°.

So: **NED + no compass**.


### Hardware wiring
The Px4 serial runs TTL level logic and the connecttech Hadron carier runs Rs-232 level logic. We need to use [RS-232 To TTL Conveter (MAX3232IDR)](https://www.seeedstudio.com/RS-232-To-TTL-Conveter-MAX3232IDR-p-2851.html?srsltid=AfmBOoorzzVt8cIBUow6n3hfHMCEcNNeEVksGzzTceETeoXjmvNJLtpT) to establish connection.

The wiring should look like below.

![Px4 Wiring](../../../assets/images/real/wiring/px4_peer.png)

![Px4 Wiring](../../../assets/images/real/wiring/rs232_converter.png)

> **Note:** In each connection, wire TX -> RX and RX -> TX

## Flash PX4 with custom bootloader

### Install toolchain on host machine (Jetson)

```bash
# Linux packages
sudo apt install git make cmake python3-pip

# Python packages
pip install kconfiglib jinja2 empy jsonschema pyros-genmsg packaging toml numpy future

cd $HOME
git clone https://github.com/PX4/PX4-Autopilot.git -b v1.17.0 --recursive
cd PX4-Autopilot

# 1. Run the official PX4 Ubuntu setup script (it handles apt packages and toolchains)
cd ~/PX4-Autopilot
bash Tools/setup/ubuntu.sh

# 2. Restart your terminal session to apply the new path modifications
exec bash
```
### Build the firmware 

```bash
make cubepilot_cubeorangeplus_default
```

### Flash the firmware 

**Manual Flashing via GUI:** You want to generate the .px4 file on your machine but prefer to flash it manually using QGroundControl's custom firmware option

1. Generate firmware
```bash
make cubepilot_cubeorangeplus_default
```
2. Flash firmware using QGC
1. Open QGC 
2. Go to **Vehicle Setup** > **Firmware** > scroll to the bottom > click **Custom Firmware** 
3. Select the generated .px4 file from your build directory (e.g., ~/PX4-Autopilot/build/cubeorangeplus_default/px4_firmware/nuttx-px4fmu-v3.bin).
4. Start flashing
5. Follow the on-screen instructions to complete the update

**Auto upload:** You want to generate and upload the firmware directly from the terminal

```bash
make cubepilot_cubeorangeplus_default upload
```

### Custom PX4 firmware (v1.17.0 + patches)

The drone runs PX4 v1.17.0 for the Cube Orange+ with three patches, applied in order to a clean `v1.17.0` checkout before `make cubepilot_cubeorangeplus_default`:

| Patch | Change |
|---|---|
| 01 | `src/modules/uxrce_dds_client/dds_topics.yaml`: `rate_limit: 400.` on `/fmu/out/sensor_combined`, so the PX4 IMU reaches the Jetson at its full rate (~200 Hz) instead of 100 Hz |
| 02 | MAVLink `SYSTEM_TIME` sends the DDS-synced companion time: hrt minus the converged uXRCE-DDS offset (`src/lib/timesync/Timesync.{hpp,cpp}`, `src/modules/mavlink/streams/SYSTEM_TIME.hpp`). After a link drop it holds the last offset; before the first convergence it is stock. The ESP32 time bridge on GPS2 then locks to Jetson time |
| 03 | `CONFIG_DRIVERS_PPS_CAPTURE=y` in `boards/cubepilot/cubeorangeplus/default.px4board`, and `/fmu/out/pps_capture` added to `dds_topics.yaml`. Only its `timestamp` is meaningful (in Jetson time); `rtc_timestamp` assumes a GNSS receiver |

Patch 01 in full:

```yaml
  - topic: /fmu/out/sensor_combined
    type: px4_msgs::msg::SensorCombined
    rate_limit: 400.
```

Flash the `.px4` with QGC's **Custom Firmware** option (above). Parameters are kept across the flash. Then set `PPS_CAP_ENABLE=1` and `PWM_AUX_FUNC5=2064` (AUX5 = PPS input, on Timer4) and `EKF2_MAG_TYPE=5`, and reboot PX4. Keep `SENS_EN_LL40LS=0` and `FD_EXT_ATS_EN=0` (they also use AUX5). The trigger wiring and the time-sync details are in [Hardware Synchronisation](./5_hardware_synchronisation.md).


### Verify connection
To verify hardware level connections use ```minicom```. Set (Using the QgrundControl Parameter editer) and change port number and baudrates accordingly.
```bash
minicom -D /dev/ttyTHS2 -b 921600 -o -8
```

#### MicroXRCE DDS Primary link -> THS2
![dds](../../../assets/images/real/wiring/dds.png)
To verify primary control link to the Px4 Run this **AFTER** installing and launching ```agidocker```
```bash
agidocker
# *** Inside agidocker
cd /workspaces/dds
git clone -b v2.4.3 https://github.com/eProsima/Micro-XRCE-DDS-Agent.git
cd Micro-XRCE-DDS-Agent

```
According to the Fast RTPS documentation specify the ROS2 domain ID by adding the following to the participant profile into the `agent.refs`

```xml
<participant .....>
    <rtps>
        .....
        <builtin>
            <domainId>15</domainId>
        </buitin>
    </rtps>
</participan
```

```bash
# *** Inside agidocker
mkdir build
cd build
cmake ..
make
sudo make install
sudo ldconfig /usr/local/lib/
sudo MicroXRCEAgent serial --dev /dev/ttyTHS2 -b 921600
```
#### MavLink Secondary telemetry link -> THS1
This link is for routing the Mavlink Trafic to a Ground station in the local network or to internet

Install and follow [Mavlink Anywhere guide](https://github.com/alireza787b/mavlink-anywhere)
1. **Clone the repository:**
   ```sh
   # *** On the Host machine (not inside the container)
   cd ~/workspace/dds
   git clone https://github.com/alireza787b/mavlink-anywhere.git
   cd mavlink-anywhere
   ```
2. **Run the installation script:**
   ```sh
   chmod +x install_mavlink_router.sh
   sudo ./install_mavlink_router.sh
   ```

3. **Run the configuration script:**
   ```sh
   chmod +x configure_mavlink_router.sh
   sudo ./configure_mavlink_router.sh
   ```
2. **Follow the prompts to set up UART device, baud rate, and UDP endpoints:**
   - If an existing configuration is found, the script will use these values as defaults and show them to you
   - **UART Device**: Set this to `/dev/ttyTHS1`. This is the serial port connected to the mavlink of PX4.
   - **Baud Rate**: Default is `57600`. This is the communication speed between the companion computer and connected devices
   - **UDP Endpoints**: Input the ground station ip. Default is `0.0.0.0:14550`. You can enter multiple endpoints separated by spaces (e.g., `100.110.200.3:14550 100.110.220.4:14550`), `14550` is the default port QGC connets to.

2. **Connecting with QGroundControl**
Use QGroundControl to connect to your companion computer's IP address on the configured UDP endpoints. For internet-based telemetry, make sure to follow the setup video to properly register your devices on your chosen VPN system or configure port forwarding on your router.



- **Check the status of the service:**
  ```sh
  sudo systemctl status mavlink-router
  ```
- **View detailed logs:**
  ```sh
  sudo journalctl -u mavlink-router -f
  ```
- **Check uxrce_dds_client status**
go into the MAVLink consol of QGC and 
  ```sh
  nsh> uxrce_dds_client status
  INFO  [uxrce_dds_client] Running, connected
  INFO  [uxrce_dds_client] Using transport:     serial
  INFO  [uxrce_dds_client] Payload tx:          65072 B/s
  INFO  [uxrce_dds_client] Payload rx:          0 B/s
  INFO  [uxrce_dds_client] timesync converged: true
  uxrce_dds_client: cycle: 49416 events, 174925511us elapsed, 3539.86us avg, min 136us max 1013110us 12206.498us rms
  uxrce_dds_client: cycle interval: 49424 events, 21668.49us avg, min 137us max 890938308us 4007537.750us rms
  ```

> ***Troubleshoot*** : If `ros2 topic list`do not show the /fmu/.. topics, check if the domain id settings match between the **ROS2** in the docker, **uxrce_dds_client** and the **MicroXRCEAgent**

#### Bench and bring-up notes

- **Don't hot-plug the Cube USB.** Plugging or unplugging the USB cable while PX4 is powered caused two PX4 hard faults, in the USB MAVLink connection. Use the network MAVLink route instead: mavlink-router on the Jetson, TCP 5760. After a hard fault, PX4 refuses to arm ("Crash dumps present on SD card") until the `fault_*.log` file is moved out of the SD card's root folder.
- **Don't arm on a bench supply.** A 24 V / 3 A bench supply cannot spin the motors, and the Jetson browns out and reboots. Run motor tests on the flight battery, with the props off.
- **Battery current reads 0 A** on the current build, although the voltage is correct. Don't rely on current-based battery estimates until the power-module calibration is checked.
- **DDS after a PX4 reboot.** The link usually reconnects by itself within about a minute. Sometimes it comes back one-way: `uxrce_dds_client status` shows `Payload rx: 0 B/s` and PX4 receives nothing from the companion. Restart the MicroXRCEAgent to fix it.

---

#### [Smart WiFi Manager Project](https://github.com/alireza787b/smart-wifi-manager)
Implement this if you need safe switiching between wifi APs
```bash
cd ~/workspace/dds
git clone https://github.com/alireza787b/smart-wifi-manager.git
cd smart-wifi-manager
sudo bash install.sh
sudo systemctl status smart-wifi-manager.service
sudo ./configure_smart_wifi_manager.sh
```

#### [NetBird VPN](https://netbird.io/)
NetBird can be used to 
- SSH to the drone over internet
- Forward data links like Mavlink telemetry over the internet
- Forward lightweight UI over the internet

```bash
curl -fsSL https://pkgs.netbird.io/install.sh | sh
netbird up 

# to add ssh keys to the remote host
ssh-copy-id sasa@<hostname>

# to reset key of ssh connections 
ssh-keygen -f "/home/sasa/.ssh/known_hosts" -R "<hostname>"


# Reconfigure mavlink router to add the GS ip over netbird
cd ~/workspace/dds/smart-wifi-manager
sudo ./configure_mavlink_router.sh
```

## 3) Interfacing and Verifying sensor connection


### Livox Lidar

#### Why [Mid 360](https://www.livoxtech.com/mid-360/specs). 
- 360 degree wide FOV
- Foarm Factor
- Active anti inference
- Const performace

Refer to the [Datasheets](../../../assets/datasheets/Livox_Mid-360_User_Manual_EN.pdf) and [Wiki](https://livox-wiki-en.readthedocs.io/en/latest/)

#### Hardware connection

![Lidar Wiring](../../../assets/images/real/wiring/mid360_eth_wiring.png)

- The power can be supplied directly from the 6S battery with a 60V capacitor for safety
- The Original cable can be terminated to have only the required lenngth and connected with the Eth connector from the connecttech to save weight.
- THe sync wires should be kept in the processes for later step.

After the physical connection is made using the Lovix connecter to the Ethernet port of the Jetson a statis network has to be made with following command.

> **Note:** We advice [modifying the static IP](https://github.com/Livox-SDK/livox_ros_driver2/issues/135) of the Livox lidar from 192.168.1.1XX to 172.16.0.XX to avoid issues assessing the local(Wifi) network when connected.


Add the static wired connection using the GUI or CLI as follows, Following command assumes the ethernet interface is **enP8p1s0** and lidar ip is **172.16.0.50**.
```bash
sudo nmcli connection add type ethernet ifname enP8p1s0 con-name static-link ipv4.method manual ipv4.addresses 172.16.0.50/24 ipv4.gateway 172.16.0.1 ipv4.dns 8.8.8.8
sudo nmcli connection up static-link
```

After the hardware connection is made the [livox_viewer2](https://www.livoxtech.com/downloads) can be used to verify connection and **firmware Update**.

#### SDK and ROS2 driver

This subsecton is recommended after setting up the docker.

Clone the [Lovox-SDK2](https://github.com/atinfinity/Livox-SDK2) and follow instructions to build. This custom SDK supports multi lidars. Set up the configuration with the device and host IPs.

For the fist time launch ```agidocker```, Compile and install the Livox-SDK2:

```shell
agidocker
# Inside agidocker
cd /workspaces/lidar_ws/src
git clone https://github.com/atinfinity/Livox-SDK2.git
cd Livox-SDK2
touch COLCON_IGNORE
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release .. && make -j
sudo make install
sudo ldconfig
```

Clone the [livox_ros_driver2](https://github.com/atinfinity/livox_ros_driver2) and follow the instructions.

```bash
agidocker
# Inside agidocker
cd /workspaces/lidar_ws/src
git clone https://github.com/SasaKuruppuarachchi/livox_ros_driver2.git
cd ..
rosdep update
rosdep install -y -i --from-paths src/livox_ros_driver2
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
```

> **Note:** 
> - In `launch/msg_MID360_launch.py` change the point cloud mode ```xfer_format``` to 0 (1) Pointcloud2(PointXYZRTL) from the ROS2 driver if you are using DLIO.
> - `src/comm/pub_handler.cpp` has been modified to Skip points inside the bounding box of the robot.
> - In `config/MID360_config.json` updated the sensor IP and the pitch to correlate to the 45 degree pitch of the Lidar

##### Verify
```bash
ros2 launch livox_ros_driver2 rviz_MID360_launch.py
```


#### [DDS tuning](https://autowarefoundation.github.io/autoware-documentation/main/installation/additional-settings-for-developers/network-configuration/dds-settings/) to accomadate looseless pointcloud transfer (Optional)

##### 1. Tune system-wide network settings

- For fast DDS Add the following to:

```
/etc/sysctl.d/10-fastdds.conf
```

- For Cyclone DDS Add the following to:

```
/etc/sysctl.d/10-cyclonedds.conf
```



Then reboot Ubuntu.

```
net.core.rmem_max=2147483647  
net.core.rmem_default=2147483647  
net.core.wmem_max=2147483647  
net.core.wmem_default=2147483647  
net.ipv4.ipfrag_time=3  
net.ipv4.ipfrag_high_thresh=134217728
```

##### 2. Make configuration of Fast DDS

Create a configuration file:

```
$HOME/fastdds.xml
```

Refer to the default configuration here:
**[DEFAULT_FASTRTPS_PROFILES.xml](https://github.com/TheGoncaloSilva/middleware_test/blob/main/publisher/src/DEFAULT_FASTRTPS_PROFILES.xml)**

##### 3. Enable custom configuration for Fast DDS

  * Add the following description to `$HOME/.bashrc`.

<!-- end list -->

```bash
export FASTRTPS_DEFAULT_PROFILES_FILE=$HOME/fastdds.xml
export RMW_FASTRTPS_USE_QOS_FROM_XML=1
```

  * Please reopen terminal.





### Monocular Camera
Connect the camera to a USB port and check that Linux sees it:

```bash
v4l2-ctl --list-devices        # package v4l-utils
v4l2-ctl -d /dev/video0 --list-formats-ext
```

The camera should appear as a `/dev/videoN` device and list its MJPG/YUYV resolutions.

### Realsense Cameras
Install libraries on the host side for realsense cameras. This also installs udev rules for the camera

```bash
# Ensure the directory exists
sudo mkdir -p /etc/apt/keyrings

# Download and dearmor
curl -sSf https://librealsense.realsenseai.com/Debian/librealsenseai.asc | \
gpg --dearmor | sudo tee /etc/apt/keyrings/librealsenseai.gpg > /dev/null

echo "deb [signed-by=/etc/apt/keyrings/librealsenseai.gpg] https://librealsense.realsenseai.com/Debian/apt-repo `lsb_release -cs` main" | \
sudo tee /etc/apt/sources.list.d/librealsense.list
sudo apt-get update

sudo apt-get install librealsense2-utils
sudo apt-get install librealsense2-dev
```

Connect the camera to the USB interface and verify 
```bash
agidocker 
# Inside agidocker use this commnad
realsense-viewer
```
If the connection is stable you can move on to launching `realsense2_camera` ROS2 package

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

Next step is [Hardware Synchronisation](./5_hardware_synchronisation.md)