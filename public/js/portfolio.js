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
class VideoPlr {
  constructor(id) {
    this.id = id;
  }

  vidLaptopPlr() {
    if (this.id.includes("/") || this.id.includes("?h=") || !isNaN(this.id)) {
      console.log("this is a vimeo id");
      return `https://player.vimeo.com/video/${this.id}?amp;byline=false&amp;portrait=false&color=ffffff&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media&autoplay=1&loop=1`;
    } else {
      console.log("this is a yt id");
      return `https://www.youtube.com/embed/${this.id}?modestbranding=1&rel=0&iv_load_policy=3&theme=light&color=white&autoplay=1&loop=1`;
    }
  }
}
//

const videoInfo = {
  mv: [
    {
      title: "ZUUI | Distant Interior | Trailer",
      id: "lge80mpJ97I",
    },
    {
      title: "En Mi Barrio | Paloma Pradal",
      id: "1eG8-Kpjk0I",
    },
    {
      title: "Hendrix Harris | Moonlit Ride",
      id: "Q3oGx2UZ2aY",
    },
    {
      title: "Itonas | L’hiver",
      id: "VIBfmOgwb3M",
    },
    {
      title: "Caroline | Nobody Knows",
      id: "rZ15daGZD-0",
    },
    {
      title: "Rachmaninoff | Jean Paul Gasparian",
      id: "xeIsooiYL9E",
    },
    {
      title: "Jwles | Yummy",
      id: "d57qu-0HOlA",
    },
    {
      title: "Jwles | cancérigène",
      id: "Kpx4ljJ_cjk",
    },
    {
      title: "Damsel | Ramesses II",
      id: "aeato83blJ4",
    },
    {
      title: "Thierry Pécou | Sikus",
      id: "bzqkJg6RWU4",
    },
  ],
  narrative: [
    {
      title: "Folia | 2021",
      id: "656486023",
    },
    {
      title: "Mon p’tit coin de rue | 2021",
      id: "662483611",
    },
    {
      title: "Speedsters | 2020",
      id: "IDVKL_I_nBM",
    },
    {
      title: "Agni | 2020",
      id: "RRaIeuiZ-Vs",
    },
    {
      title: "East Wind | 2015",
      id: "RU1-8LP2pPI",
    },
    {
      title: "An Eye for An Eye | 2018",
      id: "awELvfSQ14c",
    },
  ],
  commercial: [
    {
      title: "Vacheron Constantin | 2017",
      id: "222151246",
    },
    {
      title: "Nike | 2017",
      id: "377489779",
    },
    {
      title: "Christie’s | 2018",
      id: "332012682",
    },
    {
      title: "Roses on rails | LUNA 2020",
      id: "599477117",
    },
    {
      title: "Plastic | 2016",
      id: "yl-nOl0xU84",
    },
    {
      title: "Plastic | Part 2",
      id: "bzKdymW87f8",
    },
    {
      title: "Elise Bertrand | Lettera Amorosa(debut album) Teaser (2022)",
      id: "FjFN-ROsCNA",
    },
  ],
  reel: [
    {
      title: "Showreel | 2019",
      id: "vOmiMvt8Gg0",
    },
    {
      title: "Showreel | 2022",
      // id: "662483611",
      id: "6PptGqIu6jM",
    },
  ],
};
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

        const clickedBtn = document.querySelector(".btns-g.clicked--btn");
        if (clickedBtn != null) {
          clickedBtn.classList.remove("clicked--btn");
        }

        button.classList.add("clicked--btn");
        tbnl.classList.remove("fade");
        toggleVid.classList.add("active");
        //PLAY VID
        const vidPlr = new VideoPlr(idInfo);
        iframeSelec.src = vidPlr.vidLaptopPlr();
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
plrContent();

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
    plrContent();
    //SMARTPHONE V
    if (screen.width < 1050) {
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
const title = document.querySelector(".title");
//

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

function onYouTubeIframeAPIReady() {
  player = new YT.Player("video-placeholder", {
    width: "100%",
    height: "100%",
    autoplay: 0,
    iv_load_policy: 3,
    videoId: videoInfo.mv[0].id,
    playerVars: {
      color: "white",
      rel: 0,
      loop: 1,
    },
    // enablejsapi: 1,
    // events: {
    //   onReady: onPlayerReady,
    //   onStateChange: onPlayerStateChange,
    // },
  });
}
//
// onYouTubeIframeAPIReady();
//

//
//  VIMEO API
let dataIdVim = "562089134";
let optionsVim = {
  url: dataIdVim,
  width: screen.width,
  responsive: true,
  autoplay: false,
  loop: true,
  portrait: false,
};
const videoVim = new Vimeo.Player("vimeoVideo", optionsVim);
//

//initiate swiper

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
  carouselImages.forEach((img) => {
    imgIndex = img.getAttribute("data-index");

    //
    // img.style.display = "block";

    if (imgIndex == swiper.activeIndex) {
      //console
      console.log("imgIndex: " + imgIndex);
      console.log("Swiper imgIndex: " + swiper.activeIndex);
      //update title
      title.textContent = img.title;
      //TEXT MOVE UPDATE

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
        videoVim
          .loadVideo(dataIdVim)
          .then(() => {
            console.log("coucou vimeo");
          })
          .catch((err) => {
            console.log(err);
            errMsg.innerHTML = "video not found!";
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
        // console.log(player.playerInfo.videoData.title);
        // console.log(player.playerInfo);

        //  YT API EVENT
        player.addEventListener("onStateChange", (e) => {
          if (e.data === 3) {
            console.log("Yt buffering");
            loadIcon.classList.add("active");
            playBtn.style.opacity = "0";
            ytIsOn = true;
          } else if (e.data === 1) {
            console.log("yt vid plays");
            img.style.opacity = "0";

            loadIcon.classList.remove("active");
            ytV.classList.add("show");
          } else if (e.data === 2) {
            console.log("yt vid paused");
          } else if (e.data === 5) {
            console.log(player.getVideoUrl());
          } else if (e.data === -1) {
            console.log("unstarted");
          }
        });
        player.addEventListener("onError", (e) => {
          console.error(e);
          console.log("yt no work");
          errMsg.innerHTML = "video not found!";
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
    window.scrollTo(0, goTop);
  }
  return orientation;
}

window.onresize = getOrientation;
