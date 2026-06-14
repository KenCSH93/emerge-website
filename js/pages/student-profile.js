function getStudentIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("id"));
}

function findStudentById(id) {
  const allStudents = getStudents();
  return allStudents.find((student) => student.id === id);
}

document.addEventListener("DOMContentLoaded", function () {
  const studentId = getStudentIdFromURL();

  if (!studentId) {
    window.location.href = "students.html";
    return;
  }

  const student = findStudentById(studentId);

  if (!student) {
    alert("Student not found");
    window.location.href = "students.html";
    return;
  }

  renderStudentProfile(student);
});

function renderStudentProfile(student) {
  document.title = `${student.name} - Unity Collective`;

  document.getElementById("studentName").textContent = student.name;
  document.getElementById("studentProgram").textContent = student.program;
  document.getElementById("studentSemester").textContent = student.semester || "";

  const studentImage = document.getElementById("studentImage");

  if (studentImage) {
    if (student.image) {
      studentImage.src = student.image;
      studentImage.alt = student.name;
      studentImage.style.display = "block";
    } else {
      studentImage.style.display = "none";
    }
  }

  const contactInfoElement = document.getElementById("contactInfo");
  let contactHTML = "";

  if (student.email) {
    contactHTML += `
      <p>Email:
        <a href="mailto:${student.email}">
          ${student.email}
        </a>
      </p>
    `;
  }

  if (student.phone) {
    contactHTML += `<p>Phone: ${student.phone}</p>`;
  }

  if (student.linkedin) {
    contactHTML += `
      <p>LinkedIn:
        <a href="https://${student.linkedin}" target="_blank" rel="noreferrer">
          ${student.linkedin}
        </a>
      </p>
    `;
  }

  contactInfoElement.innerHTML = contactHTML;

  const aboutElement = document.getElementById("studentAbout");

  if (student.about) {
    aboutElement.innerHTML = student.about
      .split("\n\n")
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  } else {
    aboutElement.textContent = "No information available.";
  }

  renderStudentProjects(student.name);
}

function renderStudentProjects(studentName) {
  const projectsGrid = document.getElementById("studentProjects");
  if (!projectsGrid) return;

  const allProjects = getProjects();

  const studentProjects = allProjects.filter((project) => {
    const projectStudent = project.student || "";

    return (
      projectStudent.trim().toLowerCase() ===
      studentName.trim().toLowerCase()
    );
  });

  projectsGrid.innerHTML = "";

  if (studentProjects.length === 0) {
    projectsGrid.innerHTML = "<p>No projects found for this student.</p>";
    return;
  }

  studentProjects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <div class="project-card-content">
        <h3>${project.title}</h3>
        <p>${project.student}</p>
        <p>${project.date}</p>

        <a href="project-details.html?id=${project.id}" class="btn-secondary">
          See More
        </a>
      </div>
    `;

    projectsGrid.appendChild(card);
  });
}