# Content-Type Converter

This simple web app proxies as incoming request to another host. While in transit, the app converts the `Content-Type: multipart/form-data` to `Content-Type: application/json`.


## Configuration

You can adjust the target host via the environment variable `FORWARD_TO`.