---
title: Simulation Setup
layout: doc
---
# Setting Up the Agipix Simulation Environment

### Prerequisites for host PC
- Ubuntu 20.04/22.04 Operating System
- NVIDIA GPU (RTX 2070 or higher)
- NVIDIA GPU Driver (recommended version 525.85)

### Optional Docker
All the deployment is dockerised [Setup Docker](https://github.com/RAICAM-EU-Project/isaac_ros_common) 
- branch `agipix-hard` for Hardware
- Branch `agipix-sim` for Software

### ROS2 Humble 
&emsp; Follow the latest instructions at the [official page](https://docs.ros.org/en/humble/Installation.html)

### tmux
```bash
sudo apt install tmux
cd && git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

&emsp; if you are new to tmux or not already familiar wit tmux
```bash
wget https://raw.githubusercontent.com/SasaKuruppuarachchi/SasaKuruppuarachchi/main/.tmux.conf -P ~/
```
&emsp; go to .tmux.conf and edit line 12 "set -g prefix \`". This charactor "\`" depends on your keyboard layout.

### Nucleus Server
&emsp; [Download](https://docs.omniverse.nvidia.com/install-guide/latest/workstation-install.html) and install Omniverse Launcher and install [Nucleus Server](https://docs.omniverse.nvidia.com/launcher/latest/workstation-launcher.html#collaboration-tab)
&emsp; Go to the library and install ISAACSIM.

### Enable ROS2 extension
&emsp; Open IsaacSIM > Window > Extension > ROS2 bridge – enable (Autoload)

### Installing Qgroundcontrol (for PX4 based implementations)
&emsp; Follow the latest instructions at the [official page](https://docs.qgroundcontrol.com/master/en/qgc-user-guide/getting_started/download_and_install.html)

### Installing docker
&emsp; Follow the latest instructions at the [official docker page](https://docs.docker.com/engine/install/ubuntu/)

### Installing Portainer CE
&emsp; Portainer CE is an open-source GUI for creating and managing docker containers. Install it following [these instructions](https://docs.portainer.io/start/install-ce/server/docker/linux)

### Installing Nvidia Docker
&emsp; Install the Nvidia Container toolkit with [These Instructions](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

### PX4 firmware

```bash
# Linux packages
sudo apt install git make cmake python3-pip

# Python packages
pip install kconfiglib jinja2 empy jsonschema pyros-genmsg packaging toml numpy future

cd $HOME
git clone https://github.com/PX4/PX4-Autopilot.git --recursive
cd PX4-Autopilot
make px4_sitl_default none
```
if PX4 launched properly you can exit out of it.
&emsp; For further information [visit here](https://docs.px4.io/main/en/dev_setup/building_px4.html)

To synchronise the time stamps with the simulator we need to set the parameter [UXRCE_DDS_SYNCT](https://docs.px4.io/main/en/advanced_config/parameter_reference.html#UXRCE_DDS_SYNCT) to `false`. To do that,
1. Open the rcS file at `/PX4-Autopilot/ROMFS/px4fmu_common/init.d-posix/rcS`
2. Paste the following line before ´#Autostart ID´
```bash
param set-default UXRCE_DDS_SYNCT 0
```
3. Rebuild the firmware
```bash
cd $HOME
cd PX4-Autopilot
make px4_sitl_default none
```
4. Make sure to set the parameter `use_sim_time` (of each ROS2 node) to `true`

### Pegusus simulaotor
&emsp; Add the following lines to your ~/.bashrc or ~/.zshrc file.
```bash
# Isaac Sim root directory
export ISAACSIM_PATH="${HOME}/.local/share/ov/pkg/isaac_sim-4.1.0"
# Isaac Sim python executable
alias ISAACSIM_PYTHON="${ISAACSIM_PATH}/python.sh"
# Isaac Sim app
alias ISAACSIM="${ISAACSIM_PATH}/isaac-sim.sh"
# Change {user} accordingly
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/{user}/.local/share/ov/pkg/isaac_sim-2023.1.1/exts/omni.isaac.ros2_bridge/humble/lib
```
&emsp; Installing the extension as a library

```bash
# Go to the repository of the pegasus simulator
cd PegasusSimulator

# Go into the extensions directory
cd extensions

# Run the pip command using the built-in python interpreter
ISAACSIM_PYTHON -m pip install --editable pegasus.simulator
```

> [!NOTE]
> For the first time, launching Isaac Sim takes a very long time.
> Isaac Sim must be fully launched to spawn the robot.

### Enabling Pegasus Simulator in Isaacsim (First Operation)

1. Launch ``ISAACSIM`` application.

2. Open the Window->extensions on the top menubar inside Isaac Sim.
   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/extensions_menu_bar.png)

3. On the Extensions manager menu, we can enable or disable extensions. By pressing the settings button, we can 
add a path to the Pegasus-Simulator repository.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/extensions_widget.png)

4. The path inserted should be the path to the repository followed by ``/extensions``.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/ading_extension_path.png)


5. After adding the path to the extension, we can enable the Pegasus Simulator extension on the third-party tab.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/pegasus_inside_extensions_menu.png)


When enabling the extension for the first time, the python requirements should be install automatically for the build in 
``ISAACSIM_PYTHON`` , and after a few seconds, the Pegasus widget GUI should pop-up.

6. The Pegasus Simulator window should appear docked to the bottom-right section of the screen.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/pegasus_gui_example.png)

## Installation - Docker contrainer

1. Set your workspace definitions and Clone the repo to your ros2 workspace. replace "your_branch" with "agipix_sim" for the drone
   ```bash
   echo "export WORKSPACES_DIR='/home/sasa/workspace'" >> ~/.bashrc
   echo "export ISAAC_ROS_DEV_DIR='/home/sasa/workspace/raicam-ros'" >> ~/.bashrc
   source ~/.bashrc
   cd $ISAAC_ROS_DEV_DIR && git clone https://github.com/RAICAM-EU-Project/isaac_ros_common.git -b your_branch
   
   # set up DDS for ROS2 communication
   cd $WORKSPACES_DIR && mkdir dds && cd dds
   git clone https://github.com/eProsima/Micro-XRCE-DDS-Agent.git
   

   # Set up control stack
   cd $WORKSPACES_DIR && mkdir agipix_control && cd agipix_control
   git clone https://github.com/SasaKuruppuarachchi/px4_ros2_offboard.git
   git clone https://github.com/PX4/px4_msgs.git
   git clone https://github.com/SasaKuruppuarachchi/agipix_user_interfaces.git

   ```

2. First run of the Docker container
   ```bash
   # this will start the compose the docker container and start it. First run might take up to 15 Minutes
   cd $WORKSPACES_DIR/raicam-ros/src/isaac_ros_common/scripts/ && ./run_dev.sh

   cd /workspaces/dds/Micro-XRCE-DDS-Agent/
   mkdir build && cd build
   cmake ..
   make
   sudo make install
   sudo ldconfig /usr/local/lib/

   cd /workspaces/agipix_control && colcon build
   source /workspaces/agipix_control/install/setup.bash
   ```

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
3. Controlling the drone

Follow the instructions in the top right pane of docker tmux window

4. Opening the UI

   1. Open up a [Foxglow](https://app.foxglove.dev/) account and bavigate to the dashboard
   2. Open connection with "ws://localhost:8765"

Now we are ready for autonomy setup. See [Instructions](../autonomy/1_perception.md) to continue.






