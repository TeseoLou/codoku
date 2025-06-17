// Object to store and control theme toggle sound effects
// Reference: https://stackoverflow.com/questions/40100433
const themeToggleSounds = {
    tweet: new Audio("assets/sounds/tweet.mp3"),
    hoot: new Audio("assets/sounds/hoot.mp3"),
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
    play(name) {
        const sound = this[name];
        if (isSoundEnabled && sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
};

/**
 * Applies the selected visual theme and updates the UI accordingly.
 * This function toggles the `dark` class on the body element, updates the theme
 * toggle switch and icon, and adjusts button styles to match the selected mode.
 * It optionally plays a sound when the theme is switched (if `playSound` is true),
 * and saves the user’s choice to localStorage for persistence across sessions.
 * This approach keeps theme changes fast and consistent throughout the app while
 * ensuring user preferences are remembered and respected on future visits.
 */
function applyTheme(isLightMode, playSound = false) {
    // Reference: https://stackoverflow.com/questions/60469551
    $("body").toggleClass("dark", !isLightMode);
    // Reference: https://api.jquery.com/prop/
    $("#theme-switch").prop("checked", isLightMode);
    $("#theme-icon").attr("class", isLightMode ? "fa-solid fa-sun" : "fa-solid fa-moon");
    if (playSound) {
        themeToggleSounds.play(isLightMode ? "tweet" : "hoot");
    }
    const themeButtons = [
        $('button[data-bs-target="#setup-modal"]'),
        $("#start-button"),
        $("#rules-back-button"),
        $("#donate-button"),
        $("#check-button"),
        $("#hint-button"),
        $("#congrats-new-game"),
        $("#home-button"),
        $("#confirm-leave-btn"),
        $("#ok-button")
    ];
    // Reference: https://www.freecodecamp.org/news/javascript-array-foreach-tutorial-how-to-iterate-through-elements-in-an-array-with-map/
    themeButtons.forEach($btn => {
        if ($btn.length) {
            $btn.removeClass("btn-light btn-dark");
            $btn.addClass(isLightMode ? "btn-dark" : "btn-light");
        }
    });
    // Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
}

/**
 * Initializes the theme toggle on page load and sets up interaction behavior.
 * Loads the saved theme preference from localStorage and applies it immediately,
 * ensuring a consistent user experience from the start. Also adds a change listener
 * to the theme switch that updates the theme, plays a toggle sound, and sets
 * ARIA attributes for accessibility.
 * This setup keeps the UI responsive to user actions while maintaining 
 * persistence and accessibility best practices.
 */
function setupThemeSwitch() {
    const themeSwitch = document.getElementById("theme-switch");
    // Reference: https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/
    const savedTheme = localStorage.getItem("theme");
    const isLightMode = savedTheme !== "dark"; 
    applyTheme(isLightMode, false);
    // Reference: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
    themeSwitch.addEventListener("change", function () {
        const isLight = this.checked;
        // Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-checked
        this.setAttribute("aria-checked", isLight ? "true" : "false");
        applyTheme(isLight, true);
    });
}

/**
 * Ensures the theme setup runs after the DOM is fully loaded.
 * This guarantees that the theme toggle is correctly initialized before user interaction.
 * It uses a conditional check on `document.readyState` to support both early and late script loads.
 */
// Reference: https://builtin.com/articles/document-ready-javascript
if (document.readyState !== "loading") {
    setupThemeSwitch();
} else {
    document.addEventListener("DOMContentLoaded", setupThemeSwitch);
}