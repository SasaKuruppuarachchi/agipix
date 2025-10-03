---
layout: doc
title: Flashing Hardware
---

# Complete Guide to Flashing The Nvidia Jetson Device to Jetpack 6.0

## Prerequisites 
1. Ubuntu 20.04 host machine x86

## Installation

### Installing JetPack from NVIDIA® Embedded Download Center

1. Create a new directory for installing the Jetpack (referred to as `<BSP_ROOT>`)

2. Go to [Jetpack Release Page](https://developer.nvidia.com/embedded/jetson-linux-r363)

3. Download the "Driver Package (BSP)" and "Sample Root Filesystem" files for Orin modules (t234 platform)

4. Put the files in `<BSP_ROOT>`. You should have:
   - `Jetson_Linux_R36.3.0_aarch64.tbz2`
   - `Tegra_Linux_Sample-Root-Filesystem_R36.3.0_aarch64.tbz2`

5. Extract the "L4T Driver Package" tarball:
   ```bash
   cd <BSP_ROOT>
   sudo tar -jxf Jetson_Linux_R36.3.0_aarch64.tbz2
   ```

6. Extract the "Sample Root Filesystem" into `Linux_for_Tegra/rootfs`:
   ```bash
   sudo tar -C Linux_for_Tegra/rootfs/ -xjf Tegra_Linux_Sample-Root-Filesystem_R36.3.0_aarch64.tbz2
   ```

### CTI BSP Installation

1. Copy the CTI-L4T package into `<BSP_ROOT>/Linux_for_Tegra`
2. Extract the BSP
3. Run the install script: `sudo ./install.sh`

## Flashing

1. Connect an NVMe m.2 card to one of the m.2 slots
2. Connect the Orin NX/Nano to computer via USB
3. Put the system into recovery mode
4. Flash using CTI's automated script:
   ```bash
   sudo ./cti-flash.sh
   ```

## Connecting and First Setup

1. Connect to the debug console
2. Skip network setup initially
3. Connect to network:
   ```bash
   sudo nmcli dev wifi rescan
   sudo nmcli d wifi connect [SSID] password [PASSWORD]
   ```
4. SSH in: `ssh [user]@[ip]`

## Additional Setup

- **NoMachine**: [Installation Guide](https://kb.nomachine.com/AR02R01074)
- **Power Mode**: `sudo nvpmodel -m <# of power mode>`
- **Docker**: [Install Docker](https://docs.docker.com/engine/install/ubuntu/)
- **NVIDIA Docker**: [Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

## Next Steps

After flashing, proceed to [Software Setup]({{ '/docs/software-setup.html' | relative_url }})

---

**For detailed instructions**, visit the complete guide at [doc/real/2_flashing_hardware.Md]({{ site.github.repository_url }}/blob/main/doc/real/2_flashing_hardware.Md)
