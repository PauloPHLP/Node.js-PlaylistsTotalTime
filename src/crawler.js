const puppeteer = require('puppeteer-core');
const os = require('os');

const getVideosTimes = require('./getVideosTimes');

const platform = os.platform();
const executablePaths = {
  'linux': '/usr/bin/google-chrome',
  'darwin': '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
};
const playlistsURLS = [
  'https://www.youtube.com/playlist?list=PLJvQXRgtxlukIkmzucaV3rSFgYYdTr85A',
  'https://www.youtube.com/playlist?list=PLJvQXRgtxlumTgSFCMV3aPajZrG-84ezO'
];

(async() => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePaths[platform]
  });
  const page = await browser.newPage();
  let hours = 0,
    minutes = 0,
    seconds = 0;

  const videosTimesPromises = playlistsURLS.map(async(url) => {
    await getVideosTimes(page, url)
    .then((time) => {
      hours += time[0];
      minutes += time[1];
      seconds += time[2];
    });
  });

  await Promise.all(videosTimesPromises);

  const minutesFromSeconds = Math.floor(seconds / 60);
  seconds = seconds % 60;
  minutes += minutesFromSeconds;

  const hoursFromMinutes = Math.floor(minutes / 60);
  minutes = minutes % 60;
  hours += hoursFromMinutes;

  console.log(`Total time: ${hours} hours, ${minutes} minutes and ${seconds} seconds.`)

  await browser.close();
})();
