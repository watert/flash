"use strict"
let tmpl = Flash.View.template
let MainView = Flash.View.extend({
    events:{
        "click .btn-alert":function(e){
            alert("view events worked")
        }
    },
    render (){
        this.el.innerHTML = this.template({})
        Flash.ajax.get("./main.js",null, (script)=>{
            this.$("pre")[0].innerHTML = tmpl.escape(script)
        });
    },
    template: tmpl(`
        <h1>Title</h1>
        <p>content</p>
        <button class="btn btn-alert">Alert</button>
        <h2>Code:</h2>
        <%-"<hr>"%>
        <%="<hr>"%>
        <pre></pre>
    `)
});
let dom = document.querySelector("#app")
var main = new MainView({el:dom})
main.render()

let MainView2 = Flash.View.extend({
    events: {
        "click .btn":()=>{
            console.log("btn clicked")
        }
    }
});
let view2 = new MainView2({el:document.querySelector("#app2")})
view2.remove()
