import { check, sleep } from 'k6';

export default function MyAccount(opts) {
    const baseUrl = opts.baseUrl
    const endpoint = opts.endpoint
    let page = opts.page

    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(`${baseUrl}${endpoint}`);
            console.log(`Go to > User sign_in > ${page.url()}`)
            const elements = page.$$('#highlighted-processes .card__link');

            if (elements.length > 0) {
                const firstElement = elements[0];
                await Promise.all([firstElement.click(), page.waitForNavigation()]);

                check(page, {
                    'User is redirected to process page': (r) => r.url().includes('/processes/'),
                });
                check(page, {
                    'Page contains title': (r) => r.content().includes("Cette concertation appartient à"),
                });
            } else {
                console.log('No visible elements found.');
            }

            console.log(`User is redirected to process page > ${page.url()}`)

            sleep(5)

            resolve(page)
        } catch (err) {
            const currentDate = Date.now();
            await page.screenshot({ path: `screenshots/error-${currentDate}.png` });
            reject(err)
        }
    });
}