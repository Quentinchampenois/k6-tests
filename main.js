import {SharedArray} from "k6/data";
import http from "k6/http";
import {sleep, check} from "k6";
import {Httpx} from 'https://jslib.k6.io/httpx/0.1.0/index.js';


export const options = {
    insecureSkipTLSVerify: true,
    thresholds: {
        checks: ["rate==1.0"]
    },
    scenarios: {
        signup: {
            vus: 20,
            iterations: 20,
            executor: 'shared-iterations',
            exec: 'Signup',
            startTime: '0s',
        },
        login: {
            executor: 'shared-iterations',
            exec: 'Login',
            startTime: '20s',
            vus: 10,
            iterations: 10,
        }
    }
};

const users = new SharedArray("users", () => {
    let users = [];
    for (let i = 0; i < 100; i++) {
        let rand = Math.floor(Math.random() * 1000);
        let rand2 = Math.floor(Math.random() * 1000);
        users.push({
            email: `u-${rand}-${rand2}@example.org`,
            password: 'decidim123456789',
            name: `User ${rand} ${rand2}`,
            username: `user-${rand}-${rand2}`
        });
    }
    return users;
});

let remainingUsers = new SharedArray("remainingUsers", function (items) {
    items.push(...users);
    return users;
});

const baseUrl = 'http://localhost:3000';
const session = new Httpx({baseURL: baseUrl});

export function Signup() {
    let rand = Math.floor(Math.random() * 1000);
    let rand2 = Math.floor(Math.random() * 1000);
    let user = {
        email: `u-${rand}-${rand2}@example.org`,
        password: 'decidim123456789',
        name: `User ${rand} ${rand2}`,
        username: `user-${rand}-${rand2}`
    };
    remainingUsers.push(user);
    console.log(`User: ${user.email} - ${user.password}`);
    let signupRes = session.get("/users/sign_up");

    const elem = signupRes.html().find('input[name=authenticity_token]');
    const token = elem.attr('value');

    const resp = session.post(`/users/`, JSON.stringify({
        user: {
            name: user.name,
            email: user.email,
            password: user.password,
            password_confirmation: user.password,
            tos_agreement: true,
        },
    }), {
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token,
        }
    });

    sleep(1);

    console.log(resp.status)

    check(resp, {
        "User is created": (r) => r.status === 200
    });
}

export function Login() {
    let user = remainingUsers[Math.floor(Math.random() * remainingUsers.length)];
    console.log(remainingUsers.length)
    console.log(remainingUsers)
    remainingUsers = remainingUsers.filter(u => u.email !== user.email);

    console.log(`User: ${user.email} - ${user.password}`);
    let loginRes = session.get("/users/sign_in");

    const elem = loginRes.html().find('input[name=authenticity_token]');
    const token = elem.attr('value');

    const resp = session.post(`/users/sign_in`, JSON.stringify({
        user: {
            email: user.email,
            password: user.password,
        },
    }), {
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token,
        }
    });

    sleep(1);

    console.log(resp.status)

    check(resp, {
        "User is logged in": (r) => r.status === 200
    });
}