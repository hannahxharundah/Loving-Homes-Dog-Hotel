const carousel = document.querySelector("[data-carousel]");
const track = document.querySelector("[data-carousel-track]");
const dotsWrap = document.querySelector("[data-carousel-dots]");

if (carousel && track && dotsWrap) {
  const slides = Array.from(track.children);

  slides.forEach((slide) => {
    track.appendChild(slide.cloneNode(true));
  });

  dotsWrap.innerHTML = "";
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const countItems = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;
      const target = Number(el.getAttribute("data-count")) || 0;
      const duration = 1100;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toString();
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.35 }
);

countItems.forEach((item) => countObserver.observe(item));

const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 4;
    const rotateX = -((y - centerY) / centerY) * 4;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const parallaxHero = document.querySelector("[data-parallax]");
if (parallaxHero) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    parallaxHero.style.backgroundPosition = `center ${scrollY * 0.08}px`;
  });
}

const packageCards = document.querySelectorAll("[data-package-card]");
if (packageCards.length) {
  const setSelectedPackage = (activeCard) => {
    packageCards.forEach((card) => {
      const isActive = card === activeCard;
      card.classList.toggle("is-selected", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  packageCards.forEach((card) => {
    card.addEventListener("click", () => setSelectedPackage(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSelectedPackage(card);
      }
    });
  });
}

const mainContent = document.querySelector("main");
if (mainContent && !mainContent.id) {
  mainContent.id = "main-content";
}

if (!document.querySelector(".skip-link")) {
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.className = "skip-link";
  skipLink.textContent = "Skip to main content";
  document.body.prepend(skipLink);
}

const navBars = document.querySelectorAll(".navbar");
navBars.forEach((navBar, index) => {
  const navLinksEl = navBar.querySelector(".nav-links");
  if (!navLinksEl || navBar.querySelector(".menu-toggle")) {
    return;
  }

  const navId = `site-nav-${index + 1}`;
  navLinksEl.id = navId;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "menu-toggle";
  toggleBtn.setAttribute("aria-expanded", "false");
  toggleBtn.setAttribute("aria-controls", navId);
  toggleBtn.innerHTML = '<span class="menu-toggle-icon" aria-hidden="true"></span> Menu';

  navBar.prepend(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinksEl.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      navLinksEl.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
});
