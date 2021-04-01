import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from "@feathersjs/authentication-client";
import io from "socket.io-client";

const loc = window.location

const feathersServer = loc.protocol + "//" + loc.hostname + ":3030"
console.log("connecting to feathersServer: " + feathersServer)

const socket = io(feathersServer, { transports: ["websocket"] });

const feathersClient = feathers()
  .configure(socketio(socket, {
    timeout: 10000
  }))
  .configure(auth({ storage: window.localStorage }));

export default feathersClient;
