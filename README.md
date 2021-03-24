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
- **_WORK IN PROGRESS_**: _Multiple Services_
  - extends v0.2.
  - adds Todos service.
  - adds Reminders service.
  - adds Events service.

## _--WORK IN PROGRESS--_

- [x] **Authentication (v0.1)**
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
- [x] **Notes service (v0.2)**
  - [x] add Notes service
    - [x] enable server side
      - [x] generate feathers service
      - [x] add authentication hooks
    - [x] CRUD operations
      - [x] Create
      - [x] Read
      - [x] Update
      - [x] Delete
    - [x] redirects to login when session has expired
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
    - [x] implement pure css animations as well as vue-based transitions
- [ ] **Reminders service**
  - [ ] add Reminders service
    - [x] prepare server side
      - [x] generate feathers service
      - [x] add authentication hooks
    - [x] prepare client side
      - [x] add reminders service to the store
      - [x] add reminders service scaffold to the app
    - [x] CRUD operations
      - [x] Create
      - [x] Read
      - [x] Update
      - [x] Delete
    - [x] redirects to login when session has expired
    - [x] the logged-in user can access only their own reminders
    - [x] real-time update events are send only to the authenticated user
    - [x] when user logs out, their reminders data are cleared from store
    - [x] changes in one browser are immediately reflected in another
    - [x] reminder has text and due date & time properties
    - [x] reminder has window properties
      - [x] preview window (days)
      - [x] count-down window (hours & minutes)
      - [x] grace/snooze window (days, hours & minutes)
    - [ ] reminder has recurring scheduling properties
      - [x] start date of recurring schedule
      - [x] day of the week recurring
      - [ ] day of the month recurring
    - [x] reminder has countdown when end time is close
    - [x] a past-due notification for a recurring reminder can be dismissed
- [ ] **Events service**
  - [ ] add Events service
    - [x] prepare server side
      - [x] generate feathers service
      - [x] add authentication hooks
    - [x] prepare client side
      - [x] add events service to the store
      - [x] add events service scaffold to the app
    - [x] CRUD operations
      - [x] Create
      - [x] Read
      - [x] Update
      - [x] Delete
    - [x] redirects to login when session has expired
    - [x] events are integrated with the calendar
    - [ ] event can be associated with a reminder
    - [x] the logged-in user can access only their own events
    - [x] real-time update events are send only to the authenticated user
    - [x] when user logs out, their events data are cleared from store
    - [x] changes in one browser are immediately reflected in another
    - [x] event has title, description and start/end date & time properties
    - [x] event has color and category properties
    - [x] event has recurring scheduling properties
      - [x] start and end date of recurring schedule
      - [x] start and end time of recurring event
      - [x] day of the week recurring
- [ ] **Todos service**
  - [ ] add Todos service
    - [x] prepare server side
      - [x] generate feathers service
      - [x] add authentication hooks
    - [x] prepare client side
      - [x] add todos service to the store
      - [x] add todos service scaffold to the app
    - [x] CRUD operations
      - [x] Create
      - [x] Read
      - [x] Update
      - [x] Delete
    - [x] redirects to login when session has expired
    - [x] todos board has "open tasks", "tasks in progress" and "completed tasks" lanes
    - [ ] todos with due date are shown on the calendar
    - [ ] todo can be associated with a reminder
    - [ ] the logged-in user can access only their own todos
    - [ ] real-time update events are send only to the authenticated user
    - [x] when user logs out, their todos data are cleared from store
    - [ ] changes in one browser are immediately reflected in another
    - [x] todo has title, description, note, and due date properties
    - [x] todo has status property
    - [x] todo has color, category and pinned properties
    - [x] todo has elapsed-time property
- [ ] **services**
  - [x] > Reminders service
  - [ ] > ToDos service
  - [x] > Notes service
  - [ ] > Bookmarks service
  - [x] > Events service
  - [ ] > Diary service
  - [ ] > Archive service
  - [x] import vue-fontawesome icons
  - [ ] Each service has a dedicated view page.
  - [ ] Each service has a summary view on the Dashboard page
    - [ ] Dashboard page from top to bottom: Reminders, ToDos, Calendar, Notes, Bookmarks, Archive
    - [x] Reminders has small strip on top of Dashboard page with upcoming reminder
    - [x] Reminders has countdown when next reminder is close
    - [x] Notes applies filter to hide non-pinned items
  - [ ] Services can be archived
- [x] **calendar**
  - [x] shows all days in selected month
    - [x] can cycle through months
    - [x] can jump back to current month
  - [x] displays non-recurring reminders
  - [x] displays recurring reminders
  - [x] displays events
  - [x] displays recurring events
  - [x] can switch between month-view and day-view
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

You can view the client app at <http://localhost:8289/> (local) or at a LAN address (LAN network) - the build output will show the LAN IP address to use.

## Dependencies

**_Client Dependencies:_**

- @feathersjs/authentication-client
- @feathersjs/feathers
- @feathersjs/socketio-client
- @fortawesome/vue-fontawesome
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-regular-svg-icons
- @fortawesome/free-solid-svg-icons
- feathers-vuex
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
