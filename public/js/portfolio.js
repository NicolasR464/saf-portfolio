// INDEX page BTNS
//BTNS general
const mainBtns = document.querySelectorAll(".btns-main");
const btnsG = document.querySelectorAll(".btns-g");
const toggleVid = document.querySelector(".toggle-vid");
const iframeSelec = document.querySelector("iframe");
const playerPlyr = document.querySelector("#player");

const html = document.querySelector("html");
const tbnl = document.querySelector(".tbnl");
//
btnsG.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    const span = btn.firstChild;
    let btnWidth = btn.offsetWidth;
    let spanWidth = span.offsetWidth;
    let offset;
    if (spanWidth > btnWidth + 1) {
      offset = btnWidth - spanWidth + "px";
      btn.style.setProperty("text-indent", offset);
    }
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.removeProperty("text-indent");
  });
});

/** LAPTOP VIDEO PLR */

const vidLaptopPlr = (vidId, vimeo, hash) => {
  if (vimeo) {
    if (hash) {
      return `https://player.vimeo.com/video/${vidId}?h=${hash}&amp;byline=false&amp;portrait=false&color=ffffff&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media&autoplay=1&loop=1`;
    }

    return `https://player.vimeo.com/video/${vidId}?amp;byline=false&amp;portrait=false&color=ffffff&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media&autoplay=1&loop=1`;
  } else {
    return `https://www.youtube.com/embed/${vidId}?modestbranding=1&rel=0&iv_load_policy=3&theme=light&color=white&autoplay=1&loop=1`;
  }
};
//
let isNotPlaying = true;

const plrContent = () => {
  let indexArr = [];
  let minIndex;
  btnsG.forEach((button) => {
    //remove activeBTN
    if (button.classList.contains("activeBTN")) {
      button.classList.remove("activeBTN");
    }
    //

    if (dataSection === button.getAttribute("data-section")) {
      indexArr.push(parseInt(button.getAttribute("data-index")));
      minIndex = Math.min(...indexArr);

      if (button.getAttribute("data-index") === minIndex.toString()) {
        tbnl.src = button.getAttribute("data-img");
        button.classList.add("activeBTN");
      }

      //affichage des titres
      button.classList.add("active");

      //CLICK event > lecture video
      button.addEventListener("click", () => {
        let idInfo = button.getAttribute("data-id");
        let hash = null;

        if (idInfo.includes("/")) {
          hash = idInfo.split("/")[1];
          idInfo = idInfo.split("/")[0];
        }

        let isVimeo = false;
        let playerInfo = button.getAttribute("data-player");
        playerInfo == "vimeo" ? (isVimeo = true) : isVimeo;

        const clickedBtn = document.querySelector(".btns-g.clicked--btn");
        if (clickedBtn != null) {
          clickedBtn.classList.remove("clicked--btn");
        }

        button.classList.add("clicked--btn");
        tbnl.classList.remove("fade");
        toggleVid.classList.add("active");
        //PLAY VID

        iframeSelec.src = vidLaptopPlr(idInfo, isVimeo, hash);
        isNotPlaying = false;
      });
      // MOUSEOVER BTN EVENT > vid plr off + tbnl on

      button.addEventListener("mouseover", () => {
        const clickedBtn = document.querySelector(".btns-g.clicked--btn");

        btnsG.forEach((btn) => {
          btn.classList.remove("activeBTN");
        });
        button.classList.add("activeBTN");
        if (isNotPlaying) {
          if (clickedBtn != null) {
            clickedBtn.classList.remove("clicked--btn");
          }
          //display tbnl
          tbnlContent = button.getAttribute("data-img");

          iframeSelec.src = "";
          tbnl.src = tbnlContent;
          tbnl.classList.add("fade");
        }
      });

      //
    } else {
      button.classList.remove("active");
    }
    button.addEventListener("mouseleave", () => {
      button.classList.remove("activeBTN");
    });
  });
};
let dataSection;
let localStore = localStorage.getItem("section");
if (localStore == null) {
  dataSection = "mv";
} else {
  dataSection = localStore;
}

