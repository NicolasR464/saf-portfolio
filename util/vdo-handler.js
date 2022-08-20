class VideoPlr {
  constructor(id) {
    this.id = id;
    this.type;
  }

  idExtractor() {
    let extracted;
    const idArray = this.id.split("");
    function getOccurrence(array, value) {
      return array.filter((v) => v === value).length;
    }
    const numberSlash = getOccurrence(idArray, "/");
    console.log(getOccurrence(idArray, "/"));

    //FILTER
    if (this.id.includes("?v=")) {
      // YOUTUBE URL
      this.type = "yt";
      extracted = this.id.split("?v=")[1];
      console.log(extracted);
      if (extracted.includes("&")) {
        let extraction = extracted.split("&");
        console.log(extraction);
        extracted = extraction[0];
        console.log(extracted);
      }
      return extracted;
    } else if (numberSlash >= 3) {
      if (this.id.includes("youtu.be")) {
        this.type = "yt";
      } else {
        this.type = "vimeo";
      }

      extracted =
        this.id.split("/")[4] === undefined
          ? this.id.split("/")[3]
          : this.id.split("/")[3] + "/" + this.id.split("/")[4];

      if (extracted.includes("video")) {
        extracted = extracted.split("/")[1];
      }
      console.log({ extracted });
      return extracted;
    } else {
      //MESSAGE: URL INCORRECT
      extracted = undefined;
      return extracted;
    }
  }

  // vidLaptopPlr() {
  //   //if id has only numbers, then it is a vimeo id
  //   let processedId = this.idExtractor();

  //   if (isNaN(processedId)) {
  //     console.log("this is a yt id");
  //     return `https://www.youtube.com/embed/${processedId}?modestbranding=1&rel=0&iv_load_policy=3&theme=light&color=white&autoplay=1&loop=1`;
  //   } else {
  //     return `https://player.vimeo.com/video/${processedId}?amp;byline=false&amp;portrait=false&color=ffffff&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media&autoplay=1&loop=1`;
  //   }
  // }
}

module.exports = VideoPlr;
