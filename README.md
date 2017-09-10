# Lozad.js [![npm version](https://badge.fury.io/js/lozad.svg)](https://badge.fury.io/js/lozad) [![Build Status](https://travis-ci.org/ApoorvSaxena/lozad.js.svg?branch=travis-integration)](https://travis-ci.org/ApoorvSaxena/lozad.js)

> Highly performant, light ~0.5kb and configurable lazy loader in pure JS with no dependencies for images, iframes and more, using IntersectionObserver API

![lozad.js lazy loading javascript library](./banner/lozad-banner.png "lozad.js lazy loading javascript library")

**Lozad.js**:
- lazy loads elements performantly using pure JavaScript,
- is a light-weight library, *just **535 bytes*** minified & gzipped,
- has NO DEPENDENCIES :)
- allows lazy loading of dynamically added elements as well.

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

Get the library using one of the following ways:

1. **GitHub**

Full build

 - [unminified] : https://raw.githubusercontent.com/ApoorvSaxena/lozad.js/master/dist/lozad.js
 - [minified] : https://raw.githubusercontent.com/ApoorvSaxena/lozad.js/master/dist/lozad.min.js

2. **Yarn** : `yarn add lozad`

3. **Bower** : `bower install lozad`

3. **npm**: `npm install --save lozad`

4. **CDN**: [https://cdn.jsdelivr.net/npm/lozad](https://cdn.jsdelivr.net/npm/lozad)

Now include the library in the ``HEAD`` tag of your page:

```html
<script type="text/javascript" src="lozad.js"></script>
```
or

```html
<script type="text/javascript" src="lozad.min.js"></script>
```

**Note**: `lozad.js` supports AMD and commonJS module pattern out of the box.

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