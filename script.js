let score = 0;
// Update the score display
const scoreDisplay = document.getElementById("score-value");
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const backgroundMusic = document.getElementById("background-music");
let hasUserInteracted = false;
canvas.width = 800;
canvas.height = 600;
const bubbles = []; // Array to store bubble objects

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}
function generateBubbles(numBubbles) {
    for (let i = 0; i < numBubbles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 10 + Math.random() * 20; // Adjust the range of bubble sizes
        const color = getRandomColor(); // Implement a function to generate random colors
      // Set initial velocities for the bubbles
      const velocityX = (Math.random() - 0.5) * 2; // Adjust the range for horizontal movement
      const velocityY = (Math.random() - 0.5) * 2; // Adjust the range for vertical movement
      
      bubbles.push({ x, y, radius, color, velocityX, velocityY });
    }
}

generateBubbles(100); // Call this function to create 100 bubbles




function playBubblePopSound() {
    const popSound = new Audio("pop.mp3");
    popSound.play();
}
function drawBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach(bubble => {
        // Update bubble positions based on their velocities
        bubble.x += bubble.velocityX;
        bubble.y += bubble.velocityY;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();
    });

    if (isGameEnded()) {
        showShareButton();
        return; // Stop the animation
    }

    requestAnimationFrame(() => drawBubbles());
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function createPopAnimation(x, y, radius, color) {
    const animationInterval = setInterval(() => {
        radius -= 0.5; // Adjust the rate of shrinking
        if (radius <= 0) {
            clearInterval(animationInterval);
        } else {
            ctx.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
    }, 50); // Adjust the interval for smoother or faster animation
}

document.addEventListener("click", () => {
    if (!hasUserInteracted) {
        // Play the background music when the user interacts with the document
        backgroundMusic.play();
        hasUserInteracted = true;
    }
});

canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    bubbles.forEach((bubble, index) => {
        const dx = mouseX - bubble.x;
        const dy = mouseY - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubble.radius) {
             // Add soothing effects here
             bubbles.splice(index, 1);

             // Visual Effects
            createPopAnimation(bubble.x, bubble.y, bubble.radius, bubble.color);
 
             // Audio Effects
             playBubblePopSound();

               // Increase the score
            score += 20; // Adjust the score increment as needed
            updateScoreDisplay(); // Call this function to update the score display
        }
    });
});


drawBubbles();

// Function to check if the game has ended
function isGameEnded() {
    return bubbles.length === 0;
}

function showShareButton() {
    const shareButton = document.createElement("button");
    shareButton.textContent = "Share Your Score";
    shareButton.classList.add("share-button");
    shareButton.addEventListener("click", () => {
        // Replace 'your-score-url' with the actual URL for sharing the score
        const shareUrl = `https://twitter.com/share?`;
        window.open(shareUrl, "_blank");
    });

    const scoreDisplay = document.getElementById("score-display");
    scoreDisplay.appendChild(shareButton);
}