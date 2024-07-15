import {browser} from 'k6/experimental/browser'
import {endpoints} from "./src/endpoints.js";
import Login from './src/utils/Login.js';
import MyAccount from "./src/users/MyAccount.js";

export const options = {
    vus: 1,
    // iterations: 1,
    // duration: '30s',
    insecureSkipTLSVerify: true,
    scenarios: {
        browser: {
            executor: 'per-vu-iterations',
            //executor: 'shared-iterations',
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
    thresholds: {
        checks: ["rate==1.0"]
    }
};

export default async function () {
    let page = await browser.newPage();
    try {
        page = await Login({baseUrl: endpoints.base, endpoint: endpoints.user.sign_in, page: page});
        console.log(`User is redirected to homepage > ${page.url()}`)

        page = await MyAccount({baseUrl: endpoints.base, endpoint: endpoints.user.my_account, page: page});
        console.log(`User is redirected to edit page > ${page.url()}`)
        console.log("End of process")
    } catch(err) {
        const currentDate = Date.now();
        await page.screenshot({ path: `screenshots/error-${currentDate}.png` });
    } finally {
        page.close()
    }
}
