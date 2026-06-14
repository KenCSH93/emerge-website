let projectCurrentSlide = 0;
const projectsPerSlide = 4;

document.addEventListener("DOMContentLoaded", function () {
  createSliderStructure();
  renderFeaturedProjects();
  startProjectAutoSlide();
  setupHomeSearch();
  startHeroSlideshow();
});

/* Featured Projects Slider */
function createSliderStructure() {
  const container = document.getElementById("featuredProjects");
  if (!container) return;

  container.classList.add("featured-slider");
  container.innerHTML = `<div class="featured-track" id="featuredTrack"></div>`;
}

function renderFeaturedProjects() {
  const track = document.getElementById("featuredTrack");
  if (!track) return;

  track.innerHTML = "";

  const allProjects =
    typeof getProjects === "function" ? getProjects() : projects;

  const totalSlides = Math.ceil(allProjects.length / projectsPerSlide);

  for (let i = 0; i < totalSlides; i++) {
    const slide = document.createElement("div");
    slide.className = "featured-slide";

    const startIndex = i * projectsPerSlide;
    const endIndex = startIndex + projectsPerSlide;
    const slideProjects = allProjects.slice(startIndex, endIndex);

    slideProjects.forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <div class="project-card-content">
          <h3>${project.title}</h3>
          <p>${project.student}</p>
          <p>${project.date}</p>
          <a href="project-details.html?id=${project.id}" class="btn-secondary">
            View
          </a>
        </div>
      `;

      slide.appendChild(card);
    });

    track.appendChild(slide);
  }

  updateProjectSlide();
}

function updateProjectSlide() {
  const track = document.getElementById("featuredTrack");
  if (!track) return;

  track.style.transform = `translateX(-${projectCurrentSlide * 100}%)`;
}

function startProjectAutoSlide() {
  const allProjects =
    typeof getProjects === "function" ? getProjects() : projects;

  const totalSlides = Math.ceil(allProjects.length / projectsPerSlide);
  if (totalSlides <= 1) return;

  setInterval(function () {
    projectCurrentSlide++;

    if (projectCurrentSlide >= totalSlides) {
      projectCurrentSlide = 0;
    }

    updateProjectSlide();
  }, 4000);
}

/* Hero Image Slideshow */
let heroCurrentSlide = 0;

function startHeroSlideshow() {
  const heroSlides = document.querySelectorAll(".hero-slide");
  if (heroSlides.length <= 1) return;

  setInterval(function () {
    heroSlides[heroCurrentSlide].classList.remove("active");

    heroCurrentSlide = (heroCurrentSlide + 1) % heroSlides.length;

    heroSlides[heroCurrentSlide].classList.add("active");
  }, 3000);
}

/* Home Search */
function setupHomeSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchInput || !searchResults) return;

  searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.trim().toLowerCase();

    searchResults.innerHTML = "";

    if (keyword === "") {
      searchResults.style.display = "none";
      return;
    }

    const allStudents =
      typeof getStudents === "function" ? getStudents() : students;

    const allProjects =
      typeof getProjects === "function" ? getProjects() : projects;

    const matchedStudents = allStudents.filter((student) =>
      student.name.toLowerCase().includes(keyword)
    );

    const matchedProjects = allProjects.filter((project) =>
      project.title.toLowerCase().includes(keyword)
    );

    const matchedTags = [
      ...new Set(
        allProjects.flatMap((project) =>
          Array.isArray(project.tags)
            ? project.tags.filter((tag) =>
                tag.toLowerCase().includes(keyword)
              )
            : []
        )
      ),
    ];

    if (
      matchedStudents.length === 0 &&
      matchedProjects.length === 0 &&
      matchedTags.length === 0
    ) {
      searchResults.innerHTML = `
        <div class="search-result-item">
          No result found
        </div>
      `;
      searchResults.style.display = "block";
      return;
    }

    if (matchedStudents.length > 0) {
      const studentTitle = document.createElement("div");
      studentTitle.className = "search-category";
      studentTitle.textContent = "Students";
      searchResults.appendChild(studentTitle);

      matchedStudents.forEach((student) => {
        const item = document.createElement("a");
        item.href = `student-profile.html?id=${student.id}`;
        item.className = "search-result-item";
        item.textContent = student.name;
        searchResults.appendChild(item);
      });
    }

    if (matchedProjects.length > 0) {
      const projectTitle = document.createElement("div");
      projectTitle.className = "search-category";
      projectTitle.textContent = "Projects";
      searchResults.appendChild(projectTitle);

      matchedProjects.forEach((project) => {
        const item = document.createElement("a");
        item.href = `project-details.html?id=${project.id}`;
        item.className = "search-result-item";
        item.textContent = project.title;
        searchResults.appendChild(item);
      });
    }

    if (matchedTags.length > 0) {
      const tagTitle = document.createElement("div");
      tagTitle.className = "search-category";
      tagTitle.textContent = "Tags";
      searchResults.appendChild(tagTitle);

      matchedTags.forEach((tag) => {
        const item = document.createElement("a");
        item.href = `projects.html?tag=${encodeURIComponent(tag)}`;
        item.className = "search-result-item";
        item.textContent = tag;
        searchResults.appendChild(item);
      });
    }

    searchResults.style.display = "block";
  });
}