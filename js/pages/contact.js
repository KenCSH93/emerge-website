let contactCurrentSlide = 0;

function startContactSlideshow() {
  const slides = document.querySelectorAll(".contact-slide");

  if (slides.length <= 1) return;

  setInterval(function () {
    slides[contactCurrentSlide].classList.remove("active");

    contactCurrentSlide =
      (contactCurrentSlide + 1) % slides.length;

    slides[contactCurrentSlide].classList.add("active");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  startContactSlideshow();
});