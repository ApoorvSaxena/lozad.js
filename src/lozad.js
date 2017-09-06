const defaultConfig = {
  rootMargin: '0px',
  threshold: 0,
  load(element) {
    element.src = element.dataset.src;
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

export default function(selector = '.lozad', options = {}) {
  const {rootMargin, threshold, load} = {...defaultConfig, ...options}

  const elements = [].filter.call(document.querySelectorAll(selector),
    element => !isLoaded(element))

  if (!window.IntersectionObserver) {
    elements
      .forEach(element => {
        load(element)
        markAsLoaded(element)
      })

    return
  }

  const observer = new IntersectionObserver(onIntersection(load), {
    rootMargin,
    threshold
  })

  elements.forEach(element => {
    observer.observe(element)
  })
}
