import { check } from 'k6';

export default function Login(opts) {
    const baseUrl = opts.baseUrl
    const page = opts.page
    const EMAIL = `user@example.org`;
    const PASSWORD = 'decidim123456789';

    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(baseUrl + '/users/sign_in');
            console.log(`Go to > User sign_in > ${page.url()}`)

            const email = page.locator("#session_user_email");
            email.fill(EMAIL);
            const password = page.locator("#session_user_password");
            password.fill(PASSWORD);
            console.log(`Fill in > User email > ${EMAIL}`)
            console.log(`Fill in > User password > ${PASSWORD}`)

            const loginBtn = page.locator("form#session_new_user.register-form.new_user div.actions button.button.expanded");
            console.log(`Click on > Form login button > ${loginBtn.textContent()}`)

            await Promise.all([loginBtn.click(), page.waitForNavigation()]);
            check(page, {
                'User is redirected to homepage': (r) => r.url() === baseUrl + '/?locale=en',
                'User is logged in': (r) => r.content().includes("Signed in successfully"),
            });

            resolve(page)
        } catch (err) {
            console.error(err)
            const currentDate = Date.now();
            await page.screenshot({ path: `screenshots/error-${currentDate}.png` });
            reject(err)
        }
    });
}