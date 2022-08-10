# Content-Type Converter

This simple web app proxies as incoming request to another host. While in transit, the app converts the `Content-Type: multipart/form-data` to `Content-Type: application/json`.

## Configuration

You can adjust the target host via the environment variable `FORWARD_TO`.

## Getting Stated

The simplest way to use this app, is to clone and run it locally:
```Bash
git clone https://github.com/IObert/content-type-converter
cd content-type-converter
npm install
npm build 
FORWARD_TO=https://<target-host.com> node dist/server.js
```

If you are looking for a more advanced way, feel free to use this [Docker image](https://github.com/IObert/content-type-converter/pkgs/container/content-type-converter) and include it in your own cloud infrastructure.