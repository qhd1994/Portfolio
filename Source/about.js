function scroll() {
    const mainHeight = document
        .getElementById("main")
        .offsetHeight;
    // document.body.style.height = mainHeight + "px";

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    document
        .querySelector(".scroll")
        .innerText = Math.round(scrollTop);
    requestAnimationFrame(scroll);
}
scroll();