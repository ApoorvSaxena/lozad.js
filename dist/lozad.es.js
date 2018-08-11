/*! lozad.js - v1.6.0 - 2018-08-11
* https://github.com/ApoorvSaxena/lozad.js
* Copyright (c) 2018 Apoorv Saxena; Licensed MIT */


/**
 * Detect IE browser
 * @const {boolean}
 * @private
 */
const isIE = typeof document !== 'undefined' && document.documentMode;

const defaultConfig = {
  rootMargin: '0px',
  threshold: 0,
  load(element) {
    if (element.nodeName.toLowerCase() === 'picture') {
      const img = document.createElement('img');
      if (isIE && element.getAttribute('data-iesrc')) {
        img.src = element.getAttribute('data-iesrc');
      }
      if (element.getAttribute('data-alt')) {
        img.alt = element.getAttribute('data-alt');
      }
      element.appendChild(img);
    }
    if (element.getAttribute('data-src')) {
      element.src = element.getAttribute('data-src');
    }
    if (element.getAttribute('data-srcset')) {
      element.srcset = element.getAttribute('data-srcset');
    }
    if (element.getAttribute('data-background-image')) {
      element.style.backgroundImage = `url('${element.getAttribute('data-background-image')}')`;
    }
    if (element.getAttribute('data-toggle-class')) {
      element.classList.toggle(element.getAttribute('data-toggle-class'));
    }
  },
  loaded() {}
};

function markAsLoaded(element) {
  element.setAttribute('data-loaded', true);
}

const isLoaded = element => element.getAttribute('data-loaded') === 'true';

const onIntersection = (load, loaded) => (entries, observer) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      observer.unobserve(entry.target);

      if (!isLoaded(entry.target)) {
        load(entry.target);
        markAsLoaded(entry.target);
        loaded(entry.target);
      }
    }
  });
};

const getElements = selector => {
  if (selector instanceof Element) {
    return [selector]
  }
  if (selector instanceof NodeList) {
    return selector
  }
  return document.querySelectorAll(selector)
};

function lozad (selector = '.lozad', options = {}) {
  const {root, rootMargin, threshold, load, loaded} = {...defaultConfig, ...options};
  let observer;

  if (window.IntersectionObserver) {
    observer = new IntersectionObserver(onIntersection(load, loaded), {
      root,
      rootMargin,
      threshold
    });
  }

  return {
    observe() {
      const elements = getElements(selector);

      for (let i = 0; i < elements.length; i++) {
        if (isLoaded(elements[i])) {
          continue
        }
        if (observer) {
          observer.observe(elements[i]);
          continue
        }
        load(elements[i]);
        markAsLoaded(elements[i]);
        loaded(elements[i]);
      }
    },
    triggerLoad(element) {
      if (isLoaded(element)) {
        return
      }

      load(element);
      markAsLoaded(element);
      loaded(element);
    }
  }
}

export default lozad;
