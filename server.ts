import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import path from 'path'

const app = Fastify({ logger: true })

app.register(FastifyStatic, {
  root: path.resolve('./public'),
})

app.listen(9999)
