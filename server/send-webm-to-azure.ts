import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk'

import fsPromises from 'fs/promises'

require('dotenv/config')

const speechConfig = SpeechConfig.fromSubscription(
  process.env['AZURE_KEY']!,
  process.env['AZURE_REGION']!,
)

speechConfig.speechRecognitionLanguage = 'ja-JP'

const filePath = '/tmp/test.webm'

async function main() {
  const data = await fsPromises.readFile(filePath)
  const audioConfig = AudioConfig.fromWavFileInput(data)
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
  recognizer.startContinuousRecognitionAsync()
  recognizer.recognized = (_s, event) => {
    console.log(event.result.text)
  }
}
main()

// stream.on('data', (buf) => {
//   const audioConfig = AudioConfig.fromWavFileInput(Buffer.from(buf))
//   const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
//   recognizer.startContinuousRecognitionAsync()
//   recognizer.recognized = (_s, event) => {
//     console.log(event.result)
//   }
// })

// const audioConfig = AudioConfig.fromStreamInput(stream)
//
// const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
// recognizer.startContinuousRecognitionAsync()
// recognizer.recognized = (_s, event) => {
//   console.log(event.result)
// }
