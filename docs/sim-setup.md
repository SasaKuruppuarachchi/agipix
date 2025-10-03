---
layout: doc
title: Simulation Setup
---

# Setting up Agipix simulation environment

### Prerequisites for host PC
- Ubuntu 20.04/22.04 Operating System
- NVIDIA GPU (RTX 2070 or higher)
- NVIDIA GPU Driver (recommended version 525.85)

### Optional Docker
All the deployment is dockerised [Setup Docker](https://github.com/RAICAM-EU-Project/isaac_ros_common) 
- branch `agipix-hard` for Hardware
- Branch `agipix-sim` for Software

### ROS2 Humble 
Follow the latest instructions at the [official page](https://docs.ros.org/en/humble/Installation.html)

### tmux
```bash
sudo apt install tmux
cd && git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

If you are new to tmux or not already familiar with tmux:
```bash
wget https://raw.githubusercontent.com/SasaKuruppuarachchi/SasaKuruppuarachchi/main/.tmux.conf -P ~/
```
Go to .tmux.conf and edit line 12 "set -g prefix \`". This character "\`" depends on your keyboard layout.

For complete setup instructions, please refer to the [setup_sim.md]({{ site.github.repository_url }}/blob/main/doc/sim/setup_sim.md) file in the repository.

## Key Setup Steps

1. **Isaac Sim Installation** - Download and install Omniverse Launcher and Isaac Sim
2. **ROS2 Extension** - Enable ROS2 bridge extension in Isaac Sim
3. **Docker Setup** - Install Docker and Nvidia Container Toolkit
4. **PX4 Firmware** - Clone and build PX4-Autopilot
5. **Pegasus Simulator** - Install the Pegasus extension for Isaac Sim

## Running the Simulation

1. Open a new terminal to launch the simulator
   ```bash
   cd $ISAAC_ROS_DEV_DIR/src/isaac_ros_common/ && ./run_sim.sh
   # press ENTER after moving to the right pane to launch IsaacSim
   ```

2. In a new terminal run the docker container
   ```bash
   source /workspaces/agipix_control/install/setup.bash

   # this will run the control stack on docker
   cd /workspaces/agipix_control/src/px4_ros2_offboard/tmux/ && ./start.sh
   ```

3. **Controlling the drone** - Follow the instructions in the top right pane of docker tmux window

4. **Opening the UI** - Open [Foxglove](https://app.foxglove.dev/) and connect to `ws://localhost:8765`

Now you are ready for autonomy setup. See the [Autonomy Framework]({{ '/docs/autonomy.html' | relative_url }}) to continue.

---

**For detailed instructions**, visit the complete guide at [doc/sim/setup_sim.md]({{ site.github.repository_url }}/blob/main/doc/sim/setup_sim.md)
