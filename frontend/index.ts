const recordedBlobs: Blob[] = []

async function record() {
  const media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  })
  const audioTrack = media.getAudioTracks()[0]
  if (!audioTrack) {
    throw new Error('Audio Track is null!')
  }

  const stream = new window.MediaStream([audioTrack])

  const mimeType = `${audioTrack.kind}/webm`
  const recorder = new MediaRecorder(stream, { mimeType })

  recorder.ondataavailable = (event) => {
    if (!event.data.size) {
      return
    }
    const form = new FormData()
    recordedBlobs.push(event.data)
    // const superBuffer = new Blob(recordedBlobs, { type: 'audio/webm' })
    // form.append('data', superBuffer)
    fetch('/audio-stream/input', {
      method: 'POST',
      body: form,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    })
      .then((res) => res.text())
      .then(console.log)
  }

  // const audioConfig = AudioConfig.fromStreamInput(stream);
  // const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  // recognizer.startContinuousRecognitionAsync();
  // recognizer.recognized = (_s, event) => {
  //   if (event.result.text && event.result.text.length > 0) {
  //     appendTranscription(event.result.text);
  //   }
  // };

  recorder.start(1000)
}

function play() {
  const superBuffer = new Blob(recordedBlobs, { type: 'audio/webm' })
  document.querySelector('audio')!.src = window.URL.createObjectURL(superBuffer)
}

// function arrayBufferToString(buffer: Buffer) {
//   const bufView = new Uint8Array(buffer)
//   const length = bufView.length
//
//   let result = ''
//   let addition = Math.pow(2, 8) - 1
//
//   for (let i = 0; i < length; i += addition) {
//     if (i + addition > length) {
//       addition = length - i
//     }
//     // @ts-ignore
//     result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition))
//   }
//
//   return result
// }

async function listen() {
  const sse = new EventSource('/audio-stream/output', {
    withCredentials: false,
  })
  sse.onmessage = (data) => {
    console.log(data)
  }
}

document.getElementById('record')!.addEventListener('click', record)
document.getElementById('listen')!.addEventListener('click', listen)
document.getElementById('play')!.addEventListener('click', play)
