# vue-feathers-productivity-app
A productivity app (ToDo, reminders, notes) created with Vue, Feathers-Vuex, NeDB.

Vue-CLI plugins used:
* [babel](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel)
* [pwa](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa)
* [eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint)
* [unit-mocha](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-mocha)
* [e2e-nightwatch](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-nightwatch)


## *--WORK IN PROGRESS--*
* [ ] Minimum Viable Product
  * [x] functional registration page
    * [x] on success: redirect to login
  * [x] functional login page
    * [x] on success: redirect to dashboard
  * [x] logout functionality
  * [x] basic dashboard page
    * [x] dashboard is not accessible when not logged in
      * [x] if not logged in: redirect to login
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

1. **In Git Bash window #1**:
```bash
# cd to vue-feathers-productivity repo directory
$ cd [path/to/vue-feathers-productivity]
$ cd server
$ npm run dev
```
You should see a generic Feathers page at http://localhost:3030/.

2. **In Git Bash window #2**:
```bash
# cd to vue-feathers-productivity repo directory
$ cd [path/to/vue-feathers-productivity]
$ cd client
$ npm run dev
```
You can view the client app at http://localhost:8080/ (local) or http://192.168.56.1:8080/ (network).
