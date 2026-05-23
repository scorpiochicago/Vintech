document.addEventListener("DOMContentLoaded", () => {
  // 1. THEME TOGGLER
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");
  const currentTheme = localStorage.getItem("theme") || "dark"; // Default to dark

  // Apply the saved theme on page load
  document.body.setAttribute("data-theme", currentTheme);

  // 1a. EmailJS form submission setup
  if (typeof emailjs !== "undefined") {
    emailjs.init({
      publicKey: "3ygpgjDDA8oxXYvv8",
    });
  }

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");

  if (contactStatus && typeof emailjs === "undefined") {
    contactStatus.textContent = "Email service not loaded yet. Please refresh the page.";
    contactStatus.classList.add("error");
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const submitButton = contactForm.querySelector("button[type='submit']");

      if (!contactForm.name.value || !contactForm.email.value || !contactForm.message.value) {
        contactStatus.textContent = "Please fill in every field before sending.";
        contactStatus.classList.add("error");
        return;
      }

      contactStatus.textContent = "Sending message...";
      contactStatus.classList.remove("error", "success");
      submitButton.disabled = true;

      if (typeof emailjs === "undefined" || typeof emailjs.send !== "function") {
        contactStatus.textContent = "Email service unavailable. Open the browser console for details.";
        contactStatus.classList.add("error");
        console.error("EmailJS is not loaded or emailjs.send is unavailable.", window.emailjs);
        submitButton.disabled = false;
        return;
      }

      const templateParams = {
        from_name: contactForm.name.value,
        from_email: contactForm.email.value,
        to_email: "kelyswissgold@gmail.com",
        message: contactForm.message.value,
      };

      emailjs
        .send("service_l4f8f7m", "template_xv5odqp", templateParams)
        .then(() => {
          contactStatus.textContent = "Message sent! I will reply soon.";
          contactStatus.classList.add("success");
          contactForm.reset();
        })
        .catch((error) => {
          console.error("EmailJS error:", error);
          contactStatus.textContent = "Sorry, the message could not be sent. Please try again later.";
          contactStatus.classList.add("error");
        })
        .finally(() => {
          submitButton.disabled = false;
        });
    });
  }
  if (currentTheme === "light") {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }

  themeToggle.addEventListener("click", () => {
    let newTheme =
      document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Update icon
    if (newTheme === "light") {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    } else {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  });

  // 2. MOBILE NAVIGATION
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-links li");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isActive);

      // Toggle icon
      const icon = hamburger.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });
  }

  // Close menu when a link is clicked
  navLinksItems.forEach((li) => {
    li.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      const icon = hamburger.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      const icon = hamburger.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // 3. SCROLL-BASED ANIMATIONS (INTERSECTION OBSERVER)
  const animatedElements = document.querySelectorAll(".anim-on-scroll");

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Optional: stop observing after it's visible
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // Staggered hero animation is handled by CSS now but this ensures the class is added on load for the first section
  document.querySelectorAll(".hero .anim-on-scroll").forEach((el) => {
    el.classList.add("is-visible");
  });

  // 4. SCROLL-TO-TOP BUTTON
  const scrollToTopBtn = document.getElementById("scrollToTop");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
