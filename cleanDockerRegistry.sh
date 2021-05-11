#!/bin/bash
### Need to install doctl and login first:
# sudo snap install doctl
# doctl auth init
# doctl registry login
###

### Delete latest on Digitalocean/eisman/rainbowmaker
doctl registry repo delete-manifest rainbowmaker latest

### Start image garbage collection on Digitalocean/eisman
doctl registry garbage-collection start --include-untagged-manifests eisman
