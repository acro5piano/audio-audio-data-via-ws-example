dev:
	$(MAKE) -j dev/server dev/frontend

dev/server:
	nodemon --ext ts --watch server --exec 'node -r esbuild-register server/index.ts'

dev/frontend:
	nodemon --ext ts --watch frontend --exec './node_modules/.bin/esbuild frontend/index.ts --bundle > public/build/index.js'

gen-hls:
	find public/recordings/*.webm \
		| tail -1 \
		| xargs ffmpeg hls/output.m3u8 -re -i

clean:
	rm public/recordings/*.webm mpeg-dash/* hls/*
