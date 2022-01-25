import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import path from 'path'
import FastifyMultipart from 'fastify-multipart'
import cors from 'fastify-cors'

import { ee } from './worker'
import { publish } from './file'

export const app = Fastify({ logger: true })

app.register(cors)

app.register(FastifyStatic, {
  root: path.resolve(__dirname, '../'),
})

app.register(FastifyMultipart)

app.post<{ Body: { data: any } }>('/audio-stream/input', async (req, res) => {
  const data = await req.file()
  const buffer = await data.toBuffer()
  const newFileName = `${data.filename}.webm`
  const pathName = `public/recordings/${newFileName}`
  await publish(pathName, buffer)
  ee.emit('start-ffmpeg', pathName)
  res.send('ok')
})
