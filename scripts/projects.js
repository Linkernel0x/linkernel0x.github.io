document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("projects-list");
    if (!container) return;

    container.innerHTML = "<p style='text-align:center; grid-column: 1/-1; color: var(--text-muted); font-family: var(--font-mono);'>ls: loading projects...</p>";

    try {
        const data = await getData();
        renderProjects(data.projects);
    } catch (error) {
        console.error("Error obtaining projects:", error);
        container.innerHTML = "<p style='text-align:center; color: var(--accent-red); grid-column: 1/-1; font-family: var(--font-mono);'>Error: Failed to fetch projects.</p>";
    }
});

function renderProjects(projects) {
    const container = document.getElementById("projects-list");
    container.innerHTML = "";

    if (!projects || projects.length === 0) {
        container.innerHTML = "<p style='font-size:14px; color: var(--text-muted); text-align:center; grid-column: 1/-1; font-family: var(--font-mono);'>No projects found.</p>";
        return;
    }

    projects.forEach((project) => {
        const item = document.createElement("div");
        item.className = "project-card";

        const title = project.name || project.title || "Untitled Project";
        const status = project.status_dot || project.status || "dev";
        const meta = project.project_meta || project.meta || "";
        const description = project.description || "";

        const badgesContainer = document.createElement("div");
        badgesContainer.className = "skills-cloud";

        const badges = project.badges || project.skills || [];
        badges.forEach((badgeObj) => {
            const badgeEl = document.createElement("span");
            badgeEl.className = "skill-badge";

            const badgeName = typeof badgeObj === "string"
                ? badgeObj
                : (badgeObj.badge || badgeObj.name || badgeObj.title || "");

            const badgeIcon = badgeObj.icon ? `<i class="${badgeObj.icon}"></i> ` : "";

            if (badgeName) {
                badgeEl.innerHTML = `${badgeIcon}${badgeName.trim()}`;
                badgesContainer.appendChild(badgeEl);
            }
        });

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "project-actions";

        const buttons = project.buttons || project.links || [];
        buttons.forEach((button) => {
            const btnEl = document.createElement("a");

            if (button.type === "disabled" || button.type === 1 || button.disabled) {
                btnEl.className = "btn btn-outline btn-disabled";
            } else {
                btnEl.className = "btn btn-outline";
            }

            if (button.link || button.url) {
                btnEl.href = button.link || button.url;
                btnEl.target = "_blank";
                btnEl.rel = "noopener noreferrer";
            }

            const btnName = button.text || button.title || button.name || button.label || "Link";
            const btnIcon = button.icon ? `<i class="${button.icon}"></i> ` : "";

            btnEl.innerHTML = `${btnIcon}${btnName.trim()}`;
            buttonsContainer.appendChild(btnEl);
        });

        const contentDiv = document.createElement("div");
        contentDiv.className = "project-content";
        contentDiv.innerHTML = `
            <div class="project-header">
                <h3>${title}</h3>
                <span class="status-dot ${status}" title="Status: ${status}"></span>
            </div>
            ${meta ? `<div class="project-meta">${meta}</div>` : ""}
            <p class="project-description">${description}</p>
        `;

        contentDiv.appendChild(badgesContainer);
        item.appendChild(contentDiv);
        item.appendChild(buttonsContainer);

        container.appendChild(item);
    });
}