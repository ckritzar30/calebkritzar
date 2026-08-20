"use strict";

/* ================================================================ */
/* MOBILE NAVIGATION                                                */
/* ================================================================ */

const navigationToggle = document.querySelector(".navigation-toggle");
const navigationMenu = document.querySelector(".navigation-menu");

function closeNavigation() {
    if (!navigationToggle || !navigationMenu) {
        return;
    }

    navigationToggle.setAttribute("aria-expanded", "false");
    navigationMenu.classList.remove("is-open");
    document.body.classList.remove("navigation-open");
}

if (navigationToggle && navigationMenu) {
    navigationToggle.addEventListener("click", () => {
        const isOpen =
            navigationToggle.getAttribute("aria-expanded") === "true";

        navigationToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        navigationMenu.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("navigation-open", !isOpen);
    });

    navigationMenu.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            closeNavigation();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 720) {
            closeNavigation();
        }
    });
}

/* ================================================================ */
/* ACTIVE PAGE                                                      */
/* ================================================================ */

const currentPage = document.body.dataset.page;

if (currentPage) {
    const currentNavigationLink = document.querySelector(
        `[data-navigation="${currentPage}"]`
    );

    if (currentNavigationLink) {
        currentNavigationLink.setAttribute(
            "aria-current",
            "page"
        );
    }
}

/* ================================================================ */
/* CURRENT YEAR                                                     */
/* ================================================================ */

const currentYearElements = document.querySelectorAll(
    "[data-current-year]"
);

currentYearElements.forEach((element) => {
    element.textContent = String(new Date().getFullYear());
});

/* ================================================================ */
/* THEME TOGGLE                                                     */
/* ================================================================ */

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const systemThemeQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
);

function getCurrentTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }

    return systemThemeQuery.matches ? "dark" : "light";
}

function updateThemeInterface(theme) {
    if (!themeToggle || !themeIcon) {
        return;
    }

    const nextTheme = theme === "dark" ? "light" : "dark";

    themeIcon.textContent = theme === "dark" ? "☀" : "☾";

    themeToggle.setAttribute(
        "aria-label",
        `Switch to ${nextTheme} theme`
    );

    themeToggle.setAttribute(
        "title",
        `Switch to ${nextTheme} theme`
    );
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    updateThemeInterface(theme);
}

updateThemeInterface(getCurrentTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = getCurrentTheme();
        const nextTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);
    });
}

systemThemeQuery.addEventListener("change", () => {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (!savedTheme) {
        updateThemeInterface(getCurrentTheme());
    }
});

/* ================================================================ */
/* SCROLL PROGRESS                                                  */
/* ================================================================ */

const scrollProgressBar = document.querySelector(
    ".scroll-progress-bar"
);

function updateScrollProgress() {
    if (!scrollProgressBar) {
        return;
    }

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const percentage =
        documentHeight > 0
            ? (window.scrollY / documentHeight) * 100
            : 0;

    scrollProgressBar.style.width =
        `${Math.min(Math.max(percentage, 0), 100)}%`;
}

window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
);

window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();

/* ================================================================ */
/* SCROLL REVEALS                                                   */
/* ================================================================ */

const revealElements = document.querySelectorAll(".reveal");
const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (
    reducedMotionQuery.matches ||
    !("IntersectionObserver" in window)
) {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/* ================================================================ */
/* CLOSE NAVIGATION AFTER HISTORY CHANGES                           */
/* ================================================================ */

window.addEventListener("pageshow", closeNavigation);
