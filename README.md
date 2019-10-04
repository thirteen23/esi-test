# ESI Test Component
## Build test app
To demonstrate the test component, in a new terminal navigate to `./test-app`, install dependencies and start the application.

### Install dependencies
```
npm i
```
### Start test app
```
npm start
```

# Integration Notes

The app is configured as a demo. For integration purposes, the only required file to migrate to production code is `test-app/src/circlepack/circlepack.js`. However, there are files included in the demo that provide an example of how to integrate this component into production level code.

`test-app/src/App.js` demonstrates consumption of the React component created by `circlepack.js` with documentation in-line explaining each prop.

`circles.scss` is provided as a basic example of styling various parts of the circle pack elements (parent, child, zero, annotation, etc.).

`package.json` lists the dependency requirements for the circle pack component to work correctly.
