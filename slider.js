document.addEventListener('DOMContentLoaded', () => {

    const track = document.getElementById('track');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dots');

    // Clone the last slide and put it before the first
    // Clone the first slide and put it after the last
    // This makes wrap-around smooth
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = Array.from(track.children);

    let index = 1;              // start at first real slide
    let isTransitioning = false;

    // Build dots dynamically
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            index = i + 1;
            moveTrack(true);
            updateDots();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // Move the track with translateX
    const moveTrack = (animate = true) => {
        track.style.transition = animate ? 'transform 0.5s ease' : 'none';
        track.style.transform = `translateX(-${index * 100}%)`;
    };

    // Update which dot is active
    const updateDots = () => {
        const realIndex = (index - 1 + slides.length) % slides.length;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    };

    // Next button
    const goNext = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        index++;
        moveTrack(true);
        updateDots();
    };

    // Previous button
    const goPrev = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        index--;
        moveTrack(true);
        updateDots();
    };

    // After transition, check if we landed on a clone. If yes, jump silently.
    track.addEventListener('transitionend', () => {
        isTransitioning = false;

        if (allSlides[index] === firstClone) {
            index = 1;
            moveTrack(false);
        }

        if (allSlides[index] === lastClone) {
            index = allSlides.length - 2;
            moveTrack(false);
        }
    });

    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    });

    // Start at first real slide without animation
    moveTrack(false);

});