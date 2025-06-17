// Sound state flag default is muted
let isSoundEnabled = false;

/**
 * Updates the sound toggle state visually and stores the user’s preference.
 * This function syncs the UI (icon and toggle position) with the current sound setting,
 * and saves that setting in localStorage for persistence across sessions.
 * Although an optional `playToggleSound` parameter exists for flexibility,
 * this function itself does not handle sound playback directly—keeping it focused on UI state only.
 * This separation helps maintain modular control of sound logic elsewhere in the app.
 */
function applySoundSetting() {
  const soundSwitch = document.getElementById("sound-switch");
  const soundIcon = document.getElementById("sound-icon");
  if (soundSwitch) {
    soundSwitch.checked = isSoundEnabled;
  }
  if (soundIcon) {
    soundIcon.className = isSoundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  }
  localStorage.setItem("sound", isSoundEnabled ? "on" : "off");
}

/**
 * Initializes the sound toggle based on saved preferences and sets up change handling.
 * On page load, this function checks localStorage for the user's saved sound setting
 * and updates the toggle UI and global state accordingly. It also attaches a change 
 * listener to the toggle switch so that future changes are immediately reflected in the UI 
 * and saved back to localStorage.
 * Keeping this logic separate from `applySoundSetting()` helps clearly divide state setup 
 * from UI rendering, which improves maintainability.
 */
function setupSoundToggle() {
  const savedSoundSetting = localStorage.getItem("sound");
  isSoundEnabled = savedSoundSetting === "on";
  applySoundSetting(false);
  const soundSwitch = document.getElementById("sound-switch");
  if (soundSwitch) {
    soundSwitch.addEventListener("change", function () {
      isSoundEnabled = this.checked;
      applySoundSetting(true);
    });
  }
}

/**
 * Ensures sound preferences are loaded and applied as soon as the DOM is ready.
 * This guarantees the toggle reflects the user's saved setting before any interaction occurs.
 */
// Reference: https://builtin.com/articles/document-ready-javascript
document.addEventListener("DOMContentLoaded", setupSoundToggle);