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

  recorder.start(3000)
}

document.getElementById('record')!.addEventListener('click', record)
