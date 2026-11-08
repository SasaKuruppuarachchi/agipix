# Agipix Bill of Materials (BOM)

**Estimated parts cost: ~€4,430 (prices checked 2026-11-07), including the battery (Tattu G-Tech 4500 mAh 6S 25C, ~€97); ~€4,330 without the battery. Adding the optional RGB and RGB-D cameras brings it to ~€5,150.** These totals leave out the carbon-fibre cutting service, tools, chargers, spares and shipping (see Excluded below).

> **Prices checked on 2026-11-07; they change.** All prices are in **EUR**, one unit each, including VAT where the shop shows it. Lines marked `~` are estimates: a price converted from USD or GBP, a price taken from a search snippet, or a representative or equivalent part. US prices are converted at the ECB reference rate of 2026-11-06 (1 EUR = 1.1165 USD = 0.83415 GBP) and exclude EU import VAT and duty. Those lines total ~€478, so Finnish import VAT (25.5%) would add about €122.

Quantities are per vehicle/unit unless noted otherwise. `bom/BOM.md` is the canonical copy; the site page `bom.md` mirrors it.

## Cost summary

| Category | Subtotal (EUR) |
|---|---:|
| Core flight platform (incl. battery ~€97) | ~891.22 |
| Compute + autonomy sensors | ~3,041.09 |
| Consumables and fabrication (excl. CF cutting) | ~497.40 |
| **Estimated total, core build** | **~4,429.71** |
| Core build without battery | ~4,332.81 |
| Optional sensors | 716.44 |
| **Estimated total incl. optional sensors** | **~5,146.15** |

## Core flight platform

