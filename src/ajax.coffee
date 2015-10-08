# Based on https://gist.github.com/azproduction/1625623
do ->
    `var ajax = function(
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
    }`

    ajax.get = ()-> ajax("GET", arguments...)
    ajax.post = ()-> ajax("POST", arguments...)
    module.exports = ajax
