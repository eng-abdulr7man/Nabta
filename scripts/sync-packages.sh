#!/bin/bash

# Remove the out-of-sync lock file
rm -f package-lock.json

# Regenerate the lock file by installing dependencies
npm install
