const delBtn = document.querySelectorAll(".delBtn");
//This code runs on the client side - not on the server

const deleteHomeImg = (btn) => {
  const imgId = btn.parentNode.querySelector("[name=imgId]").value;

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
      console.log("del click");
      deleteHomeImg(btn);
    });
  });
}
