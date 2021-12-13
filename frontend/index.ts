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

  const mimeType = `audio/webm`
  const recorder = new MediaRecorder(stream, { mimeType })

  const filename = Date.now()
  recorder.ondataavailable = (event) => {
    if (!event.data.size) {
      return
    }
    const form = new FormData()
    const recordChunk = []
    recordChunk.push(event.data)
    const superBlob = new Blob(recordChunk, { type: mimeType }) // TODO: in this way, only first chunk is a valid webm
    form.append('data', superBlob, String(filename))
    fetch('/audio-stream/input', {
      method: 'POST',
      body: form,
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

  recorder.start(3000)
}

async function listen() {
  const recordedBlobs: Blob[] = []
  const audioTag = document.querySelector('audio')!
  await fetch('/audio-stream/initial')
    .then((res) => res.arrayBuffer())
    .then((d) => recordedBlobs.push(new Blob([d])))
  const sse = new EventSource('/audio-stream/output', {
    withCredentials: false,
  })
  sse.onmessage = async ({ data }) => {
    await fetch(data)
      .then((res) => res.arrayBuffer())
      .then((d) => recordedBlobs.push(new Blob([d])))
    const superBlob = new Blob(recordedBlobs, { type: 'audio/webm' })
    const currentTime = audioTag.currentTime
    audioTag.src = window.URL.createObjectURL(superBlob)
    audioTag.currentTime = currentTime
    audioTag.play()
  }
  const superBlob = new Blob(recordedBlobs, { type: 'audio/webm' })
  audioTag.src = window.URL.createObjectURL(superBlob)
  audioTag.play()
}

document.getElementById('record')!.addEventListener('click', record)
document.getElementById('listen')!.addEventListener('click', listen)
