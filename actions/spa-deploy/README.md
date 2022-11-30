# SPA Deploy Action

This action deploys a Single Page Application (SPA) to NAV CDN and NAIS.

## Prerequisites

* Registered team in NAV with NAIS Deploy Key
* Registered team in NAV CDN with repo access
* The SPA must be built and packaged as a directory containing a `index.html` file and all other static files.

## Limitations

* Versioning is not supported
* Cleanup of old versions is not supported
* Renaming of the SPA is not supported
* Only one ingress per application is supported