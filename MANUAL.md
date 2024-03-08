# Holybro x500 v2 Drone docs

<p style="text-align: justify;">This user manual contains information about the components, software, firmware, custom-made parts (e.g., 3D printed), and custom software features. The drone is mainly used for computer vision, edge computing, and aerial robotics research in computer vision and software engineering research groups at the Tampere University.

The main focus of the documentation is to provide sufficient instructions on how to assembly, disassembly, add, modify or remove hardware components (e.g., sensors, companion computers), user instructions, and repair or service the device. 



## Current setup

In this section, current setup (hardware, software, and firmware) is described. <strong>Please update the information in this section if drone is modified or software/firmware is updated so that the modifications can be tracked.</strong>

<Strong>Hardware</strong>
- Frame, PDB, Flight controller, telemetry module, propellers, ESCs, motors from Holybro x500 development kit v2
- F9P Rover Lite RTK GPS
- Admiral 5000mAH 4S 14.8V 40C LiPo Battery
- Nvidia Jetson Nano 4GB Developer Kit as Companion computer
- Radiolink AT9S Pro Receiver & Transmitter
- Luxonis DepthAI OAK-D Lite Auto-focus camera

<strong>Software & Firmware</strong>
- Px4 version Xx.xx
- Linux4Tegra OS version XX.xx
- QGroundControl version XX.xx for MAC, QGroundControl version XX.xx for Linux 
- DepthAI SDK version XX.xx, Python API version XX.xx



## User instructions

<p style="text-align:justify;">How to operate drone, start, turn off, use software etc. What are the special stuff what needs to be taken care off, MTOW, limitations, etc. Service and repair instructions</p>

<details>
<summary><strong>Assembly guide</strong></summary>

<img src="img/assembly_01.jpg" alt="assembly instructions 1" width="600"/>
<img src="img/assembly_02.jpg" alt="assembly instructions 2" width="600"/>

