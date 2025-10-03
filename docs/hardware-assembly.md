---
layout: doc
title: Hardware Assembly
---

# Complete Guide for Building the Agipix Hardware Platform

## Material checklist

See the [Bill of Materials (BOM)]({{ '/bom.html' | relative_url }})

## Carbon Fibre Cuts

Use the supplied cutting patterns available at `cad/Fab/CF` and use a water-jet cutting method to cut.

| File name                  | Material        |
|---------------------------|-----------------|
| tocut_1_5mm_500x600.dxf   | 500x600x1.5mm   |
| tocut_1_5mm_500x600.dxf   | 500x600x1.5mm   |
| tocut_4mm_500x500.dxf     | 500x500x4.0mm   |

### Postprocessing of parts
Some CF parts need extra processing to support lateral fitting.

## 3D Printed Parts

Use the supplied 3D printable STL files available at `cad/Fab/3D_prints` and use following settings to print them:

- **Filament**: AmazonBasics TPU (preferred for durability)
- **Nozzle**: 0.4 mm 
- **Layer height**: 0.2 mm
- **Infill**: 40% gyroid/cubic; 70% for bushings/adaptors
- **Temperatures**: TPU 235–245°C nozzle
- **Post-processing**: deburr, ream holes, clean support interfaces

### Required 3D Printed Parts

| File name | Quantity |
|---|---|
| battery_bush_x2.stl | 2 |
| D455_rubber_mount_Ll.stl | 1 |
| D455_rubber_mount_R.stl | 1 |
| F55A_bush_adaptor_in.stl | 1 |
| F55A_bush_adaptor.stl | 1 |
| front_cam_bush_x2.stl | 2 |
| front_left_x2.stl | 2 |
| front_right_x2.stl | 2 |
| landing damper.stl | 1 |
| landing_gear_bush.stl | 1 |
| nx_bush_x4.stl | 4 |
| px4_pad.stl | 1 |
| side_joint_lower.stl | 1 |
| side_joint_upper.stl | 1 |
| top_gurd_flexies_x4.stl | 1 |

## Assembly Process

Detailed assembly instructions with images are available in the repository.

## Next Steps

After hardware assembly, proceed to:
1. [Flashing Hardware]({{ '/docs/flashing-hardware.html' | relative_url }})
2. [Software Setup]({{ '/docs/software-setup.html' | relative_url }})

---

**For detailed instructions**, visit the complete guide at [doc/real/1_hardware_assembly.md]({{ site.github.repository_url }}/blob/main/doc/real/1_hardware_assembly.md)
