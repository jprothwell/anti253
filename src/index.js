const debug = require('debug')
const request = require('request')
const {
  promisify
} = require('util')
const DLog = debug('anti:log:')

const req = promisify(request)

const makeRequest = (host, params = {}, timeout = 5000) => {
  DLog(host)
  DLog(params)
  return req({
    method: 'POST',
    url: host,
    headers: [{
      name: 'content-type',
      value: 'application/x-www-from-urlencoded'
    }],
    timeout: parseInt(timeout, 10),
    form: params
  }).then(res => {
    const body = JSON.parse(res.body)
    DLog(body)
    return body
  })
}

const lazyload = (service, action) => options => {
  const url = `https://api.253.com/open/${service}/${action}`
  return makeRequest(url, options)
}

module.exports = new Proxy({}, {
  get: (target, property) => new Proxy({}, {
    get: (_, prop) => lazyload(property, prop)
  })
})
