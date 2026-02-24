---
title: Software Setup
layout: doc
---
# Software Setup for Agipix
Prerequisit for this setup is [setting up the Docker](./3_docker_build.Md))

## Setup PX4 interface software stack

This step is tested for the stable Branch `1.16.1 (stable)`

```bash
mkdir -r ~/workspace/agipix_control/src
cd ~/workspace/agipix_control/src
# clone the px4 msgs and manually sync with the Autopilot version
git clone https://github.com/PX4/px4_msgs.git
git clone https://github.com/PX4/PX4-Autopilot.git -b v1.16.1
# Sync
rm -f px4_msgs/msg/*.msg
rm -f px4_msgs/srv/*.srv
cp PX4-Autopilot/msg/*.msg px4_msgs/msg/
cp PX4-Autopilot/srv/*.srv px4_msgs/srv/
cp PX4-Autopilot/msg/versioned/*.msg px4_msgs/msg/
touch px4_version_synced_v1_16_1
rm -rf PX4-Autopilot # optionally remove 
# clone the interface lib
git clone https://github.com/Auterion/px4-ros2-interface-lib -b release/1.16
```
Verify versions
```bash
## to verify compatibility
cd cd ~/workspace/agipix_control/src/px4-ros2-interface-lib 
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


## Sim setup

See [Instructions](../sim/1_setup_sim.md) to continue.

## Agipix Autonomy stack setup

Now we are ready for autonomy setup. See [Instructions](../autonomy/1_perception.md) to continue.