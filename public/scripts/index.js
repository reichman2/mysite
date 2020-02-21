"use strict";

var smallScreen = window.matchMedia("(max-width: 620px)");

var nav = {
    elem: $('#sidenav'),
    open: function() {
        this.elem.css({"width": (smallScreen.matches? "100vw" : "15vw")});
    },

    close: function() {
        this.elem.css({"width": "0%"});
    },
    
    toggle: function() {
        if (this.elem.css("width") !== "0px")
            this.close();
        else
            this.open();
    },

    isOpen: function() {
        return this.elem.css("width") !== "0px";
    }
};

$('#openNav').on('click', () => {
    nav.open();
    $('#openNav').css({"display": "none"});
});

$('#closeNav').on('click', async () => {
    nav.close();
    setTimeout(() => { // Wait 500ms before showing the hamburger again.
        $('#openNav').css({"display": "block"});
    }, ($("#sidenav").css('transition-duration').replace(/[^\d\.]/, "") * 1000) - 80); // get the value for the transition-duration property without units (only digits).
});

$("#myWorkBtn").on('click', () => {
    window.location.href = "#portfolio";
});

var sidebarColorWaypointTop = new Waypoint({
    element: document.getElementById('content'),
    handler: function(direction) {
        // console.log("Scrolled to waypoint in direction: " + direction);
        if (direction == "down") {
            $("#openNav").css({"color": "#202340"});
            $("#sidenav").css({"background-color": "rgba(0, 0, 0, 0.7)"})
        } else if (direction == "up") {
            $("#openNav").css({"color": "white"});
            $("#sidenav").css({"background-color": "rgba(0, 0, 0, 0.3)"})
        }
    }
});

var sidebarColorWaypointBottom = new Waypoint({
    element: document.getElementsByTagName('footer'),
    handler: function(direction) {
        // console.log("Scrolled to waypoint in direction: " + direction);
        if (direction == "up") {
            $("#openNav").css({"color": "#202340"});
            $("#sidenav").css({"background-color": "rgba(0, 0, 0, 0.7)"})
        } else if (direction == "down") {
            $("#openNav").css({"color": "white"});
            $("#sidenav").css({"background-color": "rgba(0, 0, 0, 0.3)"})
        }
    }
});

window.onresize = () => {
    smallScreen = window.matchMedia("(max-width: 600px)");

    if (nav.isOpen()) {
        nav.open();
    }
};