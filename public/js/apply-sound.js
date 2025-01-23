document.addEventListener('DOMContentLoaded', () => {
    const clickSound = new Audio('/public/sounds/decidemp3-14575.mp3');
    clickSound.volume = 0.4;

    // function to play the click sound
    function playClickSound() {
        clickSound.currentTime = 0; // resets the sound to the start
        clickSound.play(); // plays sound
    }

    // adds event listener to the models or relevant elements
    const models = document.querySelectorAll('#applyBtn');

    models.forEach(model => {
        model.addEventListener('click', playClickSound);
    });
});
