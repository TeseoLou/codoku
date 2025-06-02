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
        if (sound) {
            // Restart sound
            sound.currentTime = 0;
            // Play the sound
            sound.play();
        }
    }
}