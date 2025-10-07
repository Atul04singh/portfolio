import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const navbarToggle = document.getElementById("navbar-toggle");
  const navbarMenu = document.getElementById("navbar-menu");
  const navLinks = document.querySelectorAll(".navbar-link");
  const sections = document.querySelectorAll("section");
  const fadeUpElements = document.querySelectorAll(".fade-up");

  // Toggle mobile menu
  if (navbarToggle) {
    navbarToggle.addEventListener("click", () => {
      navbarToggle.classList.toggle("active");
      navbarMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarToggle && navbarMenu) {
        navbarToggle.classList.remove("active");
        navbarMenu.classList.remove("active");
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navbarToggle && navbarMenu && !navbar.contains(e.target)) {
      navbarToggle.classList.remove("active");
      navbarMenu.classList.remove("active");
    }
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  fadeUpElements.forEach((element) => {
    observer.observe(element);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }

      const navbarToggler = document.querySelector(".navbar-toggler");
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });

  const scrollIndicator = document.querySelector(".scroll-indicator a");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = scrollIndicator.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") !== "#") {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const navbarHeight = navbar.offsetHeight;
          const targetPosition = targetSection.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  const parallaxProjects = document.querySelectorAll(".parallax-project");

  function handleParallaxScroll() {
    const windowHeight = window.innerHeight;

    parallaxProjects.forEach((project, index) => {
      const rect = project.getBoundingClientRect();
      const projectContent = project.querySelector(".parallax-content");

      if (rect.top <= 0 && rect.bottom > windowHeight) {
        const scrollProgress =
          Math.abs(rect.top) / (rect.height - windowHeight);
        const scale = 1 - scrollProgress * 0.1;
        const opacity = 1 - scrollProgress * 0.3;

        if (projectContent) {
          projectContent.style.transform = `scale(${Math.max(0.9, scale)})`;
          projectContent.style.opacity = Math.max(0.7, opacity);
        }
      } else if (rect.top > 0) {
        if (projectContent) {
          projectContent.style.transform = "scale(1)";
          projectContent.style.opacity = "1";
        }
      }
    });
  }

  if (parallaxProjects.length > 0) {
    window.addEventListener("scroll", handleParallaxScroll);
    handleParallaxScroll();
  }

  initCarousels();
});

function initCarousels() {
  const carousels = document.querySelectorAll(".project-carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");

    let currentIndex = 0;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("carousel-dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = carousel.querySelectorAll(".carousel-dot");

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    function moveCarousel(direction) {
      currentIndex += direction;
      if (currentIndex < 0) currentIndex = slides.length - 1;
      if (currentIndex >= slides.length) currentIndex = 0;
      updateCarousel();
    }

    // Attach event listeners
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        moveCarousel(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        moveCarousel(1);
      });
    }

    // Add click to open popup
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img) {
        img.addEventListener("click", () => {
          openImagePopup(img.src, img.alt);
        });
      }
    });
  });
}

function openImagePopup(src, alt) {
  const popup = document.createElement("div");
  popup.className = "image-popup";
  popup.innerHTML = `
    <div class="image-popup-overlay"></div>
    <div class="image-popup-content">
      <button class="image-popup-close">&times;</button>
      <img src="${src}" alt="${alt}">
    </div>
  `;

  document.body.appendChild(popup);

  // Trigger animation
  setTimeout(() => popup.classList.add("active"), 10);

  // Close popup handlers
  const closeBtn = popup.querySelector(".image-popup-close");
  const overlay = popup.querySelector(".image-popup-overlay");

  function closePopup() {
    popup.classList.remove("active");
    setTimeout(() => popup.remove(), 300);
  }

  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);

  // Close on ESC key
  function handleEscape(e) {
    if (e.key === "Escape") {
      closePopup();
      document.removeEventListener("keydown", handleEscape);
    }
  }
  document.addEventListener("keydown", handleEscape);
}
