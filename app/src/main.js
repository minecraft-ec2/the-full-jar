// Imports
import './app.css';

import { addAuthListener, login, logout, start, stats, isElevatedUser } from './utils/firebase';

// Elements
const title = document.getElementById('title'),
    emailInput = document.getElementById('email-input'),
    passwordInput = document.getElementById('password-input'),
    modal = document.getElementById('modal'),
    app = document.getElementById('app'),
    shadow = document.getElementById('shadow'),
    ipElement = document.getElementById('ip'),
    startButton = document.getElementById('start'),
    refreshButton = document.getElementById('refresh'),
    refreshIcon = document.getElementById('refresh-icon'),
    nonElevatedUserModalTrigger = document.getElementById('non-elevated-user-modal-trigger'),
    timeBoundsModalTrigger = document.getElementById('time-bounds-modal-trigger');
;

const COLORS = {
    'stopped': 'red',
    'pending': 'orange',
    'stopping': 'red',
    'running': 'green'
};

// Credit (& explanation): https://www.freecodecamp.org/news/javascript-debounce-example/
const debounce = (func, timeout = 300) => {
    let timer;

    return (...args) => {
        if (!timer) func.apply(this, args);
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
};

// Reactive UI
addAuthListener((user) => {
    if (!user) {
        // Open Modal
        modal.classList.remove('modal-close');
        modal.classList.add('modal-open');
        // Show Modal
        modal.classList.remove('hidden');
    } else {
        // Initial Stats Load
        refreshButton.click();
        // Show App
        app.classList.remove('hidden');
        // Close Modal
        modal.classList.add('modal-close');
        modal.classList.add('hidden');
    }
});

const refresh = async () => {
    const { status, ip } = (await stats()).data;
    const isRunning = status === 'running';

    if (isRunning) startButton.classList.add(
        'tooltip',
        'tooltip-bottom',
        'hover:cursor-not-allowed',
        'no-animation'
    );

    ipElement.innerText = isRunning ? ip : '[offline server]';

    shadow.classList.remove('shadow-red-600');
    shadow.classList.remove('shadow-orange-600');
    shadow.classList.remove('shadow-green-600');

    const color = COLORS[status];

    shadow.classList.add(`shadow-${color}-600`);

    return isRunning;
};

// Login Form
document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Test for empty submistions
    if (emailInput.value !== '' && passwordInput.value !== '') {
        try {
            await login(emailInput.value, passwordInput.value);
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                passwordInput.classList.add('input-error');
                passwordInput.value = '';
                passwordInput.focus();
            } else window.alert(`ERROR: ${error.code}`);
        }
    }
});

// Logout Button
document.getElementById('logout').addEventListener('click', async () => {
    await logout();
    window.location.reload();
});


// Start Button
document.getElementById('start').addEventListener('click', debounce(async (event) => {
    // Ignore Disabled Button
    if (!event.currentTarget.classList.contains('no-animation')) {
        try {
            if (await isElevatedUser()) {
                const { response } = await start();
                if (response === 'Time out of bounds') {
                    timeBoundsModalTrigger.click();
                }
            } else {
                nonElevatedUserModalTrigger.click();
            }
        } catch (err) {
            console.log(err, err.message);
        }
    }
}));

// Refresh Button
refreshButton.addEventListener('click', debounce(async (event) => {
    event.preventDefault();

    title.innerText = 'Loading...';
    refreshIcon.classList.add('hidden');
    refreshButton.classList.add('loading');

    refresh().then(isRunning => {
        title.innerText = isRunning ? 'Online' : 'Offline';
        refreshButton.classList.remove('loading');
        refreshIcon.classList.remove('hidden');
    });
}));