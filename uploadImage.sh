#!/bin/bash
# Tag latest to Digitalocean
docker tag rainbowmaker_rainbow-maker:latest registry.digitalocean.com/eisman/rainbowmaker:latest
# Push to Digitalocean
docker push registry.digitalocean.com/eisman/rainbowmaker:latest