document.querySelector(".btns-main.active").classList.remove("active");
mainBtns.forEach((btn) => {
  if (btn.getAttribute("data-section") === dataSection) {
    btn.classList.add("clicked--btn");
  }
});
if (screen.width > 1181) {
  plrContent();
}

//
//UPDATE CONTENT AFTER MAIN CATEGORY BTN CLICKED
mainBtns.forEach((mainBtn) => {
  mainBtn.addEventListener("click", () => {
    isNotPlaying = true;

    //Update light on main btn

    mainBtns.forEach((btn) => {
      btn.classList.remove("activeBTN");
    });
    //enleve les mainBtns click actifs
    const clickedBtnMain = document.querySelector(".btns-main.clicked--btn");
    if (clickedBtnMain != null) {
      clickedBtnMain.classList.remove("clicked--btn");
    }
    mainBtn.classList.add("clicked--btn");
    //enleve les subBtns click actifs
    const clickedBtn = document.querySelector(".btns-g.clicked--btn");
    if (clickedBtn != null) {
      clickedBtn.classList.remove("clicked--btn");
    }

    //reset visual window
    tbnl.classList.remove("fade");

    iframeSelec.src = "";
    //
    dataSection = mainBtn.getAttribute("data-section");

    tbnl.classList.add("fade");
    if (screen.width > 1181) {
      plrContent();
    }
    //SMARTPHONE V
    if (screen.width < 1181) {
      //Update light on main btn
      document
        .querySelector(".btns-main.clicked--btn")
        .classList.remove("clicked--btn");
      mainBtn.classList.add("clicked--btn");
      slideMaker();
      const checkYt = setInterval(() => {
        if (player != undefined) {
          clearInterval(checkYt);
          loadVid();
        }
      }, 100);
    }
  });
});

//
//
//***** SMARTPHONE VIDEO PLAYER ******

//
let player;
let ytId = "";

// CAROUSEL
const carouselContainer = document.querySelector(".carousel-container");
const carouselSlide = document.querySelector(".carousel-slide");
const swiperWrapper = document.querySelector(".swiper-wrapper");
const swiperPagination = document.querySelector(".swiper-pagination");

//VIDEO CONTAINER
const vimeoV = document.querySelector(".vimeo-v");
const vimeoContainer = document.querySelector(".vimeo-container");
const ytV = document.querySelector(".yt-container");
const ytvideo = document.querySelector("#video-placeholder");
const lastImg = document.querySelector("#lastClone");
//
// BTNS
const playBtn = document.querySelector(".play-icon");
const loadIcon = document.querySelector(".load-wrapp");
const playIcon1 = document.querySelector("#play1");
const playIcon2 = document.querySelector("#play2");
const playIcon3 = document.querySelector("#play3");
const playIcon4 = document.querySelector("#play4");

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//
// SWIPER
const prevB = document.querySelector(".swiper-button-prev");
const nextB = document.querySelector(".swiper-button-next");
const vidTitle = document.querySelector(".title");
//

let count = 0;
const letterCount = (txt) => {
  const split = txt.split("");
  split.forEach((letter) => {
    count++;
  });

  return count;
};

let firstIdYt;
let firstIdVim;
let ids = [];
btnsG.forEach((btn) => {
  if (btn.getAttribute("data-section") == "mv") {
    ids.push(btn);

    if (ids[0].getAttribute("data-player") == "yt") {
      firstIdYt = ids[0].attributes[2].nodeValue;
      firstIdVim = "222151246";
    } else {
      firstIdVim = ids[0].attributes[2].nodeValue;
    }
  }
});

// YOUTUBE API
function onYouTubeIframeAPIReady() {
  player = new YT.Player("video-placeholder", {
    width: "100%",
    height: "100%",
    autoplay: 0,
    controls: 0,
    iv_load_policy: 3,
    videoId: firstIdYt,
    playerVars: {
      color: "white",
      rel: 0,
      loop: 1,
    },
  });
}