[Youtube guide](https://youtu.be/27rbxCeCq4Y) | [More information](https://holybro.com/collections/x500-kits/products/px4-development-kit-x500-v2)

</details>

<details>
<summary><strong>Getting started</strong></summary>

---

In this section write about how to turn on, off, take off, land, switch modes from controller, pair everything, what to check before each flight etc. Write after assembly and first flight.


---

</details>

<details>
<summary><strong>Autonomous features</strong></summary>

PX4 provides autonomous flight features in their flight stack.

The modes provide different types/levels of autopilot assistance to the user (pilot), ranging from automation of common tasks like takeoff and landing, through to mechanisms that make it easier to regain level flight, hold the vehicle to a fixed path or position, etc. Autonomous modes are fully controlled by the autopilot, and require no pilot/remote control input.

Some manual modes may have autopilot-assisted mechanisms to make it easier to gain or restore controlled flight. For example, most modes will level out the vehicle when the RC sticks are centered. Pilots can transition between flight modes using switches on the remote control or with a ground control station


#### Hold Mode (MC)

Hold mode causes the multicopter to stop and hover at its current position and altitude (maintaining position against wind and other forces). The mode can be used to pause a mission or to help regain control of a vehicle in an emergency. It can be activated with a pre-programmed RC switch or the QGroundControl Pause button.

#### Return Mode (MC)
Return mode causes the vehicle to fly a clear path to a safe location. The mode may be activated manually (via a pre-programmed RC switch) or automatically (i.e. in the event of a failsafe being triggered). The return behaviour depends on parameter settings, and may follow a mission path and/or mission landing pattern (if defined). By default a mulitcopter will simply ascend to a safe height, fly to its home position, and then land.

#### Mission Mode (MC)
Mission mode causes the vehicle to execute a predefined autonomous mission (flight plan) that has been uploaded to the flight controller. The mission is typically created and uploaded with a Ground Control Station (GCS) application.

#### Takeoff Mode (MC)
Takeoff mode causes the multicopter to climb vertically to takeoff altitude and hover in position.

#### Land Mode (MC)
Land mode causes the multicopter to land at the location at which the mode was engaged.

#### Follow Me Mode (MC)
Follow Me mode causes a multicopter to autonomously follow and track a user providing their current position setpoint. Position setpoints might come from an Android phone/tablet running QGroundControl or from a MAVSDK app.

#### Offboard Mode (MC)
Offboard mode causes the multicopter to obey a position, velocity or attitude setpoint provided over MAVLink.

More information: [PX4 Flight modes](https://docs.px4.io/main/en/getting_started/flight_modes.html) | [PX4 Autonomous missions](https://docs.px4.io/main/en/flying/missions.html) | [PX4 Flying](https://docs.px4.io/main/en/flying/) | [Drone Apps & APIs](https://docs.px4.io/main/en/robotics/)

</details>

<details>
<summary><strong>Restrictions, limitations, and safety</strong></summary>

---

### Weather

The drone is not waterproof or water resistant, so flying during raining and snowing is prohibited. 

As a rule of thumb, most consumer drones can safely operate in wind speeds up to 16-24 kilometers per hour. However, the pilot should be extra causious when flying in high wind speeds, even if its less than 16-24 kmh.

In addition to wind speed, wind gusts can also pose a significant risk to drone flight. Sudden and strong gusts of wind can cause a drone to lose stability and control, potentially leading to a crash. It is crucial to monitor local weather forecasts for any wind gust warnings and avoid flying in such conditions.

Temperature is another vital factor to consider when planning a drone flight. Extreme temperatures, both hot and cold, can affect a drone’s battery life and overall performance. In cold weather, battery capacity can be significantly reduced, leading to shorter flight times and the potential for sudden power loss. In hot weather, overheating can cause damage to the drone’s components and reduce its overall lifespan. It is recommended to avoid flying in temperatures below 0°C or above 40°C, although this can vary depending on the specific drone model.

The drone is not water proof or water resistant so no flying during rain/snow etc. Cannot land on big slopes without a risk of damaging the device, so always land on flat area. 

### MTOW, payload, and other limitations/things to consider

[Maximum payload is ~1kg with 4S 5000mAH batter @ 70% throttle.](https://docs.holybro.com/drone-development-kit/px4-development-kit-x500v2#) Maximum payload varies with the different batteries (e.g., lower nominal voltage might decrease the maximum payload).

MTOW is ~1.5kg (610g drone weight + ~1kg payload).

Theoretical maximum distance for RC transmitter is 3400m, however, drone should be visible to the pilot for all times during flying. This includes line of sight etc. Notice that obstacles and power transmission lines etc. might affect the RC transmitter distance.

Telemetry radio theoretical maximum distance "out of the box" is is ~300m, however, several things can affect the actual distance such as buildings and power transmission lines. <strong>[In Finland, telemetry radio uses 433mHZ frequency and the maximum output power is ≤25mW.](https://www.traficom.fi/sites/default/files/media/regulation/Määräys%2015AT.pdf)</strong>

If bluetooth/WiFi is used for data transmission, check the maximum transmission distances from the device manifacturers. Commonly supported distances: Consumer-grade bluetooth up to 10m, commercial bluetooth up to 100m, 2.4 GHz WiFi up to 90 meters, and 5 GHz WiFi up to 15 meters in open spaces. Notice that obstacles etc. might affect the distance.




### LiPo Batteries (charging, storing)

The following information is to be used as a guideline for the safe handling, storage and charging of Lithium Polymer (LiPo) batteries. Only essential information is provided in this document, and if the user is inexperienced with LiPo batteries it is recommended to read the provided source material and other information. [Source: University of Vermont](https://www.uvm.edu/sites/default/files/UVM-Risk-Management-and-Safety/lipo_battery_safety.pdf).

<strong>Mishandling of LiPo batteries can lead to fire, explosions and toxic smoke inhalation.
Always read the manufacturer-specific battery manual for instructions regarding the handling, charging and safe usage of your manufacturer-specific LiPo batteries. </strong>

The initial source of lithium battery heat can be caused by:
- external sources, such as welding, soldering, etc., or
- internal sources, such as heating caused by short circuiting, excessive running currents for prolonged periods of time, forced over-discharge, charging, or excessive mechanical abuse.

Mechanical abuse
Excessive shock or vibration can result in:
- battery case deformation,
- crushing, and
- damage to the electrode materials.

#### <strong>Charging</strong>

LiPo batteries must only be charged with a manufacturer recommended LiPo charger.
LiPo batteries have very specific charging requirements. Some chargers, such as those used for toys or cell phones, are made to charge a specific cell count and are not configurable for other cell counts. The LiPo charger used must be able to handle the cell count of the battery you are charging.

<Strong>A 1s or 1 cell LiPo battery has a nominal voltage of 3.7v. </Strong> When fully charged it has a maximum voltage of 4.2v. <Strong>When fully discharged, it should never go below 3.0v without risking cell damage.</Strong>

A 5s4p battery pack means that the pack contains 5 cells in a series circuit and 4 cells in a parallel circuit. Since each cell is 3.7v (nominal) a 5s LiPo battery has a nominal voltage of 18.5v, a fully charged voltage of 21.0v and a maximum discharged voltage of 15.0v before damage occurs.

When charging LiPo batteries, they must be charged at the voltage of the number of cells in series. Example: A 5s4p pack must be charged as a 5 cell pack.


Tips:
- Never, under ANY circumstances let the positive and negative battery leads touch. This can lead to cell ballooning, cell damage, fire or an explosion. If you notice your LiPo battery pack is swelling, disconnect the charging device immediately.
- If necessary, put the battery in a non-combustible bucket or container and observe it for 15 minutes.
- Never charge a LiPo battery on a wooden or other combustible (carpeted) surface. Always charge LiPo batteries on surfaces made of cement, steel, ceramic or stone.
- Never charge a LiPo battery near an exit. Keep exit egress clear in case of a fire or emergency.
- Never leave a charging LiPo battery pack unattended. Never store batteries inside of an automobile.
- Have a fire extinguisher near the LiPo battery charging area and/or a large bucket of dry sand. 
- NEVER extinguish LiPo batteries with water.
- Never charge LiPo batteries near any flammable products, including liquids or gases.
- Double check that the setting for the lithium polymer charger is correct for the pack being charged – this includes the cell count as well as the current settings.
- In general, most LiPo batteries should be charged to no more than 4.2 volts per cell or depleted to less than 3.0 volts per cell. There are new generation batteries available that can handle higher / lower voltages, but they are still new and thus are the exception to the rule.
- Do not fully discharge your LiPo battery pack. Discharging a LiPo beyond it’s critical minimum voltage (often 3.0v) can cause damage to the battery.
- Ensure that charging leads are connected correctly. Reverse charging can lead to cell damage, fire or explosion.
- If you have dropped or damaged a LiPo battery in any way, do not attempt to charge it.
- Never charge a LiPo pack that has ballooned or swelled due to over/under-charging or from a crash. 
- Never charge a lithium polymer battery pack that has been punctured or damaged in a crash.
- Never charge a LiPo battery while it is inside your model or other electronic device. If it catches fire, it can lead to total destruction of the item inside which it is being charged.


#### <strong>Storage</strong>

- Never put LiPo batteries or battery packs in pockets, drawers or bags where they might make contact with something made of metal. This can cause a short circuit.
- Do not store LiPo batteries in extreme temperatures below 0C or above 50C.
- Always store LiPo pack in a safe and non-combustible container away from flammable/combustible materials.
- A LiPo Sack or metal/ceramic storage container is safest. Always store your LiPo’s partially charged so they maintain their performance levels over time; there is no need to cycle them unless stored for periods longer than 3-6 months.
- When storing batteries for extended periods, store at a half charged state.

More information: [HobbyKing LiPo guide](https://hobbyking.com/en_us/blog/lipo-battery-safety-101-a-guide/?___store=en_us) | [Battery university: learn about batteries](https://batteryuniversity.com)

---

</details>

<details>
<summary><strong>Service and repair</strong></summary>

#### Pre-flight checklist

Visual aircraft / system inspection
- Registration number is displayed properly and is legible
- Look for abnormalities—aircraft frame, propellers, motors, undercarriage
- Look for abnormalities—gimbal, camera, transmitter, payloads, etc.
- Gimbal clamp and lens caps are removed
- Clean lens with microfiber cloth
- Attach propellers, battery/fuel source, and insert SD card / lens filters

Powering up
- Turn on transmitter / remote control and open up DJI Go 4 app
- Turn on aircraft
- Verify established connection between transmitter and aircraft
- Position antennas on transmitter toward the sky
- Verify display panel / FPV screen is functioning properly
- Calibrate Inertial Measurement Unit (IMU) as needed
- Calibrate compass before every flight
- Verify battery / fuel levels on both transmitter and aircraft
- Verify that the UAS has acquired GPS location from at least six satellites

Taking off
- Take-off to eye-level altitude for about 10-15 seconds
- Look for any imbalances or irregularities
- Listen for abnormal sounds
- Pitch, roll, and yaw to test control response and sensitivity
- Check for electromagnetic interference or other software warnings
- Do one final check to secure safety of flight operations area
- Proceed with flight mission

#### Service / post-flight checklist

Like all things with moving parts and electronics, regular or constant use causes wear and tear. For drones, it’s advisable to implement a routine maintenance programme on a per-flight basis rather than set dates in the calendar.

- Take care of the essentials and clean dirt and from the chassis. 
- Use an anti static cloth, a compressed air cleaner and a light brush to keep the UAV in a shiny, out-of-the-box condition.
- Check components, check that screws and fastenings are suitably tightened, but not over tightened as this can cause stress.
- Examine the motors regularly. Make sure they are clean and free from dust.
- Propellers need to be subject to regular scrutiny. Propellers need replacing at intervals recommended by the manufacturer.
- Check the propellers are free-spinning (disconnect the battery first). 
- The landing gear also needs a check to make sure the UAV returns in one piece. 
- Clean out the motor chamber and note the condition of wiring and solder joints. 
- Make sure the antennas are free from debris to ensure a good connection with the base.
- The camera may need a wipe over with a suitable soft cloth and non-abrasive cleaner that you can pick up from a photography retailer.
- Check that firmware and software are up to date and running the latest release.

#### Repair

Drones are complex pieces of kit, even for seasoned technicians. It’s more than likely that any repairs above what can be carried out simply will need to be sent off to the manufacturer for expert work to be carried out.

Basic drone repair
- Propeller replacement: If any of the propellers are broken, or bent, you should replace them. Smaller drones have propellers that attach using a friction fit, or a single screw holding the propeller to the drive shaft.
- Motor replacement: Your motors may need replacement after extended flying and usage. It may sound a little daunting but actually replacing motors is quite simple on most drones. Some motors are connected to the electronics board by a simple plug-in, while others may require that you solder the motor leads to the main circuit board.


#### Schedule

Perform pre and post-fly check following the provided checklist above for every flight. If any of the equipment needs service or repair, abort the mission and fix the parts/system before flying. **If you are not sure what you are doing, then ask for help or contact the part manifacturer!** Perform thorough maintenance and checkup at least every 6 months (more often if drone is in active use) where all the parts are checked, cleaned and serviced.

</details>






## Hardware & Software

<p style="text-align:justify;"><strong>Holybro X500 V2 PX4 Development kit</strong> is used as a base, where different components and sensors can be attached for the task in hand. Development kit contains all the necessary parts, such as flight controller, frame, motors and so on, for ready-to-fly drone (excluding battery, radio transmitter and receiver).</p>

<p style="text-align:justify;">Several different software solutions are used with the drone, such as PX4 flight stack for flight controller and autonomous features, QGroundcontrol and ardupilot mission planner as ground station software, DepthAI API for accessing the camera features (e.g., object detection, and tracking), and different Python libraries and custom functionality in the companion computer. More detailed list and descriptions can be found from below.</p>

<strong>Features and specification:</strong>
- Minimal assembly time (~30 minutes), No soldering required
- Pre-installed motors & ESCs with simple XT30 power plugs for PDB
- Mount for companion computer such as Raspberry Pi & Nvidia Jetson Nano
- Optional depth camera mount for Intel RealSense & Structure Core
- PX4 compatible flight controller


<h4><strong>Dimensions</strong></h4>

<img src="img/X500MechanicalSpec_480x480.png.webp" alt="drawing" width="400"/>


More information: [Holybro store](https://holybro.com/collections/x500-kits/products/px4-development-kit-x500-v2) | [Documentation](https://docs.holybro.com/drone-development-kit/px4-development-kit-x500v2) | [Assembly guide](../Holybro_X500_V2_Frame_Kit_Assembly_Guide_en.pdf) | [3D print](https://cdn.shopify.com/s/files/1/0604/5905/7341/files/Holybro_X500_V2_3D_Print.rar?v=1665561017) | [Ardupilot setup guide (youtube)](https://www.youtube.com/watch?v=_ketmb8u2UI) | [Purchased from MyBotShop](https://www.mybotshop.de/Holybro-X500-V2-ARF-Kit_5)


<details>
<summary><strong>Detailed list of hardware and software</strong></summary>







---


### Parts in development kit


<details>
<summary><strong>4x holybro 2216 KV920 motors</strong></summary>
<img src="img/motor.jpeg" alt="motor" width="200"/>


#### <strong>Motor specification</strong>

<img src="img/X500MotorSpec.png" alt="drawing" width="500"/>


</details>

<details>
<summary> <strong>4x BLHeli S ESC 20A</strong></summary>

<img src="img/esc.jpeg" alt="ESC" width="200"/>

<strong>Specification:</strong>
- Continuos current: 20A
- Burst Current (10S): 30A
- BEC: No
- LiPo cells: 2-4S
- Maximum speed: 500k eRPM

More information: [MyBotShop](https://www.mybotshop.de/Holybro-X500-V2-BLHeli-S-20A-ESC_1)
</details>




<details>
<summary><strong>Power Distribution Board (PDB)</strong></summary>

<img src="img/PDB-dimensions.webp" alt="drawing" width="300"/>

<strong>Features and specification</strong>

- Xt60 connector for Power module and battery
- XT30 for ESCs and Motors 
- Rated Current: 60A
- Max current: 120A (<60 sec)

More information: [Holybro store](https://holybro.com/products/power-distribution-board-pdb) | [Documentation](https://docs.holybro.com/power-module-and-pdb/power-module)


#### <strong>Power distribution Board wiring</strong>

<img src="img/pdb-wiring.webp" alt="GPS dimensions" width="400"/>
</details>



<details>
<summary><strong>SiK Telemetry module 433MHz, max 100mW output (adjustable)</strong></summary>

<img src="img/telem-connections.png" alt="Telemetry connections" width="300"/>

<strong>Features and specification</strong>

- [Open- source SIK firmware](https://github.com/ArduPilot/SiK)
- Can be connected to a drone or ground station
- 100mW maximum output power (adjustable)
- 2-way full-duplex communication through adaptive TDM UART interface
- Dimensions: 28x53x10.7 mm (without antenna)

More info: [Holybro store](https://holybro.com/products/sik-telemetry-radio-v3) | [Documentation](https://docs.holybro.com/telemetry-radio/sik-telemetry-radio-v3)

</details>




<details>
<summary><strong>M8N GPS module</strong></summary>

<img src="img/gps-m7n.webp" alt="GPS img" width="300"/>

<strong>Features and specifications</strong>
- [Ublox Neo-M8N module](https://www.u-blox.com/en/product/neo-m8-series)
- Cold starts: 26s
- Current consumption: less than 150mA @ 5V

More information: [Holybro store](https://holybro.com/collections/standard-gps-module/products/m8n-gps) | [Documentation](https://docs.holybro.com/gps-and-rtk-system/m8n-and-m9n-gps-module/standard-m8n-and-m9n-gps/overview)

#### <strong>Dimensions</strong>

<img src="img/gps-m8n-dimensions.jpeg" alt="GPS dimensions" width="500"/>

#### <strong>Pinmap</strong>

<img src="img/gps-m8n-pinout.png" alt="GPS pinout" width="500"/>


</details>

<details>
<summary><strong>Pixhawk 6C flight controller</strong></summary>

<img src="img/pixhawk6C-img.webp" alt="GPS dimensions" width="200"/>

<strong>Features and specification</strong>
- H7 processor with clock speed up to 480MHz
- Redundant inertial measurement unit (IMU) from Boshc and InvenSense
- PX4 autopilot pre-installed
- 2Mb flash memory, 1MB RAM

More information: [Holybro store](https://holybro.com/collections/autopilot-flight-controllers/products/pixhawk-6c) | [Documentation](https://docs.holybro.com/autopilot/pixhawk-6c/overview) | [Technical specification](https://docs.holybro.com/autopilot/pixhawk-6c/technical-specification) | [Ports](https://docs.holybro.com/autopilot/pixhawk-6c/pixhawk-6c-ports) | [Firmware](https://docs.holybro.com/autopilot/pixhawk-6c/supported-firmware)

#### <strong>Dimensions</strong>

<img src="img/Pixhawk6C-Dimensions.png" alt="GPS dimensions" width="400"/>


#### <strong>Ports</strong>

<img src="img/pixhawk6c-ports.png" alt="GPS dimensions" width="400"/>

</details>

<details>
<summary><strong>6x 1045 propellers</strong></summary>

<img src="img/propeller-img.webp" alt="propeller" width="200"/>

Dimensions: Length 10 inch (25.4cm), slope 4.5inch (11.43cm).


</details>

<details>
<summary><strong>Frame</strong></summary>

Dimensions and images can be fround from above.

<strong>Specifications:</strong>
-  Full carbon top and bottom plate
-  16mm carbon fiber tubes as arms
-  16mm and 10mm carbon fiber tubes as chassis
-  Landing gear - 16mm & 10mm diameter carbon fiber tubes with strengthened & improved plastic tee connectors
-  Platform board - With mounting holes for GPS & popular companion computer such as the Raspberry Pi 4 & Jetson Nano
-  Dual 10mm Ø rod x 250 mm long rail mounting system
-  Battery mount with two Battery Straps

More information: [Holybro store](https://holybro.com/collections/x500-kits/products/px4-development-kit-x500-v2)

</details>









---

### Additional components


<p style="text-align: justify;">Components listed here are commonly attached to the drone, and therefore, listed in the documentation. E.g., Camera and battery are always attached to the drone, and M8N GPS module is switched to H-RTK Rover if accurate position data is required. In addition, this can work as a list of available components for the drone.</p>

<details>
<summary><strong>Holybro H-RTK F9P Rover Lite</strong></summary>

<img src="img/f9p-rover.jpeg" alt="rover-img" width="400"/>

<strong>Specification:</strong>
- Rover (aircraft) only
- GPS/GLONASS/BeiDou/Galileo
- Data and update rate 20Hz RAW
- Working voltage 4.75~5.25V
- Current consumption ~250mA
- Weight 106g

More information: [Holybro store](https://holybro.com/collections/standard-h-rtk-series/products/h-rtk-f9p-gnss-series) | [Documentation](https://docs.holybro.com/gps-and-rtk-system/f9p-h-rtk-series/standard-f9p/overview) | [H-RTK with Cube Autopilot](https://docs.holybro.com/gps-and-rtk-system/f9p-h-rtk-series/standard-f9p/h-rtk-with-cube-autopilot) | [Setup and getting started](https://docs.holybro.com/gps-and-rtk-system/f9p-h-rtk-series/standard-f9p/setup-and-getting-started)

#### <strong>Dimensions</strong>

<img src="img/RTK-Rover-Lite-Dimension.jpeg" alt="rover-dimensions" width="400"/>

#### <strong>Pinmap</strong>

<img src="img/RTK-Rover-Lite-pinout.jpeg" alt="rover-pinmap" width="400"/>

</details>


<details>
<summary><strong>Holybro H-RTK F9P Helical</strong></summary>

<img src="img/helical-img.jpeg" alt="rover-img" width="300"/>

<strong>Specification:</strong>
- Rover (aircraft) or base station
- GPS/GLONASS/BeiDou/Galileo
- RTK SurbeyIn time ≤ 5min
- Data and update rate 20Hz RAW, max RTK 8Hz. Moving base 5Hz max
- Working voltage 4.75~5.25V
- Current consumption ~250mA
- Weight 49g

More information: [Holybro store](https://holybro.com/collections/standard-h-rtk-series/products/h-rtk-f9p-gnss-series) | [Documentation](https://docs.holybro.com/gps-and-rtk-system/f9p-h-rtk-series/standard-f9p/overview) | [H-RTK with Cube Autopilot](https://docs.holybro.com/gps-and-rtk-system/f9p-h-rtk-series/standard-f9p/h-rtk-with-cube-autopilot) | [Setup and getting started](https://docs.holybro.com/gps-and-rtk-system/f9p-h-rtk-series/standard-f9p/setup-and-getting-started)

#### <strong>Dimensions</strong>

<img src="img/RTK-Helical-Dimension.jpeg" alt="rover-img" width="400"/>

#### <strong>Pinmap</strong>

<img src="img/F9P-Helical-pinout.png" alt="rover-img" width="500"/>

</details>

<details>
<summary><strong>Nvidia Jetson Nano 4GB Developer Kit</strong></summary>

<img src="img/jetson-nano.webp" alt="jetson nano" width="300"/>

<strong>Features and specification</strong>
- 128-core NVIDIA Maxwell GPU
- 4 GB 64-bit LPDDR4
- Ethernet, HDMI/DisplayPort, Micro-USB 5V 2A, DC power adapter 5V 4A
- Works as companion computer for the drone

More information: [Purchased from Siliconhighway](https://www.siliconhighwaydirect.com/product-p/945-13450-0000-100.htm) | [User manual](../JetsonNano_userguide.pdf) | [Datasheet](../JetsonNano_Datasheet.pdf) | [Pin and function names](../JetsonNano_pinfunction.pdf) | [NVIDIA Download center](https://developer.nvidia.com/embedded/downloads#?tx=$product,jetson_nano) | [Connect Pixhawk to Jetson Nano (Youtube)](https://www.youtube.com/watch?v=nIuoCYauW3s)

</details>


<details>
<summary><strong>Radiolink AT9S Pro Transmitter & Receiver</strong></summary>

<img src="img/radiolink-at9s-pro-img.jpeg" alt="rover-img" width="300"/>

<strong>Features and specification</strong>
- 10/12 channels
- Compatible with Pixhawk
- Delay telemetry 3ms
- Current consumption 90mAH
- Signals: SBUS, PWM, PPM & CRSF

More information: [Purchased from MyBotShop](https://www.mybotshop.de/Radiolink-AT9S-Pro_1) | [Manual](https://www.mybotshop.de/Datasheet/Radiolink_AT9S_Pro.pdf) | [Specifications](https://www.radiolink.com/at9spro_specifications)

#### <strong>Pinmap</strong>

<img src="img/radiolink-receiver-pinout.png" alt="rover-img" width="300"/>

#### <strong>Pixhawk connection</strong>

<img src="img/radiolink-receiver-pixhawk-connection.png" alt="rover-img" width="300"/>

</details>

<details>
<summary><strong>Luxonis DepthAI OAK-D Lite Auto-focus camera</strong></summary>

<img src="img/OAK-d-camera.png" alt="camera" width="300"/>

<strong>Features and specification</strong>
- 4K RGB, 480P stereo
- Auto-focus
- Effective focal length 3.37mm RGB, 1.3mm stereo
- DFOV / HFOV / VFOV: RGB 81° / 69° / 54°, stereo 86° / 73° / 58°
- Computer vision features (object detection, tracking localization etc.)


More information: [Purchased from MyBotshop](https://www.mybotshop.de/Luxonis-DepthAI-OAK-D-Lite-Auto-Focus_1) | [Documentation and specifications](https://docs.luxonis.com/projects/hardware/en/latest/pages/DM9095/) | [Datasheet](https://github.com/luxonis/depthai-hardware/blob/master/DM9095_OAK-D-LITE_DepthAI_USB3C/Datasheet/OAK-D-Lite_Datasheet.pdf) | [DepthAI API docs](https://docs.luxonis.com/projects/api/en/latest/)

#### <strong>Dimensions</strong>

<img src="img/oak-d-dimensions.png" alt="rover-img" width="500"/>

</details>

<details>
<summary><strong>Battery: Admiral 5000mAH 4S 14.8V 40C LiPo</strong></summary>

<img src="img/battery.jpeg" alt="battery" width="300"/>

<strong>Features and specifications</strong>
- 4S1P
- Discharge rate 40C
- Charge rate 3C
- weight 476g
- Dimensions: 158x46x30mm (lengthxwidthxheight)
- AWG 12, esc connector XT60, balance connector JST/XH

More information: [Purchased from MotionRC](https://www.motionrc.eu/products/admiral-5000mah-4s-14-8v-40c-lipo-battery-with-xt60-connector-epr50004x6)

</details>










---

### Software


<p style="text-align:justify;">In this section, the additional software which is required in the drone operations are listed. E.g., Software for correcting and communicating RTK GPS data to rover(s) or logging flight data. In addition, this section includes software(s) which are used for autonomous drone missions.</p>

<details>
<summary><strong>PX4 Flight Stack</strong></summary>

PX4 autopilot is an open-source autopilot system oriented toward inexpensive autonomous aircraft. PX4 is capable of integrating with other autopilot software, such as the QGroundControl ground control station software, via the MAVLink (Micro Air Vehicle Communication) protocol.

<Strong>Supported features</strong>
- Support for multiple vehicle types, including fixed-wing aircraft, multicopters, helicopters, rovers, boats, and underwater vehicles
- Fully manual, partially assisted, and fully autonomous flight modes
- Vehicle stabilization
- Waypoint navigation
- Integration with position, speed, altitude, and rotation sensors
- Automatic triggering of cameras or external actuators

More information: [Documentation](https://docs.px4.io/main/en/) | [Wikipedia](https://en.wikipedia.org/wiki/PX4_autopilot) | [Youtube](https://www.youtube.com/channel/UCkrtSvera-xusjMtgMUe-HA) | [Github](https://github.com/PX4/PX4-Autopilot)

#### <strong>Flight controller architecture</strong>

The diagram below provides a high level overview of a typical "simple" PX4 system based around a flight controller.

The hardware consists of
- Flight controller (running the PX4 flight stack). This often includes internal IMUs, compass and barometer.
- Motor ESCs connected to PWM outputs, DroneCAN (DroneCAN allows two-way communication, not single direction as shown) or some other bus.
- Sensors (GPS, compass, distance sensors, barometers, optical flow, barometers, ADSB transponders, etc.) connected via I2C, SPI, CAN, UART etc.
- Camera or other payload. Cameras can be connected to PWM outputs or via MAVLink.
- Telemetry radios for connecting to a ground station computer/software.
- RC Control System for manual control

The left hand side of the diagram shows the software stack, which is horizontally aligned (approximately) with the hardware parts of the diagram.

<img src="img/px4_fc_architecture.svg" alt="rover-img" width="500"/>

#### <strong>High-level Software Architecture</strong>

The diagram below provides a detailed overview of the building blocks of PX4. The top part of the diagram contains middleware blocks, while the lower section shows the components of the flight stack. The arrows show the information flow for the most important connections between the modules. In reality, there are many more connections than shown, and some data (e.g. for parameters) is accessed by most of the modules.

Modules communicate with each other through a publish-subscribe message bus named uORB.

<img src="img/px4_architecture.svg" alt="rover-img" width="500"/>

</details>

<details>
<summary><strong>QGroundControl</strong></summary>

QGroundControl provides full flight control and mission planning for any MAVLink enabled drone. Its primary goal is ease of use for professional users and developers. You can use it to load (flash) PX4 onto the vehicle control hardware, you can setup the vehicle, change different parameters, get real-time flight information and create and execute fully autonomous missions.

<strong>Key Features:</strong>
- Full setup/configuration of ArduPilot and PX4 Pro powered vehicles.
- Flight support for vehicles running PX4 and ArduPilot (or any other autopilot that communicates using the MAVLink protocol).
- Mission planning for autonomous flight.
- Flight map display showing vehicle position, flight track, waypoints and vehicle instruments.
- Video streaming with instrument display overlays.
- Support for managing multiple vehicles.
- QGC runs on Windows, OS X, Linux platforms, iOS and Android devices.

More information: [Website](http://qgroundcontrol.com) | [User guide](https://docs.qgroundcontrol.com/master/en/index.html) | [Download and install](https://docs.qgroundcontrol.com/master/en/getting_started/download_and_install.html) | [PX4 Documentation](https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html#qgroundcontrol)

<img src="img/qgc_img.jpeg" alt="rover-img" width="500"/>

</details>

<details>
<summary><strong>NVIDIA Jetson Nano: Linux4Tegra & JetPack SDK</strong></summary>

Linux for Tegra (Linux4Tegra, L4T) is a Linux based system software distribution by Nvidia for the Tegra processor series, used in platforms like the Nvidia Jetson board series. This system software comes with JetPack - a Software Development Kit (SDK) from Nvidia.

NVIDIA JetPack SDK is the most comprehensive solution for building end-to-end accelerated AI applications. JetPack provides a full development environment for hardware-accelerated AI-at-the-edge development on Nvidia Jetson modules.

More information: [Jetson Linux R32.7.4](https://developer.nvidia.com/embedded/linux-tegra-r3274) | [CUDA tools](https://developer.nvidia.com/debugging-solutions) | [Jetson Linux Developer guide](https://docs.nvidia.com/jetson/archives/l4t-archived/l4t-3274/index.html) | [Understanding Linux4Tegra (L4T) System package (codeinsideout)](https://www.codeinsideout.com/blog/jetson/linux-for-tegra/)

#### <strong>NVIDIA® Jetson™ Board Support Package (BSP) architecture</strong>

<img src="img/jetson_bsp_architecture.png" alt="rover-img" width="500"/>

#### <strong>NVIDIA JetPack SDK</strong>

<img src="img/jetson_sdk_architecture.png" alt="rover-img" width="500"/>

</details>

<details>
<summary><strong>DepthAI for OAK-D camera</strong></summary>

DepthAI is a Spatial AI platform, which allows robots and computers to perceive the world like a human can - what objects or features are - and where they are in physical world. It focuses on the combination of these 5 key features:
- Artificial Intelligence
- Computer Vision
- Depth perception (Stereo, ToF)
- Performant (high resolution and FPS, multiple sensors)
- Embedded, low power solution

DepthAI platform is a complete ecosystem of custom hardware, firmware, and software. Best of all, it is modular and you can integrate this technology into your products. 

DepthAI API allows users to connect to, configure and communicate with their OAK devices. We support both Python API and C++ API. DepthAI SDK is a Python package built on top of the depthai-python API library that improves ease of use when developing apps for OAK devices.

More information: [SDK documentation](https://docs.luxonis.com/projects/sdk/en/latest/) | [API documentation](https://docs.luxonis.com/projects/api/en/latest/) | [Github](https://github.com/luxonis)

#### <strong>Ecosystem</strong>

| Name | Description |
| ----------- | ----------- |
| [depthai-python](https://github.com/luxonis/depthai-python/) | Here you’ll find Python bindings creating the Python API of DepthAI |
| [depthai-core](https://github.com/luxonis/depthai-core/) | Our core API written in C++ |
| [depthai-ros](https://github.com/luxonis/depthai-ros/) | DepthAI ROS Wrapper. This is an attempt at basic DepthAI to ROS2 interface. It’s largely leveraging the existing depthai-python examples. |
| [depthai-unity](https://github.com/luxonis/depthai-unity) | DepthAI Unity Wrapper projects and examples. Useful for synthetic dataset generation. |
| [depthai-hardware](https://github.com/luxonis/depthai-hardware/) | This repository contains Luxonis open sourced baseboards, and contains Altium design files, documentation, and pictures to help you understand more about the embedded hardware that powers DepthAI.
| [depthai-ml-training](https://github.com/luxonis/depthai-ml-training/) | Here you can find repositories to help you connect your NN and create BLOBs. |


#### <strong>API diagram</strong>

<img src="img/depthai_api_diagram.png" alt="rover-img" width="500"/>



</details>

</details>


## 3D prints

CAD models for different 3D printable parts (computer and camera mounts, propeller guard etc.) can be found from `/cad` directory.  


<details>
<summary><strong>Camera mounts</strong></summary>


| Cameras    | CAD model | Image |
| -------- | ------- | ------ |
| RealSense D455 + T265  | [/cad/D455mount/d455_t265_mount_f](./cad/D455mount/d455_t265_mount_f.ipt)| <img src="cad/D455mount/d455_t265_mount.png" alt="d455-t265 mount" width="200"/> |
| RealSense D455 | [/cad/D455mount/D455_mount_f.ipt](./cad/D455mount/d455_mount_f.ipt) | <img src="cad/D455mount/d455_mount.png" alt="d455-t265 mount" width="200"/> |

</details>


<details>
<summary><strong>Companion computer mounts</strong></summary>


| Computer   | CAD model | Image |
| -------- | ------- | ------ |
| NVIDIA Jetson NX  | [/cad/JetNXMount/jetnxmount](./cad/JetNXMount/jetnxmount.ipt)| <img src="cad/JetNXMount/jetnxmount.png" alt="jet nx mount" width="200"/> |

</details>

<details>
<summary><strong>Other</strong></summary>


| Computer   | CAD model | Image |
| -------- | ------- | ------ |
| Propeller Guard Left & right v1  | [/cad/X500_prop/Version1/CAD/prop_gurd_l](./cad/X500_prop/Version1/CAD/prop_gurd_l.ipt) [/cad/X500_prop/Version1/CAD/prop_gurd_r](./cad/X500_prop/Version1/CAD/prop_gurd_r.ipt) | <img src="cad/X500_prop/Version1/prop_gurd_l.png" alt="jet nx mount" width="200"/> |
| Propeller Guard Bottom & top v2  | [/cad/X500_prop/Version2/prop_guard_bottom](./cad/X500_prop/Version2/prop_guard_bottom.ipt) [/cad/X500_prop/Version2/prop_gurd_bottom](./cad/X500_prop/Version2/prop_gurd_bottom.ipt) | <img src="cad/X500_prop/Version2/prop_guard_bottom.png" alt="jet nx mount" width="200"/> |
</details>

## Citing

If you use 3D models, or otherwise take inspiration from those or the documentation, please consider citing the work:

```
@misc{kalliola2024dronedocs,
  author       = {Kalliola, Jussi and Kuruppuarachichi, Sasanka and Suomela, Lauri},
  title        = {Holybro x500 v2 Drone docs - Tampere University},
  publisher    = {Github},
  year         = {2024},
  howpublished = {https://github.com/JussiKalliola/HolybroX500-docs}
}
```


