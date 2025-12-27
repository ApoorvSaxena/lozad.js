/*! lozad.js - v1.16.0 - 2021-10-13
* https://github.com/ApoorvSaxena/lozad.js
* Copyright (c) 2021 Apoorv Saxena; Licensed MIT */


/**
 * Detect IE browser
 * @const {boolean}
 * @private
 */
const isIE = typeof document !== 'undefined' && document.documentMode;

/**
 *
 * @param {string} type
 *
 */
const support = type => window && window[type];

const validAttribute = ['data-iesrc', 'data-alt', 'data-src', 'data-srcset', 'data-background-image', 'data-toggle-class'];

const defaultConfig = {
  rootMargin: '0px',
  threshold: 0,
  checkKey: 'default',
  enableAutoReload: false,
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

function getAttr (element) {
  return element.getAttribute('data-lozaded') || ''
}

function markAsLoaded (element, checkKey) {
  element.setAttribute('data-lozaded', `${getAttr(element)} ${checkKey}`.trim());
}

function preLoad(element) {
  if (element.getAttribute('data-placeholder-background')) {
    element.style.background = element.getAttribute('data-placeholder-background');
  }
}

function isLoaded (element, checkKey) {
  return -1 !== getAttr(element).indexOf(checkKey)
}

const onIntersection = (config) => (entries, observer) => {
  entries.forEach(entry => {
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

const onMutation = config => entries => {
  entries.forEach(entry => {
    if (isLoaded(entry.target, config.checkKey) && entry.type === 'attributes' && validAttribute.indexOf(entry.attributeName) > -1) {
      config.load(entry.target);
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

let checkKeyIncrement = 1;

function lozad (selector = '.lozad', options = {}) {
  // set auto-generated checkKey for custom `load` callback if checkKey is not specified
  if( options.load && ! options.checkKey ){
    options.checkKey = `loadfunc${ checkKeyIncrement++ }`;
  }

  let config = Object.assign({}, defaultConfig, options);
  let observer;
  let mutationObserver;
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
  if( 'default' === config.checkKey ){
    const elements = getElements(selector, config.root);
    for (let i = 0; i < elements.length; i++) {
      preLoad(elements[i]);
    }
  }

  return {
    observe() {
      const elements = getElements(selector, config.root);

      for (let i = 0; i < elements.length; i++) {
        if (isLoaded(elements[i])) {
          continue
        }

        if (observer) {
          if (mutationObserver && config.enableAutoReload) {
            mutationObserver.observe(elements[i], {subtree: true, attributes: true, attributeFilter: validAttribute});
          }

          observer.observe(elements[i]);
          continue
        }

        config.load(elements[i]);
        markAsLoaded(elements[i], config.checkKey);
        config.loaded(elements[i]);
      }
    },
    triggerLoad(element) {
      if (isLoaded(element)) {
        return
      }

      config.load(element);
      markAsLoaded(element, config.checkKey);
      config.loaded(element);
    },
    observer,
    mutationObserver
  }
}

export default lozad;
