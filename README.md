# vue-feathers-productivity-app
A productivity app (ToDo, reminders, notes) created with Vue, Feathers-Vuex, NeDB.

## Versions


* ***v0.1***: *Functional basic registration and login flow*
  * can be used as starting point for any vue.js application requiring authentication.
  * uses feathers-vuex for authentication.
  * uses NeDB as database. Sufficient for small scale applications - if need be can be swapped easily for MongoDB or similar more robust DB solution.

## *--WORK IN PROGRESS--*
* [x] Minimum Viable Product - authentication (v0.1)
  * [x] functional registration page
    * [x] on success: redirect to login
      * [x] user is created in db
      * [x] display username
  * [x] functional login page
    * [x] on success: redirect to dashboard
  * [x] logout functionality
  * [x] basic dashboard page
    * [x] dashboard is not accessible when not logged in
      * [x] if not logged in: redirect to login
* [ ] Minimum Viable Product - service (v0.2)
  * [ ] add notes service
    * [ ] CRUD operations
      * [x] Create
      * [x] Read
      * [x] Update
      * [ ] Delete
    * [x] the logged-in user can access only their own notes
    * [x] when user logs out, their notes data are cleared from store
    * [x] changes in one browser are immediately reflected in another
  * [ ] add "remain logged in" option to extend 1-day jwt expiration
* [ ] Dashboard components
  * [ ] ToDo service
  * [ ] Reminders service
  * [ ] Notes service
  * [ ] Bookmarks service
  * [ ] Calendar service
* [x] Page flow:

```
/
if logged in -> dashboard
else -> login

/dashboard
if logged in -> ok, stay
else -> login

/login
if authenticated -> dashboard

/register
if valid entry -> login
```
* [ ] Encrypt NeDB data items - each with user's key
* [ ] Mobile optimized
* [ ] Progressive Web App
* [ ] Test suite
* [ ] CI
* [ ] Deploy to cloud
  * [ ] Static (pre-rendered) + Lambda functions?
  * [ ] AWS? Netlify?
* [ ] Replace NeDB with Solid POD implementation


## Setup

First clone this repo.
```bash
# cd to vue-feathers-productivity repo directory
$ cd [path/to/vue-feathers-productivity]
# install node_modules in server directory
$ cd server
$ npm install
# install node_modules in client directory
$ cd ../client
$ npm install
```

***Note***: *You may receive vulnerability warnings. They are in 'cli-plugin-e2e-nightwatch', an e2e test utility. Thus they do no impact the normal usage of either server or client. Run `npm audit fix` to fix them, or `npm audit` for details. (As of 11/08/2018 no fix is yet available)*


## Development Usage

1. **In Git Bash window #1 - run server**:
```bash
# cd to vue-feathers-productivity repo directory
$ cd [path/to/vue-feathers-productivity]
$ cd server
# copy dummy data as a starting point
# 4 users: test1, test2, test3 and test4. Password equals username
$ npm run setup:dev
# start the server
$ npm run dev
```
You should see a generic Feathers page at http://localhost:3030/.

2. **In Git Bash window #2 - run client**:
```bash
# cd to vue-feathers-productivity repo directory
$ cd [path/to/vue-feathers-productivity]
$ cd client
# start the server (hot-reload enabled)
$ npm run dev
```
You can view the client app at http://localhost:8289/ (local) or http://192.168.56.1:8289/ (network).


## Dependencies


***Client Dependencies:***
* @feathersjs/authentication-client
* @feathersjs/feathers
* @feathersjs/socketio-client
* feathers-vuex
* register-service-worker
* socket.io-client
* vue
* vue-router
* vuex

***Server Dependencies:***
* @feathersjs/authentication
* @feathersjs/authentication-jwt
* @feathersjs/authentication-local
* @feathersjs/configuration
* @feathersjs/errors
* @feathersjs/express
* @feathersjs/feathers
* @feathersjs/socketio
* compression
* cors
* feathers-authentication-hooks
* feathers-nedb
* helmet
* nedb
* serve-favicon
* winston

***Vue-CLI plugins:***
* [babel](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel)
* [pwa](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa)
* [eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint)
* [unit-mocha](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-mocha)
* [e2e-nightwatch](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-nightwatch)
