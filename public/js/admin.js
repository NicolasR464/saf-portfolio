const delBtn = document.querySelector(".delBtn");
//This code runs on the client side - not on the server

const deleteHomeImg = () => {
  const imgId = delBtn.parentNode.querySelector("[name=imgId]").value;

  //to adentify the arcticle you want to delete on the DOM instentaneously
  //closest() - indentify the closest parent of the element that matches the selector
  const productElement = delBtn.closest("article");

  fetch("/admin/home-config/" + imgId, {
    method: "DELETE",
  })
    .then((result) => {
      productElement.parentNode.removeChild(productElement);
      return result;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

if (delBtn) {
  delBtn.addEventListener("click", () => {
    deleteHomeImg();
  });
}
