---
title: Software Setup
layout: doc
wip: true
---
# Software Setup for Agipix
Prerequisit for this setup is [setting up the Docker](./3_docker_build.md))

## Setup PX4 interface software stack

This step is tested for the stable Branch `1.17.0 (stable)`

```bash
mkdir -r ~/workspace/agipix_control/src
cd ~/workspace/agipix_control/src
# clone the px4 msgs and manually sync with the Autopilot version
git clone https://github.com/PX4/px4_msgs.git
git clone https://github.com/PX4/PX4-Autopilot.git -b v1.17.0
# Sync
rm -f px4_msgs/msg/*.msg
rm -f px4_msgs/srv/*.srv
cp PX4-Autopilot/msg/*.msg px4_msgs/msg/
cp PX4-Autopilot/srv/*.srv px4_msgs/srv/
cp PX4-Autopilot/msg/versioned/*.msg px4_msgs/msg/
touch px4_version_synced_v1_17_0
rm -rf PX4-Autopilot # optionally remove 
# clone the interface lib
git clone https://github.com/Auterion/px4-ros2-interface-lib -b release/1.17
```
Verify versions
```bash
## to verify compatibility
cd ~/workspace/agipix_control/src/px4-ros2-interface-lib 
./scripts/check-message-compatibility.py -v path/to/px4_msgs/ path/to/PX4-Autopilot/
```
build
```bash
agidocker
# *** Inside agidocker
cd /workspaces/agipix_control
colcon build --packages-select px4_msgs
colcon build --packages-select px4_ros2_cpp

```
### Install [Agi-Logger](https://github.com/SasaKuruppuarachchi/agi_logger)
```bash
cd ~/workspace/logging/src
git clone https://github.com/SasaKuruppuarachchi/agi_logger.git
agidocker
# *** Inside agidocker
cd /workspaces/logging/src/agi_logger
pip install -e .
```

## Host time sync: PTP for the LiDAR

On the Jetson **host** (not in the container), install the software PTP master that puts the Livox Mid-360 on the Jetson clock. Save the unit file from [Hardware Synchronisation](./5_hardware_synchronisation.md#install) as `ptp4l-livox.service`, then:

```bash
sudo apt install linuxptp
sudo install -m 644 ptp4l-livox.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now ptp4l-livox.service
```

Check with `journalctl -u ptp4l-livox` (port state `LISTENING` → `MASTER`); the Livox driver then reports `timestamp_type` 1 (PTP).

## Sim setup

See [Instructions](../sim/2_setup_sim.md) to continue.

## Agipix Autonomy stack setup

Now we are ready for autonomy setup. See [Instructions](../autonomy/1_perception.md) to continue.