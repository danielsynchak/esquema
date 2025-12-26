const swiper = new Swiper('.card-wrapper1', {
  spaceBetween: 30,
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickble: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    }, 
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
}
  
});