import delay from 'delay'
import fs from 'fs/promises'
import MQEmitterRedis from 'mqemitter-redis'

const ee = MQEmitterRedis({
  port: 46379,
})

ee.on('message', ({ fileName, data }, cb) => {
  console.log(fileName)
  fs.appendFile(fileName, data).then(cb)
})

export async function publish(fileName: string, data: Buffer) {
  ee.emit({ topic: 'message', fileName, data })
}

if (module === require.main) {
  delay(100).then(async () => {
    await publish('file', Buffer.from('hoge', 'utf8'))
    await publish('file', Buffer.from('hoge', 'utf8'))
    await publish('file', Buffer.from('hoge', 'utf8'))
  })
}
