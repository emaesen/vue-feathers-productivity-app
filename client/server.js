// generate self-signed certificate (bash)
// openssl req -nodes -new -x509 -keyout server.key -out server.crt


const express = require('express')
const fs = require('fs')
const https = require('https')
const app = express()

const os = require( 'os' )
const networkInterfaces = os.networkInterfaces();
const arr = networkInterfaces['VirtualBox Host-Only Network #3']
const host = arr[1].address
console.log(host)

const port = 8398
const creds = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}

app.use('/', express.static('dist', { 'index': ['index.html'] }))

console.log("Secure app running at:")
https.createServer(creds, app)
.listen(port, function () {
  console.log(`- Local:   https://localhost:${port}/`)
})
https.createServer(creds, app)
.listen(port, host, function () {
  console.log(`- Local:   https://${host}:${port}/`)
})
