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
        var actions, bathrooms, i;

        socket = io();

        //add click event listeners to bathroom thumbs
        bathrooms = document.querySelectorAll(".bathroom-thumb");
        for (i = 0; i < bathrooms.length; i++) {
            setBathroomThumbEvents(bathrooms[i]);
        }

        actions = document.querySelectorAll(".action-button");
        for (i = 0; i < actions.length; i++) {
            setActionEvents(actions[i]);
        }

        //message bar input
        document.getElementById("userMessage").addEventListener("keydown", function(e) {
            if (e.keyCode === 13) {
                if (this.value.trim().length > 0) {
                    socket.emit('userMessage', this.value);
                    this.value = "";
                }
            }
        });

        //message response socket
        socket.on('userMessage', function(msg) {
            //document.getElementById('chat-container').insertAdjacentHTML('beforeend', "<p class='animated rubberBand'><span style='font-size:10px;'>"+ (new Date()).toLocaleTimeString() + ":</span> " + msg + "</p>");
            document.getElementById('chat-container').insertAdjacentHTML('beforeend', "<p class='animated rubberBand'>" + msg + " <span style='font-size:10px;'>(" + (new Date()).toLocaleTimeString() + ")</span></p>");
        });

        //app init socket
        socket.on('init', function(msg) {
            wc = JSON.parse(msg);
            updateStatus();
        });
    });

    //left nav click event
    function setActionEvents(el) {
      el.addEventListener("click", function() {
        socket.emit('action', el.id);
        //doAnimation(el.querySelector("p"), "pulse", function() {
        doAnimation(el, "pulse", function() {
          //do something?
        })
      });
    }

    function setBathroomThumbEvents(el) {
        el.addEventListener("click", function() {
            removeClass(document.querySelector("#bathroom-nav .active"), "active");
            addClasses(el, "active animated tada");
            one(el, ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend']).then(function(el) {
                //do something
                console.log("done animating");
                console.log(el);
                removeClasses(el, "animated tada");
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

    function doAnimation(el, animation, cb) {
      addClasses(el, "animated " + animation);

      //listen for when animation ends
      one(el, ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend']).then(function(el) {
          console.log("done animating");
          console.log(el);
          removeClasses(el, "animated " + animation);
          cb();
      }).catch(function(e) {
          console.log(e);
          cb();
      });
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

    function addClasses(el, classNames) {
      var classes = classNames.split(" "), i;
      for (i = 0; i < classes.length; i++) {
        addClass(el, classes[i]);
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

    function removeClasses(el, classNames) {
      var classes = classNames.split(" "), i;
      for (i = 0; i < classes.length; i++) {
        removeClass(el, classes[i]);
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
                    el.addEventListener(toAdd, animationDone);
                }

                function animationDone() {
                    var j;
                    for (j = 0; j < eventArray.length; j++) {
                        removeEvent(eventArray[j]);
                    }
                    resolve(el);
                }

                function removeEvent(toRemove) {
                    el.removeEventListener(toRemove, animationDone);
                }

            } catch(e) {
                reject(e);
            }

        });
    }

})();
