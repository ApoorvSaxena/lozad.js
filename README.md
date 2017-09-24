# Lozad.js [![npm version](https://badge.fury.io/js/lozad.svg)](https://badge.fury.io/js/lozad) [![Build Status](https://travis-ci.org/ApoorvSaxena/lozad.js.svg?branch=master)](https://travis-ci.org/ApoorvSaxena/lozad.js) [![](https://data.jsdelivr.com/v1/package/npm/lozad/badge)](https://www.jsdelivr.com/package/npm/lozad)

> Highly performant, light ~0.5kb and configurable lazy loader in pure JS with no dependencies for images, iframes and more, using IntersectionObserver API

![lozad.js lazy loading javascript library](./banner/lozad-banner.jpg "lozad.js lazy loading javascript library")

**Lozad.js**:
- lazy loads elements performantly using pure JavaScript,
- is a light-weight library, *just **535 bytes*** minified & gzipped,
- has NO DEPENDENCIES :)
- allows lazy loading of dynamically added elements as well,
- supports responsive images and background images

It is written with an aim to lazy load images, iframes, ads, videos or any other element using the recently added [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) with tremendous performance benefits.

## Table of Contents

- [Demo](https://apoorv.pro/lozad.js/demo/)
- [Background](#yet-another-lazy-loading-javascript-library-why)
- [Install](#install)
- [Usage](#usage)
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

# Alternatively you can use Yarn.
$ yarn add lozad

# Another option is to use Bower.
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
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/lozad/dist/lozad.js"></script>
```
or

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
        // e.g. el.src = el.dataset.src;
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


## Browser Support

Available in [latest browsers](http://caniuse.com/#feat=intersectionobserver). If browser support is not available, then make use of this [polyfill](https://www.npmjs.com/package/intersection-observer).

## FAQs

Checkout the [FAQ Wiki](https://github.com/ApoorvSaxena/lozad.js/wiki/Frequently-Asked-Questions) for some common gotchas to be aware of while using **lozad.js**

## Contribute

Interested in contributing features and fixes?

[Read more on contributing](./CONTRIBUTING.md).

## Changelog

See the [Changelog](https://github.com/ApoorvSaxena/lozad.js/wiki/Changelog)

## License

[MIT](LICENSE) © [Apoorv Saxena](https://apoorv.pro)
