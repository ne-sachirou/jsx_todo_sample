'use strict'
import 'babel-core/register'
import fs from 'fs'
import jsdom from 'jsdom'
import koa from 'koa'
import send from 'koa-send'
import path from 'path'
import promisify from '../lib/promisify'

async function isFile (file) {
  const decoded = decodeURIComponent(file)
  if (decoded !== path.join('.', decoded)) return false
  try {
    const stats = await promisify(fs.stat)(file)
    if (!stats.isFile()) return false
  } catch (err) {
    return false
  }
  return true
}

const app = new koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error(err)
    ctx.body = {error: err.message}
    ctx.status = err.status || 500
  }
})

app.use(async (ctx, next) => {
  console.log('%s : %s %s', new Date(), ctx.method, ctx.url)
  await next()
})

app.use(async (ctx, next) => {
  const file = path.join('static', ctx.path)
  if (await isFile(file)) {
    await send(ctx, file)
  } else {
    const [html, appjs] = await Promise.all([
      promisify(fs.readFile)('static/app.html', 'utf8'),
      promisify(fs.readFile)('static/app.js', 'utf8')
    ])
    const window = await promisify(jsdom.env)(html, [], {src: [appjs]})
    window.startApp()
    ctx.body = window.document.documentElement.outerHTML
    window.close()
  }
})

app.listen(3000)
