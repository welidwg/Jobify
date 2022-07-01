let mainNav = document.querySelector("#mainNav");
window.addEventListener("scroll", (e) => {
    if (this.scrollY > 50) {
        console.log("test");
        mainNav.classList.add("navbar-shrink");
    } else {
        mainNav.classList.remove("navbar-shrink");
    }
});
console.log("from custom");
if (mainNav) {
    var navbarCollapse = mainNav.querySelector(".navbar-collapse");

    if (navbarCollapse) {
        var collapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false,
        });

        var navbarItems = navbarCollapse.querySelectorAll("a");

        // Closes responsive menu when a scroll trigger link is clicked
        for (var item of navbarItems) {
            item.addEventListener("click", function (event) {
                collapse.hide();
            });
        }
    }

    // Collapse Navbar
    var collapseNavbar = function () {
        var scrollTop =
            window.pageYOffset !== undefined
                ? window.pageYOffset
                : (
                      document.documentElement ||
                      document.body.parentNode ||
                      document.body
                  ).scrollTop;

        if (scrollTop > 100) {
            mainNav.classList.add("navbar-shrink");
        } else {
            mainNav.classList.remove("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    collapseNavbar();
    // Collapse the navbar when page is scrolled
    document.addEventListener("scroll", collapseNavbar);

    // bageutteBox init
    if (document.getElementsByClassName("popup-gallery").length > 0) {
        baguetteBox.run(".popup-gallery", { animation: "slideIn" });
    }
}
