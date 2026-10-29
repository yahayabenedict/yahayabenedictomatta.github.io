/* =========================================================
   BECKY LUXE BEADS — VANILLA JAVASCRIPT
   Replace the values below with the business owner's real details.
   ========================================================= */

const BUSINESS_CONFIG = {
  businessName: "Becky Luxe Beads",
  // International format for Nigeria: 234 + number without the leading 0
  // (a number typed as 0808... is converted automatically).
  whatsappNumber: "2348081186864",
  instagram: "#",
  facebook: "#",
  tiktok: "#",
  email: "example@email.com",
  phone: "08081186864",
};

/* ---------- WhatsApp helpers ---------- */
function normalizeWhatsappNumber(raw) {
  let digits = String(raw).replace(/\D/g, "");
  // Local Nigerian format 0XXXXXXXXXX -> 234XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith("0"))
    digits = "234" + digits.slice(1);
  return digits;
}

const WHATSAPP_NUMBER = normalizeWhatsappNumber(BUSINESS_CONFIG.whatsappNumber);
const WHATSAPP_READY = /^[1-9]\d{9,14}$/.test(WHATSAPP_NUMBER);

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function warnWhatsappMissing() {
  alert(
    "WhatsApp ordering is not set up yet. Add a valid WhatsApp number in script.js."
  );
}

function openWhatsapp(message) {
  const url = whatsappUrl(message);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  // If the browser blocked the popup, open WhatsApp in the same tab instead.
  if (!win) window.location.href = url;
}

