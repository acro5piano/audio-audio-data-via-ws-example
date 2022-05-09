dev:
	$(MAKE) -j dev/server dev/frontend

dev/server:
	yarn nodemon --ext ts --watch server --exec 'node -r esbuild-register server/index.ts'

dev/frontend:
	yarn nodemon --ext ts --watch frontend --exec './node_modules/.bin/esbuild frontend/index.ts --bundle > public/build/index.js'

gen-hls-using-raw-ffmpeg:
	find public/recordings/*.webm \
		| tail -1 \
		| xargs ffmpeg hls/output.m3u8 -re -i

clean:
	rm -f public/recordings/* mpeg-dash/* hls/* wav/*
