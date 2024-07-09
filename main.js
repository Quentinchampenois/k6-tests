import Login from './src/utils/Login.js';
import { browser } from 'k6/experimental/browser';
import { endpoints } from "./src/endpoints.js";

export const options = {
    vus: 1,
    // iterations: 1,
    // duration: '30s',
    insecureSkipTLSVerify: true,
    scenarios: {
        browser: {
            executor: 'shared-iterations',
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
};

export default async function() {
    let page = await browser.newPage();
    try {
        page = await Login({ baseUrl: endpoints.base, endpoint: endpoints.user.sign_in, page: page });
        console.log("Promise resolved!");
        console.log(`User is redirected to homepage > ${page.url()}`)
    } finally {
        page.close()
    }
}