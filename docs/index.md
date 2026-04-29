---
title: Agipix Documentation
layout: doc
permalink: /docs/
description: Start here to assemble the hardware, flash the Jetson, set up software, or run the simulation.
wip: true
---

# Documentation Hub

Agipix documentation is organized around the four platform blocks from the paper: real hardware, simulation, autonomy, and operator UI.

![System overview](../assets/images/diag/sys_overview.png)

Pick a scope to dive into. Each scoped section includes a sidebar with step-by-step pages.

<div class="quick-start-grid">
	<div class="quick-start-card">
		<h3>Real Hardware</h3>
		<p>Build, wire, flash, and validate the physical platform.</p>
		<ul>
			<li>Assembly and wiring</li>
			<li>Flashing Jetson & carrier</li>
			<li>Container and software setup</li>
		</ul>
		<p><a class="btn" href="{{ '/docs/real/' | relative_url }}">Real Docs →</a></p>
	</div>
	<div class="quick-start-card">
		<h3>Simulation</h3>
		<p>Use the digital twin in Isaac Sim before hardware deployment.</p>
		<ul>
			<li>Isaac Sim environment</li>
			<li>Containerized workflow</li>
			<li>PX4 SITL + ROS 2 bridge</li>
		</ul>
		<p><a class="btn" href="{{ '/docs/sim/' | relative_url }}">Sim Docs →</a></p>
	</div>
	<div class="quick-start-card">
		<h3>Autonomy</h3>
		<p>Perception, planning/control, and learning-based navigation.</p>
		<ul>
			<li>Perception pipeline</li>
			<li>Planning and control</li>
			<li>Data-driven policy integration</li>
		</ul>
		<p><a class="btn" href="{{ '/docs/autonomy/' | relative_url }}">Autonomy Docs →</a></p>
	</div>
	<div class="quick-start-card">
		<h3>User Interface</h3>
		<p>Mission supervision, teleoperation, and human-in-the-loop workflows.</p>
		<ul>
			<li>Teleoperation</li>
			<li>Exploration mode control</li>
			<li>Human-in-the-loop control</li>
		</ul>
		<p><a class="btn" href="{{ '/docs/ui/' | relative_url }}">UI Docs →</a></p>
	</div>
</div>

