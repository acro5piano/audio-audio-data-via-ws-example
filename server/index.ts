import Fastify from 'fastify'
import { nanoid } from 'nanoid'
import FastifyStatic from 'fastify-static'
import path from 'path'
import { FastifySSEPlugin } from 'fastify-sse-v2'
import FastifyMultipart from 'fastify-multipart'
import { on, EventEmitter } from 'events'
import { getWebmHeader } from './get-webm-header'
import fs from 'fs/promises'

const app = Fastify({ logger: true })

app.register(FastifyStatic, {
  root: path.resolve('./public'),
})

app.register(FastifySSEPlugin)
app.register(FastifyMultipart)

const ee = new EventEmitter()
let currentWebmHeader: any

app.post<{ Body: { data: any } }>('/audio-stream/input', async (req, res) => {
  const data = await req.file()

  const buffer = await data.toBuffer()
  const newFileName = `${new Date().toISOString()}-${nanoid(8)}.webm`
  const pathName = `public/recordings/${newFileName}`

  if (data.filename === '0') {
    await fs.writeFile(pathName, buffer)
    currentWebmHeader = await getWebmHeader(pathName)
    console.log(currentWebmHeader)
  } else {
    await fs.writeFile(pathName, currentWebmHeader)
    await fs.appendFile(pathName, buffer)
  }

  ee.emit('append', `/recordings/${newFileName}`)

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
