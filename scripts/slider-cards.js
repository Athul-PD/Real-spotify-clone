   function slider(sliders){
   const main_section_carousels = document.querySelector(sliders);

    const track = main_section_carousels.querySelector('.carousel_track');
    const items = main_section_carousels.querySelectorAll('.carousel');
    const carousel_previous_btn = main_section_carousels.querySelector('.previousBtn');
    const carousel_next_btn = main_section_carousels.querySelector('.nextBtn');

    let currentSlide = 0;
    let maxSlide = 0;

    function ItemsPerScreen(){
        if(window.innerWidth >= 900) return 3;
        if(window.innerWidth >= 500) return 2;
        return 1;
    }

    function updateMaxSlide(){
        const visible = ItemsPerScreen();
        maxSlide = items.length - visible;
    }
    function updateslider(){
        const itemWidth = items[0].getBoundingClientRect().width + 24;

        track.style.transform = `translateX(-${currentSlide * itemWidth}px)`;

        if(currentSlide <= 0){
            carousel_previous_btn.style.display = `none`;
        }else{
            carousel_previous_btn.style.display = `block`;
        }

        if(currentSlide >= maxSlide){
            carousel_next_btn.style.display = `none`;
        }else{
            carousel_next_btn.style.display = `block`;
        }
    }

    carousel_next_btn.addEventListener('click',() => {
        const visible = ItemsPerScreen();

        if(currentSlide < maxSlide){
            currentSlide += visible;

            if(currentSlide > maxSlide){
                currentSlide = maxSlide;
            }
            updateslider();
        }

    })

    carousel_previous_btn.addEventListener('click',() => {
        const visible = ItemsPerScreen();

        if(currentSlide > 0){
            currentSlide -= visible;

            if(currentSlide < 0){
                currentSlide = 0;
            }
            updateslider();
        }
    })
    updateMaxSlide();
    updateslider();
}
slider('.main_section_carousels')
slider('.main_section_carousels_2')
slider('.main_section_carousels_3')
slider('.main_section_carousels_4')
slider('.main_section_carousels_5')
slider('.main_section_carousels_6')
slider('.main_section_carousels_7')

// Preview Cards functionality.......
const cards = document.querySelectorAll('.cards')

let currentVideo = null;

cards.forEach(card => {
    const video = card.querySelector('.card_bg_video');
    const previewBtn = card.querySelector('.preview_btn');

    card.addEventListener('mouseenter',() => {
        if(currentVideo !== video){
            video.muted = true;
        }
        video.play();
    })

    card.addEventListener('mouseleave',() => {
        if(currentVideo !== video){
            video.pause();
        }
    })

    previewBtn.addEventListener('click',() => {
        const preview_icon = previewBtn.querySelector('.sound_icon')

        preview_icon.innerHTML = video.muted ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>`:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>`;

        if(currentVideo === video){
            if(video.muted){
                video.muted = false;
                previewBtn.setAttribute("aria-pressed","false");
            }else{
                video.muted = true;
                previewBtn.setAttribute("aria-pressed","true");
                currentVideo = null;
            }
        }else{
            if(currentVideo){
                currentVideo.muted = true;
                currentVideo.pause();
                previewBtn.setAttribute("aria-pressed","false");
            }
            video.muted = false;
            video.play();
            previewBtn.setAttribute("aria-pressed","true");
            currentVideo = video;
        }
    })
})
// input slider........
const inputRange = document.querySelector("input[type='range']")
inputRange.addEventListener('input',() => {
    let value = ((inputRange.value - inputRange.min) / (inputRange.max - inputRange.min)) * 100;

    inputRange.style.background = `linear-gradient(to right,white ${value}%, #555454ff ${value}%)`
})