
const grid = document.getElementById("projectGrid");
const searchInput = document.getElementById("searchInput");
const gradeFilter = document.getElementById("gradeFilter");
const subjectFilter = document.getElementById("subjectFilter");
const projectCount = document.getElementById("projectCount");

const grades = [...new Set(PROJECTS.map(p => p.grade).filter(Boolean))]
  .sort((a,b) => Number(a) - Number(b));
const subjects = [...new Set(PROJECTS.map(p => p.subject).filter(Boolean))]
  .sort((a,b) => a.localeCompare(b));

for (const grade of grades) {
  const option = document.createElement("option");
  option.value = grade;
  option.textContent = `Grade ${grade}`;
  gradeFilter.appendChild(option);
}

for (const subject of subjects) {
  const option = document.createElement("option");
  option.value = subject;
  option.textContent = subject;
  subjectFilter.appendChild(option);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const grade = gradeFilter.value;
  const subject = subjectFilter.value;

  const filtered = PROJECTS.filter(project => {
    const haystack = [
      project.subject,
      project.grade,
      project.title,
      project.abstract,
      project.question,
      project.purpose,
      ...(project.students || [])
    ].join(" ").toLowerCase();

    return (!query || haystack.includes(query)) &&
           (!grade || project.grade === grade) &&
           (!subject || project.subject === subject);
  });

  projectCount.textContent = filtered.length;

  if (!filtered.length) {
    grid.innerHTML = `<div class="project-card"><h3>No projects found</h3><p>Try adjusting your search or filters.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(project => {
    const students = (project.students || [])
      .map(name => `<span>${escapeHTML(name)}</span>`)
      .join("");

    return `
      <article class="project-card">
        <div class="meta">
          <span class="pill">Grade ${escapeHTML(project.grade || "N/A")}</span>
          <span class="pill">${escapeHTML(project.subject || "General Science")}</span>
        </div>
        <h3>${escapeHTML(project.title || "Untitled Project")}</h3>
        <div class="students">
          <strong>Student(s)</strong>
          ${students || "<span>Not listed</span>"}
        </div>
        ${project.question ? `<div class="detail"><strong>Research Question</strong><p>${escapeHTML(project.question)}</p></div>` : ""}
        ${project.purpose ? `<details class="detail"><summary>Purpose</summary><p>${escapeHTML(project.purpose)}</p></details>` : ""}
        ${project.abstract ? `<details class="detail"><summary>Abstract / Project Summary</summary><p>${escapeHTML(project.abstract)}</p></details>` : ""}
      </article>
    `;
  }).join("");
}

searchInput.addEventListener("input", renderProjects);
gradeFilter.addEventListener("change", renderProjects);
subjectFilter.addEventListener("change", renderProjects);

renderProjects();
