---
title: Building Containerised Development platform
layout: doc
nav_title: Docker Build
---

# Building Containerised Development platform

The containerised development platform is shared by both sim and real hardware. This improve the deployability from sim to real with minimal code change.
> Curent release uses [Nvidia Isaac Ros 3.2](https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_common/tree/release-3.2) as the basis for this platform

### Prerequisities
- Finish Flasing Hadrware or setting up Sim host.


## 1) Install Docker + NVIDIA Container Toolkit + Git LFS
Install docker with
- Guide from [JetsonHacks](https://jetsonhacks.com/2025/02/24/docker-setup-on-jetpack-6-jetson-orin/)

Or use
- Docker: https://docs.docker.com/engine/install/ubuntu/
- NVIDIA Container Toolkit: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html
- Git LFS: https://git-lfs.com/

## 2) Setup Workspace

```bash
cd $HOME
mkdir workspace && cd workspace
mkdir -r agipix_control/src dds lidar_ws/src raicam-ros/src
cd raicam-ros/src
git clone https://github.com/SasaKuruppuarachchi/isaac_ros_common.git -b agipix-hard # TODO

echo "export WORKSPACES_DIR='~/workspace'" >> ~/.bashrc
echo "export ISAAC_ROS_DEV_DIR='~/workspace/raicam-ros'" >> ~/.bashrc
echo "alias agidocker='cd ~/workspace/raicam-ros/src/isaac_ros_common/scripts/ && ./run_dev.sh --skip-registry-check'" >> ~/.bashrc
echo "alias killagidocker='docker container kill isaac_ros_dev-aarch64-container'" >> ~/.bashrc
source ~/.bashrc
```
## 3) Build Docker

In this step we pull source images and build the docker continer.
To customise the docker configuration edit 
```bash
code ~/workspace/raicam-ros/src/isaac_ros_common/scripts/.isaac_ros_common-config
# append the additional docker configuration layers you need built

cd ~/workspace/raicam-ros/src/isaac_ros_common/scripts/ && ./run_dev.sh # this alias builds the container
```
The build will take more than an hour and if successfull you will see ```Running isaac_ros_dev-aarch64-container``` and the container will start running in the background.

Run ```agidocker``` to attach to the container interactively.