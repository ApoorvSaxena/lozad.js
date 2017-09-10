const assert = require('assert');
const lozad = require('../dist/lozad.js');
require('jsdom-global')()

describe('lozad', function() {
  describe('#lozad', function() {
    it('should be a function', function() {
      assert.equal('function', typeof lozad);
    });
  });

  describe('#lozad return value', function() {
    it('should be an object', function() {
    	const observer = lozad();
    	assert.equal('object', typeof observer);
    });

    it('should expose observe API', function() {
    	const observer = lozad();
    	assert.equal('function', typeof observer.observe);
    });
  });

  describe('images inside viewport without class lozad', function() {
    beforeEach(function(){
      document.body.innerHTML = "";
      const image = document.createElement('img');
      image.dataset.src = 'test-src';
      document.body.appendChild(image);
    })

    it('should not load image', function() {
      const observer = lozad();
      observer.observe();
      const image = document.getElementsByTagName('img')[0];
      assert.equal(undefined, image.dataset.loaded);
    });
  });

  describe('images inside viewport with class lozad', function() {
  	beforeEach(function(){
      document.body.innerHTML = "";
	    const image = document.createElement('img');
      image.dataset.src = 'test-src';
      image.setAttribute('class', 'lozad');
      document.body.appendChild(image);
	  })

    it('should not load an image till observe function is called', function() {
    	const observer = lozad();
      const image = document.getElementsByTagName('img')[0];
      assert.equal(undefined, image.dataset.loaded);
    });

    it('should load an image after observe function is called', function() {
      const observer = lozad();
      const image = document.getElementsByTagName('img')[0];
      observer.observe();
      assert.equal('true', image.dataset.loaded);
      assert.equal(image.getAttribute('src'), image.dataset.src);
    });
  });
});