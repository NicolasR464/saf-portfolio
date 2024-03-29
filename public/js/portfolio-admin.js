const delBtns = document.querySelectorAll(".delBtn");

const delPortVid = (btn) => {
  const vidId = btn.parentNode.querySelector("[name=vidId]").value;
  const category = btn.parentNode.querySelector("[name=category]").value;
  const videoEl = btn.closest("article");
  fetch("/admin/portfolio-config/" + vidId, {
    method: "DELETE",
  })
    .then((result) => {
      videoEl.parentNode.removeChild(videoEl);

      const videoCont = document.querySelector(`[data-name=${category}]`);
      Array.from(videoCont.children).forEach((article, newI) => {
        article.children[0].value = newI;
      });
      return result.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

if (delBtns) {
  delBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      delPortVid(btn);
    });
  });
}

//**** DRAGGABLE */ | Order number

const draggables = document.querySelectorAll(".draggable");
const contVignettes = document.querySelectorAll(".cont-vignette"); // draggable-list
//
let dragStartEl;
let dragStartIndex;
let dragEndIndex;
let itemNum;
let sectionIndex;
let newParams;
let sectionEndIndex;

function dragStart() {
  dragStartIndex = +this.childNodes[1].value;
  sectionIndex = +this.closest(".cont-vignette").attributes[1].value;
  newParams = this.closest(".cont-vignette").attributes[2].value; // video category
  dragStartEl = this;
}

function dragOver(e) {
  e.preventDefault();
}
function dragDrop() {
  sectionEndIndex = +this.closest(".cont-vignette").attributes[1].value;
  const dragEndEl = this;
  dragEndIndex = +this.childNodes[1].value;

  changeOrder(dragStartEl, dragEndEl);

  fetch("/admin/portfolio-config/" + newParams, {
    method: "POST",
  })
    .then((data) => {
      data.json();
    })
    .catch((err) => {
      console.log(err);
    });
}

function changeOrder(fromIndex, toIndex) {
  if (sectionIndex === sectionEndIndex) {
    dragStartIndex < dragEndIndex
      ? contVignettes[sectionIndex].insertBefore(fromIndex, toIndex.nextSibling)
      : contVignettes[sectionIndex].insertBefore(fromIndex, toIndex);
  }
  const vignetChildren = contVignettes[sectionIndex].children;
  Array.from(vignetChildren).forEach((article, newI) => {
    article.children[0].value = newI;

    newParams += "-" + article.children[1].value;
  });
}

//

draggables.forEach((container) => {
  container.addEventListener("dragstart", dragStart);
  container.addEventListener("dragover", dragOver);
  container.addEventListener("drop", dragDrop);
});
