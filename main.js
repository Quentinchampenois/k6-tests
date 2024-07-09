import Login from './src/utils/Login.js';
import { browser } from 'k6/experimental/browser';

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

const baseUrl = "http://localhost:3000"

export default async function() {
    let page = await browser.newPage();
    try {
        try {
            page = await Login({ baseUrl: baseUrl, page: page });
            console.log("Promise resolved!");
        } catch (error) {
            console.error("Error during login:", error);
        }
        console.log(`User is redirected to homepage > ${page.url()}`)
    } finally {
        page.close()
    }
}