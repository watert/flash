# minimal backbone like view with events and template

do ->
    _extend = (obj,objs...)->
        while o = objs.shift()
            obj[k] = o[k] for k of o
        return obj

    delegateEventSplitter = /^(\S+)\s*(.*)$/

    class View
        constructor:(options={})->
            @el = options.el
            @delegateEvents(@events or {})
            # @$el = $(o.el)
            @initialize?()
        remove: ()->
            @undelegateEvents()
            @el.parentNode.removeChild(@el)
        $: (selector)->
            @el.querySelectorAll(selector)
        delegateEvents: `function(events) {
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
        }`
        undelegateEvents: `function() {
          if (this.$el) this.$el.off('.delegateEvents' + this.cid);
          return this;
        }`
    View.extend = (props,statics)->
        class NewClass extends @
        _extend NewClass.prototype,props
        _extend NewClass, statics
        return NewClass

    # View.microTemplate = mt = require("micro-template")
    View.template = tmpl =  require("./micro-template.js")
    View.escape = tmpl.escape
    # console.log(View.template)

    NativeView = require("./backbone.nativeview")({View})

    module.exports = NativeView
