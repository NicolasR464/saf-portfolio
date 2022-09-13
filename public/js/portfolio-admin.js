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
      // UPDATE order number !
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
      console.log("del click");
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
let sectionStart;
let sectionEnd;
let itemNum;
let sectionIndex;
let sectionName;
let sectionEndIndex;
let newOrder;

function dragStart() {
  //   const dropEffect = this.dropEffect;
  //   console.log(dropEffect);
  dragStartIndex = +this.childNodes[1].value;
  sectionStart = this.closest(".cont-vignette");
  sectionIndex = +this.closest(".cont-vignette").attributes[1].value;
  sectionName = this.closest(".cont-vignette").attributes[2].value;
  newOrder = sectionName + "-";
  itemNum = sectionStart.childElementCount;
  dragStartEl = this;
  //
  console.log({ dragStartIndex });
}

function dragOver(e) {
  e.preventDefault(); // enables the drop event
}
function dragDrop() {
  console.log("dropped");
  sectionEnd = this.closest(".cont-vignette");
  sectionEndIndex = +this.closest(".cont-vignette").attributes[1].value;
  const dragEndEl = this;
  dragEndIndex = +this.childNodes[1].value;
  console.log(dragStartIndex, " > ", dragEndIndex);
  changeOrder(dragStartEl, dragEndEl);
  //THEN fetch change order info the backend
  fetch("/admin/portfolio-config/" + newOrder, {
    method: "POST",
  })
    .then((data) => {
      // console.log(data);
      data.json();
    })
    .catch((err) => {
      console.log(err);
    });
}

function changeOrder(fromIndex, toIndex) {
  if (sectionIndex === sectionEndIndex) {
    console.log("in change order: ", dragStartIndex, " > ", dragEndIndex);
    dragStartIndex < dragEndIndex
      ? contVignettes[sectionIndex].insertBefore(fromIndex, toIndex.nextSibling)
      : contVignettes[sectionIndex].insertBefore(fromIndex, toIndex);
  }
  const vignetChildren = contVignettes[sectionIndex].children;
  Array.from(vignetChildren).forEach((article, newI) => {
    article.children[0].value = newI;
    newOrder += article.children[1].value;
    console.log(newOrder);
  });
}

//

draggables.forEach((container) => {
  container.addEventListener("dragstart", dragStart);
  container.addEventListener("dragover", dragOver);
  container.addEventListener("drop", dragDrop);
});
