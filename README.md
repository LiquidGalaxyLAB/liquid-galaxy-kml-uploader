# Liquid Galaxy KML API

> This project it will be developed for the **GSOC 2019** program

> All the **API documentation** and Endpoints you can fint it here:  **[KML API WIKI](https://github.com/xemyst/liquid-galaxy-kml-uploader/wiki)**

## introduction

The system will interact over the liquid galaxy using a KML with a network link.

This KML will do requests to our API. And this one will control which data will be send it to the system.

Here we can see a project scheme:

![Project Definition](./docs/Definition.jpg)

The system can create and edit a KML, but if it's the system who starts the kml, ig the user uploads a KML you just be able to display it, not edit.

## Installation (install.sh)

I prepared a simple command to install the api:

```sh
./install.sh
KMLSERVERIP=' the ip were the API will be located'
KMLSERVERPORT="the port of the API"
```


This script need's to be executed in the master, because it will elaborate the NetworkLink and shared with the slaves, to automatize the configuration process.


## Server Configuration

After run the install.sh:

```bash
npm install
```
to install all the depencies, then reboot the server system.

Finally run the server:

```js
node server.js
```

you can check what's reciving your system accessing into the next URL:

```url
http://IP/kml/viewsync/master
```
