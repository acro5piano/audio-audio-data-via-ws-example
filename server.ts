import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import path from 'path'
import { FastifySSEPlugin } from 'fastify-sse-v2'
import FastifyMultipart from 'fastify-multipart'
import { on, EventEmitter } from 'events'
import { pipeline } from 'stream'
import fs from 'fs'
import util from 'util'

const pump = util.promisify(pipeline)

const app = Fastify({ logger: true })

app.register(FastifyStatic, {
  root: path.resolve('./public'),
})

app.register(FastifySSEPlugin)
app.register(FastifyMultipart)

const ee = new EventEmitter()

app.post<{ Body: { data: any } }>('/audio-stream/input', async (req, res) => {
  const data = await req.file()
  // console.log(file)
  console.log(data)
  // await pump(data.file, fs.createWriteStream('/tmp/record.webm'))

  const buffer = await data.toBuffer()
  fs.appendFile('/tmp/record.webm', buffer, (error) => {
    if (error) {
      console.error(error)
      return
    }
  })

  // ee.emit('append', req.body.data)
  // ee.emit('append', '123')
  res.send('ok')
})

app.get('/audio-stream/output', (_req, res) => {
  res.sse(
    (async function* () {
      for await (const event of on(ee, 'append')) {
        yield {
          type: event.name,
          data: JSON.stringify(event),
        }
      }
    })(),
  )
})

app.listen(9999)

// function stringToArrayBuffer(str: string) {
//   const buf = new ArrayBuffer(str.length)
//   const bufView = new Uint8Array(buf)
//
//   for (let i = 0; i < str.length; i++) {
//     bufView[i] = str.charCodeAt(i)
//   }
//
//   return buf
// }
