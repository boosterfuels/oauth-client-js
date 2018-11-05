'use strict'

const express = require('express')
const simpleOauthModule = require('simple-oauth2')

const API_URL = process.env.API_URL || 'http://localhost:10000'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3001'
const port = process.env.PORT || 3001

const app = express()
const oauth2 = simpleOauthModule.create({
  client: {
    id: 'democlient',
    secret: 'democlientsecret'
  },
  auth: {
    tokenHost: API_URL,
    tokenPath: '/v3/oauth/access_token',
    authorizePath: '/v3/oauth/authorize'
  }
})

const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: `${CLIENT_URL}/callback`,
  scope: 'boost',
  state: '1'
})

app.get('/linkWithBooster', (req, res) => {
  res.redirect(authorizationUri)
})

app.get('/callback', async (req, res) => {
  const code = req.query.code
  const options = {
    code
  }

  try {
    const result = await oauth2.authorizationCode.getToken(options)

    token = oauth2.accessToken.create(result)

    res.status(200).json(result)
  } catch (error) {
    console.error('Access Token Error', error.message)
    return res.status(500).json('Authentication failed')
  }
})

app.get('/success', (req, res) => {
  res.send('')
})

app.get('/', (req, res) => {
  res.send('<p><a href="/linkWithBooster">Link Booster</a></p>')
})

app.listen(port, () => {
  console.log(`Express server started on port ${port}`)
})
