#!/bin/bash

pushd ./circlepack
npm i
npm run build
npm link
popd

cd ./test-app
npm i
npm link circlepack
npm run build
