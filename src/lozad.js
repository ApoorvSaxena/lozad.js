const defaultConfig = {
  rootMargin: '0px',
  threshold: 0,
  load(element) {
    element.src = element.dataset.src
  }
}

function markAsLoaded(element) {
  element.dataset.loaded = true
}

const isLoaded = element => element.dataset.loaded === 'true'

const onIntersection = load => (entries, observer) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      observer.unobserve(entry.target)
      load(entry.target)
      markAsLoaded(entry.target)
    }
  })
}

export default function (selector = '.lozad', options = {}) {
  const {rootMargin, threshold, load} = {...defaultConfig, ...options}
  let observer

  if (window.IntersectionObserver) {
    observer = new IntersectionObserver(onIntersection(load), {
      rootMargin,
      threshold
    })
  }

  return {
    observe() {
      const elements = document.querySelectorAll(selector)
      for (let i = 0; i < elements.length; i++) {
        if(!isLoaded(elements[i])) {
          if (observer) {
            observer.observe(elements[i])
          } else {
            load(elements[i])
            markAsLoaded(elements[i])
          }
        }
      }
    }
  }
}
