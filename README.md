# vue-feathers-productivity-app
A productivity app (ToDo, reminders, notes) created with Vue, Feathers-Vuex, NeDB.


## *--WORK IN PROGRESS--*
* [ ] Create MVP
  * [x] registration
  * [ ] login
  * [ ] one basic service (notes?)
* [ ] Add ToDo service
* [ ] Add Reminders service
* [ ] Add Notes service
* [ ] Add Bookmarks service
* [ ] Add Calendar service

## Setup

First clone this repo.
```bash
# cd to repo directory
$ cd vue-feathers-productivity
# install node_modules in server directory
$ cd server
$ npm install
# install node_modules in client directory
$ cd ../client
$ npm install
```

***Note***: *You may receive vulnerability warnings. They are in 'cli-plugin-e2e-nightwatch', an e2e test utility. Thus they do no impact the normal usage of either server or client. Run `npm audit fix` to fix them, or `npm audit` for details. (As of 11/08/2018 no fix is yet available)*


## Development Usage

In Git Bash window #1:
```bash
$ cd server
$ npm run dev
```

In Git Bash window #2:
```bash
$ cd client
$ npm run dev
```
