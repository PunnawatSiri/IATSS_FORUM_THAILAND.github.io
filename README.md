# IATSS Forum Thailand

This is a static HTML site. You can preview it with VS Code Live Server without a build step.

## Structure

- `index.html`, `project.html`, `people.html`, `alumni.html`, `faq.html`, and `contact.html` are separate pages for the site navigation.
- `assets/` contains the CSS, JavaScript, and image assets. The shared navigation and footer are loaded from `_includes/` by `assets/js/site-shell.js`.
- `projects/` contains the standalone detail pages opened from the project overview.
- `assets/js/project-data.js` contains the project cards, map locations, and detail text.

To preview the site, open this folder in VS Code, right-click `index.html`, and choose **Open with Live Server** (or click **Go Live**).

When adding a project, add its metadata to `assets/js/project-data.js` and create a matching standalone page in `projects/`.
