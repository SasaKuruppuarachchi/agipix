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
- PPS Sync
- Netbird
- smart netmanager
- DDS tuning
- 