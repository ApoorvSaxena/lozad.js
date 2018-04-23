import puppeteer from "puppeteer";

const LOZAD_DEMO_URL = "http://localhost:3000";

const LARGE_PICTURE_URLS = [
  `${LOZAD_DEMO_URL}/images/thumbs/picture-01.jpg`,
  `${LOZAD_DEMO_URL}/images/thumbs/picture-04.jpg`,
  `${LOZAD_DEMO_URL}/images/thumbs/picture-07.jpg`
];

let page;
let browser;
const width = 1920;
const height = 1080;

function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

// Utility function to scroll the page (by increments) to the bottom, wait a little and scroll the page all the way up.
// => in order to trigger lazy-loading behavior hooked to the intersection observer

async function scrollUpAndDown(page) {
  // Get the height of the rendered page
  const bodyHandle = await page.$("body");
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate(_viewportHeight => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(20);
    viewportIncr = viewportIncr + viewportHeight;
  }

  // Scroll back to top
  await page.evaluate(_ => {
    window.scrollTo(0, 0);
  });

  // Some extra delay to let images load
  await wait(100);
}

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});
afterAll(() => {
  //browser.close();
});

describe("Picture elements", () => {
  //just a dummy test, to delete ?
  test("assert that demo page is loaded and correct (<title> is correct)", async () => {
    await page.goto(LOZAD_DEMO_URL);
    const title = await page.title();
    expect(title).toBe("Lozad.js: Highly performant lazy loader");
  });

  test(
    "lazyloaded picture tags should have an <img> injected, with correct src",
    async () => {
      await page.goto(LOZAD_DEMO_URL);

      await scrollUpAndDown(page);

      await page.waitForSelector("#pictures"); //?

      const pictureImgsCurrentSrc = await page.$$eval(
        ".lozad-picture img",
        imgs => imgs.map(e => e.currentSrc)
      );

      // test if we have 3 <img> tags injected after scroll
      expect(pictureImgsCurrentSrc.length).toBe(3);

      // test if currentSrc attributes on imgs are relevant
      expect(pictureImgsCurrentSrc).toEqual(LARGE_PICTURE_URLS);
    },
    16000
  );
});
