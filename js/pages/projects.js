let currentPage = 1;
const projectsPerPage = 8;

let allProjects = getProjects();
let filteredProjects = [...allProjects];

document.addEventListener("DOMContentLoaded", function () {
  populateFilters();
  setupFilters();

  applyTagFromURL();
  applyFilters();
});

function populateFilters() {
  refreshFilterOptions();
}

function setupFilters() {
  const searchInput = document.getElementById("projectSearchInput");

  const filterIds = [
    "categoryFilter",
    "programmeFilter",
    "semesterFilter",
    "tagFilter",
  ];

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentPage = 1;
      applyFilters();
    });
  }

  filterIds.forEach((id) => {
    const filter = document.getElementById(id);

    if (filter) {
      filter.addEventListener("change", function () {
        currentPage = 1;
        applyFilters();
      });
    }
  });

  const resetButton = document.getElementById("resetProjectFilters");

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";

      filterIds.forEach((id) => {
        const filter = document.getElementById(id);
        if (filter) filter.value = "";
      });

      currentPage = 1;
      applyFilters();
    });
  }
}

function applyTagFromURL() {
  const params = new URLSearchParams(window.location.search);
  const tag = params.get("tag");

  if (!tag) return;

  const tagFilter = document.getElementById("tagFilter");

  if (tagFilter) {
    tagFilter.value = tag;
  }
}

function applyFilters() {
  const keyword =
    document.getElementById("projectSearchInput")
      ?.value.trim()
      .toLowerCase() || "";

  const category =
    document.getElementById("categoryFilter")?.value || "";

  const programme =
    document.getElementById("programmeFilter")?.value || "";

  const semester =
    document.getElementById("semesterFilter")?.value || "";

  const selectedTag =
    document.getElementById("tagFilter")?.value || "";

  filteredProjects = allProjects.filter((project) => {
    const projectSemester = project.semester || project.date;

    const projectTags = Array.isArray(project.tags)
      ? project.tags
      : [];

    const matchKeyword =
      keyword === "" ||
      project.title.toLowerCase().includes(keyword) ||
      projectTags.some((tag) =>
        tag.toLowerCase().includes(keyword)
      );

    const matchCategory =
      category === "" ||
      project.category === category;

    const matchProgramme =
      programme === "" ||
      project.programme === programme;

    const matchSemester =
      semester === "" ||
      projectSemester === semester;

    const matchTag =
      selectedTag === "" ||
      projectTags.includes(selectedTag);

    return (
      matchKeyword &&
      matchCategory &&
      matchProgramme &&
      matchSemester &&
      matchTag
    );
  });

  currentPage = 1;

  refreshFilterOptions();

  renderProjects();
  renderPagination();
  updateProjectsCount();
}

function refreshFilterOptions() {
  const currentValues = {
    category: document.getElementById("categoryFilter")?.value || "",
    programme: document.getElementById("programmeFilter")?.value || "",
    semester: document.getElementById("semesterFilter")?.value || "",
    tag: document.getElementById("tagFilter")?.value || "",
  };

  updateSelectOptions(
    "categoryFilter",
    getAvailableValues("category", currentValues),
    currentValues.category
  );

  updateSelectOptions(
    "programmeFilter",
    getAvailableValues("programme", currentValues),
    currentValues.programme
  );

  updateSelectOptions(
    "semesterFilter",
    getAvailableValues("semester", currentValues),
    currentValues.semester
  );

  updateSelectOptions(
    "tagFilter",
    getAvailableValues("tag", currentValues),
    currentValues.tag
  );
}

function getAvailableValues(type, currentValues) {
  const availableProjects = allProjects.filter((project) => {
    const projectSemester = project.semester || project.date;
    const projectTags = Array.isArray(project.tags) ? project.tags : [];

    if (
      type !== "category" &&
      currentValues.category &&
      project.category !== currentValues.category
    ) {
      return false;
    }

    if (
      type !== "programme" &&
      currentValues.programme &&
      project.programme !== currentValues.programme
    ) {
      return false;
    }

    if (
      type !== "semester" &&
      currentValues.semester &&
      projectSemester !== currentValues.semester
    ) {
      return false;
    }

    if (
      type !== "tag" &&
      currentValues.tag &&
      !projectTags.includes(currentValues.tag)
    ) {
      return false;
    }

    return true;
  });

  if (type === "category") {
    return [...new Set(availableProjects.map((project) => project.category))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  if (type === "programme") {
    return [...new Set(availableProjects.map((project) => project.programme))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  if (type === "semester") {
    return [
      ...new Set(
        availableProjects.map((project) => project.semester || project.date)
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  if (type === "tag") {
    return [
      ...new Set(
        availableProjects.flatMap((project) =>
          Array.isArray(project.tags) ? project.tags : []
        )
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  return [];
}

function updateSelectOptions(selectId, values, selectedValue) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const firstOptionText = select.options[0]
    ? select.options[0].textContent
    : "All";

  select.innerHTML = `<option value="">${firstOptionText}</option>`;

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });

  if (selectedValue && values.includes(selectedValue)) {
    select.value = selectedValue;
  } else {
    select.value = "";
  }
}

function renderProjects() {
  const projectsContainer = document.getElementById("projectsGrid");
  if (!projectsContainer) return;

  projectsContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  if (paginatedProjects.length === 0) {
    projectsContainer.innerHTML = "<p>No projects found.</p>";
    return;
  }

  paginatedProjects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";

    const tagsHTML = Array.isArray(project.tags)
      ? project.tags.map((tag) => `<span>${tag}</span>`).join("")
      : "";

    card.innerHTML = `
      <div class="project-card-content">
        <h3>${project.title}</h3>
        <p>${project.student}</p>
        <p>${project.category}</p>
        <p>${project.date}</p>

        <div class="tag-list">
          ${tagsHTML}
        </div>

        <a href="project-details.html?id=${project.id}" class="btn-secondary">
          See More
        </a>
      </div>
    `;

    projectsContainer.appendChild(card);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  if (totalPages <= 1) return;

  const prevButton = document.createElement("button");
  prevButton.textContent = "←";
  prevButton.disabled = currentPage === 1;

  prevButton.onclick = function () {
    if (currentPage > 1) {
      currentPage--;
      renderProjects();
      renderPagination();
      updateProjectsCount();
    }
  };

  pagination.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pageButton.onclick = function () {
      currentPage = i;
      renderProjects();
      renderPagination();
      updateProjectsCount();
    };

    pagination.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "→";
  nextButton.disabled = currentPage === totalPages;

  nextButton.onclick = function () {
    if (currentPage < totalPages) {
      currentPage++;
      renderProjects();
      renderPagination();
      updateProjectsCount();
    }
  };

  pagination.appendChild(nextButton);
}

function updateProjectsCount() {
  const countElement = document.getElementById("projectsCount");
  if (!countElement) return;

  const total = filteredProjects.length;

  if (total === 0) {
    countElement.textContent = "Showing 0 projects";
    return;
  }

  const startIndex = (currentPage - 1) * projectsPerPage + 1;
  const endIndex = Math.min(startIndex + projectsPerPage - 1, total);

  countElement.textContent = `Showing ${startIndex}-${endIndex} of ${total} projects`;
}