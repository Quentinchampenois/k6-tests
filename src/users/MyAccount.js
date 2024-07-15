import { check, sleep } from 'k6';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export default function MyAccount(opts) {
    const baseUrl = opts.baseUrl
    const endpoint = opts.endpoint
    let page = opts.page
    const rand = [randomIntBetween(1, 1000), randomIntBetween(1, 1000)]
    const NAME = `Jane Doe ${rand[0]}`;
    const EMAIL = `jane-${rand.join("-")}@example.org`;
    const USERNAME = `jane-doe-${randomIntBetween(1, 1000)}-${randomIntBetween(1, 100)}`;

    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(`${baseUrl}${endpoint}`);
            console.log(`Go to > User My account > ${page.url()}`)

            let title = page.locator("h1.heading1.user-header");
            console.log(title.textContent())
            check(title, {
                "Title is present": (r) => r.textContent() === "\n" +
                    "          Paramètres utilisateur\n" +
                    "           - Mon compte\n" +
                    "        ",
            })

            /*let pendingEmail = page.locator("#email-change-pending a[href='/account/cancel_email_change']");
            console.log(pendingEmail.textContent());
            if (pendingEmail) {
                console.log(`Click on > Cancel email change > ${pendingEmail.textContent()}`)
                await Promise.all([pendingEmail.click(), page.waitForNavigation()]);
                sleep(1)
                page = await page.goto(`${baseUrl}${endpoint}`);
            }*/

            let userNameField = page.locator("input#user_name")
            userNameField.fill(NAME)
            console.log(`Fill in > User name > ${userNameField.inputValue()}`)
            let userNicknameField = page.locator("input#user_nickname")
            userNicknameField.fill(USERNAME)
            console.log(`Fill in > User nickname > ${userNicknameField.inputValue()}`)

            /*let userEmailField = page.locator("input#user_email")
            userEmailField.fill(EMAIL)
            console.log(`Fill in > User email > ${userEmailField.inputValue()}`)*/

            let updateBtn = page.locator('//button[text()="Mettre à jour votre compte"]')
            console.log(`Click on > Form update button > ${updateBtn.textContent()}`)
            await Promise.all([updateBtn.click(), page.waitForNavigation()]);
            let successMessage = page.locator("div.flash.success");
            let changeEmail = page.locator("#email-change-pending");
            check(successMessage, {
                "User is updated successfully": (r) => r.textContent().includes("Votre compte a été mis à jour avec succès."),
            })
            /*check(changeEmail, {
                "Email has changed message": (r) => r.textContent().includes("Vérification du changement d'adresse e-mail"),
            })*/

            resolve(page)
        } catch (err) {
            const currentDate = Date.now();
            await page.screenshot({ path: `screenshots/error-${currentDate}.png` });
            reject(err)
        }
    });
}