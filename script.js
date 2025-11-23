const audio = document.getElementById("myAudio");
const muteButton = document.getElementById("muteButton");
const volumeSlider = document.getElementById("volumeSlider");
const discordButton = document.getElementById("discordButton");
const originalDiscordContent = discordButton ? discordButton.innerHTML : null; 

// Universal Elements (exist on both pages)
const loader = document.getElementById("loader-overlay");
// FIX: Checks for MCA's primary video (background-video-1) first, then falls back to the main page video (background-video)
const primaryVideo = document.getElementById("background-video-1") || document.getElementById("background-video"); 

// Define the checkmark icon for the Discord button feedback
const copiedIcon = '<i class="fa-solid fa-check"></i>';


/* ------------------------------------- */
/* 1. LOADER FUNCTIONALITY (Runs on both pages) */
/* ------------------------------------- */

if (primaryVideo && loader) {
    let loaderHidden = false;

    // Function to safely hide the loader only once
    const hideLoader = () => {
        if (!loaderHidden) {
            loader.classList.add('hidden');
            loaderHidden = true;
        }
    };
    
    // 1. Primary trigger: Hide the loader once the primary video background is ready
    primaryVideo.addEventListener('loadeddata', () => {
        // Add a short delay (500ms) for the fade-out effect
        setTimeout(hideLoader, 500); 
    });

    // 2. FALLBACK TRIGGER: Hide the loader after 2.5 seconds max
    // This prevents a stuck screen if the video file is missing or corrupted.
    setTimeout(hideLoader, 2500); 
}


/* ------------------------------------- */
/* 2. MAIN PAGE AUDIO & DISCORD FUNCTIONALITY (index.html) */
/* ------------------------------------- */

if (audio && muteButton && volumeSlider) {
    audio.muted = true;
    audio.loop = true;
    audio.volume = 0.5;

    // Mute/unmute toggle logic
    muteButton.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().catch(() => {});
        }

        if (audio.muted) {
            audio.muted = false;
            muteButton.textContent = "Mute";
            volumeSlider.classList.add("show");
        } else {
            audio.muted = true;
            muteButton.textContent = "Unmute";
            volumeSlider.classList.remove("show");
        }
    });

    // Volume slider control
    volumeSlider.addEventListener("input", (e) => {
        audio.volume = e.target.value;
        if (audio.muted && audio.volume > 0) {
            audio.muted = false;
            muteButton.textContent = "Mute";
        }
    });
}

// Discord copy logic
if (discordButton) {
    discordButton.addEventListener("click", () => {
        navigator.clipboard.writeText("0rr.").then(() => {
            discordButton.innerHTML = copiedIcon; 
            setTimeout(() => {
                discordButton.innerHTML = originalDiscordContent;
            }, 1200);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}


/* ------------------------------------- */
/* 3. MCA PAGE AUDIO FUNCTIONALITY (mca.html) */
/* ------------------------------------- */

const mcaAudio = document.getElementById("mcaAudio");
const mcaPlayButton = document.getElementById("mcaPlayButton");
const mcaVolumeSlider = document.getElementById("mcaVolumeSlider");

if (mcaAudio && mcaPlayButton && mcaVolumeSlider) {
    // Initial Volume Setting
    mcaAudio.volume = 0.5;

    mcaPlayButton.addEventListener("click", () => {
        if (mcaAudio.paused) {
            mcaAudio.play().then(() => {
                mcaPlayButton.innerHTML = '<i class="fa-solid fa-pause"></i> Mute';
                mcaVolumeSlider.classList.add("show");
            }).catch(err => {
                console.error("Audio playback failed:", err);
            });
        } else {
            mcaAudio.pause();
            mcaPlayButton.innerHTML = '<i class="fa-solid fa-play"></i> Unmute';
            mcaVolumeSlider.classList.remove("show");
        }
    });

    mcaVolumeSlider.addEventListener("input", (e) => {
        mcaAudio.volume = e.target.value;
    });
}


/* ------------------------------------- */
/* 4. MCA VIDEO SWITCHING FUNCTIONALITY (mca.html) */
/* ------------------------------------- */

const video1 = document.getElementById("background-video-1");
const video2 = document.getElementById("background-video-2");

if (video1 && video2) {
    // Function to switch and play the next video
    const switchVideo = (currentVideo, nextVideo) => {
        // Hide current, show next (uses CSS classes defined in style.css)
        currentVideo.classList.remove('active-video');
        currentVideo.classList.add('hidden-video');
        
        // Reset and prepare the next video
        nextVideo.currentTime = 0;
        nextVideo.classList.remove('hidden-video');
        nextVideo.classList.add('active-video');
        
        // Start playing the next video
        nextVideo.play().catch(err => {
            console.error("Video playback failed:", err);
        });
    };

    // Listener for Video 1 ending: start Video 2
    video1.addEventListener('ended', () => {
        switchVideo(video1, video2);
    });

    // Listener for Video 2 ending: restart Video 1
    video2.addEventListener('ended', () => {
        switchVideo(video2, video1);
    });
}