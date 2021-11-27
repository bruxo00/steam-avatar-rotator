const puppeteer = require('puppeteer');
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const cookiesPath = `${process.cwd()}/cookies.json`;
const avatarsPath = `${process.cwd()}/avatars`;

process.stdout.write('\033c'); // clear console

const optionDefinitions = [
    { name: 'login', alias: 'l', type: Boolean, defaultValue: false },
    { name: 'clear', alias: 'c', type: Boolean, defaultValue: false },
    { name: 'time', alias: 't', type: Number, defaultValue: 60 },
    { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
]

const options = commandLineArgs(optionDefinitions);

(async () => {
    console.log('\x1b[32m', '>>> STEAM AVATAR ROTATOR <<<', '\x1b[0m');

    if (!fs.existsSync(avatarsPath)) {
        fs.mkdirSync(avatarsPath);
    }

    if (options.help) {
        console.log('--login     (-l): use this argument on the first run to login into your account');
        console.log('--clear     (-c): delete saved cookies');
        console.log('--time     (-c): time in seconds between avatar changes (default: 60 seconds)');
        console.log('--help     (-h): shows this menu');

        process.exit(0);
    }

    if (options.clear) {
        fs.unlinkSync(cookiesPath);
        console.log('Cookies cleared');
        process.exit(0);
    }

    const browser = await puppeteer.launch({
        headless: options.login ? false : true,
        defaultViewport: null,
        args: options.login ? ['--start-maximized'] : []
    });
    const page = await browser.newPage();

    if (options.login) {
        console.log('Login into your steam account and close the BROWSER (not this node app).');

        await page.goto('https://steamcommunity.com/');

        browser.on('disconnected', async () => {
            const cookies = await page.cookies();

            await fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
        });
    } else {
        if (fs.existsSync(cookiesPath)) {
            const cookiesString = fs.readFileSync(cookiesPath);
            const cookies = JSON.parse(cookiesString);
            const avatars = [];

            fs.readdirSync(avatarsPath).forEach(avatar => avatars.push(avatar));

            if (avatars.length === 0) {
                console.error('No avatars found. Place your avatars inside the \'avatars\' folder.');
                process.exit(0);
            } else {
                console.log(`${avatars.length} avatars loaded`);
            }

            await page.setCookie(...cookies);

            console.log(`Changing avatars every ${options.time} seconds`);

            const changeAvatar = async () => {
                try {
                    const choosenOne = avatars[Math.floor(Math.random() * avatars.length)];

                    await page.goto('https://steamcommunity.com/id/1bruxo/edit/avatar');

                    const input = await page.$("input[type=file]");
                    await input.uploadFile(`./avatars/${choosenOne}`);

                    const button = await page.$('.DialogButton:nth-child(1)');
                    await sleep(2000);
                    await button.evaluate(form => form.click());

                    console.log(`Avatar changed to: ${choosenOne}`);
                } catch {
                    console.error('Error chaning avatars');
                }
            }

            await changeAvatar();
            setInterval(changeAvatar, options.time * 1000);
        } else {
            console.error('Could not load cookies. Please start the app with --login argument and login into your account.');
            browser.close();
        }
    }
})();