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
//

//
//

// console.log(document.cookie);

/* ELEMENT ON CLICK */
// window.onclick = (e) => {
//   console.log(e.target.tagName); // to get the element tag name alone
//   console.log(e.target); // to get the element
// };
//
//
//BURGER MENU

// const burgerWrap = document.querySelector(".burger-wrap");
// const burger = document.querySelector(".burger");
// const wrapBlur = document.querySelector(".wrap-blur");
// const burgerLinks = document.querySelectorAll(".burger--link");
// const linkIndexed = document.querySelector(".burger-links");
// const listWrapper = document.querySelector(".burger-link-cont");

// burgerWrap.addEventListener("click", () => {
//   burger.classList.toggle("tapped");
//   burgerWrap.classList.toggle("tapped");
//   wrapBlur.classList.toggle("blur");
//   burgerLinks.forEach((el) => {
//     el.classList.toggle("showlink");
//   });
//   linkIndexed.classList.toggle("indexed");
// });

/** LAPTOP VIDEO PLR */

const vidLaptopPlr = (vidId, vimeo, hash) => {
  if (vimeo) {
    if (hash) {
      console.log("this is a private vimeo id");
      return `https://player.vimeo.com/video/${vidId}?h=${hash}&amp;byline=false&amp;portrait=false&color=ffffff&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media&autoplay=1&loop=1`;
    }
    console.log("this is a normal vimeo id");
    return `https://player.vimeo.com/video/${vidId}?amp;byline=false&amp;portrait=false&color=ffffff&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media&autoplay=1&loop=1`;
  } else {
    console.log("this is a yt id");
    return `https://www.youtube.com/embed/${vidId}?modestbranding=1&rel=0&iv_load_policy=3&theme=light&color=white&autoplay=1&loop=1`;
  }
};
//

//
//
//DEFAULT CONTENT (MV) - if portfolio in localstorage or nothing
let isNotPlaying = true;

const plrContent = () => {
  //console

  //
  //   tbnlContent = `./images/portfolio/${dataSection}/0.jpg`;
  //   tbnl.src = tbnlContent;
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
        console.log(hash);
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
        // const vidPlr = new VideoPlr(idInfo);
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
          console.log(tbnlContent);
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
    // document.querySelector(".btns-main.active").classList.remove("active");
    // mainBtn.classList.add("active");
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
    // toggleVid.classList.add("active"); //??
    iframeSelec.src = "";
    //
    dataSection = mainBtn.getAttribute("data-section");
    console.log(dataSection);
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
// const collect = require("collect.js"); //
// var animations = require("create-keyframe-animation");
//
let player;
let ytId = "";

//console

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

//
// window.onclick = (e) => {
//   console.log(e.target.tagName); // to get the element tag name alone
//   console.log(e.target); // to get the element
// };
//
// YT Player API code asynchronous
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
// like vdo blocker test
const blocker = document.querySelector(".vdo-like-blocker");
blocker.addEventListener("click", () => {
  console.log("blocker clicked");
});

let count = 0;
const letterCount = (txt) => {
  const split = txt.split("");
  split.forEach((letter) => {
    count++;
  });
  // console.log("letter count: " + count);
  return count;
};
// letterCount("hey");
//
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
    iv_load_policy: 3,
    videoId: firstIdYt, //change id source
    playerVars: {
      color: "white",
      rel: 0,
      loop: 1,
    },
  });
}

//
//  VIMEO API
//maxheight: document.querySelectorAll(".carouselImages")[0].innerHeight,
const containerHeight = document.querySelector(".swiper-wrapper");

console.log(containerHeight);
const styles = window.getComputedStyle(containerHeight);
const height = styles.getPropertyValue("height");
// console.log(styles);
// console.log(styles.border);
// console.log(styles.width);
// console.log(height);
// console.log(containerHeight.getPropertyValue("height"));

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
    console.log("el removed");
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
};
if (screen.width < 1050) {
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

  // playBtn.classList.remove("fade-sm");
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
      console.log("this vid is: ", isPublicArr[Number(imgIndex)]);

      //console
      console.log("imgIndex: " + imgIndex);
      console.log("Swiper imgIndex: " + swiper.activeIndex);
      //update title
      vidTitle.textContent = img.title;

      const titleWidth = "-" + vidTitle.getBoundingClientRect().width + "px";
      console.log({ titleWidth });
      vidTitle.style.setProperty("--new-width", titleWidth, "important");

      if (img.getAttribute("data-vid-source") === "vimeo") {
        //console
        console.log("vimeo");
        console.log("dataId inside: " + img.getAttribute("data-id"));
        console.log(img.title);

        //class
        ytV.classList.remove("show");
        ytV.classList.remove("forward");
        vimeoContainer.classList.add("forward");

        // change vimeo id
        dataIdVim = img.getAttribute("data-id");
        // load vimeo video
        videoVim.loadVideo(dataIdVim).catch((err) => {
          console.log("Vimeo 1st err: ", err);
          let vidId;
          let hash;
          if (dataIdVim.includes("/")) {
            vidId = dataIdVim.split("/")[0];
            hash = dataIdVim.split("/")[1];
          }

          videoVim
            .loadVideo(`https://vimeo.com/${vidId}?h=${hash}`)
            .then((info) => console.log(info))
            .catch((err) => {
              console.log("Vimeo 2n err: ", err);
              errMsg.innerHTML = "video not found!";
              playBtn.style.opacity = "0";
            });
        });

        //Events
        videoVim.on("loaded", () => {});
        videoVim.on("bufferstart", () => {
          loadIcon.classList.add("active");

          playBtn.style.opacity = "0";
        });
        videoVim.on("bufferend", () => {
          loadIcon.classList.remove("active");
        });
        videoVim.on("play", () => {
          console.log("vimeo playing");
          img.style.opacity = "0";
          vimeoContainer.classList.add("show");
        });
        //
      } else if (img.getAttribute("data-vid-source") === "yt") {
        //console
        console.log("YT");

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
          console.log(player);
        } catch (err) {
          // console.log(err);
        }

        //  YT API EVENT
        player.addEventListener("onStateChange", (e) => {
          if (e.data === 3) {
            console.log("Yt buffering");
            loadIcon.classList.add("active");
            playBtn.style.opacity = "0";
          } else if (e.data === 1) {
            console.log("yt vid plays");
            img.style.opacity = "0";
            loadIcon.classList.remove("active");
            ytV.classList.add("show");
          } else if (e.data === 2) {
            console.log("yt vid paused");
          } else if (e.data === 5) {
            console.log("yt vid cued");
            console.log(player.getVideoUrl());
          } else if (e.data === -1) {
            console.log("unstarted");
          }
        });
        player.addEventListener("onError", (e) => {
          console.error(e);
          console.log("yt no work");
          errMsg.innerHTML = "video not found!";
          //remove play btn
          playBtn.style.opacity = "0";
        });
      }
    }
  });
};
// loadVid();
const checkYt = setInterval(() => {
  if (player != undefined && screen.width < 1050) {
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
  console.log("slide changed");
  console.log(swiper.activeIndex);

  console.log(swiper.slides[swiper.activeIndex].innerHTML);
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
  console.log("new fn: ", orientation);

  if (orientation == "Landscape") {
    const wrapper = document.querySelector(".swiper-wrapper");
    wrapper.style.height = "100%";

    window.scrollTo(0, goTop);
  }
  return orientation;
}

window.onresize = getOrientation;
