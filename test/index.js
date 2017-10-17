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

  describe('different type of selectors', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      image.setAttribute('class', 'lozad')
      document.body.appendChild(image)
    })

    it('string selector should load all matching images', () => {
      const observer = lozad('.lozad')
      observer.observe()

      const image = document.getElementsByTagName('img')[0]
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
    })

    it('element selector should load the particular element image', () => {
      const element = document.getElementsByTagName('img')[0]
      const observer = lozad(element)
      observer.observe()

      const image = document.getElementsByTagName('img')[0]
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
    })

    it('invalid selector should throw an error', () => {
      let observer = lozad(['array'])
      assert.throws(
        observer.observe,
        Error
      )
    })
  })
})
