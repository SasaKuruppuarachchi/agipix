---
title: Hardware Assembly
layout: doc
wip: true
---

# Complete Guide for Building the Agipix Hardware Platform

## Material checklist

- [Bill of Materials (BOM)](../../../bom.md)
- [Interactive 3D CAD Model (Autodesk A360)](https://a360.co/4gY1h8M)
- Fasteners: the frame uses mostly M3 hex-head screws, with some M2. The Livox Mid-360 is mounted on [Lundahl M3 isolators](https://www.soundimports.eu/en/lundahl-m3-isolator.html).

## Carbon fibre cuts

Use the supplied cutting patterns available at cad/Fab/CF and use a water-jet cutting method to cut.

| File name                  | Material        |
|---------------------------|-----------------|
| tocut_1_5mm_500x600.dxf   | 500x600x1.5mm   |
| tocut_1_5mm_500x600.dxf   | 500x600x1.5mm   |
| tocut_4mm_500x500.dxf     | 500x500x4.0mm   |

### Postprocessing of parts
Some CF parts need extra processing to support lataral fitting.

> **Note:** TODO: Detailed description with images

## 3D printed parts

Use the supplied 3D printable stl files available at cad/Fab/3D_prints and use followig settings to print them

- Filament: AmazonBasics TPU (preferred for durability);
- Nozzle: 0.4 mm 
- Layer height: 0.2 mm
- Infill: 40% gyroid/cubic; 70% for bushings/adaptors
- Temperatures: TPU 235–245°C nozzle

- Post-processing: deburr, ream holes, clean support interfaces

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

![Water-jet-cut carbon-fibre plates and 3D-printed TPU parts laid out before assembly](../../../assets/images/real/making/carbon_fibre_parts.jpg)

## Assembly

### Low level assembly and test

In this step we setup following componenets before the low level test
- Frame (CF plates and TPU parts)
- Power: Tattu G-Tech 4500 mAh 6S 25C LiPo and the Power Brick Mini (part of the Cube Orange+ Mini set)
- ESC: T-Motor F55A Pro II 4-in-1
- Motors: T-Motor Slatts 2306.3 1700KV
- Radio receiver: FrSky Archer Plus SR12+
- Telemetry: over Wi-Fi from the Jetson (no telemetry radio)
- Flight controller: CubePilot Cube Orange+ Mini set (PX4 v1.17.0)
- Optical flow: CubePilot HereFlow on DroneCAN

Finally we do a seris of manual flight tests to verify

> **Note:** TODO: Detailed steps with images

### High level Assembly

In this step we setup following componenets before attempting high level controls
- Top plate
- RS-232 to TTL converter (MAX3232) for the Jetson–PX4 DDS serial link
- Jetson Orin NX 16 GB with ConnectTech Hadron (Dual MIPI) carrier, WD_BLACK SN770M 1 TB NVMe and Intel Wireless-AC 9260 Wi-Fi card
- Wifi antennas (x2)
- ESP32 time-sync board (DFRobot FireBeetle 2 ESP32-S3)
- Wiring and Complient frame stiffner 

> **Note:** TODO: Detailed steps with images

Now we are ready to Firmware setup. See [Instructions](./2_flashing_hardware.md) to continue.

### Sensor Assembly

In this step we setup following componenets before attempting high level controls
- Carbon Fibre Sensor Cage
- Livox Mid-360 Lidar
- USB webcam (currently fitted)
- (Optional) Arducam OG02B10 global-shutter RGB camera
- (Optional) Intel RealSense D455 RGBD camera

> **Note:** TODO: Detailed steps with images

### High level Assembly

In this step we setup following componenets before attempting high level controls
- Top plate
- RS-232 to TTL converter (MAX3232) for the Jetson–PX4 DDS serial link
- Jetson Orin NX 16 GB with ConnectTech Hadron (Dual MIPI) carrier, WD_BLACK SN770M 1 TB NVMe and Intel Wireless-AC 9260 Wi-Fi card
- Wifi antennas (x2)
- ESP32 time-sync board (DFRobot FireBeetle 2 ESP32-S3)
- Wiring

> **Note:** TODO: Detailed steps with images

Now we are ready for software setup. See [Instructions](./9_software_setup.md) to continue.


