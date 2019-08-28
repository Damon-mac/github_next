const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const koaBody = require('koa-body')
const Redis = require('ioredis')
const atob = require('atob')

const auth = require('./server/auth')
const api = require('./server/api')

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

// 创建redis client, 可以不用传配置, 用默认localhost:6379
const redis = new Redis()

// 设置nodejs全局增加一个atob方法
global.atob = atob

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router

  server.keys = ['zhu develop github app']
  server.use(koaBody())

  const SESSION_CONFIG = {
    key: 'gid',
    store: new RedisSessionStore(redis)
  }

  server.use(session(SESSION_CONFIG, server))

  auth(server)
  api(server)

  // server.use(async (ctx, next) => {
  //   if (!ctx.session.user) {
  //     ctx.session.user = {
  //       name: 'jaja',
  //       age: 18
  //     }
  //   } else {
  //     console.log('session is:', ctx.session);
  //   }
  //   await next()
  // })

  router.get('/api/user/info', async ctx => {
    // const id = ctx.params.id
    // await handle(ctx.req, ctx.res, {
    //   pathname: '/a',
    //   query: { id },
    // })
    // ctx.respond = false
    const user = ctx.session.userInfo
    if (!user) {
      ctx.status = 401
      ctx.body = 'Need Login'
    } else {
      ctx.body = user
      ctx.set('Content-Type', 'application/json')
    }
  })
  server.use(router.routes())


  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('Koa server listening at port 3000')
  })
})