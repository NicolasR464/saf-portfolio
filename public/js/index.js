// import Swup from "swup";

//
class Slide {
  constructor() {
    this.img = document.querySelectorAll(".img");
    this.startDiapo = document.querySelector(
      `.i${Math.floor(Math.random() * this.img.length)}`
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

    if (this.startDiapo.classList[1] === activeImg.classList[1]) {
      this.startDiapo.style.opacity = 1;
    }
    activeImg.classList.add("fade");
  }
  start() {
    if (this.isPlaying) {
      clearInterval(this.isPlaying);

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
if (screen.width > 1180) {
  slide.firstImg();
  slide.start();
}

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

const imgPortrait = document.querySelector(`.i0`);
const imgLandscape = document.querySelector(`.i1`);

function getOrientation() {
  let orientation =
    window.innerWidth > window.innerHeight ? "landscape" : "portrait";

  if (orientation == "portrait") {
    imgLandscape.style.display = "none";
    imgPortrait.style.display = "block";
  } else {
    imgPortrait.style.display = "none";
    imgLandscape.style.display = "block";
  }
}

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  getOrientation();
  window.onresize = getOrientation;
}
