# Lozad.js [![npm version](https://badge.fury.io/js/lozad.svg)](https://badge.fury.io/js/lozad) [![Build Status](https://travis-ci.org/ApoorvSaxena/lozad.js.svg?branch=master)](https://travis-ci.org/ApoorvSaxena/lozad.js) [![](https://data.jsdelivr.com/v1/package/npm/lozad/badge)](https://www.jsdelivr.com/package/npm/lozad)

> Highly performant, light and configurable lazy loader in pure JS with no dependencies for images, iframes and more, using IntersectionObserver API

![lozad.js lazy loading javascript library](./banner/lozad-banner.jpg "lozad.js lazy loading javascript library")

**Lozad.js**:
- lazy loads elements performantly using pure JavaScript,
- is a light-weight library, just [![](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/lozad?compression=gzip)](https://cdn.jsdelivr.net/npm/lozad) minified & gzipped,
- has NO DEPENDENCIES :)
- allows lazy loading of dynamically added elements as well,
- supports <img>, <picture>, iframes, videos, audios, responsive images, background images etc.

It is written with an aim to lazy load images, iframes, ads, videos or any other element using the recently added [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) with tremendous performance benefits.

##### Featured in:
- [Web | Google Developers](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/)
- [Product Hunt](https://www.producthunt.com/posts/lozad-js)
- [Reddit](https://www.reddit.com/r/webdev/comments/6zg1x0/highly_performant_light_05kb_and_configurable/)
- [CSS Tricks](https://css-tricks.com/lozad-js-performant-lazy-loading-images)
- [David Walsh](https://twitter.com/davidwalshblog/status/915319510646829061)
- [Codrops](https://twitter.com/Apoorv_Saxena/status/906586828265758720)

## Table of Contents

- [Demo](https://apoorv.pro/lozad.js/demo/)
- [Background](#yet-another-lazy-loading-javascript-library-why)
- [Install](#install)
- [Usage](#usage)
- [Example with picture tag](#example-with-picture-tag)
- [Browser Support](#browser-support)
- [FAQs](#faqs)
- [Contribute](#contribute)
- [Changelog](#changelog)
- [License](#license)

## Yet another Lazy Loading JavaScript library, why?
Existing lazy loading libraries hook up to the scroll event or use a periodic timer and call `getBoundingClientRect()` on elements that need to be lazy loaded. This approach, however, is painfully slow as each call to `getBoundingClientRect()` forces the browser to re-layout the entire page and will introduce considerable jank to your website.

Making this more efficient and performant is what [IntersectionObserver](https://developers.google.com/web/updates/2016/04/intersectionobserver) is designed for, and it’s landed in Chrome 51. IntersectionObservers let you know when an observed element enters or exits the browser’s viewport.

## Install

```sh
# You can install lozad with npm
$ npm install --save lozad

# Alternatively you can use Yarn
$ yarn add lozad

# Another option is to use Bower
$ bower install lozad
```

Then with a module bundler like rollup or webpack, use as you would anything else:

```javascript
// using ES6 modules
import lozad from 'lozad'

// using CommonJS modules
var lozad = require('lozad')
```

Or load via **CDN** and include in the `head` tag of your page.

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js"></script>
```

When loading from CDN, you can find the library on `window.lozad`.

## Usage

In HTML, add an identifier to the element (default selector identified is `lozad` class):
```html
<img class="lozad" data-src="image.png" />
```

All you need to do now is just instantiate Lozad as follows:
```js
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();
```
or with a DOM `Element` reference:
```js
const el = document.querySelector('img');
const observer = lozad(el); // passing a `NodeList` (e.g. `document.querySelectorAll()`) is also valid
observer.observe();
```
or with custom options:
```js
const observer = lozad('.lozad', {
    rootMargin: '10px 0px', // syntax similar to that of CSS Margin
    threshold: 0.1 // ratio of element convergence
});
observer.observe();
```
Reference:

 - [IntersectionObserver options: rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)
 - [IntersectionObserver options: thresholds](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)

or if you want to give custom function definition to load element:
```js
lozad('.lozad', {
    load: function(el) {
        console.log('loading element');

        // Custom implementation to load an element
        // e.g. el.src = el.getAttribute('data-src');
    }
});
```

If you would like to extend the `loaded` state of elements, you can add the loaded option:

> **Note**: The `"data-loaded"="true"` attribute is used by lozad to determine if an element has been previously loaded.
```js
lozad('.lozad', {
    loaded: function(el) {
        // Custom implementation on a loaded element
        el.classList.add('loaded');
    }
});
```

If you want to lazy load dynamically added elements:

```js
const observer = lozad();
observer.observe();

// ... code to dynamically add elements
observer.observe(); // observes newly added elements as well
```

for use with responsive images

```html
<!-- responsive image example -->
<img class="lozad" data-src="image.png" data-srcset="image.png 1000w, image-2x.png 2000w" />
```

for use with background images
```html
<!-- background image example -->
<div class="lozad" data-background-image="image.png">
</div>
```

If you want to load the images before they appear:

```js
const observer = lozad();
observer.observe();

const coolImage = document.querySelector('.image-to-load-first')
// ... trigger the load of a image before it appears on the viewport
observer.triggerLoad(coolImage);
```

## Example with picture tag

Create _a broken_ picture element structure.

> IE browser don't support picture tag!
> You need to set `data-iesrc` attribute (only for your picture tags) with source for IE browser

> `data-alt` attribute can be added to picture tag for use in `alt` attribute of lazy-loaded images

```html
<!-- For an element to be caught, add a block type that is different from the inline and some min-height for correct caught into view -->
<picture class="lozad" style="display: block; min-height: 1rem" data-iesrc="images/thumbs/04.jpg" data-alt="">
    <source srcset="images/thumbs/04.jpg" media="(min-width: 1280px)">
    <source srcset="images/thumbs/05.jpg" media="(min-width: 980px)">
    <source srcset="images/thumbs/06.jpg" media="(min-width: 320px)">
    <!-- NO img element -->
    <!-- instead of img element, there will be the last source with the minimum dimensions -->
    <!-- for disabled JS you can set <noscript><img src="images/thumbs/04.jpg" alt=""></noscript> -->
</picture>
```

When _lozad_ loads this picture element, it will fix it.

## Example with iframe

```html
<iframe data-src="embed.html" class="lozad"></iframe>
```
That's all, just add the `lozad` class.

## Example toggling class

```html
<div data-toggle-class="active" class="lozad">
    <!-- content -->
</div>
```
The `active` class will be toggled on the element when it enters the browser’s viewport.

## Browser Support

Available in [latest browsers](http://caniuse.com/#feat=intersectionobserver). If browser support is not available, then make use of this [polyfill](https://www.npmjs.com/package/intersection-observer).

## FAQs

Checkout the [FAQ Wiki](https://github.com/ApoorvSaxena/lozad.js/wiki/Frequently-Asked-Questions) for some common gotchas to be aware of while using **lozad.js**

## More than 3000 sites are using Lozad.js, here's few of them:

* [gis.utah.gov](https://gis.utah.gov)
* [BNP PARIBAS](https://mabanque.bnpparibas/)
* [Reitmans](https://www.reitmans.com/)
* [Black Desert Online](https://www.blackdesertonline.com/)
* [Barkers](https://www.barkersonline.co.nz/)
* [Promoda](http://www.promoda.com.mx/)
* [Dormy Golf & Fashion AB](https://www.dormy.se/)
* [L'ovedbaby](https://www.lovedbaby.com/)
* [LitNet](https://litnet.com/)
* [CARD.com](https://www.card.com/)
* [Wittchen](https://www.wittchen.com/)
* [Fiege Group](https://www.fiege.com/)
* [Kolgot](https://kolgot.net/)
* [CYSM - Colombia y su Moda](https://cysm.com/)
* [Siege Media](https://www.siegemedia.com/)
* [Hi-Fi Class](https://www.hfc.com.pl/)
* [StagonNews](http://www.stagonnews.gr/)
* [Insurance Zebra](https://www.thezebra.com/)
* [Summoners Inn](https://www.summoners-inn.de/de/start)
* [Roots](https://roots.io/)
* [Chrdk](https://chrdk.ru/)
* [Giving Assistant](https://givingassistant.org/)
* [Just A Pinch Recipe Club](https://www.justapinch.com/)
* [am](https://www.am.com.mx/)
* [Admiral Markets](https://admiralmarkets.com/)
* [KickResume](https://www.kickresume.com/)
* [Paper Tiger](https://www.papertiger.com/)
* [Gmelius](https://gmelius.com/)
* [Dormy](https://www.dormy.se/)
* [Nabobil](https://nabobil.no/)
* [Atbox](https://atbox.io/)
* *[Add your site]* - See [Contributing section](./CONTRIBUTING.md)

## Support Lozad.js

Lozad.js is completely free and open-source. If you find it useful, you can show your support by starring it or sharing it in your social network or by simply letting me know how much you 💖 it by tweeting to [@Apoorv_Saxena](https://twitter.com/Apoorv_Saxena).

## Contribute

Interested in contributing features and fixes?

[Read more on contributing](./CONTRIBUTING.md).

## Changelog

See the [Changelog](https://github.com/ApoorvSaxena/lozad.js/wiki/Changelog)

## License

[MIT](LICENSE) © [Apoorv Saxena](https://apoorv.pro)
