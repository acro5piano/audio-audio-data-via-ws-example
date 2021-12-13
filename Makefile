dev:
	$(MAKE) -j dev/server dev/frontend

dev/server:
	nodemon --ext ts --watch server --exec 'node -r esbuild-register server/index.ts'

dev/frontend:
	nodemon --ext ts --watch frontend --exec './node_modules/.bin/esbuild frontend/index.ts --bundle > public/build/index.js'

gen-mpeg-dash:
	find public/recordings/*.webm \
		| head -1 \
		| xargs ffmpeg -c copy -window_size 0 -movflags +faststart mpeg-dash/output.mpd -i

clean:
	rm public/recordings/*.webm mpeg-dash/*
