# Steam Avatar Rotator
Changes your Steam avatar every X seconds between the ones you have chosen. 

## Why?
Why not?

## Requirements
[NodeJS](https://nodejs.org/en/) - above version 13 it should work, but download the LTS if you want to be sure.

## Instructions
1. Download or clone this repository
2. Navigate to the folder you downloaded the repository into
3. Run `npm install`
4. Run `node app.js --login`
5. A browser will appear. Login into your steam account.
6. Close the browser.
7. Put your avatars inside the **/avatars** folder. For better results the avatars must have 1:1 aspect ratio (recommended 184x184).
8. Run `node app.js`
9. Keep the app running, it will start to change avatars randomly from the ones you have inside the folder.

If your session expires or you keep having errors, run `node app -c` and then start again from **4.**

If you want to change the time between avatar changes, run with the parameter `-t`, ex: `node app -t 10` will change the avatar every 10 seconds.

If you get yourself banned, it's lidating. Altough it should be fine, don't use low time values.

## Todo
* Allow to change the avatars in a specific order
