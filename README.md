# ESI Test Component

## Build test component
In `./test-component` directory, install dependencies, build the component and link to local npm for test app consumption.

### Install Dependencies
```
npm i
```
### Build component
```
npm run build
```
### Link component
```
npm link
```

### Component Development
To continue development of the test component, once the linking step is performed, start the application.
```
npm start
```
Any changes made will automatically propagate to the test app, if it is running.

## Build test app
To demonstrate the test component, in a new terminal navigate to `./test-app`, install dependencies, link the component, and start the application.

### Install dependencies
```
npm i
```
### Link component
```
npm link circlepack
```
### Start test app
```
npm start
```
