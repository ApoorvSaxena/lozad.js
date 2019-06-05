require('jsdom-global')()
const assert = require('assert')
const lozad = require('../dist/lozad.js')

describe('lozad', () => {
  describe('#lozad', () => {
    it('should be a function', () => {
      assert.strictEqual('function', typeof lozad)
    })
  })

  describe('#lozad return value', () => {
    it('should be an object', () => {
      const observer = lozad()
      assert.strictEqual('object', typeof observer)
    })

    it('should expose observe API', () => {
      const observer = lozad()
      assert.strictEqual('function', typeof observer.observe)
    })
  })

  describe('images inside viewport without class lozad', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.append(image)
    })

    it('should not load image', () => {
      const observer = lozad()
      observer.observe()
      const image = document.querySelectorAll('img')[0]
      assert.strictEqual(undefined, image.dataset.loaded)
    })
  })

  describe('images inside viewport with class lozad', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      image.setAttribute('class', 'lozad')
      document.body.append(image)
    })

    it('should not load an image till observe function is called', () => {
      lozad()
      const image = document.querySelectorAll('img')[0]
      assert.strictEqual(undefined, image.dataset.loaded)
    })

    it('should load an image after observe function is called', () => {
      const observer = lozad()
      const image = document.querySelectorAll('img')[0]
      observer.observe()
      assert.strictEqual('true', image.dataset.loaded)
      assert.strictEqual(image.getAttribute('src'), image.dataset.src)
    })
  })

  describe('images inside viewport with different class', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.append(image)
    })

    it('should load the image', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const image = document.querySelectorAll('img')[0]
      image.setAttribute('class', className)
      observer.observe()
      assert.strictEqual('true', image.dataset.loaded)
      assert.strictEqual(image.getAttribute('src'), image.dataset.src)
    })
  })

  describe('images inside viewport using a DOM `Element` reference', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.append(image)
    })

    it('should load the image', () => {
      const node = document.querySelector('img')
      const observer = lozad(node)
      observer.observe()
      assert.strictEqual('true', node.dataset.loaded)
      assert.strictEqual(node.getAttribute('src'), node.dataset.src)
    })
  })

  describe('images inside viewport using a DOM `NodeList` reference', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.append(image)
      const imageTwo = document.createElement('img')
      imageTwo.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.append(imageTwo)
    })

    it('should load the images', () => {
      const nodes = document.querySelectorAll('img')
      const observer = lozad(nodes)
      observer.observe()
      assert.strictEqual(nodes.length, 2)
      nodes.forEach(node => {
        assert.strictEqual('true', node.dataset.loaded)
        assert.strictEqual(node.getAttribute('src'), node.dataset.src)
      })
    })
  })

  describe('images inside viewport with different attributes', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      document.body.append(image)
    })

    it('should load the image with data-srcset attribute', () => {
      const dataSrcSetAttr = 'test-srcset'
      const observer = lozad()
      const image = document.querySelectorAll('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-srcset', dataSrcSetAttr)
      observer.observe()
      assert.strictEqual('true', image.dataset.loaded)
      assert.strictEqual(image.getAttribute('srcset'), dataSrcSetAttr)
    })

    it('should load the image with data-background-image attribute', () => {
      const bgImageAttr = 'test-bg-image'
      const observer = lozad()
      const image = document.querySelectorAll('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-background-image', bgImageAttr)
      observer.observe()
      assert.strictEqual('true', image.dataset.loaded)
      assert.strictEqual(
        image.style.backgroundImage,
        'url(' + bgImageAttr + ')'
      )
    })
  })

  describe('when passing options', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.append(image)
    })

    it('should not load elements by default when custom load option is passed in', () => {
      const observer = lozad('.lozad', {
        load(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.querySelectorAll('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.strictEqual(true, image.classList.contains('loaded'))
      assert.strictEqual(null, image.getAttribute('src'))
    })

    it('should run loaded option after loading an element', () => {
      const observer = lozad('.lozad', {
        loaded(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.querySelectorAll('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.strictEqual(true, image.classList.contains('loaded'))
    })

    it('should set data attribute when loaded option is passed in', () => {
      const observer = lozad('.lozad', {
        loaded(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.querySelectorAll('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.strictEqual(true, image.classList.contains('loaded'))
      assert.strictEqual('true', image.dataset.loaded)
    })
  })

  describe('public API functions', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.append(image)
    })

    it('should load image via triggerLoad function', () => {
      const dataSrcSetAttr = 'test-srcset'
      const observer = lozad()
      const image = document.querySelectorAll('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-srcset', dataSrcSetAttr)
      observer.triggerLoad(image)
      assert.strictEqual('true', image.dataset.loaded)
      assert.strictEqual(image.getAttribute('src'), image.dataset.src)
    })
  })

  describe('picture inside viewport with different class', () => {
    const src = Math.random()
      .toString(36)
      .substring(7)

    beforeEach(() => {
      document.body.innerHTML = ''
      const picture = document.createElement('picture')
      picture.setAttribute('data-alt', 'alt text')
      const source = document.createElement('source')
      source.setAttribute('srcset', src)
      picture.append(source)
      document.body.append(picture)
    })

    it('should load the picture', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const picture = document.querySelectorAll('picture')[0]
      picture.setAttribute('class', className)
      observer.observe()
      assert.strictEqual('true', picture.dataset.loaded)
    })

    it('should append image after last source', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const picture = document.querySelectorAll('picture')[0]
      picture.setAttribute('class', className)
      observer.observe()

      const img = picture.children[1]
      assert.strictEqual('IMG', img.tagName)
    })

    it('should add alt attribute to image', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const picture = document.querySelectorAll('picture')[0]
      picture.setAttribute('class', className)
      observer.observe()

      const img = picture.children[1]
      assert.strictEqual('alt text', img.getAttribute('alt'))
    })
  })

  describe('toggle class', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const el = document.createElement('div')
      el.dataset.toggleClass = 'test'
      el.setAttribute('class', 'lozad')
      document.body.append(el)
    })

    it('should not toggle till observe function is called', () => {
      lozad()
      const el = document.querySelectorAll('div')[0]
      assert.strictEqual(false, el.classList.contains('test'))
    })

    it('should toggle after observe function is called', () => {
      const observer = lozad()
      const el = document.querySelectorAll('div')[0]
      observer.observe()
      assert.strictEqual(true, el.classList.contains('test'))
    })
  })

  describe('exported IntersectionObserver', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const el = document.createElement('div')
      el.dataset.toggleClass = 'test'
      el.setAttribute('class', 'lozad')
      document.body.append(el)
    })

    it('should export the IntersectionObserver instance', () => {
      const observer = lozad()

      assert.strictEqual(true, Object.keys(observer).includes('observer'))
    })
  })
})
