const projectId = document.body.dataset.projectId;
const project = window.projectDatabase.find(item => item.id === projectId);

if (!project) {
    throw new Error(`Project data not found for "${projectId}"`);
}

document.title = `${project.name} | IATSS Forum Thailand`;
const article = document.getElementById("project-detail");
document.querySelector("[data-projects-home]").href = new URL("project.html", projectSiteRoot).pathname;
const header = document.createElement("header");
header.className = "space-y-4";

const metadata = document.createElement("div");
metadata.className = "flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider";
[project.sghs, project.dateLabel, project.location].forEach((label, index) => {
    const badge = document.createElement("span");
    badge.className = index === 0
        ? "px-3 py-1 rounded-full bg-iatss-light dark:bg-iatss/20 text-iatss"
        : "px-3 py-1 rounded-full bg-apple-subtle dark:bg-apple-darksubtle text-apple-secondary dark:text-apple-darksecondary";
    badge.textContent = label;
    metadata.appendChild(badge);
});

const title = document.createElement("h1");
title.className = "text-3xl sm:text-5xl font-extrabold tracking-tight";
title.textContent = project.name;
const summary = document.createElement("p");
summary.className = "text-lg leading-relaxed text-apple-secondary dark:text-apple-darksecondary";
summary.textContent = project.detail;
header.append(metadata, title, summary);

const image = document.createElement("img");
image.src = project.image;
image.alt = project.name;
image.className = "protected-img w-full max-h-[28rem] object-cover rounded-3xl apple-shadow-lg";

const description = document.createElement("div");
description.className = "glass-card rounded-3xl p-6 sm:p-10 space-y-5 leading-relaxed text-apple-secondary dark:text-apple-darksecondary";
const paragraph = document.createElement("p");
paragraph.textContent = project.description;
const link = document.createElement("a");
link.href = new URL("project.html", projectSiteRoot).pathname;
link.className = "font-semibold text-iatss hover:underline";
link.textContent = "Explore the other alumni projects →";
description.append(paragraph, link);

article.append(header, image, description);
