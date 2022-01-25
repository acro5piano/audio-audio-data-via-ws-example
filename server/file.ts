import delay from 'delay'
import IORedis from 'ioredis'
import fs from 'fs/promises'
import { EventEmitter } from 'events'

const REDIS_URL = 'redis://127.0.0.1:46379'

const ee = new EventEmitter()

// const publisher = new IORedis(REDIS_URL)
// const subscriber = new IORedis(REDIS_URL)

// subscriber.psubscribe('*')
// subscriber.on('pmessage', async (_, fileName, data) => {
//   await fs.appendFile(fileName, Buffer.from(data))
// })

ee.on('message', async (fileName, data) => {
  await fs.appendFile(fileName, Buffer.from(data))
})

export async function publish(fileName: string, data: Buffer) {
  // await publisher.publishBuffer(fileName, data)
  await ee.emit('message', fileName, data)
}

if (module === require.main) {
  delay(100).then(async () => {
    await publish('file', Buffer.from('hoge', 'utf8'))
    await publish('file', Buffer.from('hoge', 'utf8'))
    await publish('file', Buffer.from('hoge', 'utf8'))
  })
}
