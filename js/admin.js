const isAdmin =
  localStorage.getItem("isAdmin") === "true" ||
  sessionStorage.getItem("isAdmin") === "true";

if (!isAdmin) {
  window.location.href = "login.html";
}

let adminStudents = getStudents();
let adminProjects = getProjects();

document.addEventListener("DOMContentLoaded", function () {
  renderAdminStudents();
  renderAdminProjects();
  setupAdminTabs();

  document.getElementById("studentForm").addEventListener("submit", saveStudent);
  document.getElementById("clearForm").addEventListener("click", clearForm);

  document.getElementById("projectForm").addEventListener("submit", saveProject);
  document
    .getElementById("clearProjectForm")
    .addEventListener("click", clearProjectForm);

  const adminStudentSearch = document.getElementById("adminStudentSearch");
  if (adminStudentSearch) {
    adminStudentSearch.addEventListener("input", renderAdminStudents);
  }

  const adminProjectSearch = document.getElementById("adminProjectSearch");
  if (adminProjectSearch) {
    adminProjectSearch.addEventListener("input", renderAdminProjects);
  }
});

/* NOTIFICATION */

function showAdminNotification(message) {
  alert(message);
}

/* STUDENTS */

function renderAdminStudents() {
  const list = document.getElementById("adminStudentsList");
  list.innerHTML = "";

  const keyword =
    document.getElementById("adminStudentSearch")?.value.trim().toLowerCase() || "";

  const filteredAdminStudents = adminStudents.filter((student) =>
    student.name.toLowerCase().includes(keyword)
  );

  filteredAdminStudents.forEach((student) => {
    const item = document.createElement("div");
    item.className = "admin-item";

    item.innerHTML = `
      <div>
        <strong>${student.name}</strong>
        <p>${student.program}</p>
        <p>${student.semester || ""}</p>
      </div>

      <div>
        <button onclick="editStudent(${student.id})" class="btn-secondary">Edit</button>
        <button onclick="deleteStudent(${student.id})" class="btn-secondary">Delete</button>
      </div>
    `;

    list.appendChild(item);
  });
}

function saveStudent(e) {
  e.preventDefault();

  const idValue = document.getElementById("studentId").value;
  const isEditing = idValue !== "";

  const studentData = {
    id: isEditing ? Number(idValue) : Date.now(),
    name: document.getElementById("studentNameInput").value,
    program: document.getElementById("studentProgramInput").value,
    semester: document.getElementById("studentSemesterInput").value,
    email: document.getElementById("studentEmailInput").value,
    phone: document.getElementById("studentPhoneInput").value,
    linkedin: document.getElementById("studentLinkedinInput").value,
    image: document.getElementById("studentImageInput").value,
    about: document.getElementById("studentAboutInput").value,
  };

  if (isEditing) {
    adminStudents = adminStudents.map((student) =>
      student.id === Number(idValue) ? studentData : student
    );
  } else {
    adminStudents.push(studentData);
  }

  saveStudents(adminStudents);
  clearForm();
  renderAdminStudents();

  if (isEditing) {
    showAdminNotification("Student details have been updated successfully.");
  } else {
    showAdminNotification("New student has been added successfully.");
  }
}

function editStudent(id) {
  const student = adminStudents.find((student) => student.id === id);
  if (!student) return;

  document.getElementById("studentId").value = student.id;
  document.getElementById("studentNameInput").value = student.name || "";
  document.getElementById("studentProgramInput").value = student.program || "";
  document.getElementById("studentSemesterInput").value = student.semester || "";
  document.getElementById("studentEmailInput").value = student.email || "";
  document.getElementById("studentPhoneInput").value = student.phone || "";
  document.getElementById("studentLinkedinInput").value = student.linkedin || "";
  document.getElementById("studentImageInput").value = student.image || "";
  document.getElementById("studentAboutInput").value = student.about || "";

  document.getElementById("studentForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  adminStudents = adminStudents.filter((student) => student.id !== id);

  saveStudents(adminStudents);
  renderAdminStudents();
  showAdminNotification("Student has been deleted successfully.");
}

function clearForm() {
  document.getElementById("studentForm").reset();
  document.getElementById("studentId").value = "";
}

/* PROJECTS */

function renderAdminProjects() {
  const list = document.getElementById("projectAdminList");
  if (!list) return;

  list.innerHTML = "";

  const keyword =
    document.getElementById("adminProjectSearch")?.value.trim().toLowerCase() || "";

  const filteredAdminProjects = adminProjects.filter((project) =>
    project.title.toLowerCase().includes(keyword)
  );

  filteredAdminProjects.forEach((project) => {
    const item = document.createElement("div");
    item.className = "admin-item";

    item.innerHTML = `
      <div>
        <strong>${project.title}</strong>
        <p>${project.student}</p>
      </div>

      <div>
        <button onclick="editProject(${project.id})" class="btn-secondary">Edit</button>
        <button onclick="deleteProject(${project.id})" class="btn-secondary">Delete</button>
      </div>
    `;

    list.appendChild(item);
  });
}

function saveProject(e) {
  e.preventDefault();

  const idValue = document.getElementById("projectId").value;
  const isEditing = idValue !== "";

  const tags = document
    .getElementById("projectTags")
    .value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const images = document
    .getElementById("projectImages")
    .value
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);

  const projectData = {
    id: isEditing ? Number(idValue) : Date.now(),
    title: document.getElementById("projectTitle").value,
    student: document.getElementById("projectStudent").value,
    date: document.getElementById("projectDate").value,
    category: document.getElementById("projectCategory").value,
    programme: document.getElementById("projectProgramme").value,
    overview: document.getElementById("projectOverview").value,
    document: document.getElementById("projectDocument").value,
    tags: tags,
    images: images,
  };

  if (isEditing) {
    adminProjects = adminProjects.map((project) =>
      project.id === Number(idValue) ? projectData : project
    );
  } else {
    adminProjects.push(projectData);
  }

  saveProjects(adminProjects);
  clearProjectForm();
  renderAdminProjects();

  if (isEditing) {
    showAdminNotification("Project details have been updated successfully.");
  } else {
    showAdminNotification("New project has been added successfully.");
  }
}

function editProject(id) {
  const project = adminProjects.find((project) => project.id === id);
  if (!project) return;

  document.getElementById("projectId").value = project.id;
  document.getElementById("projectTitle").value = project.title || "";
  document.getElementById("projectStudent").value = project.student || "";
  document.getElementById("projectDate").value = project.date || "";
  document.getElementById("projectCategory").value = project.category || "";
  document.getElementById("projectProgramme").value = project.programme || "";
  document.getElementById("projectOverview").value = project.overview || "";
  document.getElementById("projectDocument").value = project.document || "";

  document.getElementById("projectTags").value = Array.isArray(project.tags)
    ? project.tags.join(", ")
    : "";

  document.getElementById("projectImages").value = Array.isArray(project.images)
    ? project.images.join(", ")
    : "";

  document.getElementById("projectForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteProject(id) {
  if (!confirm("Are you sure you want to delete this project?")) return;

  adminProjects = adminProjects.filter((project) => project.id !== id);

  saveProjects(adminProjects);
  renderAdminProjects();
  showAdminNotification("Project has been deleted successfully.");
}

function clearProjectForm() {
  document.getElementById("projectForm").reset();
  document.getElementById("projectId").value = "";
}

/* TABS */

function setupAdminTabs() {
  const tabs = document.querySelectorAll(".admin-tab");
  const contents = document.querySelectorAll(".admin-tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
}