| Item | Listing | Qty | Unit (EUR) | Line (EUR) | Buy | Checked | Notes |
|---|---|---:|---:|---:|---|---|---|
| FC | CubePilot Cube Orange+ Mini Set (HX4-06229) | 1 | 453.79 | 453.79 | [rotorama.com](https://www.rotorama.com/product/cubepilot-cube-orange-mini) | 2026-11-07 | Runs PX4 v1.17.0. Set includes the Mini carrier board and a Power Brick Mini power module with cable. "On the way"; VAT not stated. |
| ESC | T-Motor F55A Pro II 3-6S 4-in-1 ESC | 1 | 102.90 | 102.90 | [fpv24.com](https://www.fpv24.com/en/t-motor/t-motor-f55a-pro-ii-6s-am32-esc) | 2026-11-07 | **Discontinued.** 4 x 55 A continuous, 75 A burst. ESC only: the F7 flight-controller board of the stack is not fitted (the Cube replaces it). Successor: T-Motor F55A Pro III 3-8S 4-in-1 ESC, [€128.90](https://www.drone-fpv-racer.com/en/f55a-pro-iii-4in1-esc-38s-am32-t-motor-11888.html). |
| Motors | T-Motor Slatts 2306.3 1700KV Motor (Pink) | 4 | ~28.17 | ~112.68 | [hobbyrc.co.uk](https://www.hobbyrc.co.uk/t-motor-slatts-23063-1700kv-motor-grey) | 2026-11-07 | £23.50 each (Grey listing; Pink also sold). No EU stock found. |
| Propeller | Azure Power SFP 5148 (pack of 4: 2 CW + 2 CCW) | 1 | 4.29 | 4.29 | [fpv24.com](https://fpv24.com/en/azure-power-5148-sfp-3-blatt-propeller) | 2026-11-07 | **Discontinued / unavailable** at all shops checked. Successor: any 5.1 in tri-blade with a similar pitch (not price-checked). |
| Receiver | FrSky Archer Plus SR12+ | 1 | 94.99 | 94.99 | [lindinger.at](https://lindinger.at/en/RC-Electronics/RC-Systems/Receivers/FrSky-Empfaenger-Archer-Plus-SR12-2-4Ghz/9802174) | 2026-11-07 | |
| 6S lipo | Tattu G-Tech 4500 mAh 6S 25C (22.2 V) | 1 | ~96.90 | ~96.90 | [genstattu.com](https://genstattu.com/tattu-4500mah-22-2v-25c-6s1p-lipo-battery-pack-with-xt60-plug.html) | 2026-11-07 | US$108.19 at the manufacturer's US store (out of stock there; same price in stock at US retailers). Tattu/Grepow list this 4500 mAh 6S 25C pack as TAA45006S25X6 (XT60), without the G-Tech name. |
| XT60 | Battery connector (Amass XT60, pair) | 3 | 1.39 | 4.17 | [rotorama.com](https://www.rotorama.com/product/xt60-konektory-10-paru) | 2026-11-07 | |
| Battery straps | Tekno RC Battery Straps (1x center, 1x side, EB/ET48 2.0) TKR9019 | 1 | ~9.84 | ~9.84 | [teknorc.com](https://www.teknorc.com/?p=48524) | 2026-11-07 | US$10.99, snippet only. No EU shop found. |
| Lipo status | VALUERC LIPO VOLTAGE CHECKER 1-8S | 1 | 7.90 | 7.90 | [hobbyfactory.fi](https://hobbyfactory.fi/en/p43002/valuerc-lipo-voltage-checker-1-8s) | 2026-11-07 | |
| M3 damper | VIBRATION DAMPER - M3 -: 8MM - RUBBER - PIT: 8MM - THREAD PIT: 6MM - 24N | 4 | ~0.94 | ~3.76 | [tme.com](https://www.tme.com/in/en/details/dva2-8-8-m3-40/vibration-dampers/elesa-ganter/dva-2-8-8-m3-6-40/) | 2026-11-07 | Elesa+Ganter DVA.2-8-8-M3-6-40. US$1.05 ex VAT, snippet only. |
| LiDAR mount isolator | Lundahl M3 isolator (damped bolt) | — | — | — | [soundimports.eu](https://www.soundimports.eu/en/lundahl-m3-isolator.html) | — | Mounts the Livox Mid-360. Quantity and price not yet recorded. |

## Compute + autonomy sensors

| Item | Listing | Qty | Unit (EUR) | Line (EUR) | Buy | Checked | Notes |
|---|---|---:|---:|---:|---|---|---|
| Main compute unit | NVIDIA Jetson Orin NX 16 GB (module p3767-0000) | 1 | 1,327.77 | 1,327.77 | [reichelt.com](https://www.reichelt.com/fi/en/shop/product/nvidia_jetson_orin_nx_8x_2_ghz_100_tops_16_gb_ddr5-358849) | 2026-11-07 | Price is for the current revision 900-13767-0000-001; the -000 revision is out of stock. Reichelt sells to businesses only. Runs JetPack 6.2 / L4T R36.4.4. |
| Breakout Board | ConnectTech Hadron (Dual MIPI) carrier for Orin NX, NGX027 | 1 | ~367.22 | ~367.22 | [wdlsystems.com](https://www.wdlsystems.com/connect-tech-ngx027) | 2026-11-07 | US$410.00. No EU retailer found. Ethernet on board. |
| NX heatsink | NVIDIA JETSON ORIN NX/NANO ACTIVE HEATSINK (095-0181-000) | 1 | 34.99 | 34.99 | [mybotshop.de](https://www.mybotshop.de/NVIDIA-Jetson-ORIN-Heat-Sink) | 2026-11-07 | |
| NVMe SSD | WD_BLACK SN770M 1 TB, M.2 2230 (WDS100T3X0G) | 1 | 328.00 | 328.00 | [hinta.fi](https://hinta.fi/4833542/western-digital-black-sn770m-1-tb) | 2026-11-07 | Lowest Finnish offer; availability unknown. SSD prices have risen sharply since 2025. |
| Wi-Fi/BT card | Intel Wireless-AC 9260 (9260NGW), M.2 2230 | 1 | 49.50 | 49.50 | [hinta.fi](https://hinta.fi/1401496/intel-wireless-ac-9260) | 2026-11-07 | **Discontinued** (Intel EOL, 2025). Successor: Intel AX210 (Wi-Fi 6E), [€25.90](https://www.jimms.fi/fi/Product/Show/174436). |
| Wifi antenna | 146153-1150 - Joustava Wi-Fi 6E -antenni, 3.7 dBi, MHF4, 35mm, Liimakiinnitys, Molex | 2 | 3.82 | 7.64 | [digikey.fi](https://www.digikey.fi/en/products/result?keywords=146153-1150) | 2026-11-07 | The -1150 suffix is the 150 mm cable version. |
| Lidar | Livox MID-360 | 1 | ~772.95 | ~772.95 | [mybotshop.de](https://www.mybotshop.de/Livox-Mid360S_1) | 2026-11-07 | Mid-360: n/a, not sold to Finland on the DJI store and no reputable EU listing found. Price shown is for the newer **Livox Mid-360S**; check driver and mount compatibility before substituting. |
| Optical flow | CubePilot HereFlow (optical flow + short-range ToF lidar, DroneCAN) | 1 | 119.50 | 119.50 | [altigator.com](https://drones.altigator.com/hereflow-p-42706.html) | 2026-11-07 | Out of stock at the EU shops checked; supply looks intermittent. |
| RS-232 to TTL converter | Seeed Studio RS-232 To TTL Converter (MAX3232IDR), 103990363 | 1 | 4.34 | 4.34 | [eu.robotshop.com](https://eu.robotshop.com/products/seeedstudio-rs-232-to-ttl-converter-max3232idr) | 2026-11-07 | On the Jetson-PX4 DDS serial link. VAT not stated. |
| Time-sync board | DFRobot FireBeetle 2 ESP32-S3 (DFR0975) | 1 | 22.18 | 22.18 | [digikey.fi](https://www.digikey.fi/en/products/detail/dfrobot/DFR0975/20500154) | 2026-11-07 | PPS + GPRMC for the LiDAR; see `docs/real/5_hardware_synchronisation.md`. |
| USB camera | Vitade AF USB webcam (autofocus, 1080p) | 1 | n/a | n/a | — | 2026-11-07 | n/a: exact model not identified (likely Vitade 960A), and it is sold only on Amazon, which could not be checked. |
| Power capacitor | Low-ESR electrolytic capacitor, 63 V (e.g. Panasonic EEU-FS1J102B, 1000 µF) | 2 | 3.50 | 7.00 | [digikey.fi](https://www.digikey.fi/en/products/detail/panasonic-industry/EEU-FS1J102B/8567301) | 2026-11-07 | Across the 6S input of the Jetson carrier and of the LiDAR. The docs don't give the capacitance. |

## Optional sensors

| Item | Listing | Qty | Unit (EUR) | Line (EUR) | Buy | Checked | Notes |
|---|---|---:|---:|---:|---|---|---|
| RGB Camera | Arducam 2MP Global Shutter OG02B10 Color Camera Modules Pivariety (B0348) | 1 | 119.00 | 119.00 | [welectron.com](https://www.welectron.com/Arducam-B0348-2MP-Global-Shutter-OG02B10-Color-Camera-Modules-Pivariety_1) | 2026-11-07 | About 7 weeks' delivery. |
| RGBD camera | Intel RealSense D455 | 1 | 597.44 | 597.44 | [digikey.fi](https://www.digikey.fi/en/products/detail/realsense/82635DSD455/12429610) | 2026-11-07 | Active; now sold by RealSense. |

## Consumables and fabrication

| Item | Listing | Qty | Unit (EUR) | Line (EUR) | Buy | Checked | Notes |
|---|---|---:|---:|---:|---|---|---|
| Carbon Fiber | 1.5 mm, 600 x 500 carbon fibre plate | 2 | 92.30 | 184.60 | [ahltec.de](https://www.ahltec.de/shop/de/600-mm-x-500-mm-54.html) | 2026-11-07 | Frame plates; DXF in `cad/Fab/CF`. |
| Carbon Fiber | 4 mm, 500 x 500 carbon fibre plate | 1 | 209.27 | 209.27 | [carbonwebshop.com](https://www.carbonwebshop.com/carbon-fiber-sheets/standard/carbon-panel-500x500x4mm/) | 2026-11-07 | |
| CF cutting | Water-jet / CNC cutting of the three sheets from DXF | 1 | n/a | n/a | [carbon-vertrieb.com](https://www.carbon-vertrieb.com/carbon-technik/cfk-platten/) | 2026-11-07 | n/a: quote-only, no published rates. Not in the totals. |
| TPU filament | TPU 95A, 1.75 mm, 1 kg (e.g. eSUN TPU-95A) | 1 | ~31.49 | ~31.49 | [3djake.fi](https://www.3djake.fi/esun/tpu-95a-black-2) | 2026-11-07 | For the STL set in `cad/Fab/3D_prints`. AmazonBasics TPU: n/a (Amazon could not be checked). |
| Nut bolt set | Pulttisarja 330 kpl (philips-ruuvit, mutterit & aluslevyt), Velleman K/SC1 | 2 | 5.90 | 11.80 | [polkumyynti.com](https://polkumyynti.com/tyoekalut/284589-ruuvisarja-330-kpl-5410329304478.html) | 2026-11-07 | |
| Heat shrinks | VALUERC 280 PIECES COLORED HEAT SHRINK TUBE KIT (1/2/3/4/5/6/8/10MM) | 1 | ~7.47 | ~7.47 | [masterled.es](https://masterled.es/en/electric-material/2110-heat-shrink-tubing-kit-21-280-pieces.html) | 2026-11-07 | Equivalent 280-piece kit; the VALUERC kit is sold only on Amazon. |
| Cable tie | DroneBuildr Zip tie / Cable tie (Pack of 20) | 2 | ~0.90 | ~1.80 | [unmannedtechshop.co.uk](https://www.unmannedtechshop.co.uk/products/dronebuildr-zip-tie-cable-tie-pack-of-20) | 2026-11-07 | £0.75; stock unclear. |
| Printed landing gear | Carbon-fibre-filled filament, 1.75 mm, 1 kg (e.g. 3DJAKE easyPETG CF) | 1 | ~34.99 | ~34.99 | [3djake.fi](https://www.3djake.fi/3djake/easypetg-cf-black) | 2026-11-07 | Estimate: one spool, far more than the gear needs. Replaces the aluminium gear. Out of stock when checked. A TPU gear prints from the TPU spool above at no extra cost. |
| Mounting foam | 3M Double-Sided Mounting Foam (e.g. Scotch 19 mm x 1.5 m) | 2 | 7.99 | 15.98 | [motonet.fi](https://www.motonet.fi/fi/tuote/600709/Scotch-asennusteippi-kaksipuolinen-19-mm-x-15-m) | 2026-11-07 | Store pickup only. |

## Not on the current build

| Item | Listing | Status |
|---|---|---|
| GPS | — | Removed; not needed indoors. The ESP32 board provides the LiDAR time signal. |
| RS323-USB converter | EX-13101 - USB-RS232-sarjamuunninkortti, Exsys (x2) | Replaced by the MAX3232 RS-232 to TTL converter on the PX4 link. |
| Telemetry radio | SiK telemetry radio pair (optional), e.g. Holybro SiK V3 433 MHz, [~€71.40](https://www.hobbydrone.cz/holybro-sik-telemetry-radio-v3-100mw-433mhz/) | Not used. Telemetry goes over Wi-Fi from the Jetson (mavlink-router). |
| Separate power module / PDB | — | Not needed. The Cube Orange+ Mini Set includes a Power Brick Mini; the Jetson carrier and the LiDAR run directly from 6S. |
| F7 flight controller | F7 board of the T-Motor F7 + F55A Pro II stack | Not fitted; the Cube Orange+ is the flight controller. |
| Aluminium landing gear | Custom-cut aluminium part (`cad/Fab/Al_fab`) | Alternative only, quote-based. Replaced by a 3D-printed gear (CF-filled filament or TPU). |

## Excluded

The totals leave out:
- the CF cutting service (quote-only);
- tools, LiPo charger and ground station;
- spares (props, batteries, plates);
- shipping, customs and import VAT on non-EU purchases.

## To confirm

- Exact USB webcam model (Vitade).
- Capacitor value on the 6S inputs.
- Whether a second MAX3232 is needed for the PX4 MAVLink serial link to the Jetson.
- The printed landing-gear STL: it is not in `cad/Fab/3D_prints` yet; only the aluminium drawing is in `cad/Fab/Al_fab`.

---
