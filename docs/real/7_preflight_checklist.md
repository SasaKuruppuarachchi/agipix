---
title: Preflight Checklist
layout: doc
nav_title: Preflight Checklist
---

# Preflight Checklist

```bash
# 1) Primary link test
sudo MicroXRCEAgent serial --dev /dev/ttyTHS2 -b 921600

# 2) Secondary link test
sudo systemctl status mavlink-router
sudo journalctl -u mavlink-router -f
```

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