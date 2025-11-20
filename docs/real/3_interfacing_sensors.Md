---
title: Interfacing PX4 and Sensors
layout: doc
nav_title: PX4 and Sensors
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

#### Why [Mid 360](https://www.livoxtech.com/mid-360/specs). 
- 360 degree wide FOV
- Foarm Factor
- Active anti inference
- Const performace

Refer to the [Datasheets](../../assets/datasheets/Livox_Mid-360_User_Manual_EN.pdf) and [Wiki](https://livox-wiki-en.readthedocs.io/en/latest/)

#### Hardware connection

![Lidar Wiring](../../assets/images/real/wiring/mid360_eth_wiring.png)

- The power can be supplied directly from the 6S battery with a 60V capacitor for safety
- The Original cable can be terminated to have only the required lenngth and connected with the Eth connector from the connecttech to save weight.
- THe sync wires should be kept in the processes for later step.

After the physical connection is made using the Lovix connecter to the Ethernet port of the Jetson a statis network has to be made with following command.

> **Note:** We advice [modifying the static IP](https://github.com/Livox-SDK/livox_ros_driver2/issues/135) of the Livox lidar from 192.168.1.1XX to 172.16.0.XX to avoid issues assessing the local(Wifi) network when connected.



```bash
nmcli connection add type ethernet ifname eth0 con-name eth0-static ipv4.method manual ipv4.addresses 172.16.0.50/24 ipv4.gateway 255.255.255.0 ipv4.dns 8.8.8.8
nmcli connection up eth0-static

```

After the hardware connection is made the [livox_viewer2](https://www.livoxtech.com/downloads) can be used to verify connection and **firmware Update**.

#### SDK and ROS2 driver

This subsecton is recommended after setting up the docker.

Clone the [Lovox-SDK2](https://github.com/atinfinity/Livox-SDK2) and follow instructions to build. This custom SDK supports multi lidars. Set up the configuration with the device and host IPs.

For the fist time launch ```agidocker```, Compile and install the Livox-SDK2:

```shell
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

Clone the [livox_ros_driver2](https://github.com/atinfinity/livox_ros_driver2) and floow the isntructions.

```shell
cd /workspaces/lidar_ws/src
git clone https://github.com/atinfinity/livox_ros_driver2.git
cd ..
rosdep install -y -i --from-paths src/livox_ros_driver2
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
```

> **Note:** Change the point cloud mode ```xfer_format``` to 2 (0) (PointCloud2) from the ROS2 driver if you are using DLIO

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

Refer the [Wiki](https://github.com/Livox-SDK/Livox-SDK/wiki/livox-device-time-synchronization-manual), [PX4](https://discuss.px4.io/t/how-to-test-the-time-synchronization-between-radar-and-camera)

### PTP method

In the absence of GPS and PPS hardware signals, PTP v2 can be used for time synchronization between Livox LiDAR/Hub and other devices. This method requires minimal external hardware support, and only requires a master clock device in the entire network.

1. **Set [UXRCE_DDS_SYCT](https://docs.px4.io/main/en/advanced_config/parameter_reference#UXRCE_DDS_SYNCT) to ```true```** - The messages from the flight controller have their timestamp adjusted with the estimated time offset between the flight controller and the onboard computer. Thus all the ROS2 messages would have a timestamp based on the time of the onboard computer.

2. **Setup lidar side PTPv2 Sync** - Follow instructions at the [official Livox wiki](https://github.com/Livox-SDK/Livox-SDK/wiki/livox-device-time-synchronization-manual#2-instructions-of-use)

![ptp sample](../../assets/images/real/wiring/wireshark_ptp.png)

### GPS method
This synchronization method can be used when Livox Hub is connected to multiple LiDARs. Livox Hub needs to be connected to the PPS signal of the GPS receiver and the time signal in GPRMC format. At this time, the LiDAR point cloud time will be automatically corrected to the GPS time.

Livox LiDAR can also use GPS synchronization, but it needs to connect the GPRMC signal to the PC, and then send the time data to the LiDAR through the SDK protocol.

> **Note:** Not implemented or tested on Agipix as the hardware platform do not have an GPS reciever at the moment

---