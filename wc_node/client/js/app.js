(function() {

    var socket, selectedBathroom = "bathroom-1";

    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function() {
        var b, bathrooms, i;
        /*
        get("http://wc.com:3000/wc").then(function(resp) {
            console.log(resp);
            displayStatus(JSON.parse(resp));
        }).catch(function(e) {
            console.log("womp wompp");
        });
        */

        addClass(document.getElementById(selectedBathroom), "active");

        //add click event listeners to bathroom thumbs
        bathrooms = document.querySelectorAll("#bathroom-nav div");
        console.log(bathrooms);
        for (i = 0; i < bathrooms.length; i++) {
            setClickEvent(bathrooms[i]);
        }

        //websocket!
        socket = io();

        socket.emit('msg', 'msg');

        socket.on('status', function(msg) {
            displayStatus(JSON.parse(msg));
        });
    });

    function setClickEvent(el) {
        el.addEventListener("click", function() {
            removeClass(document.querySelectorAll("#bathroom-nav div.active")[0], "active");
            addClass(el, "active");
            if (el.classList.indexOf("available") !== -1) {
                document.querySelector("body").classList = "available";
            } else if (el.classList.indexOf("occupied") !== -1) {
                document.querySelector("body").classList = "occupied";
            } else if (el.classList.indexOf("reserved") !== -1) {
                document.querySelector("body").classList = "reserved";
            }
        });
    }

    function displayStatus(wc) {
        var bathroom, display = document.getElementById("status"), el, s, status = "";

        for (bathroom in wc) {
            console.log(bathroom);
            el = document.getElementById(bathroom);
            el.className.indexOf("active") === -1? status = "": status = "active";
            for (s in wc[bathroom]) {
                status += " " + wc[bathroom][s];
            }
            console.log(status);
            status += el.className;
            el.className = status.trim();
        }
    }

    function get(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onreadystatechange = function(){
            	if(req.readyState === 4 && req.status === 200){
                    resolve(req.response);
                } else if (req.readyState ===4 && req.status !== 200) {
                    reject(req.statusText);
                }
            }

            req.onerror = function() {
                reject(Error("Network Error"));
            }

            req.send();
        });
    }

    function hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!hasClass(el, className)) {
            el.className += " " + className;
        }
    }

    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className=el.className.replace(reg, ' ');
        }
    }

})();
