dev:
	$(MAKE) -j dev/server dev/frontend

dev/server:
	nodemon --ext ts --watch server --exec 'node -r esbuild-register server/index.ts'

dev/frontend:
	nodemon --ext ts --watch frontend --exec './node_modules/.bin/esbuild frontend/index.ts --bundle > public/build/index.js'

clean:
	rm public/recordings/*.webm
