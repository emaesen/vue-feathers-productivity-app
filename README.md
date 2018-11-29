# vue-feathers-productivity-app

A productivity app (ToDo, reminders, notes) created with Vue, Feathers-Vuex, NeDB.

## Versions

- **_v0.1_**: _Authentication foundation_
  - can be used as starting point for any vue.js application requiring authentication.
  - uses feathers-vuex for authentication.
  - uses NeDB as database.
    - Sufficient for small scale applications - if need be can be swapped easily for MongoDB or other more robust DB solution.
- **_v0.2_**: _One Service: Notes_
  - extends v0.1.
  - uses feathers-vuex service to store notes.
  - logged in user can access own notes only.
  - implements create, read, edit, delete from server.
  - implements client-side sorting and filtering.
  - has several types of animation: vue-based as well as plain css.
  - changes in one browser are immediately reflected in another.

## _--WORK IN PROGRESS--_

- [x] **authentication (v0.1)**
  - [x] functional registration page
    - [x] on success: redirect to login
      - [x] user is created in db
      - [x] display username
  - [x] functional login page
    - [x] on success: redirect to dashboard
  - [x] logout functionality
  - [x] basic dashboard page
    - [x] dashboard is not accessible when not logged in
      - [x] if not logged in: redirect to login
- [x] **notes service (v0.2)**
  - [x] add notes service
    - [x] CRUD operations
      - [x] Create
      - [x] Read
      - [x] Update
      - [x] Delete
    - [x] display Create/Update error messages
    - [x] ask confirmation before Delete
    - [x] the logged-in user can access only their own notes
    - [x] when user logs out, their notes data are cleared from store
    - [x] changes in one browser are immediately reflected in another
    - [x] a note has text, category and color properties
      - [x] support basic markdown-style formatting of note text
      - [x] support color-coding
      - [x] support ordering by
        - [x] created time
        - [x] modified time
        - [x] category
        - [x] color
      - [x] support filtering by
        - [x] color
        - [x] category
    - [x] has list and grid mode
    - [x] implement vue-fontawesome icons
    - [x] implement basic css and vue-based transitions
- [ ] **services**
  - [ ] > Reminders service
  - [ ] > ToDos service
  - [ ] > Notes service
  - [ ] > Bookmarks service
  - [ ] > Calendar service
    - [ ] > Events service
  - [ ] > Archive service
  - [ ] Each service has a dedicated view page.
  - [ ] Each service has a summary view on the Dashboard page.
    - [ ] Dashboard page from top to bottom: Reminders, ToDos, Notes, Bookmarks, Calendar, Archive.
    - [ ] Reminders has small strip on top of Dashboard page with upcoming reminder.
    - [ ] Reminders has countdown when next reminder is close.
  - [ ] Services can be associated with each other.
  - [ ] Services can be archived
- [ ] **progressive web app**
  - [ ] app is operational when offline
  - [ ] app syncs when back online
- [ ] **deployment**
  - [ ] app is deployed on "cloud" service
  - [ ] app is accessible on desktop and mobile device
- [ ] add "remain logged in" option to extend 1-day jwt expiration
- [x] Page flow:

```pseudo
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

- [ ] Encrypt NeDB data items - each with user's key
- [ ] Mobile optimized
- [ ] Progressive Web App
- [ ] Test suite
- [ ] CI
- [ ] Deploy to cloud
  - [ ] Static (pre-rendered) + Lambda functions?
  - [ ] AWS? Netlify?
  - [ ] For personal use: on mobile device using termux app?
- [ ] Replace NeDB with Solid POD implementation

## Setup

Clone or download this repo.

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

**_Note_**: _You may receive vulnerability warnings. They are in 'cli-plugin-e2e-nightwatch', an e2e test utility. Thus they do no impact the normal usage of either server or client. Run `npm audit fix` to fix them, or `npm audit` for details. (As of 11/08/2018 no fix is yet available)_

## Development Usage

**In Git Bash window #1 - run server**:

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

You should see a generic Feathers page at <http://localhost:3030/>.

**In Git Bash window #2 - run client**:

```bash
# cd to vue-feathers-productivity repo directory
$ cd [path/to/vue-feathers-productivity]
$ cd client
# start the server (hot-reload enabled)
$ npm run dev
```

You can view the client app at <http://localhost:8289/> (local) or <http://192.168.56.1:8289/> (network).

## Dependencies

**_Client Dependencies:_**

- @feathersjs/authentication-client
- @feathersjs/feathers
- @feathersjs/socketio-client
- feathers-vuex
- @fortawesome/vue-fontawesome
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-solid-svg-icons
- register-service-worker
- socket.io-client
- vue
- vue-router
- vuex

**_Server Dependencies:_**

- @feathersjs/authentication
- @feathersjs/authentication-jwt
- @feathersjs/authentication-local
- @feathersjs/configuration
- @feathersjs/errors
- @feathersjs/express
- @feathersjs/feathers
- @feathersjs/socketio
- compression
- cors
- feathers-authentication-hooks
- feathers-nedb
- helmet
- nedb
- serve-favicon
- winston

**_Vue-CLI plugins:_**

- [babel](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel)
- [pwa](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa)
- [eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint)
- [unit-mocha](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-mocha)
- [e2e-nightwatch](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-nightwatch)
