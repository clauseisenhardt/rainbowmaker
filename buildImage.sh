#!/bin/bash
# Build angular app
rm -rf backend/angular
ng build --prod
# Build docker image
docker build -t rainbowmaker_rainbow-maker:latest .
