// 배경
var PI2 = Math.PI * 2;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var circles = [];
var mouse = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
};
var options = {
    totalCircles: 10,
    maxRadius: 300,
    maxLineWidth: 150,
    colors: ["#87CEEB", "#98FF98", "#32CD32", "#1E90FF"]
};

function init() {
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
    document
        .body
        .addEventListener("mousemove", onMouseMove, false);
    document
        .body
        .addEventListener("touchmove", onTouchMove, false);
    for (var i = 0; i < options.totalCircles; i++) 
        circles.push(new Circle());
    }

function onTouchMove(event) {
    var touch = event.touches[0];
    mouse = {
        x: touch.clientX,
        y: touch.clientY
    };
}

function onMouseMove(event) {
    mouse = {
        x: event.clientX,
        y: event.clientY
    };
}

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    time = new Date().getTime() * 0.001;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < circles.length; i++) 
        circles[i].draw(context);
    }

var Circle = function (args) {
    if (args === undefined) 
        var args = {};
    this.radius = args.radius || Math.random() * options.maxRadius + 10;
    this.lineWidth = args.lineWidth || Math.random() * options.maxLineWidth;
    this.color = args.color || options.colors[Math.floor(Math.random() * options.colors.length)];
    this.delay = Math.random() * 100 + 4;
    this.center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    this.draw = function (ctx) {
        this.center.x += (mouse.x - this.center.x) / this.delay;
        this.center.y += (mouse.y - this.center.y) / this.delay;
        var scale = Math.sin(time + this.lineWidth) - 0.5;
        ctx.lineWidth = (Math.sin(time + this.lineWidth) + 1) * this.lineWidth;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.center.x, this.center.y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = this.color;
        ctx.arc(0, 0, this.radius, 0, PI2, false);
        ctx.stroke();
        ctx.restore();
    };
    return this;
};

init();
animate();

// 타이틀
var maxDist;
var mouse = {
    x: 0,
    y: 0
};
var cursor = {
    x: window.innerWidth,
    y: window.innerHeight
};

Math.dist = function (a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
};

window.addEventListener("mousemove", function (e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

window.addEventListener("touchmove", function (e) {
    var t = e.touches[0];
    cursor.x = t.clientX;
    cursor.y = t.clientY;
}, {passive: false});

var Char = function (container, char) {
    var span = document.createElement("span");
    span.setAttribute("data-char", char);
    span.innerText = char;
    container.appendChild(span);
    this.getDist = function () {
        this.pos = span.getBoundingClientRect();
        return Math.dist(mouse, {
            x: this.pos.x + this.pos.width / 1.75,
            y: this.pos.y
        });
    };
    this.getAttr = function (dist, min, max) {
        var wght = max - Math.abs((max * dist) / maxDist);
        return Math.max(min, wght + min);
    };
    this.update = function (args) {
        var dist = this.getDist();
        this.wdth = args.wdth
            ? ~~this.getAttr(dist, 5, 200)
            : 100;
        this.wght = args.wght
            ? ~~this.getAttr(dist, 100, 800)
            : 400;
        this.alpha = args.alpha
            ? this
                .getAttr(dist, 0, 1)
                .toFixed(2)
            : 1;
        this.ital = args.ital
            ? this
                .getAttr(dist, 0, 1)
                .toFixed(2)
            : 0;
        this.draw();
    };
    this.draw = function () {
        var style = "";
        style += "opacity: " + this.alpha + ";";
        style += "font-variation-settings: 'wght' " + this.wght + ", 'wdth' " + this.wdth + ", '" +
                "ital' " + this.ital + ";";
        span.style = style;
    };
    return this;
};

var VFont = function () {
    this.scale = false;
    this.flex = true;
    this.alpha = false;
    this.stroke = false;
    this.width = true;
    this.weight = true;
    this.italic = true;
    var title,
        str,
        chars = [];

    this.init = function () {
        title = document.getElementById("title");
        str = title.innerText;
        title.innerHTML = "";
        for (var i = 0; i < str.length; i++) {
            var _char = new Char(title, str[i]);
            chars.push(_char);
        }
        this.set();
        window.addEventListener("resize", this.setSize.bind(this));
    };

    this.set = function () {
        title.className = "";
        title.className += this.flex
            ? " flex"
            : "";
        title.className += this.stroke
            ? " stroke"
            : "";
        this.setSize();
    };

    this.setSize = function () {
        var fontSize = window.innerWidth / (str.length / 2);
        title.style = "font-size: " + fontSize + "px;";
        if (this.scale) {
            var scaleY = (window.innerHeight / title.getBoundingClientRect().height).toFixed(
                2
            );
            var lineHeight = scaleY * 0.8;
            title.style = "font-size: " + fontSize + "px; transform: scale(1," + scaleY + "); line-height: " +
                    lineHeight + "em;";
        }
    };

    this.animate = function () {
        mouse.x += (cursor.x - mouse.x) / 20;
        mouse.y += (cursor.y - mouse.y) / 20;
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    };

    this.render = function () {
        maxDist = title
            .getBoundingClientRect()
            .width / 2;
        for (var i = 0; i < chars.length; i++) {
            chars[i].update(
                {wght: this.weight, wdth: this.width, ital: this.italic, alpha: this.alpha}
            );
        }
    };
    this.init();
    this.animate();
    return this;
};

var txt = new VFont();

// 버튼
var animateButton = function (e) {
    e.preventDefault;
    //reset animation
    e
        .target
        .classList
        .remove("animate");

    e
        .target
        .classList
        .add("animate");
    setTimeout(function () {
        e
            .target
            .classList
            .remove("animate");
    }, 700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener("click", animateButton, false);
}
// 버튼 페이지 트랜지션
const main = document.querySelector("#main");
const openCanvas = main.querySelector(".open__canvas");
const openTitle = main.querySelector(".open__title");
const openButton = main.querySelector(".open__button");
const openButtonTxt = main.querySelector(".open__button span");

openButton.addEventListener("click", () => {
    nextPage();
});

function nextPage() {
    gsap.to(openCanvas, {
        duration: 1.5,
        opacity: 0,
        ease: "expo.inOut"
    });
    gsap.to(openTitle, {
        duration: 1.5,
        opacity: 0,
        ease: "expo.inOut",
        delay: 0.5
    });
    gsap.to(openButtonTxt, {
        duration: 1,
        opacity: 0,
        ease: "expo.inOut",
        delay: 0.5
    });
    gsap.to(openButton, {
        duration: 1.5,
        width: 0,
        opacity: 0,
        ease: "expo.inOut",
        delay: 1
    });
    gsap.to(main, {
        duration: 1,
        backgroundColor: "#319eea",
        ease: "expo.inOut",
        delay: 1
    });
    setTimeout(() => {
        location.href = "Source/about.html";
    }, 2000);

    gsap.to(openCanvas, {
        duration: 0,
        opacity: 1,
        ease: "expo.inOut",
        delay: 3
    });
    gsap.to(openTitle, {
        duration: 0,
        opacity: 1,
        ease: "expo.inOut",
        delay: 3
    });
    gsap.to(openButtonTxt, {
        duration: 0,
        opacity: 1,
        ease: "expo.inOut",
        delay: 3
    });
    gsap.to(openButton, {
        duration: 0,
        opacity: 1,
        ease: "expo.inOut",
        delay: 3
    });
    gsap.to(main, {
        duration: 0,
        backgroundColor: "#b5eaff",
        ease: "expo.inOut",
        delay: 3
    });
}

//인트로 메세지
// const hellow = document.querySelector(".hellow");
