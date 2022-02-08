const mimeType = 'audio/webm'

function createRecorder(stream: MediaStream): MediaRecorder {
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    return new MediaRecorder(stream, { mimeType })
  } else {
    // Safari is not support audio/webm natively, so we should use WASM.
    // @ts-ignore
    return new OpusMediaRecorder(
      stream,
      { mimeType },
      {
        OggOpusEncoderWasmPath:
          'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OggOpusEncoder.wasm',
        WebMOpusEncoderWasmPath:
          'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/WebMOpusEncoder.wasm',
      },
    )
  }
}

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

  const recorder = createRecorder(stream)

  const filename = Date.now()
  recorder.ondataavailable = (event) => {
    if (!event.data.size) {
      return
    }
    const form = new FormData()
    const blob = new Blob([event.data], { type: mimeType })
    form.append('data', blob, String(filename))
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