//
//  VIMEO API

const containerHeight = document.querySelector(".swiper-wrapper");

const styles = window.getComputedStyle(containerHeight);
const height = styles.getPropertyValue("height");

let optionsVim = {
  url: firstIdVim,
  responsive: true,
  maxwidth: screen.width,
  autoplay: false,
  loop: true,
  portrait: false,

  title: false,
  color: "#FFF",
};
const videoVim = new Vimeo.Player("vimeoVideo", optionsVim);
//

// *** SLIDE MAKER***
let swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  direction: "horizontal",
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  rewind: true,
  preloadImages: true,
  lazy: false,
  autoplay: false,
  initialSlide: 0,
});

const slideMaker = () => {
  const bullets = document.querySelectorAll(".swiper-pagination-bullet");
  bullets.forEach((bullet) => {
    if (bullet.classList.contains("swiper-pagination-bullet-active")) {
      bullet.classList.remove("swiper-pagination-bullet-active");
      bullets[0].classList.add("swiper-pagination-bullet-active");
    }
  });

  swiper.activeIndex = 0;

  while (swiperWrapper.firstChild) {
    swiperWrapper.firstChild.remove();
  }

  function appendBuild() {
    let index = 0;
    btnsG.forEach((button) => {
      if (dataSection === button.getAttribute("data-section")) {
        const div = document.createElement("div");
        div.classList.add("swiper-slide");
        const img = document.createElement("img");
        img.src = button.getAttribute("data-img");
        img.title = button.getAttribute("data-title");
        img.alt = button.getAttribute("data-title");
        img.dataset.id = button.getAttribute("data-id");
        img.width = "1920";
        img.height = "1080";
        img.dataset.vidSource = button.getAttribute("data-player");
        img.dataset.ispubrated = button.getAttribute("data-ispubrated");
        img.dataset.index = index;
        img.classList.add("slide");

        swiperWrapper.appendChild(div);
        div.appendChild(img);
        index++;
      }
    });
  }
  if (!swiperWrapper.firstChild) {
    appendBuild();
    swiper.update();
  }

  //ALT
  //swiperWrapper.replaceChildren()
};
if (screen.width < 1181) {
  slideMaker();
  const slide = document.querySelectorAll(".slide")[0];
  const wrapper = document.querySelector(".swiper-wrapper");
  wrapper.style.height = `${slide.height}px`;
}

