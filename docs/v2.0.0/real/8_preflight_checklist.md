---
title: Preflight Checklist
layout: doc
nav_title: Preflight Checklist
wip: true
---

# Preflight Checklist

```bash
# 1) Primary link test
sudo MicroXRCEAgent serial --dev /dev/ttyTHS2 -b 921600

# 2) Secondary link test
sudo systemctl status mavlink-router
sudo journalctl -u mavlink-router -f
```

### Time sync
- [ ] PTP service active: `systemctl is-active ptp4l-livox` returns `active` (port state `MASTER` in `journalctl -u ptp4l-livox`).
- [ ] In the terminal viewer (`agipix_viewer`) or the Foxglove diagnostics panel: `<ns>/time_sync` is OK and `<ns>/time_sync/lidar` shows source PTP, `synced=true`.
- [ ] The LIO (LiDAR-inertial odometry) has started, not held at `wait_time_sync`. If the LiDAR synced after the LIO started, restart the LIO.

See [Hardware Synchronisation](./5_hardware_synchronisation.md).

### Todos:
HW
- PPS Sync
- DDS tuning
- Realsense test 

SW
- GLIM calib
- DLIO update verification
- DQ controller test on sim
- Onboard detector test with realsense

- Test Global planner, local planner
- Test nav