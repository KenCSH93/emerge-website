const isAdminLoggedIn =
  localStorage.getItem("isAdmin") === "true" ||
  sessionStorage.getItem("isAdmin") === "true";

const authLink = isAdminLoggedIn
  ? `<li><a href="#" id="logoutBtn" class="login-link">Logout</a></li>`
  : `<li><a href="login.html" class="login-link">Login</a></li>`;

const headerHTML = `
  <nav class="nav">
    <div class="nav-container">
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="students.html">Students</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="admin.html">Admin</a></li>
        ${authLink}
      </ul>
    </div>
  </nav>
`;

const footerHTML = `
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-main">
        <div>
          <h3>UNITY COLLECTIVE</h3>
          <p>A platform to showcase and support Emerge students, staff and managers.</p>
        </div>

        <div>
          <h3>CONTACT US</h3>
          <p>helpdesk@ara.ac.nz</p>
          <p>03 740 8000</p>
        </div>
      </div>

      <div class="footer-bottom">
        © 2026 Unity Collective
      </div>
    </div>
  </footer>
`;

document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header");
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
  }

  const footerContainer = document.getElementById("footer");
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }

  highlightActivePage();
  setupLogout();
});

function highlightActivePage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();

      localStorage.removeItem("isAdmin");
      sessionStorage.removeItem("isAdmin");

      window.location.href = "login.html";
    });
  }
}