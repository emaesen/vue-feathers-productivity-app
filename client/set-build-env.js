//const path = require('path')
const fse = require('fs-extra')

const ENV_FILE = ".env"
const BUILD_PROP = "VUE_APP_BUILD_AT"

async function setBuildInfo() {
  await fse.ensureFile(ENV_FILE)
  const options = { dateStyle: "medium", timeStyle: "short" }
  const now =(new Date()).toLocaleString('en-US', options)
  //let data = await fse.readFile(ENV_FILE, 'utf-8')
  // we're simply replacing what's in the file
  let data = BUILD_PROP + "=" + now
  await fse.outputFile(ENV_FILE, data, 'utf-8')
  console.log('INFO: updating file ' + ENV_FILE + ':\n' + data)
}

setBuildInfo()
