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
        516: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        1024: {
            slidesPerView: 4,
        },
    }

});


//sidebar

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("headerMenu");
  const menu = document.getElementById("headerMenuPanel");

  // Criar overlay
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  function openMenu() {
    menu.classList.add("is-open");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
    button.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
  }

  // Botão menu
  button.addEventListener("click", function () {
    menu.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  // Clique no overlay fecha
  overlay.addEventListener("click", closeMenu);

  // ESC fecha
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
});












