---
layout: doc
title: Software Setup
---

# Software Setup for Agipix

All the deployment is dockerised using [Isaac ROS Common](https://github.com/RAICAM-EU-Project/isaac_ros_common)
- branch `agipix-hard` for Hardware
- branch `agipix-sim` for Software

Follow the instructions in the repository to setup Docker environment.

## Simulation Setup

For simulation environment setup, see [Simulation Setup]({{ '/docs/sim-setup.html' | relative_url }})

## Agipix Autonomy Stack Setup

Once the software environment is ready, proceed to the [Autonomy Framework]({{ '/docs/autonomy.html' | relative_url }}) for complete autonomy stack setup.

## Key Steps

1. **Clone the Isaac ROS Common repository** (appropriate branch)
2. **Build Docker containers** with required dependencies
3. **Deploy ROS 2 workspace** on the Jetson
4. **Configure sensor interfaces** (LiDAR, camera, IMU)
5. **Launch autonomy stack** (see Autonomy Framework)

---

**For detailed instructions**, visit the complete guide at [doc/real/3_software_setup.md]({{ site.github.repository_url }}/blob/main/doc/real/3_software_setup.md)
