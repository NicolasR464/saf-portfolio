// PHONE IMAGE ACTION

export default function homeAdmin() {
  console.log("home admin module");

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
    image_workspace.src = "";

    console.log(image);
    file = image.files[0];
    url = window.URL.createObjectURL(new Blob([file], { type: "image/jpg" }));
    console.log(url);
    console.log(image_workspace.src);
    image_workspace.src = url;
    console.log(image_workspace.src);
    try {
      cropper.replace(url, { hasSameSize: true });
      console.log("cropper is launched");
    } catch {
      console.log("cropper not launched yet");
    }

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

  //DELETE VIGNETTE ACTION
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
}
