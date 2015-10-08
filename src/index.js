let ajax = require("./ajax.coffee")
// console.log("ajax",ajax)
let View = require("./view.coffee")

let {template, escape} = View
module.exports = window.Flash = {ajax, View, template, escape}
