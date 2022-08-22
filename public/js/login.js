const eyes = document.querySelectorAll(".eye-toggle");
const icons = document.querySelectorAll(".fa-regular");
const pwds = document.querySelectorAll(".pwd");

eyes.forEach((eye) => {
  eye.addEventListener("click", () => {
    console.log("eye click");
    icons.forEach((icon) => {
      if (icon.classList.contains("fa-eye")) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        pwds.forEach((pwd) => {
          pwd.setAttribute("type", "text");
        });
      } else {
        icon.classList.add("fa-eye");
        icon.classList.remove("fa-eye-slash");
        pwds.forEach((pwd) => {
          pwd.setAttribute("type", "password");
        });
      }
    });
  });
});
