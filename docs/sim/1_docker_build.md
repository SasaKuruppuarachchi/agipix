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
mkdir workspace/docker && cd workspace/docker
git clone https://github.com/SasaKuruppuarachchi/agidocker.git -b minimal

cd agidocker
./setup_host.sh
# This will setup the host with the required dependencies and create a workspace folder
```
## 3) Build Docker

In this step we pull source images and build the docker continer.
To customise the docker configuration edit 
```bash
code ~/workspace/docker/agidocker/scripts/.agipix_ros_common-config
# append the additional docker configuration layers you need built

cd ~/workspace/docker/agidocker/scripts/ && ./run_dev.sh # this alias builds the container
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




## 4) Post setup (Optional)

### Build torchvision from source (matches NVIDIA PyTorch)
```bash
export FORCE_CUDA=1
git clone -b v0.17.2 https://github.com/pytorch/vision.git
cd vision
sudo -E python setup.py develop  # use 'install' if you don't need editable mode
```


## 5) Prune Docker cash (Optional)

Docker builder cash consumes lot of memory. You can clean manualy or schedule a clean as follows
```bash
docker system prune -a --volumes
```
Output will show the size of the volume freed up `Total reclaimed space: 60.52GB`

Optional **not recommended**: Prevent buildup with a scheduled cleanup (e.g., every week):
```bash
docker system prune -a --filter "until=168h" --volumes

sudo du -h --max-depth=1 /home/<user>/workspace | sort -hr

rm -rf ~/.cache/*

rm -rf ~/.local/share/Trash/*
rm -rf ~/.local/share/pip
rm -rf ~/.local/share/virtualenvs

```