const eye = document.querySelector("#eye-toggle");
const icon = document.querySelector(".fa-regular");
const pwd = document.querySelector("#pwd");

eye.addEventListener("click", () => {
  console.log("eye click");
  if (icon.classList.contains("fa-eye")) {
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
    pwd.setAttribute("type", "text");
  } else {
    icon.classList.add("fa-eye");
    icon.classList.remove("fa-eye-slash");
    pwd.setAttribute("type", "password");
  }
});
