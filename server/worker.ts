import { EventEmitter } from 'events'

import { execa } from 'execa'
import delay from 'delay'

export const ee = new EventEmitter()

let ffmpegStarted = false

ee.on('start-ffmpeg', async (pathName: string) => {
  if (ffmpegStarted) {
    return
  }
  ffmpegStarted = true
  await delay(3000)
  await Promise.all([
    execa('ffmpeg', ['-re', '-i', pathName, 'hls/output.m3u8']),
    execa('ffmpeg', ['-re', '-i', pathName, 'wav/output.wav']),
  ])
})
