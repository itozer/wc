(function() {

    var wc,       //holds state for all bathrooms
        socket    //web socket (socket.io)

    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function() {
        var bathrooms, i;

        //add click event listeners to bathroom thumbs
        bathrooms = document.querySelectorAll("#bathroom-nav div");
        for (i = 0; i < bathrooms.length; i++) {
            setClickEvent(bathrooms[i]);
        }

        socket = io();

        socket.emit('msg', 'msg');

        socket.on('status', function(msg) {
            wc = JSON.parse(msg);
            updateStatus();
        });
    });

    function setClickEvent(el) {
        el.addEventListener("click", function() {
            removeClass(document.querySelector("#bathroom-nav div.active"), "active");
            addClass(el, "active");
            document.body.className = wc[el.id].availability;
        });
    }

    function updateStatus() {
        var bathroom, classList, el, status;

        for (bathroom in wc) {
            el = document.getElementById(bathroom);
            el.className.indexOf("active") === -1? classList = "": classList = "active";
            for (status in wc[bathroom]) {
                classList += " " + wc[bathroom][status];
            }
            classList += el.className;
            el.className = classList.trim();
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
