const axios = require('axios')

const github_base_url = 'https://api.github.com'

// 如果是在服务端, 直接请求api地址即可
async function requestGithub(method, url, data, headers) {
  return await axios({
    method,
    url: `${github_base_url}${url}`,
    data,
    headers
  })
}

const isServer = typeof window === 'undefined'

async function request({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('url must provide')
  }
  if (isServer) {
    const session = req.session
    const githubAuth = session.githubAuth || {}
    const headers = {}
    if (githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${
        githubAuth.access_token
      }`
    }
    return await requestGithub(method, url, data, headers)
  } else {
    // 如果在客户端发起的请求, 需要在服务端做一层代理
    return await axios({
      method,
      url: `/github${url}`,
      data,
    })
  }
}

module.exports = {
  request,
  requestGithub,
}
