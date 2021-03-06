// import Swup from "swup";

//
class Slide {
  constructor() {
    this.img = document.querySelectorAll(".img");
    this.startDiapo = document.querySelector(
      `.i${Math.floor(Math.random() * this.img.length + 1)}`
    );

    this.isPlaying = null;
  }

  //1st RANDOM IMAGE
  firstImg() {
    this.startDiapo.style.opacity = 1;
  }

  //DIAPO
  repeat() {
    this.startDiapo.style.opacity = 0;
    let step = Math.floor(Math.random() * this.img.length);
    const activeImg = document.querySelector(`.i${step}`);
    console.log(activeImg);
    //
    if (this.startDiapo.classList[1] === activeImg.classList[1]) {
      this.startDiapo.style.opacity = 1;
    }
    activeImg.classList.add("fade");
  }
  start() {
    if (this.isPlaying) {
      clearInterval(this.isPlaying);
      console.log(this.isPlaying);
      this.isPlaying = null;
    } else {
      this.isPlaying = setInterval(() => {
        this.img.forEach((image) => {
          image.classList.remove("fade");
        });
        this.repeat();
      }, 3000);
    }
  }
}
// CALL
const slide = new Slide();
slide.firstImg();
slide.start();
//END DIAPO

//Pass info to open sub section in Portfolio page
localStorage.clear();

const links = document.querySelectorAll(".dropdown-link");
links.forEach((link) => {
  link.addEventListener("click", () => {
    let section = link.getAttribute("data-section");
    localStorage.setItem("section", section);
  });
});

//
// FOR PHONE AND TABLET

const randomNum = (n) => {
  let num = Math.floor(Math.random() * n);
  console.log(num);
  return num;
};
const n = randomNum(2);
console.log(n);
const phoneImg = document.querySelector(".phone-img");

phoneImg.src = `./stills/phoneVs/${n}.jpg`;
