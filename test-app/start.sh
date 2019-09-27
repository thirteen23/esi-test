#!/bin/bash

pushd ../circlepack
npm i
npm run build
npm link
popd

npm i
npm link circlepack
npm run build
