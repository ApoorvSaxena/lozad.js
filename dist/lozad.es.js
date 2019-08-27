/*! lozad.js - v1.10.0 - 2019-08-27
* https://github.com/ApoorvSaxena/lozad.js
* Copyright (c) 2019 Apoorv Saxena; Licensed MIT */


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
  load(element) {
    if (element.nodeName.toLowerCase() === 'picture') {
      const img = document.createElement('img');
      if (isIE && element.getAttribute('data-iesrc')) {
        img.src = element.getAttribute('data-iesrc');
      }

      if (element.getAttribute('data-alt')) {
        img.alt = element.getAttribute('data-alt');
      }

      element.append(img);
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

    if (element.getAttribute('data-src')) {
      element.src = element.getAttribute('data-src');
    }

    if (element.getAttribute('data-srcset')) {
      element.setAttribute('srcset', element.getAttribute('data-srcset'));
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

const onMutation = load => entries => {
  entries.forEach(entry => {
    if (isLoaded(entry.target) && entry.type === 'attributes' && validAttribute.indexOf(entry.attributeName) > -1) {
      load(entry.target);
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
  let mutationObserver;
  if (support('IntersectionObserver')) {
    observer = new IntersectionObserver(onIntersection(load, loaded), {
      root,
      rootMargin,
      threshold
    });
  }

  if (support('MutationObserver')) {
    mutationObserver = new MutationObserver(onMutation(load, loaded));
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

        if (mutationObserver) {
          mutationObserver.observe(elements[i], {subtree: true, attributes: true, attributeFilter: validAttribute});
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
    observer,
    mutationObserver
  }
}

export default lozad;
