---
title: Simulation Setup
layout: doc
---
# Setting Up the Agipix Simulation Environment

### Prerequisites for host PC
- Ubuntu 20.04/22.04 Operating System
- NVIDIA GPU (RTX 2070 or higher)
- NVIDIA GPU Driver (recommended version 525.85)

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

# IsaacSIM Installation
> This documentation is tested for the current stable version 5.1.0. This will be updated as new stable release published

Quick install instructions: [Official Documentation](https://docs.isaacsim.omniverse.nvidia.com/5.1.0/installation/quick-install.html)

```bash
mkdir isaac-sim
cd isaac-sim/
wget https://download.isaacsim.omniverse.nvidia.com/isaac-sim-standalone-5.1.0-linux-x86_64.zip
unzip "isaac-sim-standalone-5.1.0-linux-x86_64.zip" -d ~/isaacsim
rm isaac-sim-standalone-5.1.0-linux-x86_64.zip # optionally clean install artifacts
cd ~/isaacsim
./post_install.sh
```
Setup environemnt vars
```bash
cat <<'EOF' >> ~/.bashrc

# ---------------------------
# ISAAC SIM SETUP
# ---------------------------
# Isaac Sim root directory
export ISAACSIM_PATH="${HOME}/isaacsim"
# Isaac Sim python executable
export ISAACSIM_PYTHON="${ISAACSIM_PATH}/python.sh"
# Isaac Sim app
export ISAACSIM="${ISAACSIM_PATH}/isaac-sim.sh"

# Define an auxiliary function to launch Isaac Sim or run scripts with Isaac Sim's python
# This is done to avoid conflicts between ROS 2 and Isaac Sim's Python environment
isaac_run() {

    # ------------------
    # === VALIDATION ===
    # ------------------
    if [ ! -x "$ISAACSIM_PYTHON" ]; then
        echo "❌ IsaacSim python.sh not found at: $ISAACSIM_PYTHON"
        return 1
    fi
    if [ ! -x "$ISAACSIM" ]; then
        echo "❌ IsaacSim launcher not found at: $ISAACSIM"
        return 1
    fi

    # -------------------------
    # === CLEAN ENVIRONMENT ===
    # -------------------------
    # Unset ROS 2 environment variables to avoid conflicts with Isaac's Python 3.11
    unset ROS_VERSION ROS_PYTHON_VERSION ROS_DISTRO AMENT_PREFIX_PATH COLCON_PREFIX_PATH PYTHONPATH CMAKE_PREFIX_PATH

    # Remove ROS 2 paths from LD_LIBRARY_PATH if present
    local ros_paths=("/opt/ros/humble" "/opt/ros/jazzy" "/opt/ros/iron")
    for ros_path in "${ros_paths[@]}"; do
        export LD_LIBRARY_PATH=$(echo "$LD_LIBRARY_PATH" | tr ':' '\n' | grep -v "^${ros_path}" | paste -sd':' -)
    done

    # -----------------------------
    # === UBUNTU VERSION CHECK ===
    # -----------------------------

    if [ -f /etc/os-release ]; then
        UBUNTU_VERSION=$(grep "^VERSION_ID=" /etc/os-release | cut -d'"' -f2)
    fi

    # If Ubuntu 24.04 -> use the Isaac Sim internal ROS2 Jazzy (ROS2 Jazzy bridge)
    if [[ "$UBUNTU_VERSION" == "24.04" ]]; then
        export ROS_DISTRO=jazzy
        export RMW_IMPLEMENTATION=rmw_fastrtps_cpp
        export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:${ISAACSIM_PATH}/exts/isaacsim.ros2.bridge/jazzy/lib"
        echo "🧩 Detected Ubuntu 24.04 -> Using ROS_DISTRO=jazzy"
    # If Ubuntu 22.04 -> use the Isaac Sim internal ROS2 Humble (ROS2 Humble bridge)
    else
        export ROS_DISTRO=humble
        export RMW_IMPLEMENTATION=rmw_fastrtps_cpp
        export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:${ISAACSIM_PATH}/exts/isaacsim.ros2.bridge/humble/lib"
        echo "🧩 Detected Ubuntu ${UBUNTU_VERSION:-unknown} -> Using ROS_DISTRO=humble"
    fi

    # ---------------------
    # === RUN ISAAC SIM ===
    # ---------------------
    if [ $# -eq 0 ]; then
        # No args → Launch full Isaac Sim GUI
        echo "🧠 Launching Isaac Sim GUI..."
        "${ISAACSIM}"

    elif [[ "$1" == --* ]]; then
        # Arguments start with "--" → pass them to Isaac Sim executable
        echo "⚙️  Launching Isaac Sim with options: $*"
        "${ISAACSIM}" "$@"

    elif [ -f "$1" ]; then
        # First argument is a Python file → run with Isaac Sim's Python
        local SCRIPT_PATH="$1"
        shift
        echo "🚀 Running Python script with Isaac Sim: $SCRIPT_PATH"
        "${ISAACSIM_PYTHON}" "$SCRIPT_PATH" "$@"

    else
        # Unrecognized input
        echo "❌ Unknown argument or file not found: '$1'"
        echo "Usage:"
        echo "  isaac_run                 → launch GUI"
        echo "  isaac_run my_script.py    → run script with IsaacSim Python"
        echo "  isaac_run --headless ...  → launch IsaacSim with CLI flags"
        return 1
    fi
}
alias agisim="cd ~/workspace/raicam-ros/src/isaac_ros_common/ && ./run_sim.sh"
export ROS_DOMAIN_ID=3
EOF
source ~/.bashrc
```

Running IsaacSIM


### Nucleus Server
> Depreciated

&emsp; [Download](https://docs.omniverse.nvidia.com/install-guide/latest/workstation-install.html) and install Omniverse Launcher and install [Nucleus Server](https://docs.omniverse.nvidia.com/launcher/latest/workstation-launcher.html#collaboration-tab)
&emsp; Go to the library and install ISAACSIM.

### Enable ROS2 extension
&emsp; Open IsaacSIM > Window > Extension > ROS2 bridge – enable (Autoload)

### Installing Qgroundcontrol (for PX4 based implementations)
&emsp; Follow the latest instructions at the [official page](https://docs.qgroundcontrol.com/master/en/qgc-user-guide/getting_started/download_and_install.html)

```bash
sudo usermod -aG dialout "$(id -un)"
```
(Optional) Disable ModemManager On some Ubuntu-based systems, ModemManager can claim serial ports that QGC needs. If you don't use it elsewhere, mask or remove it.
```bash
# preferred: stop and mask the service
sudo systemctl mask --now ModemManager.service

# or, if you’d rather remove the package
sudo apt remove --purge modemmanager
```
On the command prompt, enter:
```bash
sudo apt install gstreamer1.0-plugins-bad gstreamer1.0-libav gstreamer1.0-gl -y
sudo apt install libfuse2 -y
sudo apt install libxcb-xinerama0 libxkbcommon-x11-0 libxcb-cursor-dev -y
```
To install QGroundControl:

1. Download [QGroundControl-x86_64.AppImage](https://d176tv9ibo4jno.cloudfront.net/latest/QGroundControl-x86_64.AppImage).

2. Make the AppImage executable

```bash
chmod +x QGroundControl-x86_64.AppImage
./QGroundControl-x86_64.AppImage
```

### PX4 firmware

```bash
# Linux packages
sudo apt install git make cmake python3-pip

# Python packages
pip install kconfiglib jinja2 empy jsonschema pyros-genmsg packaging toml numpy future

cd $HOME
git clone https://github.com/PX4/PX4-Autopilot.git -b v1.16.1 --recursive
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
param set-default UXRCE_DDS_DOM_ID 3
```
3. Rebuild the firmware
```bash
cd $HOME
cd PX4-Autopilot
make px4_sitl_default none
```
4. Make sure to set the parameter `use_sim_time` (of each ROS2 node) to `true`

### Pegusus simulaotor
&emsp; Cloning into the repo and the assets
```bash
cd $HOME
git clone https://github.com/SasaKuruppuarachchi/PegasusSimulator.git
cd PegasusSimulator/extensions/pegasus.simulator/pegasus/simulator/assets/Worlds
git clone https://github.com/SasaKuruppuarachchi/isaac_envs.git
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
   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/extensions_menu_bar.png?raw=1)

3. On the Extensions manager menu, we can enable or disable extensions. By pressing the settings button, we can 
add a path to the Pegasus-Simulator repository.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/extensions_widget.png?raw=1)

4. The path inserted should be the path to the repository followed by ``/extensions``.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/ading_extension_path.png?raw=1)


5. After adding the path to the extension, we can enable the Pegasus Simulator extension on the third-party tab.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/pegasus_inside_extensions_menu.png?raw=1)


When enabling the extension for the first time, the python requirements should be install automatically for the build in 
``ISAACSIM_PYTHON`` , and after a few seconds, the Pegasus widget GUI should pop-up.

6. The Pegasus Simulator window should appear docked to the bottom-right section of the screen.

   ![alt text](https://github.com/PegasusSimulator/PegasusSimulator/blob/main/docs/_static/pegasus_gui_example.png?raw=1)

## Post setups
### Download assets
- Download assets from [Official page](https://docs.isaacsim.omniverse.nvidia.com/5.1.0/installation/download.html) and same them in `~/isaacsim/assets/` 
- then `mkdir ~/isaacsim/assets/Isaac/5.1/NVIDIA`
- Open `~/isaacsim/exts/isaacsim.asset.browser/config/extension.toml` and add the asset paths at 

    ```toml
    [settings]
    # Root folder URLs to list and monitor.
    exts."isaacsim.asset.browser".folders = [
        # asset paths here
    ]
    ```

- Open `~isaacsim/exts/isaacsim.storage.native/config/extension.toml` and replace persistent.isaac.asset_root.default with `persistent.isaac.asset_root.default = "/home/sasa/isaacsim/assets/Isaac/5.1"`


### Add Lidar definitions
To replicate Mid360 lidar in the Agipix we create this custom Lidar model in Isaacsim.

- Copy Mid360 usda file `cp ~/PegasusSimulator/assets/lidar/Mid_360.usda ~/isaacsim/assets/Isaac/5.1/Isaac/Sensors/NVIDIA/Mid_360.usda`
- Open `~/isaacsim/exts/isaacsim.sensors.rtx/isaacsim/sensors/rtx/impl/supported_lidar_configs.py` and add `"/Isaac/Sensors/NVIDIA/Mid_360.usda": set(),` under the `SUPPORTED_LIDAR_CONFIGS`


## Running the Simulation

1. Open a new terminal to launch the simulator
   ```bash
   cd $ISAAC_ROS_DEV_DIR/src/isaac_ros_common/ && ./run_sim.sh
   # press ENTER after moving to the right pane to launch IsaacSim
   ```

2. In a new terminal run the docker container
   ```bash
   runagi
   ```
3. Controlling the drone

Follow the instructions in the top right pane of docker tmux window

4. Opening the UI

   1. Open up a [Foxglow](https://app.foxglove.dev/) account and bavigate to the dashboard
   2. Open connection with "ws://localhost:8765"

Now we are ready for autonomy setup. See [Instructions](../autonomy/1_perception.md) to continue.






