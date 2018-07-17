require('jsdom-global')()
const assert = require('assert')
const lozad = require('../dist/lozad.js')

describe('lozad', () => {
  describe('#lozad', () => {
    it('should be a function', () => {
      assert.equal('function', typeof lozad)
    })
  })

  describe('#lozad return value', () => {
    it('should be an object', () => {
      const observer = lozad()
      assert.equal('object', typeof observer)
    })

    it('should expose observe API', () => {
      const observer = lozad()
      assert.equal('function', typeof observer.observe)
    })
  })

  describe('images inside viewport without class lozad', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should not load image', () => {
      const observer = lozad()
      observer.observe()
      const image = document.getElementsByTagName('img')[0]
      assert.equal(undefined, image.dataset.loaded)
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
      document.body.appendChild(image)
    })

    it('should not load an image till observe function is called', () => {
      lozad()
      const image = document.getElementsByTagName('img')[0]
      assert.equal(undefined, image.dataset.loaded)
    })

    it('should load an image after observe function is called', () => {
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
    })
  })

  describe('images inside viewport with different class', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should load the image', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', className)
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
    })
  })

  describe('images inside viewport using a DOM `Element` reference', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should load the image', () => {
      const node = document.querySelector('img')
      const observer = lozad(node)
      observer.observe()
      assert.equal('true', node.dataset.loaded)
      assert.equal(node.getAttribute('src'), node.dataset.src)
    })
  })

  describe('images inside viewport using a DOM `NodeList` reference', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
      const imageTwo = document.createElement('img')
      imageTwo.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(imageTwo)
    })

    it('should load the images', () => {
      const nodes = document.querySelectorAll('img')
      const observer = lozad(nodes)
      observer.observe()
      assert.equal(nodes.length, 2)
      nodes.forEach(node => {
        assert.equal('true', node.dataset.loaded)
        assert.equal(node.getAttribute('src'), node.dataset.src)
      })
    })
  })

  describe('images inside viewport with different attributes', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      document.body.appendChild(image)
    })

    it('should load the image with data-srcset attribute', () => {
      const dataSrcSetAttr = 'test-srcset'
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-srcset', dataSrcSetAttr)
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('srcset'), dataSrcSetAttr)
    })

    it('should load the image with data-background-image attribute', () => {
      const bgImageAttr = 'test-bg-image'
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-background-image', bgImageAttr)
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.style.backgroundImage, 'url(' + bgImageAttr + ')')
    })
  })

  describe('when passing options', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should not load elements by default when custom load option is passed in', () => {
      const observer = lozad('.lozad', {
        load(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.equal(true, image.classList.contains('loaded'))
      assert.equal(null, image.getAttribute('src'))
    })

    it('should run loaded option after loading an element', () => {
      const observer = lozad('.lozad', {
        loaded(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.equal(true, image.classList.contains('loaded'))
    })

    it('should set data attribute when loaded option is passed in', () => {
      const observer = lozad('.lozad', {
        loaded(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.equal(true, image.classList.contains('loaded'))
      assert.equal('true', image.dataset.loaded)
    })
  })

  describe('public API functions', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should load image via triggerLoad function', () => {
      const dataSrcSetAttr = 'test-srcset'
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-srcset', dataSrcSetAttr)
      observer.triggerLoad(image)
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
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
      picture.appendChild(source)
      document.body.appendChild(picture)
    })

    it('should load the picture', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const picture = document.getElementsByTagName('picture')[0]
      picture.setAttribute('class', className)
      observer.observe()
      assert.equal('true', picture.dataset.loaded)
    })

    it('should append image after last source', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const picture = document.getElementsByTagName('picture')[0]
      picture.setAttribute('class', className)
      observer.observe()

      const img = picture.children[1]
      assert.equal('IMG', img.tagName)
    })

    it('should add alt attribute to image', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const picture = document.getElementsByTagName('picture')[0]
      picture.setAttribute('class', className)
      observer.observe()

      const img = picture.children[1]
      assert.equal('alt text', img.getAttribute('alt'))
    })
  })

  describe('toggle class', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const el = document.createElement('div')
      el.dataset.toggleClass = 'test'
      el.setAttribute('class', 'lozad')
      document.body.appendChild(el)
    })

    it('should not toggle till observe function is called', () => {
      lozad()
      const el = document.getElementsByTagName('div')[0]
      assert.equal(false, el.classList.contains('test'))
    })

    it('should toggle after observe function is called', () => {
      const observer = lozad()
      const el = document.getElementsByTagName('div')[0]
      observer.observe()
      assert.equal(true, el.classList.contains('test'))
    })
  })
})
