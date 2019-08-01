# Liquid Galaxy KML API

> This project it will be developed for the **GSOC 2019** program

> All the **API documentation** and Endpoints you can fint it here:  (in process) **[API documentation](in process)**

## introduction

The system will interact over the liquid galaxy using a KML with a network link.

This KML will do requests to our API. And this one will control which data will be send it to the system.

Here we can see a project scheme:

![Project Definition](./docs/Definition.jpg)

The system can create and edit a KML, but if it's the system who starts the kml, ig the user uploads a KML you just be able to display it, not edit.

## Configuration

The project consist an "express Router" object, with all the end points and answerds, with the root path '/kml'. To use the API you will need to say to your express server use the router:

```javascript
const express = require('express')
const app = express()
var kmlAPI = require('kmlAPI')

app.use(kmlAPI)
```

The Api will consume and know which's kml have our system consulting a directory. This directory will be situated in our home, to create this directory just copy the following command in our cli:

```sh
$ mkdir ~/kmlApi
```

Finally you just need to set the IP of your machine into the KML with the network link that you create in the liquid galaxy:

```xml
http://IP/kml/viewsync
```

## Manage KML's

This endpoint is the one that will be called from the liquid galaxy, to get the kml throw the Network Link.
```js
lgKML.get('/kml/viewsync')
```

The update endpoint return the list of KML's available in the sistem  
```jsFormatting your README

READMEs generally follow one format in order to immediately orient developers to the most important aspects of your project.

    Project name: Your project’s name is the first thing people will see upon scrolling down to your README, and is included upon creation of your README file.

    Description: A description of your project follows. A good description is clear, short, and to the point. Describe the importance of your project, and what it does.

    Table of Contents: Optionally, include a table of contents in order to allow other people to quickly navigate especially long or detailed READMEs.

    Installation: Installation is the next section in an effective README. Tell other users how to install your project locally. Optionally, include a gif to make the process even more clear for other people.

    Usage: The next section is usage, in which you instruct other people on how to use your project after they’ve installed it. This would also be a good place to include screenshots of your project in action.

    Contributing: Larger projects often have sections on contributing to their project, in which contribution instructions are outlined. Sometimes, this is a separate file. If you have specific contribution preferences, explain them so that other developers know how to best contribute to your work. To learn more about how to help others contribute, check out the guide for setting guidelines for repository contributors.

    Credits: Include a section for credits in order to highlight and link to the authors of your project.

    License: Finally, include a section for the license of your project. For more information on choosing a license, check out GitHub’s licensing guide!

lgKML.get('kml/manage/update')
```

Delete a kml by id
```js
lgKML.get('/kml/manage/delete/:id')
```

Return the current kml
```js
lgKML.get('/kml/manage/current')
```

## Create KML's

Create a tour
```js
lgKML.post('/kml/Builder/Createtour')
```

Add a placemark into a tour
```js
lgKML.get('/kml/Builder/addpoint/:tourName')
```





guide from github, dosn't forgot!

Formatting your README

READMEs generally follow one format in order to immediately orient developers to the most important aspects of your project.

    Project name: Your project’s name is the first thing people will see upon scrolling down to your README, and is included upon creation of your README file.

    Description: A description of your project follows. A good description is clear, short, and to the point. Describe the importance of your project, and what it does.

    Table of Contents: Optionally, include a table of contents in order to allow other people to quickly navigate especially long or detailed READMEs.

    Installation: Installation is the next section in an effective README. Tell other users how to install your project locally. Optionally, include a gif to make the process even more clear for other people.

    Usage: The next section is usage, in which you instruct other people on how to use your project after they’ve installed it. This would also be a good place to include screenshots of your project in action.

    Contributing: Larger projects often have sections on contributing to their project, in which contribution instructions are outlined. Sometimes, this is a separate file. If you have specific contribution preferences, explain them so that other developers know how to best contribute to your work. To learn more about how to help others contribute, check out the guide for setting guidelines for repository contributors.

    Credits: Include a section for credits in order to highlight and link to the authors of your project.

    License: Finally, include a section for the license of your project. For more information on choosing a license, check out GitHub’s licensing guide!
