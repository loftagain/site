document.addEventListener('DOMContentLoaded', () => {
    const clickSound = new Audio('./public/sounds/mouse-click-sound-233951.mp3');
    clickSound.volume = 0.2;

    // function to play the click sound
    function playClickSound() {
        clickSound.currentTime = 0; // resets the sound to the start
        clickSound.play(); // plays the sound
    }

    // adds event listener to the models or relevant elements
    const models = document.querySelectorAll('#embedded-iframe-container, .clickable');

    models.forEach(model => {
        model.addEventListener('click', playClickSound);
    });
});
