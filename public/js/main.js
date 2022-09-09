//BURGER MENU

const burgerWrap = document.querySelector(".burger-wrap");
const burger = document.querySelector(".burger");
const wrapBlur = document.querySelector(".wrap-blur");
const burgerLinks = document.querySelectorAll(".burger--link");
const linkIndexed = document.querySelector(".burger-links");
const listWrapper = document.querySelector(".burger-link-cont");

try {
  burgerWrap.addEventListener("click", () => {
    burger.classList.toggle("tapped");
    burgerWrap.classList.toggle("tapped");
    wrapBlur.classList.toggle("blur");
    burgerLinks.forEach((el) => {
      el.classList.toggle("showlink");
    });
    linkIndexed.classList.toggle("indexed");
  });
} catch (err) {
  console.log(err);
}
