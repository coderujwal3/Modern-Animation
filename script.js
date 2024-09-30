const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

raf();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
})

gsap.ticker.lagSmoothing(0);


const frames = {
    currentIndex: 0,
    maxIndex: 382,
};

let imagesLoaded = 0;
const images = [];

function preloadImages() {
    for (var i = 1; i <= frames.maxIndex; i++) {
        const imageUrl = `./assets/frame_${i.toString().padStart(4, '0')}.jpg`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === frames.maxIndex) {
                loadImage(frames.currentIndex);
                console.log("all images loaded");
                animate();
            }
        }
        images.push(img);
    }
}

function loadImage(index) {
    if (index >= 0 && index <= frames.maxIndex && images[index] != null) {
        const img = images[index];
        if (!img.complete) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY = (canvas.height - newHeight) / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingQuality = "high";
        context.imageSmoothingEnabled = true;
        context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
        frames.currentIndex = index;
    } else {
        console.error(`Image at index ${index} is undefined or not loaded`);
    }
}

function animate() {
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".parent",
            start: "top top",
            scrub: 2,
            end: "bottom bottom",
            markers: true,
        }
    });

    tl.to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: function () {
            loadImage(Math.floor(frames.currentIndex));
        }
    })
}
preloadImages();