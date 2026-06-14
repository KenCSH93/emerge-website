function getProjects() {
  const savedProjects = localStorage.getItem("projects");

  if (savedProjects) {
    return JSON.parse(savedProjects);
  }

  localStorage.setItem("projects", JSON.stringify(projects));
  return projects;
}

function saveProjects(updatedProjects) {
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
}