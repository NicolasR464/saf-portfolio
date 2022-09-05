//

export default function index() {
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
      console.log(this.startDiapo);
      this.startDiapo.style.opacity = 1;
    }

    //DIAPO
    repeat() {
      this.startDiapo.style.opacity = 0;
      let step = Math.floor(Math.random() * this.img.length);
      const activeImg = document.querySelector(`.i${step}`);
      // console.log(activeImg);
      //
      if (this.startDiapo.classList[1] === activeImg.classList[1]) {
        this.startDiapo.style.opacity = 1;
      }
      activeImg.classList.add("fade");
    }
    start() {
      if (this.isPlaying) {
        clearInterval(this.isPlaying);
        // console.log(this.isPlaying);
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

  const imgsNum = document.querySelectorAll(".img").length;
  const randomNum = (n) => {
    let num = Math.floor(Math.random() * n);
    return num;
  };
  const n = randomNum(imgsNum);
  const phoneImg = document.querySelector(`.i${n}`);
  phoneImg.classList.add("display");
  //
  // Orientation
  let landscapeLoaded = false;
  let imgsCont = document.querySelector(".imgs");
  console.log(imgsCont);
  function getOrientation() {
    let orientation =
      window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    console.log("Orientation is on: ", orientation);

    if (landscapeLoaded || orientation == "landscape") {
      landscapeLoaded = true;
      console.log({ landscapeLoaded });
      fetch("/home/" + orientation)
        .then(() => {
          fetch("/home/" + orientation)
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              console.log({ result });
              // update images section
              while (imgsCont.firstChild) {
                imgsCont.firstChild.remove();
              }
              let index = 0;
              result.URLs.forEach((url, i) => {
                const img = document.createElement("img");
                img.classList.add("img");
                img.classList.add(`i${i}`);
                img.alt = "cinema still";
                img.src = url;
                imgsCont.appendChild(img);
                index++;
              });

              const randomIndex = Math.floor(Math.random() * index);
              console.log(randomIndex);
              const newImg = document.querySelector(`.i${randomIndex}`);
              newImg.classList.add("display");
              console.log(newImg);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  if (screen.width <= 1180) {
    // getOrientation();
  }
  window.onresize = getOrientation;
}
