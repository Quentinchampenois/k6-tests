import Login from './src/utils/Login.js';

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
    try {
        let login = await Login({ baseUrl: baseUrl });
        console.log(login);
    } catch (error) {
        console.error("Error during login:", error);
    }
}