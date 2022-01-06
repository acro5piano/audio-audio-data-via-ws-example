import Fastify from 'fastify'
import delay from 'delay'
import FastifyStatic from 'fastify-static'
import path from 'path'
import { FastifySSEPlugin } from 'fastify-sse-v2'
import FastifyMultipart from 'fastify-multipart'
import cors from 'fastify-cors'
import { on, EventEmitter } from 'events'
import fsPromise from 'fs/promises'
import ffmpeg from 'fluent-ffmpeg'

const app = Fastify({ logger: true })

app.register(cors)

app.register(FastifyStatic, {
  root: path.resolve(__dirname, '../'),
})

app.register(FastifySSEPlugin)
app.register(FastifyMultipart)

const ee = new EventEmitter()
let pathName = ''
let ffmpegStarted = false

ee.on('start-ffmpeg', async () => {
  ffmpegStarted = true
  await delay(3000)
  ffmpeg(pathName)
    .inputOption('-re')
    .on('end', () => {
      console.log('\n\n=================================Done!!\n\n')
    })
    .on('error', console.error)
    .save('./hls/output.m3u8')
})

app.post<{ Body: { data: any } }>('/audio-stream/input', async (req, res) => {
  const data = await req.file()
  const buffer = await data.toBuffer()
  const newFileName = `${data.filename}.webm`
  pathName = `public/recordings/${newFileName}`
  await fsPromise.appendFile(pathName, buffer)
  ee.emit('append', `/recordings/${newFileName}`)
  if (!ffmpegStarted) {
    ee.emit('start-ffmpeg')
  }
  res.send('ok')
})

app.get('/audio-stream/output', (_req, res) => {
  res.sse(
    (async function* () {
      for await (const event of on(ee, 'append')) {
        yield {
          type: event.name,
          data: event[0],
        }
      }
    })(),
  )
})

app.get('/audio-stream/initial', async (_req, res) => {
  res.send(await fsPromise.readFile(pathName))
})

app.listen(9999)
