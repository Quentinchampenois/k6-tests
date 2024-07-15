import {browser} from 'k6/experimental/browser'

import {endpoints} from "./src/endpoints.js";
import Login from './src/utils/Login.js';
import MyAccount from "./src/users/MyAccount.js";
import Index from "./src/participatory_processes/Index.js";

export const options = {
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
    thresholds: {
        checks: ["rate==1.0"]
    }
};

export default async function () {
    let page = await browser.newPage();
    page.waitForLoadState('networkidle');
    try {
        page = await Login({baseUrl: endpoints.base, endpoint: endpoints.user.sign_in, page: page});
        console.log(`User is redirected to homepage > ${page.url()}`)

        page = await MyAccount({baseUrl: endpoints.base, endpoint: endpoints.user.my_account, page: page});
        console.log(`User is redirected to edit page > ${page.url()}`)

        page = await Index({baseUrl: endpoints.base, endpoint: endpoints.participatory_processes.index, page: page})
        console.log(`User is redirected to Participatory process show page > ${page.url()}`)
        console.log("End of process")
    } catch(err) {
        const currentDate = Date.now();
        await page.screenshot({ path: `screenshots/error-${currentDate}.png` });
    } finally {
        page.close()
    }
}
