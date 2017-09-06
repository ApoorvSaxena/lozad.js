;(function() {

    function getElements() {
        return document.querySelectorAll(this.config.selector);
    }

    function loadAll() {
        const elements = getElements.call(this);
        elements.forEach(function (element) {
            if (!isLoaded(element)) {
                this.load(element);
                markAsLoaded(element);
            }
        }.bind(this));
    }

    function markAsLoaded(el) {
        el.dataset.loaded = true;
    }

    function onIntersection(entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 0) {
                this.observer.unobserve(entry.target);
                this.load(entry.target);
                markAsLoaded(entry.target);
            }
        }.bind(this));
    }

    function isLoaded(el) {
        return (el.dataset.loaded === "true");
    }

    function _Lozad(config) {
        this.config = config || {};
        this.config.selector = this.config.selector || '.lozad';
        this.config.rootMargin = this.config.rootMargin || '0px';
        this.config.threshold = this.config.threshold || 0;
        this.activate();
    }

    _Lozad.prototype.activate = function() {
        if (!window.IntersectionObserver) {
            loadAll.call(this);
        } else {
            if (this.observer) {
                this.observer.disconnect();
            }
            this.observer = new IntersectionObserver(onIntersection.bind(this), this.config);
            const elements = getElements.call(this);
            elements.forEach(function (element) {
                if (!isLoaded(element)) {
                    this.observer.observe(element);
                }
            }.bind(this));
        }
    };

    _Lozad.prototype.load = function(el) {
        el.src = el.dataset.src;
    };

    // open to the world.
    // commonjs
    if (typeof exports === 'object') {
        module.exports = _Lozad;
    }
    // AMD module
    else if (typeof define === 'function' && define.amd) {
        define('Lozad', function() {
            return _Lozad;
        });
    }
    // Browser global
    else {
        window.Lozad = _Lozad;
    }

})();