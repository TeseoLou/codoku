// Sound state flag default is muted
let isSoundEnabled = false;

/**
 * Toggle sound icon and save preference
 */
function applySoundSetting(playToggleSound = false) {
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
 * Set up sound toggle behavior on page load
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

// Run setup on page load
document.addEventListener("DOMContentLoaded", setupSoundToggle);

