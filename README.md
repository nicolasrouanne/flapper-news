# Flapper News
Thinkster MEAN Stack Tutorial

A reddit clone (aka forum) built using the MEAN Stack Tutorial from thinkster. Find the complete tutorial at [Thinkster.io](https://thinkster.io/)
mean-stack-tutorial

## Prerequisites
Make sure you have the following installed before clone and get going with this app:
* Node.js (using npm)
* mongodb

Check the tutorials to install [MongoDB](https://docs.mongodb.com/manual/installation/) and [Node.js](https://nodejs.org/en/download/)

## Installing Mac OS X environment
If you want to run this app on your local machine (aka Mac OS), follow this instructions to install Node and MongoDB

### Installing Node.js
Check if node.js is installed:
```shell
node -v
```
The version should be higher than v0.10.32

If not, use the installer on [node.js](https://nodejs.org/). It should install both npm and node.js

### Updating npm
npm gets installed with node, so normally no need to run this. However npm gets updated frequently, so you might want to check if it is up to date.
Check npm version
```shell
npm -v
```
The version should be higher than 2.1.8.

If not run
`npm install npm -g`

### Install MongoDB
Install Mongo using brew
```shell
brew update
brew install mongodb
```


## App installing and launch
Clone the repository where you want on your machine.

Get into the working directory and install the application and all its dependencies
```shell
npm install
```

To get the application up and running
1. Launch mongodb: `mongod &`
2. Run `npm start`
3. You're good to go!

Fire up a browser on [http://localhost:3000](http://localhost:3000) to see your application.
