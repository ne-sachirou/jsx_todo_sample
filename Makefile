build:
	node_modules/.bin/babel -o app/index.js app/index.babel.js
	node_modules/.bin/webpack

start:
	node_modules/.bin/pm2 start app --no-daemon --name app --watch app

test:
	node_modules/.bin/eslint lib/**/**.js web/**/**.js web/**/**.jsx

watch:
	node_modules/.bin/webpack --display-error-details -w

# vim: set noet:
