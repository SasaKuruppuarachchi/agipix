---
title: Flashing Jetson & Carrier
layout: doc
nav_title: Flashing Hardware
---

# Flashing the NVIDIA Jetson (JetPack 6.x)

> Note: These steps target Jetson Orin NX/Nano on Connect Tech carriers (Hadron, etc.), Jetson Linux R36.3. Adjust versions as needed.

Refer to the [Datasheets](../../assets/datasheets/CTIM-00088.pdf) and install the Jetson Orin NX module, wiring and power to the Hadron carrier. 

## Install Wifi and SSD

Install the [wifi](https://www.intel.com/content/www/us/en/products/sku/230078/intel-wifi-7-be200/specifications.html) and [ssd](https://www.verkkokauppa.com/fi/product/906691/WD-Black-SN770M-1-Tt-M-2-NVMe-SSD-kovalevy) cards to the PCI mini E and M slots respectively.

## Powering up the carrier
The 6S Lipo can be used to power up the board directly. Install a 60V capacitor between the terminals of the main power. Get the board ready to be powered up for he flashing of firmware.

![Hadron Carrier](../../assets/images/real/wiring/NGX027.png)

## What you’ll do
- Prepare a host machine and download JetPack BSP + sample rootfs
- Install the CTI BSP on the host
- Put the Jetson in recovery mode and flash (auto or manual)
- Perform first boot steps and basic post-setup

## Prerequisites
- Host: Ubuntu 20.04 (x86_64)
- USB cable for recovery/flash
- NVMe M.2 SSD installed on the carrier

---

## 1) Get JetPack (Driver Package + RootFS)

1) Create a working directory, referred to as BSP_ROOT below.

2) Open the Jetson Linux R36.3 downloads and notes:
   - Driver page: https://developer.nvidia.com/embedded/jetson-linux-r363

3) Download both for Orin (t234):
   - Driver Package (BSP): Jetson_Linux_R36.3.0_aarch64.tbz2
   - Sample Root Filesystem: Tegra_Linux_Sample-Root-Filesystem_R36.3.0_aarch64.tbz2

4) Place both files under BSP_ROOT, then extract them:

```bash
cd <BSP_ROOT>
sudo tar -jxf Jetson_Linux_R36.3.0_aarch64.tbz2
sudo tar -C Linux_for_Tegra/rootfs/ -xjf Tegra_Linux_Sample-Root-Filesystem_R36.3.0_aarch64.tbz2
```

After extraction, you should have `<BSP_ROOT>/Linux_for_Tegra` populated.

---

## 2) Install the CTI BSP

If you used NVIDIA SDK Manager, BSP_ROOT is typically:
- `~/nvidia/nvidia_sdk/<JetPack_Version>_Linux_JETSON_NX_ORIN_TARGETS/`
- or `~/nvidia/nvidia_sdk/<JetPack_Version>_Linux_JETSON_NANO_ORIN_TARGETS/`

If you manually downloaded from the Embedded Download Center, use the folder you created as BSP_ROOT.

1) Copy the CTI package to Linux_for_Tegra:

```bash
cp CTI-L4T-ORIN-NX-NANO-36.3.0-V###.tgz <BSP_ROOT>/Linux_for_Tegra
```

2) Extract it and run the installer:

```bash
cd <BSP_ROOT>/Linux_for_Tegra
sudo tar -xzf CTI-L4T-ORIN-NX-NANO-36.3.0-V###.tgz
cd CTI-L4T
sudo ./install.sh
cd .. # back to Linux_for_Tegra
```

> The CTI-L4T BSP is now installed on the host, and you can flash Orin NX/Nano.

---

## 3) Put the device in Recovery Mode

1) Connect the carrier to your host via USB per the carrier manual.
2) Ensure an NVMe M.2 SSD is installed.
3) Follow the carrier instructions to enter recovery (button/strap sequence).

> Tip: You can verify via `lsusb` for an NVIDIA device in recovery.

---

## 4) Flashing options

You can use either the CTI automated script or the manual NVMe flash script.

### Option A: Automated (menu-driven)

```bash
cd <BSP_ROOT>/Linux_for_Tegra
sudo ./cti-flash.sh
```
Follow the menu to select your module and board configuration. Flashing will begin.

### Option B: Manual NVMe flash

Do not include the `.conf` extension in `<config>`.

```bash
cd <BSP_ROOT>/Linux_for_Tegra
sudo ./cti-nvme-flash.sh cti/<module>/<boardname>/<config>
# <module> is one of: orin-nx | orin-nano
```
Examples:
```bash
sudo ./cti-nvme-flash.sh cti/orin-nx/boson/base
sudo ./cti-nvme-flash.sh cti/orin-nano/boson/base
```

When flashing completes, the device will reboot.

---

## 5) First boot and basic setup

### Connect via serial console (recommended)
- Guide: https://jetsonhacks.com/2019/04/19/jetson-nano-serial-console/
- Complete the initial setup prompts. You can skip network here and do it below.

### Join Wi‑Fi via nmcli
```bash
nmcli dev wifi rescan
nmcli d wifi connect <SSID> password <PASSWORD>
```

### SSH in
```bash
ssh <user>@<device-ip>
```

---

## 6) Useful post-setup

### Increase Swap 
You may need to increase swap depending on he RAM of your Jetson module
Follow [This Guide](https://www.forecr.io/blogs/programming/how-to-increase-swap-space-on-jetson-modules?srsltid=AfmBOoqQdjadGieWKvqNFyLf5XFb0XoVjQ_sH9gjZORudTmtEU1wo2yX) to upgrade swap memeory.

### NoMachine (remote desktop)
To setup remote desktop to the headless system for debugging follow [this guide](https://kb.nomachine.com/AR02R01074)

### Change power mode
```bash
sudo nvpmodel -m <mode-number>
```
- Reference: https://forums.developer.nvidia.com/t/power-mode-in-terminal/287224

### Install Docker + NVIDIA Container Toolkit + Git LFS
- Docker: https://docs.docker.com/engine/install/ubuntu/
- NVIDIA Container Toolkit: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html
- Git LFS: https://git-lfs.com/

### Build torchvision from source (matches NVIDIA PyTorch)
```bash
export FORCE_CUDA=1
git clone -b v0.17.2 https://github.com/pytorch/vision.git
cd vision
sudo -E python setup.py develop  # use 'install' if you don't need editable mode
```

### Mount a USB drive
- https://linuxconfig.org/howto-mount-usb-drive-in-linux

---

## References
1) Hadron carrier: https://connecttech.com/product/hadron-carrier-for-nvidia-jetson-orin-nx/
2) CTI L4T release notes (36.3.0): https://connecttech.com/ftp/Drivers/L4T-Release-Notes/Jetson-Orin-NX-Orin-Nano/ORIN-NX-NANO-36.3.0.pdf
3) CTI knowledge base: https://connecttech.com/resource-center/kdb373/
4) torchvision dev install: https://github.com/pytorch/vision/blob/main/CONTRIBUTING.md#development-installation

---

### Continue
- ← Back: [Hardware Assembly](./1_hardware_assembly.md)
- Next → [Software Setup](./3_software_setup.md)

