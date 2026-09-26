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

Promise.all([
    loadShellPart("_includes/header.html", "site-header"),
    loadShellPart("_includes/alumni-modal.html", "alumni-modal"),
    loadShellPart("_includes/footer.html", "site-footer")
]).then(() => {
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
