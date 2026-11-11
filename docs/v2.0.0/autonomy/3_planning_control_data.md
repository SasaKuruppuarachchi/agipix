---
title: "Planning & control: data-driven autonomy"
layout: doc
nav_title: Data-driven autonomy
wip: true
---
# Data-driven planning and control

Learned navigation policies can fly AgiPIX in place of the planner. They run outside agipix_auto, as separate experiments.

## [FAINT](https://lasuomela.github.io/faint/)

FAINT is a visual navigation policy trained in simulation. It steers the robot to given subgoals from camera images alone. By building on pretrained visual representations, the policy reaches up to 50% higher navigation success than prior methods, and it transfers between ground and aerial robots. On AgiPIX it was deployed without modification, running on board the Jetson Orin NX; see the [FAINT post]({{ '/posts/faint/' | relative_url }}).

<div class="video-container text-width">
  <iframe src="https://www.youtube.com/embed/izExoAxZoeo" title="AgiPIX running FAINT" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
<p class="small">AgiPIX running FAINT.</p>
