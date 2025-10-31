// This professional utility handles unlocking the browser's audio context
// and playing sounds in a reliable, browser-compliant way.

let audioUnlocked = false;

// This function is designed to be triggered by the user's first click anywhere on the page.
const unlockAudio = async () => {
    // This function will only run once.
    if (audioUnlocked || !window.Tone) {
        return;
    }
    
    try {
        // Tone.start() is required by modern browsers to allow audio to play.
        // It must be called after a user interaction.
        await window.Tone.start();
        audioUnlocked = true;
        console.log("Audio Context has been unlocked by user interaction.");
    } catch (e) {
        console.error("Could not start audio context:", e);
    }
};

// We attach a one-time event listener to the entire document.
// When the user clicks anywhere for the first time, it will automatically call unlockAudio.
// This is the definitive solution for the browser's Autoplay Policy.
document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('touchend', unlockAudio, { once: true }); // Also for touch devices

/**
 * Plays a short, clean notification sound if the audio context has been unlocked.
 */
export const playNotificationSound = () => {
    if (!audioUnlocked || !window.Tone) {
        console.warn("Audio not yet unlocked by user interaction. Sound cannot be played.");
        return;
    }
    // A synth is a sound generator in Tone.js. .toDestination() connects it to the speakers.
    const synth = new window.Tone.Synth().toDestination();
    
    // Play a short, clean, high-pitched note (G5) for a "ping" effect.
    // "16n" refers to the duration of the note (a sixteenth note).
    synth.triggerAttackRelease("G5", "16n");
};

