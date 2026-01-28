---
title: Host setup
layout: doc
---
# Setting Up the Agipix Simulation Environment

### Prerequisites for host PC
- Ubuntu 20.04/22.04 Operating System
- NVIDIA GPU (RTX 2070 or higher)
- NVIDIA GPU Driver (recommended version 525.85)

### Cuda and CUDnn
> !! Importat: Always use the given liks to get the latest deb package links wt is statud here may be outdated.

Install cuda with the instructions [here](https://developer.nvidia.com/cuda-12-8-0-download-archive?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_local)
```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/12.8.0/local_installers/cuda-repo-ubuntu2204-12-8-local_12.8.0-570.86.10-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2204-12-8-local_12.8.0-570.86.10-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu2204-12-8-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-8
```

Install Cudnn with the instructions [here](https://developer.nvidia.com/cudnn-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_local&Configuration=Full)
```bash
wget https://developer.download.nvidia.com/compute/cudnn/9.18.1/local_installers/cudnn-local-repo-ubuntu2204-9.18.1_1.0-1_amd64.deb
sudo dpkg -i cudnn-local-repo-ubuntu2204-9.18.1_1.0-1_amd64.deb
sudo cp /var/cudnn-local-repo-ubuntu2204-9.18.1/cudnn-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cudnn

echo 'export PATH=/usr/local/cuda-12.8/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-12.8/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
```

Verify
```bash
nvcc -V
cd $HOME/workspace/raicam-ros/src/isaac_ros_common/verify
g++ verify_cuda_cudnn.cpp \
    -I/usr/local/cuda-12.8/targets/x86_64-linux/include \
    -L/usr/local/cuda-12.8/targets/x86_64-linux/lib \
    -lcudart -lcudnn -o verify_cuda_cudnn
./verify_cuda_cudnn
```

# Building Containerised Development platform

The containerised development platform is shared by both sim and real hardware. This improve the deployability from sim to real with minimal code change.
> Curent release uses [Nvidia Isaac Ros 3.2](https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_common/tree/release-3.2) as the basis for this platform

### Prerequisities
- Finish Flasing Hadrware or setting up Sim host.


## 1) Install Docker + NVIDIA Container Toolkit + Git LFS
Install docker with
- Guide from [JetsonHacks](https://jetsonhacks.com/2025/02/24/docker-setup-on-jetpack-6-jetson-orin/)
```bash
cd hacks
git clone https://github.com/jetsonhacks/install-docker.git
cd install-docker
bash ./install_nvidia_docker.sh
bash ./configure_nvidia_docker.sh
```

Or use
- Docker: https://docs.docker.com/engine/install/ubuntu/
- NVIDIA Container Toolkit: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html

Git LFS: https://git-lfs.com/
```bash
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
# Install Git LFS
sudo apt update
sudo apt install git-lfs -y

# Initialize Git LFS for your user
git lfs install

```

To verify CDI interfaces `sudo nvidia-ctk cdi list` should output
```bash
INFO[0000] Found 2 CDI devices                          
nvidia.com/pva=0
nvidia.com/pva=all
```
> if no CDI devices are found
```bash
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

## 2) Setup Workspace

```bash
cd $HOME
mkdir workspace && cd workspace
mkdir -p agipix_control/src dds lidar_ws/src raicam-ros/src ui/src logging/bags logging/flogs logging/crashreports
cd raicam-ros/src
git clone https://github.com/SasaKuruppuarachchi/isaac_ros_common.git # TODO

echo "export WORKSPACES_DIR="$HOME/workspace"" >> ~/.bashrc
echo "export ISAAC_ROS_DEV_DIR="$HOME/workspace/raicam-ros"" >> ~/.bashrc
echo "alias agidocker='cd $HOME/workspace/raicam-ros/src/isaac_ros_common/scripts/ && ./run_dev.sh --skip-registry-check'" >> ~/.bashrc
echo "alias killagidocker='docker container kill isaac_ros_dev-x86_64-container'" >> ~/.bashrc
source ~/.bashrc
```
## 3) Build Docker

In this step we pull source images and build the docker continer.
- To customise the docker configuration edit and append the additional docker configuration layers you need built
    ```bash
    code ~/workspace/raicam-ros/src/isaac_ros_common/scripts/.isaac_ros_common-config
    ```


- Change the ROS_DOMAIN_ID to 3 (To mactch the sim environment)
    ```bash
    code ~/workspace/raicam-ros/src/isaac_ros_common/scripts/bashrc
    ```

Build the Docker    

```bash
cd ~/workspace/raicam-ros/src/isaac_ros_common/scripts/ && ./run_dev.sh # this alias builds the container
```
The build will take more than an hour and if successfull you will see ```Running isaac_ros_dev-aarch64-container``` and the container will start running in the background.

Run ```agidocker``` to attach to the container interactively.

Verify Pytorch with cuda on dcker
```bash
agidocker
# Inside docker
python3 - << 'EOF'
import torch
print("CUDA:", torch.cuda.is_available())
print("Device:", torch.cuda.get_device_name(0))
EOF

```

### (Optional) Installing Portainer CE
&emsp; Portainer CE is an open-source GUI for creating and managing docker containers. Install it following [these instructions](https://docs.portainer.io/start/install-ce/server/docker/linux)