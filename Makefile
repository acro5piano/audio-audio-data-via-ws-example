dev:
	$(MAKE) -j dev/server dev/frontend

dev/server:
	nodemon --watch server.ts --exec 'node -r esbuild-register server.ts'

dev/frontend:
	nodemon --watch frontend/*.ts --exec './node_modules/.bin/esbuild frontend/index.ts --bundle > public/build/index.js'

clean:
	rm public/recordings/*.webm