// **** VIDEO LOADER
let errMsg = document.querySelector(".err-msg");
const loadVid = () => {
  errMsg.innerHTML = "";
  const carouselImages = document.querySelectorAll(".swiper-slide img");

  //
  //
  if (ytV.classList.contains("show")) {
    ytV.classList.remove("show");
  }
  if (ytV.classList.contains("forward")) {
    ytV.classList.remove("forward");
  }

  if (vimeoContainer.classList.contains("show")) {
    vimeoContainer.classList.remove("show");
  }
  if (vimeoContainer.classList.contains("forward")) {
    vimeoContainer.classList.remove("forward");
  }

  playBtn.style.opacity = "1";
  if (loadIcon.classList.contains("active")) {
    loadIcon.classList.remove("active");
  }
  //
  try {
    videoVim.pause();
    player.pauseVideo();
  } catch (error) {}

  //
  let imgIndex;
  let isPublicArr = [];

  carouselImages.forEach((img) => {
    imgIndex = img.getAttribute("data-index");
    isPublicArr.push(img.getAttribute("data-isPubRated"));

    if (imgIndex == swiper.activeIndex) {
      vidTitle.textContent = img.title;

      const titleWidth = "-" + vidTitle.getBoundingClientRect().width + "px";

      vidTitle.style.setProperty("--new-width", titleWidth, "important");
      vidTitle.style.setProperty("transform", "translateX(0px)");

      if (img.getAttribute("data-vid-source") === "vimeo") {
        ytV.classList.remove("show");
        ytV.classList.remove("forward");
        vimeoContainer.classList.add("forward");

        // change vimeo id
        dataIdVim = img.getAttribute("data-id");
        // load vimeo video
        videoVim.loadVideo(dataIdVim).catch((err) => {
          let vidId;
          let hash;
          if (dataIdVim.includes("/")) {
            vidId = dataIdVim.split("/")[0];
            hash = dataIdVim.split("/")[1];
          }

          videoVim
            .loadVideo(`https://vimeo.com/${vidId}?h=${hash}`)
            .then((info) => console.log("hash!"))
            .catch((err) => {
              errMsg.innerHTML = "video not found!";
              playBtn.style.opacity = "0";
            });
        });

        // Vimeo Events
        videoVim.on("loaded", () => {});
        videoVim.on("bufferstart", () => {
          loadIcon.classList.add("active");

          playBtn.style.opacity = "0";
        });
        videoVim.on("bufferend", () => {
          loadIcon.classList.remove("active");
        });
        videoVim.on("play", () => {
          img.style.opacity = "0";
          vimeoContainer.classList.add("show");
        });
        //
      } else if (img.getAttribute("data-vid-source") === "yt") {
        if (isPublicArr[Number(imgIndex)] === "false") {
          img.style.opacity = "0";
          ytV.classList.add("show");
        }

        vimeoContainer.classList.remove("show");
        vimeoContainer.classList.remove("forward");
        ytV.classList.add("forward");

        // change video id
        let vidId = img.getAttribute("data-id");
        //LOAD video

        try {
          player.cueVideoById(vidId);
        } catch (err) {
          console.log(err);
        }

        //  YT API EVENT
        player.addEventListener("onStateChange", (e) => {
          if (e.data === 3) {
            loadIcon.classList.add("active");
            playBtn.style.opacity = "0";
          } else if (e.data === 1) {
            img.style.opacity = "0";
            loadIcon.classList.remove("active");
            ytV.classList.add("show");
          }
        });
        player.addEventListener("onError", (e) => {
          console.log(e);
          if (e.data === 150 || e.data === 101) {
            errMsg.innerHTML = "";
          } else {
            errMsg.innerHTML = "video not found!";
          }
          //remove play btn
          playBtn.style.opacity = "0";
        });
      }
    }
  });
};
// loadVid();
const checkYt = setInterval(() => {
  if (player != undefined && screen.width < 1181) {
    clearInterval(checkYt);
    loadVid();
  }
}, 100);

//SWIPER FUNCTIONS
const slidePrev = () => {
  playIcon1.classList.remove("moveR");
  setTimeout(() => {
    playIcon1.classList.add("moveR");
  }, 10);
  playIcon2.classList.remove("fade");
  setTimeout(() => {
    playIcon2.classList.add("fade");
  }, 10);
};
//
const slideNext = () => {
  playIcon4.classList.remove("moveL");
  setTimeout(() => {
    playIcon4.classList.add("moveL");
  }, 10);
  playIcon2.classList.remove("fade");
  setTimeout(() => {
    playIcon2.classList.add("fade");
  }, 10);
};
const slideUpdate = () => {
  document.querySelectorAll(".swiper-slide img").forEach((img) => {
    img.style.opacity = "1";
  });

  errMsg.innerHTML = "";
  playBtn.style.opacity = "1";

  try {
    loadVid();
  } catch (error) {
    console.log(error);
  }
};
//SWIPER SLIDES

// SLIDE 1
if (swiper) {
  swiper.on("slidePrevTransitionStart", () => {
    slidePrev();
  });
  swiper.on("slideNextTransitionStart", () => {
    slideNext();
  });

  swiper.on("slideChange", function () {
    slideUpdate();
  });
}

// FLIP PHONE EVENT
let goTop = swiperWrapper.getBoundingClientRect().top;

//
function getOrientation() {
  var orientation =
    window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";

  if (orientation == "Landscape") {
    const wrapper = document.querySelector(".swiper-wrapper");
    wrapper.style.height = "100%";

    window.scrollTo(0, goTop);
  }
  return orientation;
}

window.onresize = getOrientation;
