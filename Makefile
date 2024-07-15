run:
	k6 run main.js

run-browser:
	K6_BROWSER_HEADLESS=false k6 run main.js