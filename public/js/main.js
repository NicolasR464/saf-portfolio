//BURGER MENU

const burgerWrap = document.querySelector(".burger-wrap");
const burger = document.querySelector(".burger");
const wrapBlur = document.querySelector(".wrap-blur");
const burgerLinks = document.querySelectorAll(".burger--link");
const linkIndexed = document.querySelector(".burger-links");
const listWrapper = document.querySelector(".burger-link-cont");

const loadWrap = document.querySelector(".loader-wrapper");
console.log(loadWrap);
// addEventListener("load", () => {
//   console.log("page loaded");
//   // loadWrap.classList.add("wrapper-off");
//   loadWrap.classList.add("wrapper-off");
// });

// document.body.className = "fade";
// document.body.classList.add("fade");

// document.addEventListener("DOMContentLoaded", () => {
//   window.setTimeout(function () {
//     console.log("page loaded");
//     // loadWrap.classList.add("wrapper-off");
//     // document.body.classList.remove("fade");
//     document.body.classList.add("fade-in");
//   }, 2030);
// });

// burgerWrap.addEventListener("click", () => {
//   burger.classList.toggle("tapped");
//   burgerWrap.classList.toggle("tapped");
//   wrapBlur.classList.toggle("blur");
//   burgerLinks.forEach((el) => {
//     el.classList.toggle("showlink");
//   });
//   linkIndexed.classList.toggle("indexed");
// });
