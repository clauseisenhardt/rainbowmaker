#!/bin/bash
# Build angular app
rm -r backend/angular/*
ng build --prod
# Build docker image
docker build -t rainbowmaker_rainbow-maker:latest .
