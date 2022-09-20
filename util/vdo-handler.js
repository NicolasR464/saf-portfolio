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

    //FILTER
    if (this.id.includes("?v=")) {
      // YOUTUBE URL
      this.type = "yt";
      extracted = this.id.split("?v=")[1];

      if (extracted.includes("&")) {
        let extraction = extracted.split("&");

        extracted = extraction[0];
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

      return extracted;
    } else {
      //MESSAGE: URL INCORRECT
      extracted = undefined;
      return extracted;
    }
  }
}

module.exports = VideoPlr;
