# flash
Minimal Standalone Backbone.View and utils for home page optimizing before big libraries loaded

size:

- minified: <5K
- gzipped: <3K

supports:

- Flash.ajax
    - get(url,query,callback)
    - post(url,data,callback)
- Flash.View
    - extend:
        - events: `click .selector`
        - delegateEvents
- Flash.template (John Resig Template based)
    - escape
