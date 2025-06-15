// Sound state flag default is muted
let isSoundEnabled = false;

/**
 * Toggle sound icon and save preference
 */
function applySoundSetting(playToggleSound = false) {
  const soundSwitch = document.getElementById("sound-switch");
  const soundIcon = document.getElementById("sound-icon");
  // Update icon and checkbox
  soundSwitch.checked = isSoundEnabled;
  soundIcon.className = isSoundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  // Save setting to localStorage
  localStorage.setItem("sound", isSoundEnabled ? "on" : "off");
}

/**
 * Set up sound toggle behavior on page load
 */
function setupSoundToggle() {
  const savedSoundSetting = localStorage.getItem("sound");
  isSoundEnabled = savedSoundSetting === "on";
  applySoundSetting(false);
  // Add toggle listener
  const soundSwitch = document.getElementById("sound-switch");
  soundSwitch.addEventListener("change", function () {
    isSoundEnabled = this.checked;
    applySoundSetting(true);
  });
}
