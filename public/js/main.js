//import
import homeAdmin from "./home-admin.js";
import portAdmin from "./portfolio-admin.js";
import login from "./login.js";
import index from "./index.js";
// import portfolio from "./portfolio.js";
// import Swup from "swup";
const swup = new Swup();
//swup
console.log("main module");
console.log(swup);

//***** DESTROY */
function unload() {
  console.log("unload fn");
  let el;
  if (document.querySelector(".portfolio-admin")) {
    el = document.querySelector(".portfolio-admin");
    el.remove();
    console.log("removed 1");
  }
  if (document.querySelector(".home-admin")) {
    el = document.querySelector(".home-admin");
    el.remove();
    console.log("removed 2");
  }
  if (document.querySelector(".login")) {
    el = document.querySelector(".login");
    el.remove();
    console.log("removed 3");
  }
  if (document.querySelector(".index")) {
    el = document.querySelector(".index");
    el.remove();
    console.log("removed 4");
  }
  if (document.querySelector(".portfolio")) {
    el = document.querySelector(".portfolio");
    el.remove();
    console.log("removed 5");
  }
}

// swup.on("willReplaceContent", unload);

//******INIT FNs
async function init() {
  //ADMIN
  if (document.querySelector(".portfolio-admin")) {
    console.log("portfolio-admin");
    portAdmin();
  }

  if (document.querySelector(".home-admin")) {
    console.log("home-admin");
    homeAdmin();
  }
  //CLIENT
  if (document.querySelector(".login")) {
    console.log("login");
    login();
  }
  if (document.querySelector(".index")) {
    console.log("index");
    index();
  }
  if (document.querySelector(".portfolio")) {
    //
    console.log("portfolio");
    // portfolio();
  }
}

init();

swup.on("contentReplaced", init);
