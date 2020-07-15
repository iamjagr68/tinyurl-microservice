# TinyURL Microservice
A microservice used to shorten urls utilizing the following technologies
* [Docker][1]
* [Node][2]
* [Express][3]
* [MongoDB][4]

# Table of Contents
* [Pre-requisites](#pre-requisites)
* [Getting Started](#getting-started)
* [Docker](#docker)
* [Postman](#postman)
    
# Pre-requisites
To build and run this app locally you will need a few things
* Install [Git][5]
* Install [Node.js][2]
* Install [MongoDB][6]

# Getting started
* Clone the repository
```
git clone https://github.com/iamjagr68/tinyurl-microservice.git <project_dir>
```

* Install dependencies
```
cd <project_dir>
npm install
```

* Ensure your MongoDB server is up and running

* Create a copy of the .env.sample file named .env
```
cd <project_dir>
cp .env.sample .env
``` 

* Update the contents of the .env file to reflect your setup

* Build and run the project
```
npm run build
npm start
```

### Testing Locally
To run the suite of unit tests locally execute the following
commands, which will also output coverage information.
```
cd <project_dir>
npm run test
``` 

# Docker
To build and run the application from Docker you will need
* Install [Docker Desktop][7]

Once you have Docker installed you can use [docker-compose][8]
to launch the microservice.

```
cd <project_dir>
docker-compose up --build
```

### Testing within Docker
To run the suite of unit tests from Docker execute the following
commands, which will also output coverage information.
```
docker-compose run --rm node npm run test
```
 
# Postman
Since this microservice has no UI (*yet*) I would highly recommend using
[Postman][9] to interact with this service.

You can download Postman [here][10].

I've included a postman collection in the root of the repository
named `TinyUrls.postman_collection.json`.

For instructions on how to import a collection into Postman look [here][11].

[1]:https://www.docker.com/
[2]:https://nodejs.org/en/
[3]:https://expressjs.com/
[4]:https://www.mongodb.com/
[5]:https://git-scm.com/downloads
[6]:https://www.mongodb.com/try/download/community
[7]:https://www.docker.com/get-started
[8]:https://docs.docker.com/compose/
[9]:https://www.postman.com/
[10]:https://www.postman.com/downloads/
[11]:https://learning.postman.com/docs/getting-started/importing-and-exporting-data/