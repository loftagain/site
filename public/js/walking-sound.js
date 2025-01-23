document.addEventListener('DOMContentLoaded', () => {
    const walkSound = new Audio('./public/sounds/concrete-footsteps-6752.mp3');

    let isPlaying = false;
    let keyHoldDuration = 0;
    let holdInterval;

    // Function to play sound with variable speed
    function playWalkSound() {
        if (!isPlaying) {
            walkSound.currentTime = 0;
            walkSound.play();
            isPlaying = true;
        }
    }

    // Helper function to check if the pressed key is relevant
    function isMovementKey(key) {
        return (
            key === "w" || key === "a" || key === "s" || key === "d" ||
            key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight"
        );
    }

    // Event listener for keydown
    document.addEventListener('keydown', (event) => {
        const key = event.key; // Use the actual key value
        if (isMovementKey(key)) {
            if (!holdInterval) {
                playWalkSound();
                holdInterval = setInterval(() => {
                    keyHoldDuration += 100; // Increase duration
                    walkSound.playbackRate = 1 + keyHoldDuration / 1000; // Increase speed gradually
                }, 100);
            }
        }
    });

    // Event listener for keyup
    document.addEventListener('keyup', (event) => {
        const key = event.key; // Use the actual key value
        if (isMovementKey(key)) {
            if (holdInterval) {
                clearInterval(holdInterval);
                holdInterval = null;
                keyHoldDuration = 0;
                walkSound.pause();
                isPlaying = false;
                walkSound.playbackRate = 1; // Reset speed
            }
        }
    });
});
