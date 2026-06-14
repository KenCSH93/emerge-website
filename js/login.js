document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember").checked;

    if (email === "admin@emerge.com" && password === "12345") {
      if (rememberMe) {
        localStorage.setItem("isAdmin", "true");
        sessionStorage.removeItem("isAdmin");
      } else {
        sessionStorage.setItem("isAdmin", "true");
        localStorage.removeItem("isAdmin");
      }

      window.location.href = "admin.html";
    } else {
      alert("Wrong email or password");
    }
  });
});