# send-audio-data-via-fetch-example

Demonstrates core concept for building live stream app.

Example distributed app doing:

- Send audio data in WebM format (frontend)
- Publish the audio data via Redis
- Receive the audio and convert them into HLS format using FFMpeg

# Give it a try

```
docker-compose up -d
yarn
make dev
```

Then, open http://localhost:9999/public/

# Thanks

https://github.com/cptrodgers/getUserMedia-Socket-Demo/blob/master/frontend/js/main.js
