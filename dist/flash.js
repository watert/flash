/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var ajax = __webpack_require__(1);
	// console.log("ajax",ajax)
	var View = __webpack_require__(2);
	
	var template = View.template;
	var escape = View.escape;
	
	module.exports = window.Flash = { ajax: ajax, View: View, template: template, escape: escape };

/***/ },
/* 1 */
/***/ function(module, exports) {

	var slice = [].slice;
	
	(function() {
	  var ajax = function(
	      m, // method - get, post, whatever
	      u, // url
	      d, // [post_data]
	      c, // [callback] if passed -> asych call
	      x
	    ){
	        with(x=new XMLHttpRequest)
	            return onreadystatechange=function(){ // filter only readyState=4 events
	                readyState^4||c.bind(this)(this.responseText) // if callback passed and readyState == 4 than trigger Callback with xhr object
	            },
	            open(m,u,c), // open connection with Method and Url and asyCh flag
	            send(d), // send Data
	            x
	    };
	  ajax.get = function() {
	    return ajax.apply(null, ["GET"].concat(slice.call(arguments)));
	  };
	  ajax.post = function() {
	    return ajax.apply(null, ["POST"].concat(slice.call(arguments)));
	  };
	  return module.exports = ajax;
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var slice = [].slice,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	(function() {
	  var NativeView, View, _extend, delegateEventSplitter, tmpl;
	  _extend = function() {
	    var k, o, obj, objs;
	    obj = arguments[0], objs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	    while (o = objs.shift()) {
	      for (k in o) {
	        obj[k] = o[k];
	      }
	    }
	    return obj;
	  };
	  delegateEventSplitter = /^(\S+)\s*(.*)$/;
	  View = (function() {
	    function View(options) {
	      if (options == null) {
	        options = {};
	      }
	      this.el = options.el;
	      this.delegateEvents(this.events || {});
	      if (typeof this.initialize === "function") {
	        this.initialize();
	      }
	    }
	
	    View.prototype.remove = function() {
	      this.undelegateEvents();
	      return this.el.parentNode.removeChild(this.el);
	    };
	
	    View.prototype.$ = function(selector) {
	      return this.el.querySelectorAll(selector);
	    };
	
	    View.prototype.delegateEvents = function(events) {
	          if (!events) return this;
	          this.undelegateEvents();
	          for (var key in events) {
	            var method = events[key];
	            if (!typeof(method)=="function") method = this[method];
	            if (!method) continue;
	            var match = key.match(delegateEventSplitter);
	            this.delegate(match[1], match[2], method.bind(this));
	          }
	          return this;
	        };
	
	    View.prototype.undelegateEvents = function() {
	          if (this.$el) this.$el.off('.delegateEvents' + this.cid);
	          return this;
	        };
	
	    return View;
	
	  })();
	  View.extend = function(props, statics) {
	    var NewClass;
	    NewClass = (function(superClass) {
	      extend(NewClass, superClass);
	
	      function NewClass() {
	        return NewClass.__super__.constructor.apply(this, arguments);
	      }
	
	      return NewClass;
	
	    })(this);
	    _extend(NewClass.prototype, props);
	    _extend(NewClass, statics);
	    return NewClass;
	  };
	  View.template = tmpl = __webpack_require__(3);
	  View.escape = tmpl.escape;
	  NativeView = __webpack_require__(4)({
	    View: View
	  });
	  return module.exports = NativeView;
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

	// based on JR's micro template http://ejohn.org/blog/javascript-micro-templating/
	'use strict';
	
	module.exports = (function () {
	  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\x22': '&#x22;', '\x27': '&#x27;' };
	  var ctx = {};
	  ctx.escape = function (string) {
	    return ('' + string).replace(/[&<>\'\"]/g, function (_) {
	      return map[_];
	    });
	  };
	
	  var cache = {};
	
	  ctx.tmpl = function tmpl(str, data) {
	    // Figure out if we're getting a template, or if we need to
	    // load the template - and be sure to cache the result.
	    var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :
	
	    // Generate a reusable function that will serve as a template
	    // generator (and which will be cached).
	    new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
	
	    // Introduce the data as local variables using with(){}
	    "with(obj){p.push('" +
	
	    // Convert the template into pure JavaScript
	    str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").replace(/\t-(.*?)%>/g, "',this.escape($1),'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
	
	    fn = fn.bind(ctx);
	    // Provide some basic currying to the user
	    return data ? fn(data) : fn;
	  };
	  ctx.tmpl.escape = ctx.escape;
	  return ctx.tmpl;
	})();

/***/ },
/* 4 */
/***/ function(module, exports) {

	//
	// forked from [Backbone.NativeView](https://github.com/akre54/Backbone.NativeView)
	
	'use strict';
	
	module.exports = function (Backbone) {
	  // Cached regex to match an opening '<' of an HTML tag, possibly left-padded
	  // with whitespace.
	  var paddedLt = /^\s*</;
	
	  // Caches a local reference to `Element.prototype` for faster access.
	  var ElementProto = typeof Element !== 'undefined' && Element.prototype || {};
	
	  // Cross-browser event listener shims
	  var elementAddEventListener = ElementProto.addEventListener || function (eventName, listener) {
	    return this.attachEvent('on' + eventName, listener);
	  };
	  var elementRemoveEventListener = ElementProto.removeEventListener || function (eventName, listener) {
	    return this.detachEvent('on' + eventName, listener);
	  };
	
	  var indexOf = function indexOf(array, item) {
	    for (var i = 0, len = array.length; i < len; i++) if (array[i] === item) return i;
	    return -1;
	  };
	
	  // Find the right `Element#matches` for IE>=9 and modern browsers.
	  var matchesSelector = ElementProto.matches || ElementProto.webkitMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.msMatchesSelector || ElementProto.oMatchesSelector ||
	  // Make our own `Element#matches` for IE8
	  function (selector) {
	    // Use querySelectorAll to find all elements matching the selector,
	    // then check if the given element is included in that list.
	    // Executing the query on the parentNode reduces the resulting nodeList,
	    // (document doesn't have a parentNode).
	    var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
	    return ~indexOf(nodeList, this);
	  };
	
	  // Cache Backbone.View for later access in constructor
	  var BBView = Backbone.View;
	
	  // To extend an existing view to use native methods, extend the View prototype
	  // with the mixin: _.extend(MyView.prototype, Backbone.NativeViewMixin);
	  Backbone.NativeViewMixin = {
	
	    _domEvents: null,
	
	    constructor: function constructor() {
	      this._domEvents = [];
	      return BBView.apply(this, arguments);
	    },
	
	    $: function $(selector) {
	      return this.el.querySelectorAll(selector);
	    },
	
	    _removeElement: function _removeElement() {
	      this.undelegateEvents();
	      if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
	    },
	
	    // Apply the `element` to the view. `element` can be a CSS selector,
	    // a string of HTML, or an Element node. If passed a NodeList or CSS
	    // selector, uses just the first match.
	    _setElement: function _setElement(element) {
	      if (typeof element == 'string') {
	        if (paddedLt.test(element)) {
	          var el = document.createElement('div');
	          el.innerHTML = element;
	          this.el = el.firstChild;
	        } else {
	          this.el = document.querySelector(element);
	        }
	      } else if (element && element.length) {
	        this.el = element[0];
	      } else {
	        this.el = element;
	      }
	    },
	
	    // Set a hash of attributes to the view's `el`. We use the "prop" version
	    // if available, falling back to `setAttribute` for the catch-all.
	    _setAttributes: function _setAttributes(attrs) {
	      for (var attr in attrs) {
	        attr in this.el ? this.el[attr] = attrs[attr] : this.el.setAttribute(attr, attrs[attr]);
	      }
	    },
	
	    // Make a event delegation handler for the given `eventName` and `selector`
	    // and attach it to `this.el`.
	    // If selector is empty, the listener will be bound to `this.el`. If not, a
	    // new handler that will recursively traverse up the event target's DOM
	    // hierarchy looking for a node that matches the selector. If one is found,
	    // the event's `delegateTarget` property is set to it and the return the
	    // result of calling bound `listener` with the parameters given to the
	    // handler.
	    delegate: function delegate(eventName, selector, listener) {
	      if (typeof selector === 'function') {
	        listener = selector;
	        selector = null;
	      }
	
	      var root = this.el;
	      var handler = selector ? function (e) {
	        var node = e.target || e.srcElement;
	        for (; node && node != root; node = node.parentNode) {
	          if (matchesSelector.call(node, selector)) {
	            e.delegateTarget = node;
	            listener(e);
	          }
	        }
	      } : listener;
	
	      elementAddEventListener.call(this.el, eventName, handler, false);
	      this._domEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });
	      return handler;
	    },
	
	    // Remove a single delegated event. Either `eventName` or `selector` must
	    // be included, `selector` and `listener` are optional.
	    undelegate: function undelegate(eventName, selector, listener) {
	      if (typeof selector === 'function') {
	        listener = selector;
	        selector = null;
	      }
	
	      if (this.el) {
	        var handlers = this._domEvents.slice();
	        var i = handlers.length;
	        while (i--) {
	          var item = handlers[i];
	
	          var match = item.eventName === eventName && (listener ? item.listener === listener : true) && (selector ? item.selector === selector : true);
	
	          if (!match) continue;
	
	          elementRemoveEventListener.call(this.el, item.eventName, item.handler, false);
	          this._domEvents.splice(i, 1);
	        }
	      }
	      return this;
	    },
	
	    // Remove all events created with `delegate` from `el`
	    undelegateEvents: function undelegateEvents() {
	      if (this.el) {
	        for (var i = 0, len = this._domEvents.length; i < len; i++) {
	          var item = this._domEvents[i];
	          elementRemoveEventListener.call(this.el, item.eventName, item.handler, false);
	        };
	        this._domEvents.length = 0;
	      }
	      return this;
	    }
	  };
	
	  Backbone.NativeView = Backbone.View.extend(Backbone.NativeViewMixin);
	
	  return Backbone.NativeView;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=flash.js.map