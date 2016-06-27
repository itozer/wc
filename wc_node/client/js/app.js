(function() {
    "use strict";

    var wc,       //holds state for all bathrooms
        socket,    //web socket (socket.io)
        vacantTimer;

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
        bathrooms = document.querySelectorAll(".bathroom-thumb-wrapper div");
        for (i = 0; i < bathrooms.length; i++) {
            setBathroomThumbEvents(bathrooms[i]);
        }

        //add click event listeners to action buttons
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
            document.getElementById('chat-container').insertAdjacentHTML('beforeend', "<p class='animated fadeInUp'>" + msg + " <span style='font-size:10px;'>(" + (new Date()).toLocaleTimeString() + ")</span></p>");
        });

        //app init socket
        socket.on('init', function(msg) {
            var bathroom;

            wc = JSON.parse(msg);

            //check if client has cookie that remembers last selected bathroom
            if (false) {
                //set active from cookie
            } else {
                wc.active = wc.bathrooms.b1;
            }
            //updateActiveBathroomPanel();

            for (bathroom in wc.bathrooms) {
                //updateBathroomThumb(wc.bathrooms[bathroom]);
                drawBathroomState(bathroom, false);
            }

        });

        //bathroom status change
        socket.on('update', function(msg, animate) {
//console.log('update');
//console.log(msg);
            var bathroom = JSON.parse(msg);
            setBathroomsState(bathroom);
            drawBathroomState(bathroom, animate);
        });

        setVacantTimer(0);
    });

    function setBathroomsState(bathroom) {
        for (prop in bathroom) {
            wc.bathrooms[bathroom.key][prop] = bathroom[prop];
        }
    }

    function drawBathroomState(bathroom, animate) {
        updateBathroomThumb(wc.bathrooms[bathroom.key], animate);

        if (bathroom.id === wc.active.id) {
            updateActiveBathroomPanel();
        }
    }

    //left nav click event
    function setActionEvents(el) {
        el.addEventListener("click", function() {
            socket.emit('action', JSON.stringify({action: el.id, bId: wc.active.id}));
            /*
            doAnimation(el, "pulse", function() {
                //do something?
            })
            */
        });
        el.addEventListener("mouseover", function() {
            addClass(this, "hover");
        });
        el.addEventListener("mouseout", function() {
            removeClass(this, "hover");
        });
    }

    function setBathroomThumbEvents(el) {
        el.addEventListener("click", function() {
            removeClass(document.querySelector("#bathroom-nav .active"), "active");
            addClass(el, "active");
            setActiveBathroom(el.parentNode.id);
        });
    }

    function setActiveBathroom(id) {
        var bathroom;
        for (bathroom in wc.bathrooms) {
            console.log(wc.bathrooms[bathroom].id);
            if (wc.bathrooms[bathroom].id === id) {
                wc.active = wc.bathrooms[bathroom];
                break;
            }
        }
        //i will need to update visible stats here
        document.getElementById("center-bathroom-title").innerHTML = wc.active.title;

        //update main site color status
        //is this the best place for this?
        //document.getElementById("status").className = wc.active.availability;
        updateActiveBathroomPanel()
    }

    function updateBathroomThumb(bathroom, animate) {
        var classList, status, thumb, title;

        console.log(bathroom);

        //update thumb
        thumb = document.getElementById(bathroom.id).querySelector("div");
        wc.active.id === bathroom.id? classList = "active ": classList = "";
        classList += bathroom.availability + " " + bathroom.desireability + " " + bathroom.gender;
        thumb.className = classList;

        //add animation to thumb
        if (animate) {
            doAnimation(document.getElementById(bathroom.id), "tada", function() {
                //on complete
            });
        }
    }

    function updateActiveBathroomPanel() {
//console.log(wc.active);
        //updates site color based on availability
        document.getElementById("status").className = wc.active.availability;

        //updates center icon based on desireability
        document.getElementById("center-gender").className = wc.active.desireability;

        //updates center title based on desireability
        if (wc.active.desireability === "blowed") {
            document.getElementById("center-blowed").innerHTML = "(blowed&#128169;) ";
        } else {
            document.getElementById("center-blowed").innerHTML = "";
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

    function setVacantTimer(totalSecondsPassed) {
        vacantTimer = setInterval(function () {
            var days, hours, minutes, seconds, secondsPassed, timePassed;

            var days = parseInt(totalSecondsPassed / 86400);
            var secondsPassed = parseInt(totalSecondsPassed % 86400);
            var hours = parseInt(secondsPassed / 3600);
            var secondsPassed = parseInt(secondsPassed % 3600);
            var minutes = parseInt(secondsPassed / 60);
            var seconds = parseInt(secondsPassed % 60);
            var minutes = minutes < 10? "0" + minutes: minutes;
            var seconds = seconds < 10? "0" + seconds: seconds;

            if (days > 0) {
                timePassed = days + ":" + hours + ":" + minutes + ":" + seconds;
            } else if (hours > 0) {
                timePassed = hours + ":" + minutes + ":" + seconds;
            } else {
                timePassed = minutes + ":" + seconds;
            }

            document.getElementById("vacant-timer").innerHTML = timePassed;
            totalSecondsPassed++;

        }, 1000);
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
