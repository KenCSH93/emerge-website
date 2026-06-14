function getProjectIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

document.addEventListener("DOMContentLoaded", function () {
  const projectId = getProjectIdFromURL();

  const allProjects = getProjects();
  const project = allProjects.find((p) => p.id === projectId);

  if (!project) {
    alert("Project not found");
    window.location.href = "projects.html";
    return;
  }

  renderProject(project);
});

function renderProject(project) {
  document.querySelector("h1").textContent = project.title;

  renderProjectImages(project);

  const detailContent = document.querySelector(".project-detail-content");

  detailContent.innerHTML = `
    <h1>${project.title}</h1>

    <p>By ${project.student}</p>
    <p>${project.date}</p>
    <p>${project.category}</p>
    <p>Programme: ${project.programme}</p>

    <div class="detail-divider"></div>

    <section class="detail-section">
      <h2>OVERVIEW</h2>

      <div class="overview-box" style="padding:20px; height:auto;">
        ${(project.overview || "").replace(/\n/g, "<br>")}
      </div>
    </section>

    <section class="detail-section">
      <h2>PROJECT DOCUMENTS</h2>

      <a
        href="${project.document || "#"}"
        download
        class="document-box"
        style="text-decoration:none;"
      >
        Download PDF Here
      </a>
    </section>

    <section class="detail-section">
      <h2>TAGS</h2>

      <div class="tag-list">
        ${(project.tags || [])
          .map((tag) => `<span>${tag}</span>`)
          .join("")}
      </div>
    </section>
  `;
}

function renderProjectImages(project) {
  const imageContainer = document.querySelector(".project-detail-images");
  if (!imageContainer) return;

  if (!project.images || project.images.length === 0) {
    imageContainer.innerHTML = `
      <div class="thumbnail-row">
        <div class="thumbnail">×</div>
        <div class="thumbnail">×</div>
        <div class="thumbnail">×</div>
        <div class="thumbnail">×</div>
      </div>

      <div class="large-project-image">
        <div class="placeholder-image">×</div>
      </div>
    `;
    return;
  }

  imageContainer.innerHTML = `
    <div class="thumbnail-row">
      ${project.images
        .map(
          (img) => `
            <img
              src="${img}"
              class="thumbnail-img"
              alt="${project.title}"
              onclick="changeMainImage('${img}')"
            >
          `
        )
        .join("")}
    </div>

    <img
      src="${project.images[0]}"
      class="large-project-img"
      id="mainProjectImage"
      alt="${project.title}"
      onclick="openImageModal(this.src)"
    >
  `;
}

function changeMainImage(imageSrc) {
  const mainImage = document.getElementById("mainProjectImage");

  if (mainImage) {
    mainImage.src = imageSrc;
  }
}

function openImageModal(imageSrc) {
  let zoomLevel = 1;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let moveX = 0;
  let moveY = 0;

  const modal = document.createElement("div");
  modal.className = "image-modal";

  modal.innerHTML = `
    <button class="close-modal" id="closeModal">×</button>
    <img src="${imageSrc}" class="modal-image" id="modalImage">
  `;

  document.body.appendChild(modal);

  const modalImage = document.getElementById("modalImage");

  function updateTransform() {
    modalImage.style.transform =
      `translate(${moveX}px, ${moveY}px) scale(${zoomLevel})`;
  }

  modal.addEventListener("wheel", function (e) {
    e.preventDefault();

    zoomLevel += e.deltaY < 0 ? 0.15 : -0.15;
    zoomLevel = Math.max(0.5, Math.min(zoomLevel, 5));

    updateTransform();
  });

  modalImage.addEventListener("mousedown", function (e) {
    e.preventDefault();

    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;

    modalImage.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    moveX = e.clientX - startX;
    moveY = e.clientY - startY;

    updateTransform();
  });

  window.addEventListener("mouseup", function () {
    isDragging = false;

    if (modalImage) {
      modalImage.style.cursor = "grab";
    }
  });

  document.getElementById("closeModal").addEventListener("click", function () {
    modal.remove();
  });
}