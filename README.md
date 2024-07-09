# K6 Grafana labs

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