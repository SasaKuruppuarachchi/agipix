---
layout: doc
title: Flashing Hardware
---

# Complete guide to flashing The Nvidia Jetson device to Jetpack 6.0

## Prerequisites 
1. Ubuntu 20.04 host machine x86

## Installation

### Installing JetPack from NVIDIA® Embedded Download Center

1. Create a new directory for installing the Jetpack. Referred to as <BSP_ROOT>
   in these instructions.

2. Go to Jetpack Release Page https://developer.nvidia.com/embedded/jetson-linux-r363

3. Download the "Driver Package (BSP)" and "Sample Root Filesystem" files for
   Orin modules (t234 platform).

4. Put the "L4T Driver Package (BSP)" and "Sample Root Filesystem" in <BSP_ROOT>.
   Afterwards, you should have the following files in <BSP_ROOT>
   - Jetson_Linux_R36.3.0_aarch64.tbz2
   - Tegra_Linux_Sample-Root-Filesystem_R36.3.0_aarch64.tbz2

5. Extract the "L4T Driver Package" tarball:

   ```bash
   cd <BSP_ROOT>
   sudo tar -jxf Jetson_Linux_R36.3.0_aarch64.tbz2
   ```

6. You should now have a new directory called Linux_for_Tegra in your <BSP_ROOT> folder.
   Extract the "Sample Root Filesystem" into Linux_for_Tegra/rootfs.

   ```bash
   sudo tar -C Linux_for_Tegra/rootfs/ -xjf Tegra_Linux_Sample-Root-Filesystem_R36.3.0_aarch64.tbz2
   ```

### CTI BSP Installation

1. Copy the CTI-L4T-ORIN-NX-NANO-36.3.0-V###.tgz package into
   <BSP_ROOT>/Linux_for_Tegra.
   If you are using Nvidia's SDK manager then "<BSP_ROOT>" will be:
   ~/nvidia/nvidia_sdk/<JetPack_Version>_Linux_JETSON_NX_ORIN_TARGETS/
   or
   ~/nvidia/nvidia_sdk/<JetPack_Version>_Linux_JETSON_NANO_ORIN_TARGETS/
   depending on your target module.

   Otherwise if manually installing from the NVIDIA® Embedded Download Center
   <BSP_ROOT> will be the folder created previously

   ```bash
   cp CTI-L4T-ORIN-NX-NANO-36.3.0-V###.tgz <BSP_ROOT>/Linux_for_Tegra
   ```

2. Extract the BSP:
   ```bash
   cd <BSP_ROOT>/Linux_for_Tegra
   sudo tar -xzf CTI-L4T-ORIN-NX-NANO-36.3.0-V###.tgz
   ```

3. Change into the CTI-L4T directory:
   ```bash
   cd <BSP_ROOT>/Linux_for_Tegra/CTI-L4T
   ```

4. Run the install script (as root or sudo) to automatically install the BSP files
   to the correct locations:

   ```bash
   sudo ./install.sh
   # return to Linux_for_Tegra
   cd ..
   ```

5. The CTI-L4T BSP is now installed on the host system and it should now be able
   to flash the Orin™ NX/Orin™ Nano module.

## Flashing
1. Connect an NVMe m.2 card to one of the m.2 slots on your Orin™ NX/Orin™ Nano carrier.

2. Connect the Orin™ NX/Orin™ Nano and Carrier to the computer via USB, following the
   instructions in the appropriate manual.

3. Put the system to be flashed into recovery mode, following the
   instructions in the appropriate manual

4. There are two options for flashing Jetson modules:

   Using CTI's automated script:
   ```bash
   sudo ./cti-flash.sh
   ```

   Follow the menu and select your desired configuration. Once selected,
   the device will start to flash.

   Using the Manual Method with cti-nvme-flash:

   Note do not add the ".conf" file extension to the <config> parameter:

   ```bash
   # Manual Flash
   sudo ./cti-nvme-flash.sh cti/<module>/<boardname>/<config>
   ```

   <module> is either orin-nx or orin-nano depending on your module.

   Examples:
   ```bash
   sudo ./cti-nvme-flash.sh cti/orin-nx/boson/base
   sudo ./cti-nvme-flash.sh cti/orin-nano/boson/base
   ```

5. Once the flashing has completed, the Orin™ NX/Orin™ Nano will reboot 

## Connecting and first setup
1. Connect to the debug console and follow the setup
   https://jetsonhacks.com/2019/04/19/jetson-nano-serial-console/

2. Skip network setup for now

3. Connect to the network 
   ```bash
   sudo nmcli dev wifi rescan
   sudo nmcli d wifi connect [SSID] password [PASSWORD]
   ```

4. SSH in
   ```bash
   ssh [user]@[ip]
   ```

## Setting up Nomachine
https://kb.nomachine.com/AR02R01074

## Change power mode
```bash
sudo nvpmodel -m <# of power mode>
```
https://forums.developer.nvidia.com/t/power-mode-in-terminal/287224

## Installing docker and nvidia docker
- https://docs.docker.com/engine/install/ubuntu/
- https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html
- https://git-lfs.com/

## Compose and run docker

## Build torchvision from source
We need to build torchvision from source in order to link against the right libraries as compiled with the NVIDIA-compiled build of pytorch
```bash
export FORCE_CUDA=1
git clone -b v0.17.2 https://github.com/pytorch/vision.git
cd vision
sudo -E python setup.py develop  # use install instead of develop if you don't care about development.
```

## Mount USB
https://linuxconfig.org/howto-mount-usb-drive-in-linux

## References
1. https://connecttech.com/product/hadron-carrier-for-nvidia-jetson-orin-nx/
2. https://connecttech.com/ftp/Drivers/L4T-Release-Notes/Jetson-Orin-NX-Orin-Nano/ORIN-NX-NANO-36.3.0.pdf
3. https://connecttech.com/resource-center/kdb373/
4. https://github.com/pytorch/vision/blob/main/CONTRIBUTING.md#development-installation

Back to [Further Assembly]({{ '/docs/hardware-assembly.html' | relative_url }}) to continue.
