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

  const mimeType = `audio/aac`
  const recorder = new MediaRecorder(stream, { mimeType })

  let seq = 0
  recorder.ondataavailable = (event) => {
    if (!event.data.size) {
      return
    }
    const form = new FormData()
    recordedBlobs.push(event.data)
    const recordChunk = []
    recordChunk.push(event.data)
    const superBlob = new Blob(recordChunk, { type: mimeType }) // TODO: in this way, only first chunk is a valid webm
    form.append('data', superBlob, String(seq))
    fetch('/audio-stream/input', {
      method: 'POST',
      body: form,
    })
      .then((res) => res.text())
      .then(console.log)
      .then(() => seq++)
  }

  // const audioConfig = AudioConfig.fromStreamInput(stream);
  // const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  // recognizer.startContinuousRecognitionAsync();
  // recognizer.recognized = (_s, event) => {
  //   if (event.result.text && event.result.text.length > 0) {
  //     appendTranscription(event.result.text);
  //   }
  // };

  recorder.start(3000)
}

function play() {
  const superBlob = new Blob(recordedBlobs, { type: 'audio/webm' })
  document.querySelector('audio')!.src = window.URL.createObjectURL(superBlob)
}

async function listen() {
  const sse = new EventSource('/audio-stream/output', {
    withCredentials: false,
  })
  sse.onmessage = ({ data }) => {
    console.log(data[0])
  }
}

document.getElementById('record')!.addEventListener('click', record)
document.getElementById('listen')!.addEventListener('click', listen)
document.getElementById('play')!.addEventListener('click', play)
