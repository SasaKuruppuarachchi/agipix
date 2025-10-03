---
layout: doc
title: Agipix Autonomy Framework
---

# Agipix Autonomy Framework

[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) 
[![Linux platform](https://img.shields.io/badge/platform-linux--64-orange.svg)](https://releases.ubuntu.com/20.04/)
[![Linux platform](https://img.shields.io/badge/platform-linux--arm-brown.svg)](https://releases.ubuntu.com/20.04/)

Welcome to the **Agipix Autonomy Framework**, a versatile and modular ROS2 framework for autonomous unmanned aerial vehicles (UAVs). This framework comprises distinct components (simulator, perception, mapping, planning, and control) to achieve autonomous navigation, unknown exploration, and target inspection.

**Author**: [Sasanka Kuruppu Arachchige](https://sasakuruppuarachchi.github.io/), Vision Group, Tampere University, Finland.

**Contact Email**: sasa.kuruppuarachchi@gmail.com

## Table of Contents
1. [The Autonomy Modules Introduction](#the-autonomy-modules-introduction)
2. [Installation Guide](#installation-guide)
3. [Run Autonomy DEMO](#run-autonomy-demo)
4. [PX4 Simulation & Real Flight](#px4-simulation--real-flight)
5. [Citation and Reference](#citation-and-reference)

## The Autonomy Modules Introduction

The autonomy stack consists of several key modules:

- **uav_simulator**: Lightweight Gazebo/ROS-based simulator for UAVs
- **Perception Module**: LiDAR-inertial-visual sensor fusion
- **Mapping Module**: Real-time 3D occupancy mapping
- **Planning Module**: Path planning and exploration algorithms
- **Control Module**: PX4 offboard control interface

## Installation Guide

This repo has been tested on ROS2 Humble with Ubuntu 22.04

### Step 1: Setup Docker and Isaac-ROS
Follow the [Software Setup]({{ '/docs/software-setup.html' | relative_url }}) guide

### Step 2: Clone the repositories
```bash
cd $WORKSPACES_DIR
git clone https://github.com/SasaKuruppuarachchi/px4_ros2_offboard.git
git clone https://github.com/PX4/px4_msgs.git
git clone https://github.com/SasaKuruppuarachchi/agipix_user_interfaces.git
```

### Step 3: Build and Install
```bash
cd /workspaces/agipix_control && colcon build
source /workspaces/agipix_control/install/setup.bash
```

## Run Autonomy DEMO

### Start Simulator
See [Simulation Setup]({{ '/docs/sim-setup.html' | relative_url }}) for launching Isaac Sim

### Run the Navigation Program
Follow the instructions in the tmux window to:
1. Launch the perception stack
2. Start the mapping module
3. Initiate exploration/navigation
4. Execute autonomous missions

### Autonomous Inspection
Navigate to the target and inspect it with a zig-zag path.

## PX4 Simulation & Real Flight

The framework supports both simulation in Isaac Sim and real flight with PX4:
- **Simulation**: Full digital twin with sensor models
- **Real Flight**: Direct deployment on Jetson with PX4 autopilot

## Citation and Reference

If you find this work useful, please consider citing the Agipix project:

Related papers:
- Zhefan Xu, Christopher Suzuki, Xiaoyang Zhan, Kenji Shimada, "Heuristic-based Incremental Probabilistic Roadmap for Efficient UAV Exploration in Dynamic Environments", IEEE ICRA, 2024. [[paper]](https://arxiv.org/pdf/2303.00132.pdf) [[video]](https://youtu.be/fjVJCgDemjc?si=9nsWhReMeJH5JC3Q)
- Zhefan Xu, Di Deng, and Kenji Shimada, "Autonomous UAV Exploration of Dynamic Environments via Incremental Sampling and Probabilistic Roadmap", IEEE RA-L, 2021. [[paper]](https://ieeexplore.ieee.org/document/9362184) [[video]](https://youtu.be/ileyP4DRBjU?si=KFJLt-rLCa3tFaRH)

---

**For detailed instructions**, visit the complete guide at [doc/real/4_agipix_autonomy.md]({{ site.github.repository_url }}/blob/main/doc/real/4_agipix_autonomy.md)
