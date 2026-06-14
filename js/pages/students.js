let currentPage = 1;
const studentsPerPage = 8;

let allStudents = getStudents();
let filteredStudents = [...allStudents];

document.addEventListener("DOMContentLoaded", function () {
  populateProgramFilter();
  populateSemesterFilter();
  renderStudents();
  setupFilters();
  renderPagination();
});

function populateProgramFilter() {
  const programFilter = document.getElementById("programFilter");
  if (!programFilter) return;

  const uniquePrograms = [
    ...new Set(allStudents.map((student) => student.program))
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  uniquePrograms.forEach((program) => {
    const option = document.createElement("option");
    option.value = program;
    option.textContent = program;
    programFilter.appendChild(option);
  });
}

function populateSemesterFilter() {
  const semesterFilter = document.getElementById("semesterFilter");
  if (!semesterFilter) return;

  const uniqueSemesters = [
    ...new Set(allStudents.map((student) => student.semester))
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  uniqueSemesters.forEach((semester) => {
    const option = document.createElement("option");
    option.value = semester;
    option.textContent = semester;
    semesterFilter.appendChild(option);
  });
}

function renderStudents() {
  const grid = document.getElementById("studentsGrid");
  if (!grid) return;

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  grid.innerHTML = "";

  paginatedStudents.forEach((student) => {
    const card = document.createElement("div");
    card.className = "student-card";

    const avatarHTML = student.image
      ? `<img src="${student.image}" alt="${student.name}" />`
      : `
        <svg class="user-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `;

    card.innerHTML = `
      <div class="student-avatar">${avatarHTML}</div>

      <h3>${student.name}</h3>
      <p>${student.program}</p>
      <p>${student.semester || ""}</p>

      <a href="student-profile.html?id=${student.id}" class="btn-secondary">
        View Profile →
      </a>
    `;

    grid.appendChild(card);
  });

  updateResultsCount();
}

function updateResultsCount() {
  const resultsCount = document.getElementById("resultsCount");
  if (!resultsCount) return;

  const total = filteredStudents.length;

  if (total === 0) {
    resultsCount.textContent = "Showing 0 students";
    return;
  }

  const startIndex = (currentPage - 1) * studentsPerPage + 1;
  const endIndex = Math.min(startIndex + studentsPerPage - 1, total);

  resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} students`;
}

function setupFilters() {
  const searchInput = document.getElementById("studentSearchInput");
  const programFilter = document.getElementById("programFilter");
  const semesterFilter = document.getElementById("semesterFilter");
  const resetButton = document.getElementById("resetFilters");

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (programFilter) {
    programFilter.addEventListener("change", applyFilters);
  }

  if (semesterFilter) {
    semesterFilter.addEventListener("change", applyFilters);
  }

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      if (programFilter) programFilter.value = "";
      if (semesterFilter) semesterFilter.value = "";
      applyFilters();
    });
  }
}

function applyFilters() {
  const searchInput = document.getElementById("studentSearchInput");
  const programFilter = document.getElementById("programFilter");
  const semesterFilter = document.getElementById("semesterFilter");

  const keyword = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const selectedProgram = programFilter ? programFilter.value : "";
  const selectedSemester = semesterFilter ? semesterFilter.value : "";

  filteredStudents = allStudents.filter((student) => {
    const matchName =
      keyword === "" ||
      student.name.toLowerCase().includes(keyword);

    const matchProgram =
      selectedProgram === "" ||
      student.program === selectedProgram;

    const matchSemester =
      selectedSemester === "" ||
      student.semester === selectedSemester;

    return matchName && matchProgram && matchSemester;
  });

  currentPage = 1;

  refreshStudentFilterOptions();

  renderStudents();
  renderPagination();
}

function refreshStudentFilterOptions() {
  const currentProgram = document.getElementById("programFilter")?.value || "";
  const currentSemester = document.getElementById("semesterFilter")?.value || "";

  const availablePrograms = allStudents
    .filter((student) => {
      return currentSemester === "" || student.semester === currentSemester;
    })
    .map((student) => student.program);

  const availableSemesters = allStudents
    .filter((student) => {
      return currentProgram === "" || student.program === currentProgram;
    })
    .map((student) => student.semester);

  updateStudentSelectOptions("programFilter", availablePrograms, currentProgram, "All Programmes");
  updateStudentSelectOptions("semesterFilter", availableSemesters, currentSemester, "All Semesters");
}

function updateStudentSelectOptions(selectId, values, selectedValue, defaultText) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const uniqueValues = [...new Set(values)]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  select.innerHTML = `<option value="">${defaultText}</option>`;

  uniqueValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });

  if (uniqueValues.includes(selectedValue)) {
    select.value = selectedValue;
  } else {
    select.value = "";
  }
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  const prevButton = document.createElement("button");
  prevButton.textContent = "←";
  prevButton.disabled = currentPage === 1;

  prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      renderStudents();
      renderPagination();
    }
  });

  pagination.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;

    if (i === currentPage) {
      pageButton.className = "active";
    }

    pageButton.addEventListener("click", function () {
      currentPage = i;
      renderStudents();
      renderPagination();
    });

    pagination.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "→";
  nextButton.disabled = currentPage === totalPages;

  nextButton.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      renderStudents();
      renderPagination();
    }
  });

  pagination.appendChild(nextButton);
}