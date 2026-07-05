const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const certificateCards = document.querySelectorAll("[data-certificate-open]");
const certificateSlide = document.querySelector(".certificate-slide");
const certificateImage = document.querySelector("[data-certificate-image]");
const certificateType = document.querySelector("[data-certificate-type]");
const certificateHeading = document.querySelector("[data-certificate-heading]");
const certificateDescription = document.querySelector(
  "[data-certificate-description]",
);
const certificateThumbs = Array.from(
  document.querySelectorAll("[data-certificate-thumb]"),
);
const certificatePrev = document.querySelector("[data-certificate-prev]");
const certificateNext = document.querySelector("[data-certificate-next]");
const certificateModal = document.querySelector("#certificate-modal");
const modalImage = document.querySelector(".modal-certificate-image");
const modalTitle = document.querySelector("#certificate-modal-title");
const modalMeta = document.querySelector("#certificate-modal-meta");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");

if (window.AOS) {
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
    offset: 90,
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

let activeCertificateIndex = 0;

const setActiveCertificate = (index) => {
  if (
    !certificateSlide ||
    !certificateImage ||
    !certificateType ||
    !certificateHeading ||
    !certificateDescription ||
    !certificateThumbs.length
  ) {
    return;
  }

  activeCertificateIndex =
    (index + certificateThumbs.length) % certificateThumbs.length;

  const activeThumb = certificateThumbs[activeCertificateIndex];
  const {
    certificateSrc,
    certificateTitle,
    certificateType: type,
    certificateDescription: description,
    certificateMeta,
    certificateAlt,
  } = activeThumb.dataset;

  certificateSlide.dataset.certificateSrc = certificateSrc;
  certificateSlide.dataset.certificateTitle = certificateTitle;
  certificateSlide.dataset.certificateMeta = certificateMeta;
  certificateImage.src = certificateSrc;
  certificateImage.alt = certificateAlt;
  certificateType.textContent = type;
  certificateHeading.textContent = certificateTitle;
  certificateDescription.textContent = description;

  certificateThumbs.forEach((thumb, thumbIndex) => {
    const isActive = thumbIndex === activeCertificateIndex;
    thumb.classList.toggle("active", isActive);
    thumb.setAttribute("aria-current", isActive ? "true" : "false");
  });
};

certificateThumbs.forEach((thumb, index) => {
  thumb.addEventListener("click", () => setActiveCertificate(index));
});

certificatePrev?.addEventListener("click", () => {
  setActiveCertificate(activeCertificateIndex - 1);
});

certificateNext?.addEventListener("click", () => {
  setActiveCertificate(activeCertificateIndex + 1);
});

const closeCertificateModal = () => {
  if (!certificateModal) return;

  certificateModal.classList.remove("open");
  certificateModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

const openCertificateModal = (card) => {
  if (!certificateModal || !modalImage || !modalTitle || !modalMeta) return;

  const src = card.dataset.certificateSrc;
  const title = card.dataset.certificateTitle;
  const meta = card.dataset.certificateMeta;

  modalImage.src = src;
  modalImage.alt = `${title} certificate`;
  modalTitle.textContent = title;
  modalMeta.textContent = meta;
  certificateModal.classList.add("open");
  certificateModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

certificateCards.forEach((card) => {
  card.addEventListener("click", () => openCertificateModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCertificateModal(card);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveCertificate(activeCertificateIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveCertificate(activeCertificateIndex + 1);
    }
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeCertificateModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCertificateModal();
  }
});

const setActiveLink = () => {
  let currentId = "";

  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 160;
    const height = section.offsetHeight;

    if (top >= offset && top < offset + height) {
      currentId = section.id;
    }
  });

  navAnchors.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
};

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", () => {
  setActiveLink();
});
