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
