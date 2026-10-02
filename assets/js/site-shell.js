const shellScript = document.currentScript;
const siteRoot = new URL("../../", shellScript.src);

async function loadShellPart(path, targetId) {
    const response = await fetch(new URL(path, siteRoot));
    if (!response.ok) {
        throw new Error(`Unable to load ${path}: ${response.status} ${response.statusText}`);
    }

    const container = document.getElementById(targetId);
    container.innerHTML = await response.text();
    container.querySelectorAll("a[href^='/'], img[src^='/']").forEach(element => {
        const attribute = element.tagName === "IMG" ? "src" : "href";
        const value = element.getAttribute(attribute);
        element.setAttribute(attribute, new URL(value.slice(1), siteRoot).href);
    });
}

async function loadPagePopup() {
    const popupPath = {
        about: "partials/popups/landing.html",
        alumni: "partials/popups/alumni.html"
    }[document.body.dataset.page];

    if (!popupPath) return;

    const response = await fetch(new URL(popupPath, siteRoot));
    if (!response.ok) {
        throw new Error(`Unable to load ${popupPath}: ${response.status} ${response.statusText}`);
    }

    const container = document.getElementById("page-popup");
    container.innerHTML = await response.text();

    const dialog = container.querySelector("dialog");
    const sessionKey = `iatss_popup_seen_${document.body.dataset.page}`;
    if (sessionStorage.getItem(sessionKey)) return;

    const graphic = dialog.querySelector("[data-popup-graphic]");
    const imagePath = graphic.dataset.imageSrc;
    if (imagePath) {
        const image = new Image();
        image.alt = graphic.dataset.imageAlt || "";
        image.className = "page-popup__image";
        image.hidden = true;
        image.addEventListener("load", () => {
            graphic.replaceChildren(image);
            image.hidden = false;
        });
        const imageProbe = new Image();
        imageProbe.addEventListener("load", () => {
            image.src = new URL(imagePath, siteRoot).href;
        });
        imageProbe.src = new URL(imagePath, siteRoot).href;
    }

    dialog.querySelector("[data-popup-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });
    sessionStorage.setItem(sessionKey, "shown");
    dialog.showModal();
    dialog.querySelector("[data-popup-close]").focus();
}

Promise.all([
    loadShellPart("partials/header.html", "site-header"),
    loadShellPart("partials/alumni-modal.html", "alumni-modal"),
    loadShellPart("partials/footer.html", "site-footer"),
    loadPagePopup()
]).then(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    document.getElementById("theme-toggle-sun-icon").classList.toggle("hidden", !isDarkMode);
    document.getElementById("theme-toggle-moon-icon").classList.toggle("hidden", isDarkMode);

    const activePage = document.body.dataset.page;
    document.querySelectorAll("[data-nav-id]").forEach(link => {
        if (link.dataset.navId !== activePage) return;

        link.setAttribute("aria-current", "page");
        if (link.closest("#mobile-menu")) {
            link.classList.add("text-iatss");
            link.classList.remove("text-apple-text", "dark:text-apple-darktext");
        } else {
            link.classList.add("text-apple-text", "dark:text-apple-darktext", "bg-white", "dark:bg-slate-800", "shadow-sm");
            link.classList.remove("text-apple-secondary", "dark:text-apple-darksecondary", "hover:text-apple-text", "dark:hover:text-apple-darktext");
        }
    });
    document.getElementById("year").textContent = new Date().getFullYear();
});
