// PHONE IMAGE ACTION

const image_workspace = document.querySelector(".image-workspace img");
const image = document.querySelector("#image");
const phoneBtn = document.querySelector(".phone-btn");
const modalWindow = document.querySelector(".modal-container");
const contVignettes = document.querySelector(".cont");
const closeBtn = document.querySelector(".close-modal-btn");
const cropBtn = document.querySelector(".crop-btn");
const radioBtns = document.querySelector(".fieldset");
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
  image_workspace.src = "";

  file = image.files[0];
  url = window.URL.createObjectURL(new Blob([file], { type: "image/jpg" }));
  image_workspace.src = url;

  try {
    cropper.replace(url, { hasSameSize: true });
  } catch {
    console.log("cropper not launched yet");
  }

  //
};
phoneBtn.addEventListener("click", () => {
  if (url) {
    modalWindow.classList.add("modal-active");
    contVignettes.classList.add("blurred");

    options = {
      aspectRatio: 9 / 16,
      dragMode: "move",
      preview: ".img-preview",
      viewMode: 2,
      background: false,
      crop(event) {
        cropX = Math.floor(event.detail.x);
        cropY = Math.floor(event.detail.y);
        cropWidth = Math.floor(event.detail.width);
        cropHeight = Math.floor(event.detail.height);
      },
    };
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

  //If crop done open radio buttons - phone only option
  radioBtns.style.display = "flex";
});

const delBtn = document.querySelectorAll(".delBtn");

const deleteHomeImg = (btn) => {
  let imgId = btn.parentNode
    .querySelector("[name=imgId]")
    .value.split("v1/")[1]
    .replaceAll("/", "-");

  const productElement = btn.closest("article");

  fetch("/admin/home-config/" + imgId, {
    method: "DELETE",
  })
    .then((result) => {
      productElement.parentNode.removeChild(productElement);
      return result.json();
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
