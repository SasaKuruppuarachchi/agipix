---
title: Agipix Documentation
layout: doc
permalink: /docs/
description: Start here to assemble the hardware, flash the Jetson, set up software, or run the simulation.
---

# Welcome

Agipix is an open hardware and software platform for agile indoor autonomy. This front page helps you choose the right path and quickly find the guides you need.

## Choose your path

- I want to build and fly the real robot:
	1) Hardware assembly → [Real/1_hardware_assembly](real/1_hardware_assembly.md)
	2) Flash Jetson & carrier → [Real/2_flashing_hardware](real/2_flashing_hardware.Md)
	3) Install and configure software → [Real/3_software_setup](real/3_software_setup.md)
	4) Autonomy overview & running demos → [autonomy/2_planning_control](autonomy/2_planning_control.md)

- I want to run in simulation first:
	- Isaac Sim + containers setup → [Sim/1_setup_sim](sim/1_setup_sim.md)
	- Then see autonomy overview/demos → [autonomy/2_planning_control](autonomy/2_planning_control.md)

## All documentation

### Real hardware
- Hardware assembly: [real/1_hardware_assembly.md](real/1_hardware_assembly.md)
- Flashing Jetson and carrier: [real/2_flashing_hardware.Md](real/2_flashing_hardware.Md)
- Software setup on the robot: [real/3_software_setup.md](real/3_software_setup.md)
- Agipix autonomy framework: [autonomy/2_planning_control.md](autonomy/2_planning_control.md)
- Carrier configuration snippet: [real/hadron_cfg.txt](real/hadron_cfg.txt)

### Simulation
- Simulation setup: [sim/1_setup_sim.md](sim/1_setup_sim.md)

## Helpful resources

- Project README (overview, highlights) → [README]({{ '/README' | relative_url }})
- Bill of Materials (BOM) → [bom/BOM.md]({{ '/bom/BOM' | relative_url }})
- CAD and fabrication files → [cad/]({{ '/cad' | relative_url }})
- Media assets used in docs → [_assets/]({{ '/_assets' | relative_url }})

## Tips

- Follow the order shown in “Choose your path.” Each page links to the next step.
- If you’re new, start with Simulation to validate the stack before moving to hardware.
- Stuck? Open an issue on GitHub: [{{ site.github.repository_url }}]({{ site.github.repository_url }})

