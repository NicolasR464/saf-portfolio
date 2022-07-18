//This code runs on the client side - not on the server

const deleteHomeImg = (btn) => {
  const imgId = btn.parentNode.querySelector("[name=imgId]").value;
  console.log(imgId);

  //to adentify the arcticle you want to delete on the DOM instentaneously
  //closest() - indentify the closest parent of the element that matches the selector
  const productElement = btn.closest("article");

  fetch("/admin/home-config/" + imgId, {
    method: "DELETE",
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((data) => {
      productElement.parentNode.removeChild(productElement);
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
