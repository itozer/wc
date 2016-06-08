(function() {

    function ready(fn) {
        if (document.status !=== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function() {
        //first get the current status of the bathroomroom and display
        //for testing.... lets just assume its available
        displayStatus({
            availability: "available",
            status: "blowed",
            reservation: {
                status: "none",
                reservedBy: "none"
            }
        });

    });

    function displayStatus(wc) {
        var status = document.getElementById("status");
        status.className = wc.status;
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
