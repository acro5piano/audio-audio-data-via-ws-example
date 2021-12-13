dev:
	$(MAKE) -j dev/server dev/frontend

dev/server:
	nodemon --ext ts --watch server --exec 'node -r esbuild-register server/index.ts'

dev/frontend:
	nodemon --ext ts --watch frontend --exec './node_modules/.bin/esbuild frontend/index.ts --bundle > public/build/index.js'

gen-mpeg-dash:
	find public/recordings/*.webm \
		| head -1 \
		| xargs ffmpeg -c copy -window_size 0 -movflags +faststart mpeg-dash/output.mpd -re -i

listen-with-mpd:
	cd mpeg-dash && mpv output.mpd

# use mpv 'udp://0.0.0.0:1234?listen'
ffmpeg-live:
	find public/recordings/*.webm \
		| head -1 \
		| xargs ffmpeg -f mpegts udp://0.0.0.0:1234 -re -i


clean:
	rm public/recordings/*.webm mpeg-dash/*
