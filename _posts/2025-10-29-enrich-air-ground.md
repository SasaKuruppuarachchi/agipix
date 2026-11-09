---
layout: post
title: "Air-ground robots for nuclear power plant inspection"
short_title: "Air-ground inspection"
date: 2025-10-29
permalink: /posts/enrich-air-ground/
description: "A low-cost drone and ground robot, built in three weeks for EnRicH 2025 and tested at AKW Zwentendorf, using the two AgiPIX hardware variants. IEEE SSRR 2025."
status: "IEEE SSRR 2025 · pp. 84–89"
authors: "Changda Tian, Sasanka Kuruppu Arachchige, Haichuan Li, et al. (17 authors)"
---

Inside a nuclear power plant there is no GPS, communication is unreliable, and radiation can be hazardous for people. This paper describes a low-cost drone and ground vehicle built for inspection and situational awareness in that setting. The system was developed for the EnRicH 2025 competition at the decommissioned AKW Zwentendorf plant in Austria, and went from design to deployment in three weeks using ROS 2, off-the-shelf parts and open-source frameworks.

<figure>
  <img src="{{ '/assets/images/agipix_adaptations.png' | relative_url }}" data-zoomable alt="The AgiPIX quadrotor with circular propeller guards next to the AgiPIX four-wheeled ground robot carrying a LiDAR on top.">
  <figcaption>The AgiPIX drone and ground robot variants deployed at EnRicH 2025.</figcaption>
</figure>

## How AgiPIX was used

The drone and ground robot are the two AgiPIX hardware variants. Both ran the same autonomy stack, differing only at the vehicle dynamics and actuation interface, and both were validated in real-world experiments at EnRicH 2025.

## Read more

- [Paper on IEEE Xplore (DOI: 10.1109/SSRR68451.2025.11391258)](https://doi.org/10.1109/SSRR68451.2025.11391258)
- [Project write-up of EnRicH 2025](https://sasakuruppuarachchi.github.io/projects:%20robotic/raicam/2025/07/04/the-european-robotics-hackathon-enrich-2025.html)
