/*! lozad.js - v1.16.0 - 2021-10-13
* https://github.com/ApoorvSaxena/lozad.js
* Copyright (c) 2021 Apoorv Saxena; Licensed MIT */


(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.lozad = factory());
}(this, (function () { 'use strict';

  /**
   * Detect IE browser
   * @const {boolean}
   * @private
   */
  var isIE = typeof document !== 'undefined' && document.documentMode;

  /**
   *
   * @param {string} type
   *
   */
  var support = function support(type) {
    return window && window[type];
  };

  var validAttribute = ['data-iesrc', 'data-alt', 'data-src', 'data-srcset', 'data-background-image', 'data-toggle-class'];

  var defaultConfig = {
    rootMargin: '0px',
    threshold: 0,
    checkKey: 'default',
    enableAutoReload: false,
    load: function load(element) {
      if (element.nodeName.toLowerCase() === 'picture') {
        var img = element.querySelector('img');
        var append = false;

        if (img === null) {
          img = document.createElement('img');
          append = true;
        }

        if (isIE && element.getAttribute('data-iesrc')) {
          img.src = element.getAttribute('data-iesrc');
        }

        if (element.getAttribute('data-alt')) {
          img.alt = element.getAttribute('data-alt');
        }

        if (append) {
          element.append(img);
        }
      }

      if (element.nodeName.toLowerCase() === 'video' && !element.getAttribute('data-src')) {
        if (element.children) {
          var childs = element.children;
          var childSrc = void 0;
          for (var i = 0; i <= childs.length - 1; i++) {
            childSrc = childs[i].getAttribute('data-src');
            if (childSrc) {
              childs[i].src = childSrc;
            }
          }

          element.load();
        }
      }

      if (element.getAttribute('data-poster')) {
        element.poster = element.getAttribute('data-poster');
      }

      if (element.getAttribute('data-src')) {
        element.src = element.getAttribute('data-src');
      }

      if (element.getAttribute('data-srcset')) {
        element.setAttribute('srcset', element.getAttribute('data-srcset'));
      }

      var backgroundImageDelimiter = ',';
      if (element.getAttribute('data-background-delimiter')) {
        backgroundImageDelimiter = element.getAttribute('data-background-delimiter');
      }

      if (element.getAttribute('data-background-image')) {
        element.style.backgroundImage = 'url(\'' + element.getAttribute('data-background-image').split(backgroundImageDelimiter).join('\'),url(\'') + '\')';
      } else if (element.getAttribute('data-background-image-set')) {
        var imageSetLinks = element.getAttribute('data-background-image-set').split(backgroundImageDelimiter);
        var firstUrlLink = imageSetLinks[0].substr(0, imageSetLinks[0].indexOf(' ')) || imageSetLinks[0]; // Substring before ... 1x
        firstUrlLink = firstUrlLink.indexOf('url(') === -1 ? 'url(' + firstUrlLink + ')' : firstUrlLink;
        if (imageSetLinks.length === 1) {
          element.style.backgroundImage = firstUrlLink;
        } else {
          element.setAttribute('style', (element.getAttribute('style') || '') + ('background-image: ' + firstUrlLink + '; background-image: -webkit-image-set(' + imageSetLinks + '); background-image: image-set(' + imageSetLinks + ')'));
        }
      }

      if (element.getAttribute('data-toggle-class')) {
        element.classList.toggle(element.getAttribute('data-toggle-class'));
      }
    },
    loaded: function loaded() {}
  };

  function getAttr(element) {
    return element.getAttribute('data-lozaded') || '';
  }

  function markAsLoaded(element, checkKey) {
    element.setAttribute('data-lozaded', (getAttr(element) + ' ' + checkKey).trim());
  }

  function preLoad(element) {
    if (element.getAttribute('data-placeholder-background')) {
      element.style.background = element.getAttribute('data-placeholder-background');
    }
  }

  function isLoaded(element, checkKey) {
    return -1 !== getAttr(element).indexOf(checkKey);
  }

  var onIntersection = function onIntersection(config) {
    return function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.intersectionRatio > 0 || entry.isIntersecting) {
          observer.unobserve(entry.target);

          if (!isLoaded(entry.target)) {
            config.load(entry.target);
            markAsLoaded(entry.target, config.checkKey);
            config.loaded(entry.target);
          }
        }
      });
    };
  };

  var onMutation = function onMutation(config) {
    return function (entries) {
      entries.forEach(function (entry) {
        if (isLoaded(entry.target, config.checkKey) && entry.type === 'attributes' && validAttribute.indexOf(entry.attributeName) > -1) {
          config.load(entry.target);
        }
      });
    };
  };

  var getElements = function getElements(selector) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    if (selector instanceof Element) {
      return [selector];
    }

    if (selector instanceof NodeList) {
      return selector;
    }

    return root.querySelectorAll(selector);
  };

  var checkKeyIncrement = 1;

  function lozad () {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.lozad';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // set auto-generated checkKey for custom `load` callback if checkKey is not specified
    if (options.load && !options.checkKey) {
      options.checkKey = 'loadfunc' + checkKeyIncrement++;
    }

    var config = Object.assign({}, defaultConfig, options);
    var observer = void 0;
    var mutationObserver = void 0;
    if (support('IntersectionObserver')) {
      observer = new IntersectionObserver(onIntersection(config), {
        root: config.root,
        rootMargin: config.rootMargin,
        threshold: config.threshold
      });
    }

    if (support('MutationObserver') && config.enableAutoReload) {
      mutationObserver = new MutationObserver(onMutation(config));
    }

    // do preLoad() only for default load callback
    if ('default' === config.checkKey) {
      var elements = getElements(selector, config.root);
      for (var i = 0; i < elements.length; i++) {
        preLoad(elements[i]);
      }
    }

    return {
      observe: function observe() {
        var elements = getElements(selector, config.root);

        for (var _i = 0; _i < elements.length; _i++) {
          if (isLoaded(elements[_i])) {
            continue;
          }

          if (observer) {
            if (mutationObserver && config.enableAutoReload) {
              mutationObserver.observe(elements[_i], { subtree: true, attributes: true, attributeFilter: validAttribute });
            }

            observer.observe(elements[_i]);
            continue;
          }

          config.load(elements[_i]);
          markAsLoaded(elements[_i], config.checkKey);
          config.loaded(elements[_i]);
        }
      },
      triggerLoad: function triggerLoad(element) {
        if (isLoaded(element)) {
          return;
        }

        config.load(element);
        markAsLoaded(element, config.checkKey);
        config.loaded(element);
      },

      observer: observer,
      mutationObserver: mutationObserver
    };
  }

  return lozad;

})));
