# Lucos Mock Authentication Server

A simple server which implements the lucos authentication interface with no external dependencies.  Designed for use when developing offline.

**Warning:** This server provides no meaningful authentication whatsoever.  It should only be used for development purposes.

## Running
The web server is designed to be run within [lucos_services](https://github.com/lucas42/lucos_services), but can be run standalone by running server.js with nodejs, passing in the port to run on as the first parameter.
