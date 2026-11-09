---
layout: post
title: "AGIptive-LIOM: failure-aware LiDAR-inertial odometry for quadrotors"
short_title: "AGIptive-LIOM"
date: 2026-11-06
permalink: /posts/agiptive-liom/
description: "Ongoing work on LiDAR-inertial odometry that guards against sensor faults and tells the flight controller when its estimate degrades, with a real forest flight on AgiPIX."
status: "Ongoing work · Title tentative"
image: /assets/images/posts/agiptive-liom/forest.jpg
---

A quadrotor that flies on LiDAR-inertial odometry closes its control loop on the estimate, so a divergence nobody notices can cost the vehicle. Many of the failures we met came from the sensors rather than the scene: clock steps, a blocked view, starting while moving, and an IMU that clips at impacts.

AGIptive-LIOM guards against these faults, knows when its estimate is degraded, and tells the flight controller. An onboard health monitor reports OK, DEGRADED or FAILED with every scan and needs no ground truth. It sets the quality of the vision message sent to PX4, so PX4's own filter stops fusing a failed estimate.

<figure>
  <img src="{{ '/assets/images/posts/agiptive-liom/forest.jpg' | relative_url }}" data-zoomable alt="Height-coloured point cloud of a forest and nearby building, with the drone's flight path drawn as a loop that starts and ends at the take-off point.">
  <figcaption>A real forest flight mapped by AGIptive-LIOM from onboard LiDAR and IMU data, from take-off through the forest and back. Offline replay; points coloured by height.</figcaption>
</figure>

## How AgiPIX was used

The real forest flight above was flown on an AgiPIX quadrotor.

## Current status

This is ongoing work. The method was compared with others on public recordings, fault injection and closed-loop simulated flights. It is not the most accurate method tested, and real flights in the loop are still to come. Code will be released once the paper is submitted.

[Read the full project page](https://sasakuruppuarachchi.github.io/projects:%20robotic/raicam/2026/11/06/agiptive-liom-failure-aware-lidar-inertial-odometry.html), which includes the forest flight video.
