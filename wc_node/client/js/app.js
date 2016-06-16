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
        bathrooms = document.querySelectorAll(".bathroom-thumb");
        for (i = 0; i < bathrooms.length; i++) {
            setClickEvent(bathrooms[i]);
        }

        socket = io();

        socket.emit('msg', 'msg');

        socket.on('init', function(msg) {
            wc = JSON.parse(msg);
            updateStatus();
        });
    });

    function setClickEvent(el) {
        el.addEventListener("click", function() {
            removeClass(document.querySelector("#bathroom-nav .active"), "active");
            addClass(el, "active");
            addClass(el, "animated");
            addClass(el, "tada");
            one(el, ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend']).then(function(el) {
                //do something
                console.log("done animating");
                console.log(el);
                removeClass(el, "animated");
                removeClass(el, "tada");
            }).catch(function(e) {
                console.log(e);
            });

            document.body.className = wc[el.parentNode.id].availability;
        });
    }

    function updateStatus() {
        var bathroom, classList, status, thumb;

        for (bathroom in wc) {
            //update visual status of thumb
            thumb = document.getElementById(bathroom).querySelector(".bathroom-thumb");
            thumb.className.indexOf("active") === -1? classList = "": classList = "active ";
            classList += wc[bathroom].availability + " " + wc[bathroom].desireability + " " + wc[bathroom].gender;
            thumb.className = classList;

            //add animation to text
            title = document.getElementById(bathroom).querySelector("p");
            one(title, ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend']).then(function(el) {
                //do something
                console.log("done animating");
                console.log(el);
            }).catch(function(e) {
                console.log(e);
            });


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

    function one(el, eventArray) {
        return new Promise(function(resolve, reject) {
            var i;

            try {
                for (i = 0; i < eventArray.length; i++) {
                    addEvent(eventArray[i]);
                }

                function addEvent(toAdd) {
                    el.addEventListener(toAdd, addIt);
                }

                function addIt() {
                    var j;
                    for (j = 0; j < eventArray.length; j++) {
                        removeEvent(eventArray[j]);
                    }
                    resolve(el);
                }

                function removeEvent(toRemove) {
                    el.removeEventListener(toRemove, addIt);
                }

            } catch(e) {
                reject(e);
            }

        });
    }

})();