document.addEventListener("DOMContentLoaded", () => {
  /* 1. MOBILE HAMBURGER MENU */
  const menuToggle = document.querySelector("#menuToggle");
  const navMenu = document.querySelector("#primaryMenu");

  const setMenu = (open) => {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  menuToggle?.addEventListener("click", () =>
    setMenu(!navMenu.classList.contains("open"))
  );

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Close the menu with Escape or by tapping outside it
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu?.classList.contains("open")) {
      setMenu(false);
      menuToggle?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navMenu?.classList.contains("open")) return;
    if (navMenu.contains(event.target) || menuToggle.contains(event.target))
      return;
    setMenu(false);
  });

  /* 2. SMOOTH SCROLLING
     Handled by CSS (html { scroll-behavior: smooth }) plus scroll-margin-top
     on sections, so the sticky header never covers headings. */

  /* 3. PRODUCT FILTERING */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      productCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });

  /* 4–5. GALLERY LIGHTBOX + PREVIOUS/NEXT */
  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxClose = document.querySelector("#lightboxClose");
  const lightboxPrev = document.querySelector("#lightboxPrev");
  const lightboxNext = document.querySelector("#lightboxNext");
  let currentGalleryIndex = 0;

  const openGallery = (index) => {
    currentGalleryIndex = index;
    const source = galleryItems[currentGalleryIndex]?.querySelector("img");
    if (!source) return;
    lightboxImage.src = source.src;
    lightboxImage.alt = source.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const changeGallery = (direction) => {
    currentGalleryIndex =
      (currentGalleryIndex + direction + galleryItems.length) %
      galleryItems.length;
    openGallery(currentGalleryIndex);
  };

  galleryItems.forEach((item, index) =>
    item.addEventListener("click", () => openGallery(index))
  );
  lightboxClose?.addEventListener("click", closeGallery);
  lightboxPrev?.addEventListener("click", () => changeGallery(-1));
  lightboxNext?.addEventListener("click", () => changeGallery(1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeGallery();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("open")) return;
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") changeGallery(-1);
    if (event.key === "ArrowRight") changeGallery(1);
  });

  /* 6. FAQ — ONLY ONE OPEN AT A TIME */
  document.querySelectorAll(".faq-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".faq-list details").forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  /* 7. TESTIMONIAL CAROUSEL */
  const track = document.querySelector("#testimonialTrack");
  const slides = [...document.querySelectorAll(".testimonial")];
  const dotsContainer = document.querySelector("#testimonialDots");
  let testimonialIndex = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (index === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => showTestimonial(index));
    dotsContainer?.appendChild(dot);
  });

  function showTestimonial(index) {
    if (!slides.length) return;
    testimonialIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    document
      .querySelectorAll(".dot")
      .forEach((dot, i) =>
        dot.classList.toggle("active", i === testimonialIndex)
      );
  }

  document
    .querySelector("#testimonialPrev")
    ?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
  document
    .querySelector("#testimonialNext")
    ?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));

  /* 8. WHATSAPP ORDER LINKS
     Every .whatsapp-link (hero, product "Order Now", offer, custom order,
     contact, footer) becomes a real link to your WhatsApp DM with a
     pre-filled message. Real hrefs also work with right-click / long-press
     and are not blocked by popup blockers. */
  const defaultMessage = `Hello ${BUSINESS_CONFIG.businessName}, I would like to make an inquiry about your products.`;

  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    const message = link.dataset.message || defaultMessage;

    if (!WHATSAPP_READY) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        warnWhatsappMissing();
      });
      return;
    }

    link.href = whatsappUrl(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  /* 9–10. CONTACT FORM VALIDATION + DYNAMIC WHATSAPP MESSAGE */
  const form = document.querySelector("#inquiryForm");

  function setError(field, message) {
    const group = field.closest(".form-group");
    group.classList.toggle("invalid", Boolean(message));
    group.querySelector(".error-message").textContent = message;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.name;
    const phone = form.elements.phone;
    const email = form.elements.email;
    const product = form.elements.product;
    const message = form.elements.message;
    let valid = true;

    [name, phone, email, product, message].forEach((field) =>
      setError(field, "")
    );

    if (name.value.trim().length < 2) {
      setError(name, "Please enter your name.");
      valid = false;
    }

    if (!/^[0-9+()\-\s]{7,20}$/.test(phone.value.trim())) {
      setError(phone, "Please enter a valid phone number.");
      valid = false;
    }

    if (
      email.value.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
    ) {
      setError(email, "Please enter a valid email address.");
      valid = false;
    }

    if (!product.value) {
      setError(product, "Please select a product or category.");
      valid = false;
    }

    if (message.value.trim().length < 5) {
      setError(message, "Please tell us what you are looking for.");
      valid = false;
    }

    if (!valid) return;

    if (!WHATSAPP_READY) {
      warnWhatsappMissing();
      return;
    }

    const text = [
      `Hello ${BUSINESS_CONFIG.businessName},`,
      ``,
      `I would like to make an inquiry.`,
      ``,
      `Name: ${name.value.trim()}`,
      `Phone: ${phone.value.trim()}`,
      `Email: ${email.value.trim() || "Not provided"}`,
      `Product/Category: ${product.value}`,
      `Message: ${message.value.trim()}`,
    ].join("\n");

    openWhatsapp(text);
    form.reset();
  });

  /* 11. SCROLL REVEAL ANIMATIONS */
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));

  /* 12. BACK TO TOP */
  const backToTop = document.querySelector("#backToTop");
  window.addEventListener(
    "scroll",
    () => {
      backToTop?.classList.toggle("show", window.scrollY > 700);
    },
    { passive: true }
  );
  backToTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* 13. ACTIVE NAVIGATION LINK WHILE SCROLLING */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-menu a:not(.nav-cta)")];

  const updateActiveNav = () => {
    let current = "home";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 160) current = section.id;
    });
    navLinks.forEach((link) =>
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      )
    );
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* SOCIAL/CONTACT SETTINGS */
  document
    .querySelectorAll(".instagram-link, .social-instagram-link")
    .forEach((link) => (link.href = BUSINESS_CONFIG.instagram));
  document
    .querySelectorAll(".facebook-link")
    .forEach((link) => (link.href = BUSINESS_CONFIG.facebook));
  document
    .querySelectorAll(".tiktok-link")
    .forEach((link) => (link.href = BUSINESS_CONFIG.tiktok));

  document.querySelectorAll(".email-link").forEach((link) => {
    link.href = `mailto:${BUSINESS_CONFIG.email}`;
  });
  document
    .querySelectorAll(".email-text")
    .forEach((el) => (el.textContent = BUSINESS_CONFIG.email));
  document
    .querySelectorAll(".phone-text")
    .forEach((el) => (el.textContent = BUSINESS_CONFIG.phone));
  document.querySelectorAll(".phone-link").forEach((link) => {
    link.href = `tel:${BUSINESS_CONFIG.phone.replace(/\s/g, "")}`;
  });
});
