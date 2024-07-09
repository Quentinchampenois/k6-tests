# K6 Grafana labs

## Description

This is a Grafana k6 scenario to test end-to-end scenarios on Decidim.

## Getting started

* Start a decidim-app on http://localhost:3000
* Execute the k6 test

```bash
make run
or
k6 run main.js
```

## Structure

* `main.js` - Main K6 scenario
* `Makefile` - Makefile to run the test
* `screenshots` - Screenshots of the test in case of error
* `src/utils/Login.js` - User login scenario
* `src/endpoints.js` - Decidim HTTP endpoints

## Notes

* Take a screenshot

```ruby

import { browser } from 'k6/experimental/browser';
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';

describe(`Login as user`, async () => {
  const page = await browser.newPage();

try {
  await page.goto(baseUrl + '/users/sign_in');
  
  await page.screenshot({ path: 'screenshots/screenshot.png' });
} finally {
  await page.close();
}

```