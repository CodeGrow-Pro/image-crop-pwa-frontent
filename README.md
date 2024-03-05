# Commodity PWA frontend

## Setting up project

1. Clone the repository in your workspace by `git clone`
2. go inside the folder `commodity_pwa`
3. run `npm install`. This will install all requited packages
4. Clone the `commodity_backend` repository and follow its `README.md` for setting up the server.
5. After running the backend server. Get the server host IP by running `ifconfig` command in terminal
6. Paste the host ip in commodity_pwa/src/config.js, you can also change the `PORT` according to your server port.
8. run `npm start` to launch the PWA


## Offline support

1. This app supports offline mode and will show proper error messages and popup when in offline mode.
2. App can be installed in Mobile devices by opening the frontend in mobile browsers.
3. Open the home url and select `Add to Home Page`, option available in almost all new browsers
