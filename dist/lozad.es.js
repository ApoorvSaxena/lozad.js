/*! lozad.js - v1.16.0 - 2020-09-06
* https://github.com/ApoorvSaxena/lozad.js
* Copyright (c) 2020 Apoorv Saxena; Licensed MIT */


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
      let img = element.querySelector('img');
      let append = false;

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
        const childs = element.children;
        let childSrc;
        for (let i = 0; i <= childs.length - 1; i++) {
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

    let backgroundImageDelimiter = ',';
    if (element.getAttribute('data-background-delimiter')) {
      backgroundImageDelimiter = element.getAttribute('data-background-delimiter');
    }

    if (element.getAttribute('data-background-image')) {
      element.style.backgroundImage = `url('${element.getAttribute('data-background-image').split(backgroundImageDelimiter).join('\'),url(\'')}')`;
    } else if (element.getAttribute('data-background-image-set')) {
      const imageSetLinks = element.getAttribute('data-background-image-set').split(backgroundImageDelimiter);
      let firstUrlLink = (imageSetLinks[0].substr(0, imageSetLinks[0].indexOf(' ')) || imageSetLinks[0]); // Substring before ... 1x
      firstUrlLink = firstUrlLink.indexOf('url(') === -1 ? `url(${firstUrlLink})` : firstUrlLink;
      if (imageSetLinks.length === 1) {
        element.style.backgroundImage = firstUrlLink;
      } else {
        element.setAttribute('style', (element.getAttribute('style') || '') + `background-image: ${firstUrlLink}; background-image: -webkit-image-set(${imageSetLinks}); background-image: image-set(${imageSetLinks})`);
      }
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

function preLoad(element) {
  if (element.getAttribute('data-placeholder-background')) {
    element.style.background = element.getAttribute('data-placeholder-background');
  }
}

const isLoaded = element => element.getAttribute('data-loaded') === 'true';

const onIntersection = (load, loaded) => (entries, observer) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0 || entry.isIntersecting) {
      observer.unobserve(entry.target);

      if (!isLoaded(entry.target)) {
        load(entry.target);
        markAsLoaded(entry.target);
        loaded(entry.target);
      }
    }
  });
};

const getElements = (selector, root = document) => {
  if (selector instanceof Element) {
    return [selector]
  }

  if (selector instanceof NodeList) {
    return selector
  }

  return root.querySelectorAll(selector)
};

function lozad (selector = '.lozad', options = {}) {
  const {root, rootMargin, threshold, load, loaded} = Object.assign({}, defaultConfig, options);
  let observer;

  if (typeof window !== 'undefined' && window.IntersectionObserver) {
    observer = new IntersectionObserver(onIntersection(load, loaded), {
      root,
      rootMargin,
      threshold
    });
  }

  const elements = getElements(selector, root);
  for (let i = 0; i < elements.length; i++) {
    preLoad(elements[i]);
  }

  return {
    observe() {
      const elements = getElements(selector, root);

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
    },
    observer
  }
}

export default lozad;
