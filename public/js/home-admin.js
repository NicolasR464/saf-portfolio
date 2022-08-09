// PHONE IMAGE ACTION

const image_workspace = document.querySelector(".image-workspace img");
const image = document.querySelector("#image");
const phoneBtn = document.querySelector(".phone-btn");
const modalWindow = document.querySelector(".modal-container");
const contVignettes = document.querySelector(".cont");
const closeBtn = document.querySelector(".close-modal-btn");
const cropBtn = document.querySelector(".crop-btn");
let url;
let file;
let options;
let cropper;
let cropX;
let cropY;
let cropWidth;
let cropHeight;
//

image.onchange = () => {
  file = image.files[0];
  url = window.URL.createObjectURL(new Blob([file], { type: "image/jpg" }));
  console.log(url);
  image_workspace.src = url;

  //
  options = {
    aspectRatio: 9 / 16,
    dragMode: "move",
    preview: ".img-preview",
    viewMode: 2,
    // modal: false,
    background: false,
    crop(event) {
      cropX = Math.floor(event.detail.x);
      cropY = Math.floor(event.detail.y);
      cropWidth = Math.floor(event.detail.width);
      cropHeight = Math.floor(event.detail.height);
      console.log({ cropX });
      console.log({ cropY });
      console.log({ cropWidth });
      console.log({ cropHeight });
    },
  };

  //

  //
};
phoneBtn.addEventListener("click", () => {
  if (url) {
    modalWindow.classList.add("modal-active");
    contVignettes.classList.add("blurred");
    cropper = new Cropper(image_workspace, options);
  }
});
closeBtn.addEventListener("click", () => {
  modalWindow.classList.remove("modal-active");
  contVignettes.classList.remove("blurred");
});
cropBtn.addEventListener("click", () => {
  modalWindow.classList.remove("modal-active");
  contVignettes.classList.remove("blurred");

  document.querySelector("[name=cropX]").value = cropX;
  document.querySelector("[name=cropY]").value = cropY;
  document.querySelector("[name=cropWidth]").value = cropWidth;
  document.querySelector("[name=cropHeight]").value = cropHeight;
  console.log(
    " cropX: ",
    cropX,
    " cropY: ",
    cropY,
    " cropWidth: ",
    cropWidth,
    " cropHeight: ",
    cropHeight
  );
});

// const cropper = new Cropper(image_workspace, {
//   aspectRatio: 9 / 16,
//   crop(event) {
//     console.log(event.detail.x);
//     console.log(event.detail.y);
//     console.log(event.detail.width);
//     console.log(event.detail.height);
//     console.log(event.detail.rotate);
//     console.log(event.detail.scaleX);
//     console.log(event.detail.scaleY);
//   },
// });

//DELETE VIGNETTE ACTION
const delBtn = document.querySelectorAll(".delBtn");
//This code runs on the client side - not on the server

const deleteHomeImg = (btn) => {
  let imgId = btn.parentNode
    .querySelector("[name=imgId]")
    .value.split("v1/")[1]
    .replaceAll("/", "-");

  //to adentify the arcticle you want to delete on the DOM instentaneously
  //closest() - indentify the closest parent of the element that matches the selector
  const productElement = btn.closest("article");

  fetch("/admin/home-config/" + imgId, {
    method: "DELETE",
  })
    .then((result) => {
      productElement.parentNode.removeChild(productElement);
      return result.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

if (delBtn) {
  delBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteHomeImg(btn);
    });
  });
}
