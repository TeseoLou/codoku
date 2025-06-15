// Navigation sound effects
// Object to store and control navigation sound effects
// Reference: https://stackoverflow.com/questions/40100433
const navSounds = {
    // Retrieve the sound object matching the given name from the themeToggleSounds object
    page: new Audio("assets/sounds/page.mp3"),
    // Method that plays a sound effect by name
    play(name) {
        // Retrieve the sound object matching the given name from the navSounds object
        const sound = this[name];
        // Check if a valid sound was found for the given name
        if (isSoundEnabled && sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
};

/**
 * Toggles visibility of the settings dropdown on smaller screens when the settings cog button is clicked.
 * This enables users to access theme and sound toggles via an overlay menu on small viewports (≤ 992px).
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get the cog icon button element that opens the settings dropdown
  const settingsToggleBtn = document.getElementById('settings-toggle');

  // Get the hidden dropdown container element that holds the toggles
  const settingsDropdown = document.getElementById('settings-dropdown');

  // When the cog icon is clicked, toggle the dropdown visibility
  settingsToggleBtn.addEventListener('click', () => {
    // Toggles the Bootstrap utility class 'd-none' to show/hide the settings menu
    settingsDropdown.classList.toggle('d-none');
  });
});


/**
 * Collapse the Bootstrap navbar when clicking outside of the open menu
 */
// Reference: https://stackoverflow.com/questions/74670132
function setupOutsideNavbarCollapse() {
    // Listen for any click on the entire document
    document.addEventListener("click", function (event) {
        // Set the collapsible navbar element
        const navbarCollapse = $("#navbar-content");
        // Return early if navbar content element is not found in the DOM
        // Reference: https://www.sitepoint.com/jquery-check-element-exists/
        if (!navbarCollapse.length) return;
        // Check if the click happened inside the navbar content 
        // Reference: https://stackoverflow.com/questions/62375324
        const isClickInsideNavbar = $(event.target).closest("#navbar-content").length > 0;
        // Check if the click target is the navbar toggler or inside 
        // Reference: https://stackoverflow.com/questions/46736823
        const isNavbarToggler = $(event.target).is(".navbar-toggler") || $(event.target).closest(".navbar-toggler").length > 0;
        // If the click is outside both the navbar and toggler, and the navbar is expanded
        if (!isClickInsideNavbar && !isNavbarToggler && navbarCollapse.hasClass("show")) {
            // Get the Bootstrap Collapse instance associated with the navbar
            // https://getbootstrap.com/docs/5.3/components/collapse/#methods
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse[0]);
            // If the instance exists, hide the navbar
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
};

/**
 * Sets up button event listeners, sound triggers, and navigation handling once the page is fully loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Selects all elements with the class .modal from the DOM
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
    // Intercept clicks on main navigation links
    // Reference: https://stackoverflow.com/questions/23269951
    // Reference: https://attacomsian.com/blog/javascript-loop-dom-elements
    document.querySelectorAll('a[href="index.html"], a[href="about.html"]').forEach(link => {
        // Attaches a click event listener to each selected link
        link.addEventListener('click', function (event) {
            // Stop the browser from navigating right away
            // Reference: https://stackoverflow.com/questions/821011
            event.preventDefault();
            // Identify the href attribute of the clicked link
            const href = $(this).attr('href');
            // Check if the current page is index.html
            // Reference: https://www.samanthaming.com/tidbits/86-window-location-cheatsheet/
            const isLeavingGame = window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
            // Prompt the user before leaving the game to avoid accidental loss
            if (isLeavingGame && href.includes("about.html")) {
                // Show Bootstrap confirm modal
                const confirmModal = new bootstrap.Modal(document.getElementById("confirm-leave-modal"));
                confirmModal.show();
                // Wait for user response
                document.getElementById("confirm-leave-btn").onclick = () => {
                    window.location.href = href;
                };
                return;
            }
            // Play a page transition sound
            navSounds.play("page");
            // Then navigates to the desired page after a 300ms delay
            // Reference: https://stackoverflow.com/questions/66144270
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        })
    })
})