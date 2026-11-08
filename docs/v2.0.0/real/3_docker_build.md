---
redirect_from:
  - /docs/v2.0.0/sim/1_docker_build.html
title: Building Containerised Development platform
layout: doc
nav_title: Docker Build
---

# Building Containerised Development platform

The containerised development platform is shared by both sim and real hardware. This improve the deployability from sim to real with minimal code change.
> Curent release uses [Nvidia Isaac Ros 3.2](https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_common/tree/release-3.2) as the basis for this platform

### Prerequisities
- Finish Flasing Hadrware or setting up Sim host.

### Jetson and Sim PC
Both machines build agidocker branch `minimal` with `scripts/run_dev.sh`. The script detects the architecture (`uname -m`), and both use the same layer list (`scripts/.agipix_ros_common-config`). What differs:

| | Jetson (aarch64) | Sim PC (x86_64) |
|---|---|---|
| Base image | `nvcr.io/nvidia/12.6.11-devel:12.6.11-devel-aarch64-ubuntu22.04` | `nvcr.io/nvidia/tritonserver:24.08-py3` |
| Image / container | `agipix_ros_dev-aarch64` / `agipix_ros_dev-aarch64-container` | `agipix_ros_dev-x86_64` / `agipix_ros_dev-x86_64-container` |
| PyTorch | NVIDIA JetPack 6 torch wheel; torchvision 0.20.0 built from source in the image; numpy < 2 pinned | torch 2.14.0 / torchvision 0.29.0 wheels (cu130) |
| Other | no gtsam (no aarch64 wheel); small_gicp 1.0.1 | gtsam installed |
| GPU in container | `nvidia.com/gpu=all,nvidia.com/pva=all`; mounts tegra libs, tegrastats, VPI3, jetson_multimedia_api, jtop socket, `/dev/i2c-1`; `--pid=host` | `nvidia.com/gpu=all` |
| Docker install | JetsonHacks script (JetPack 6) | Docker Engine + NVIDIA Container Toolkit |
| `nvidia-ctk cdi list` | shows the `nvidia.com/pva` devices | shows only `nvidia.com/gpu` devices, no PVA |


## 1) Install Docker + NVIDIA Container Toolkit + Git LFS

### Jetson
Install docker with the guide from [JetsonHacks](https://jetsonhacks.com/2025/02/24/docker-setup-on-jetpack-6-jetson-orin/)
```bash
cd hacks
git clone https://github.com/jetsonhacks/install-docker.git
cd install-docker
bash ./install_nvidia_docker.sh
bash ./configure_nvidia_docker.sh
```

### Sim PC
- Docker: https://docs.docker.com/engine/install/ubuntu/
- NVIDIA Container Toolkit: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html

### Git LFS (both)
Git LFS: https://git-lfs.com/
```bash
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
# Install Git LFS
sudo apt update
sudo apt install git-lfs -y

# Initialize Git LFS for your user
git lfs install

```

To verify CDI interfaces, run `sudo nvidia-ctk cdi list`. On the Jetson it should output the devices below; on a Sim PC it shows only `nvidia.com/gpu` devices, with no PVA.
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

cd ~/workspace/docker/agidocker/scripts/ && ./run_dev.sh # this script builds the container
```
The build will take more than an hour and if successfull you will see `Running agipix_ros_dev-<arch>-container` and the container will start running in the background.

Run `agidocker` to attach to the container interactively. If the container is not running, this alias for `run_dev.sh --skip-registry-check` first rebuilds any image layer that changed, then starts it.

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




## 4) Prune Docker cash (Optional)

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