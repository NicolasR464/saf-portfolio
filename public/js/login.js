const eyes = document.querySelectorAll(".eye-toggle");
const icons = document.querySelectorAll(".fa-regular");
const pwds = document.querySelectorAll(".pwd");
const pwd = document.querySelector("#pwd");

eyes.forEach((eye) => {
  eye.addEventListener("click", () => {
    icons.forEach((icon) => {
      if (icon.classList.contains("fa-eye")) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        if (pwds.length > 0) {
          pwds.forEach((pwd) => {
            pwd.setAttribute("type", "text");
          });
        } else {
          pwd.setAttribute("type", "text");
        }
      } else {
        icon.classList.add("fa-eye");
        icon.classList.remove("fa-eye-slash");
        if (pwds.length > 0) {
          pwds.forEach((pwd) => {
            pwd.setAttribute("type", "password");
          });
        } else {
          pwd.setAttribute("type", "password");
        }
      }
    });
  });
});
