// Object to store and control navigation sound effects
// Reference: https://stackoverflow.com/questions/40100433
const navSounds = {
    page: new Audio("assets/sounds/page.mp3"),
    play(name) {
        const sound = this[name];
        if (isSoundEnabled && sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
};

/**
 * Closes the mobile navbar menu when clicking outside of it.
 * Listens for clicks on the document and checks if the user clicked 
 * outside both the open menu and the hamburger toggle. If so, and if 
 * the navbar is currently expanded, it collapses it.
 * This improves mobile usability by mimicking native app behavior and 
 * prevents the menu from staying open unnecessarily. It uses Bootstrap's 
 * Collapse API to cleanly hide the menu and ties in with the responsive 
 * navigation system already in place.
 */
// Reference: https://stackoverflow.com/questions/74670132
function setupOutsideNavbarCollapse() {
    document.addEventListener("click", function (event) {
        const navbarCollapse = $("#navbar-content");
        // Reference: https://www.sitepoint.com/jquery-check-element-exists/
        if (!navbarCollapse.length) return;
        // Reference: https://stackoverflow.com/questions/62375324
        const isClickInsideNavbar = $(event.target).closest("#navbar-content").length > 0;
        // Reference: https://stackoverflow.com/questions/46736823
        const isNavbarToggler = $(event.target).is(".navbar-toggler") || $(event.target).closest(".navbar-toggler").length > 0;
        if (!isClickInsideNavbar && !isNavbarToggler && navbarCollapse.hasClass("show")) {
            // https://getbootstrap.com/docs/5.3/components/collapse/#methods
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse[0]);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
}

/**
 * Handles UI interactions and navigation events once the DOM is ready.
 * Adds sound effects to all Bootstrap modals (open/close) to enhance feedback.
 * Intercepts link clicks to show a confirmation modal when leaving an active game,
 * helping prevent accidental progress loss.
 * Delays navigation slightly to allow sound to play before redirecting.
 * Designed to hook into Bootstrap's modal system and core navigation links, this setup
 * ensures consistent UX across page transitions while supporting audio feedback toggled 
 * elsewhere in the app.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Reference: https://getbootstrap.com/docs/5.3/components/modal/
    const modals = document.querySelectorAll('.modal');
    // Reference: https://stackoverflow.com/questions/47168607
    modals.forEach(modal => {
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#events
        modal.addEventListener('shown.bs.modal', () => {
            navSounds.play("page");
        });
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#events
        modal.addEventListener('hidden.bs.modal', () => {
            navSounds.play("page");
        });
    });
    // Reference: https://stackoverflow.com/questions/23269951
    // Reference: https://attacomsian.com/blog/javascript-loop-dom-elements
    document.querySelectorAll('a[href="index.html"], a[href="about.html"]').forEach(link => {
        link.addEventListener('click', function (event) {
            // Reference: https://stackoverflow.com/questions/821011
            event.preventDefault();
            const href = $(this).attr('href');
            // Reference: https://www.samanthaming.com/tidbits/86-window-location-cheatsheet/
            const isLeavingGame = window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
            if (isLeavingGame && href.includes("about.html")) {
                const confirmModal = new bootstrap.Modal(document.getElementById("confirm-leave-modal"));
                confirmModal.show();
                document.getElementById("confirm-leave-btn").onclick = () => {
                    window.location.href = href;
                };
                return;
            }
            navSounds.play("page");
            // Reference: https://stackoverflow.com/questions/66144270
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});