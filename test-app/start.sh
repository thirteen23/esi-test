#!/bin/bash

export NODE_ENV="production"

pushd ../circlepack
echo "Installing CirclePack Component"
npm i
echo "Building CirclePack Component"
npm run build
echo "Linking CirclePack Component"
npm link
popd

echo "Installing Test App"
npm i
echo "Linking CirclePack Component to Test App"
npm link circlepack
echo "Building Test App"
npm run build
