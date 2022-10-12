import './style.css';

import { login } from './services/firebase'

const debounce = (func: Function, timeout = 300) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return (...args: any[]) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}

window.addEventListener('DOMContentLoaded', () => {
    login().then(({ user }) => {
        console.log(user.uid)
    })
});