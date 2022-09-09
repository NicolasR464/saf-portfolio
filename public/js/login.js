const eyes = document.querySelectorAll(".eye-toggle");
const icons = document.querySelectorAll(".fa-regular");
const pwds = document.querySelectorAll(".pwd");
const pwd = document.querySelector("#pwd");

console.log(pwds);

eyes.forEach((eye) => {
  eye.addEventListener("click", () => {
    console.log("eye click");
    icons.forEach((icon) => {
      if (icon.classList.contains("fa-eye")) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        if (pwds.length > 0) {
          pwds.forEach((pwd) => {
            console.log("pwd?");
            console.log(pwd);
            pwd.setAttribute("type", "text");
          });
        } else {
          console.log(" single pwd?");
          pwd.setAttribute("type", "text");
        }
      } else {
        icon.classList.add("fa-eye");
        icon.classList.remove("fa-eye-slash");
        if (pwds.length > 0) {
          pwds.forEach((pwd) => {
            console.log("pwd?");
            console.log(pwd);
            pwd.setAttribute("type", "password");
          });
        } else {
          console.log(" single pwd?");
          pwd.setAttribute("type", "password");
        }
      }
    });
  });
});
