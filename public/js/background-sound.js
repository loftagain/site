document.addEventListener('DOMContentLoaded', () => {
    const backgroundSound = new Audio('./public/sounds/city.mp3');
         backgroundSound.loop = true; // enables looping
         backgroundSound.volume = 0; // starts with volume at 0 (meant to increase)

         // function to play the background sound
         function playBackgroundSound() {
             backgroundSound.currentTime = 0; // resets to the beginning
             backgroundSound.play(); // starts playing the sound
             increaseVolume(); // calls the function to increase volume
         }

         // function to gradually increase the volume
         function increaseVolume() {
             let volume = 0; // stars from 0
             const interval = setInterval(() => {
                 if (volume < 1) { // target volume (100%)
                     volume += 0.2; // increases volume by 0.2
                     backgroundSound.volume = Math.min(volume, 0.04); // sets the volume, not exceeding 1
                 } else {
                     clearInterval(interval); // clears the interval once target volume is reached
                 }
             }, 50); // adjusts the frequency of the interval (here 50ms)
         }

         // plays the sound after user interaction
         document.addEventListener('click', () => {
             playBackgroundSound();
             // removes the click event listener after the first interaction to avoid multiple plays
             document.removeEventListener('click', arguments.callee);
         }, { once: true }); // 'once' ensures the listener is removed after the first click

         // pauses the sound when user leaves the page
         window.addEventListener('beforeunload', () => {
             backgroundSound.pause();
         });
     });
