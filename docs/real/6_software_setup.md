---
title: Software Setup
layout: doc
---
# Software Setup for Agipix
Prerequisit for this setup is [setting up the Docker](./3_docker_build.Md))

## Setup PX4 interface software stack

This step is tested for the stable Branch `1.16.0`

```bash
mkdir -r ~/workspace/agipix_control/src
cd ~/workspace/agipix_control/src
git clone https://github.com/PX4/px4_msgs -b release/1.16
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