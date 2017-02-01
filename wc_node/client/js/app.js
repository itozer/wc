(function() {
    "use strict";

    var wc,       //holds state for all bathrooms
        socket,    //web socket (socket.io)
        vacantTimer = setInterval(setAppTimer, 1000);

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
        //add mouse events to action buttons for animation
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

            for (bathroom in wc.bathrooms) {
                paintBathroomState(wc.bathrooms[bathroom], false);
            }

        });

        //bathroom status change
        socket.on('update', function(msg, animate) {
//console.log('update');
//console.log(msg);
            var bathroom = JSON.parse(msg);
            setBathroomState(bathroom);
            paintBathroomState(bathroom, animate);
        });

    });

    function setBathroomState(bathroom) {
        var prop
        for (prop in bathroom) {
            wc.bathrooms[bathroom.key][prop] = bathroom[prop];
        }
    }

    function paintBathroomState(bathroom, animate) {
        paintBathroomThumb(bathroom, animate);

        if (bathroom.id === wc.active.id) {
            paintActiveBathroomPanel();
        }
    }

    //left nav click event
    function setActionEvents(el) {
        el.addEventListener("click", function(e) {
            socket.emit('action', JSON.stringify({action: el.id, bathroom: wc.active}));
            /*
            doAnimation(el, "pulse", function() {
                //do something?
            })
            */
        });
        /*
        el.addEventListener("mouseover", function(e) {
            addClass(this, "hover");
        });
        el.addEventListener("mouseout", function(e) {
            removeClass(this, "hover");
        });
        */
    }

    function setBathroomThumbEvents(el) {
        el.addEventListener("click", function() {
            removeClass(document.querySelector("#bathroom-nav .active"), "active");
            addClass(el, "active");
            setActiveBathroom(el.parentNode.id);
            paintActiveBathroomPanel()
        });
    }

    function setActiveBathroom(id) {
        var bathroom;
        for (bathroom in wc.bathrooms) {
            if (wc.bathrooms[bathroom].id === id) {
                wc.active = wc.bathrooms[bathroom];
                break;
            }
        }
    }

    function paintBathroomThumb(bathroom, animate) {
        var classList, status, thumb, title;

//console.log(bathroom);

        //update thumb
        thumb = document.getElementById(bathroom.id).querySelector("div");
        wc.active.id === bathroom.id? classList = "active ": classList = "";
        classList += bathroom.availability + " " + bathroom.desireability + " " + bathroom.gender + "-" + bathroom.desireability;
        thumb.className = classList;

        //add animation to thumb
        if (animate) {
            doAnimation(document.getElementById(bathroom.id), "tada", function() {
                //on complete
            });
        }
    }

    function paintActiveBathroomPanel() {
        //updates site color based on availability
        document.getElementById("status").className = wc.active.availability;

        //updates center icon based on desireability
        document.getElementById("center-gender").className = wc.active.gender + "-" + wc.active.desireability;

        //updates center title based on desireability
        if (wc.active.desireability === "blowed") {
            //document.getElementById("center-blowed").innerHTML = "(blowed) ";
            document.querySelector("#blowed-button p").innerHTML = "Blowed ()";
        } else {
            //document.getElementById("center-blowed").innerHTML = "";
        }

        //bathroom title
        document.getElementById("center-bathroom-title").innerHTML = wc.active.title;

        //displays appropriate timers
        setAppTimer();
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
          console.log("catch");
          removeClasses(el, "animated " + animation);
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

    function setAppTimer() {
        //vacant timer
        if (wc.active.availability === "available") {
            document.getElementById("vacant-timer").innerHTML = getTimePassed(wc.active.availabilityTime);
            setTimeout(function(){document.getElementById("center-status").style.display = "block";},0);
        } else {
            setTimeout(function(){document.getElementById("center-status").style.display = "none";},0);
        }

        //reserved timer
        if (wc.active.availability === "reserved") {
            document.querySelector("#reserved-button p").innerHTML = "Reserved (" + getTimePassed(wc.active.reservedTime, wc.active.reservedCountdownTime) + ")";
        } else {
            document.querySelector("#reserved-button p").innerHTML = "Make Reservation";
        }

        //desireability timer
        if (wc.active.desireability === "blowed") {
            document.querySelector("#blowed-button p").innerHTML = "Blowed (" + getTimePassed(wc.active.blowedTime, wc.active.blowedCountdownTime) + ")";
        } else {
            document.querySelector("#blowed-button p").innerHTML = "Report Blowed";
        }

    }

    function getTimePassed(startTime, getTimeLeft) {
        var days, hours, minutes, seconds, secondsPassed, timePassed, totalMillisecondsPassed, totalSecondsPassed;

        //totalSecondsPassed = Math.floor((Date.now() - wc.active.availabilityTime) / 1000);
        totalMillisecondsPassed =  Date.now() - startTime ;
        if (getTimeLeft !== undefined) {
            totalMillisecondsPassed = getTimeLeft - totalMillisecondsPassed;
        }
        totalSecondsPassed = Math.floor(totalMillisecondsPassed / 1000);
        days = parseInt(totalSecondsPassed / 86400);
        secondsPassed = parseInt(totalSecondsPassed % 86400);
        hours = parseInt(secondsPassed / 3600);
        secondsPassed = parseInt(secondsPassed % 3600);
        minutes = parseInt(secondsPassed / 60);
        seconds = parseInt(secondsPassed % 60);
        minutes = minutes < 10? "0" + minutes: minutes;
        seconds = seconds < 10? "0" + seconds: seconds;

        if (days > 0) {
            timePassed = days + ":" + hours + ":" + minutes + ":" + seconds;
        } else if (hours > 0) {
            timePassed = hours + ":" + minutes + ":" + seconds;
        } else {
            timePassed = minutes + ":" + seconds;
        }

        return timePassed;
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
