/*jslint
  browser: true
*/

var BINGO = {
  images: [],

  getValueFromElement: function (element) {
    "use strict";
    return parseInt(document.getElementById(element).value, 10);
  },

  processDrop: function (event) {
    "use strict";
    var dt = event.dataTransfer;
    var files = dt.files;
    var count = files.length;
    var i;
    document.getElementById("imageDrop").textContent = "Received " + count + " images. " + (count + this.images.length) + " images received so far.";

    for (i = 0; i < files.length; i += 1) {
      this.loadImage(files[i], event.target.id);
    }
  },

  loadImage: function (file) {
    "use strict";
    var self = this;
    var reader = new FileReader();
    var img = document.createElement("img");

    img.file = file;
    self.images.push(img);

    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    }(img));
    reader.readAsDataURL(file);
  },

  shuffle: function () {
    "use strict";
    var counter = this.images.length;
    var temp;
    var index;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter -= 1;

      // And swap the last element with it
      temp = this.images[counter];
      this.images[counter] = this.images[index];
      this.images[index] = temp;
    }

  },

  makeCard: function () {
    "use strict";
    var i;
    var j;
    var card;
    var row;
    var cell;
    var image;

    const bingoHeight = this.getValueFromElement("height");
    const bingoWidth = this.getValueFromElement("width");
    const numRequiredImages = bingoHeight * bingoWidth;
    if (this.images.length < numRequiredImages) {
      alert(`You only added ${this.images.length} / ${numRequiredImages} images.`);
      return;
    }

    this.shuffle();
    const centerIsFree = document.getElementById("free-center").checked;
    document.getElementById("bingo-header").textContent = document.getElementById("title").value;
    card = document.getElementsByTagName("tbody")[0];
    card.innerHTML = "";

    for (i = 0; i < bingoHeight; i += 1) {
      row = document.createElement("tr");
      for (j = 0; j < bingoWidth; j += 1) {
        if (centerIsFree && i == Math.floor(bingoHeight / 2) && j == Math.floor(bingoWidth/ 2))  {
          const freeCell = document.createTextNode("FREE");
          cell = document.createElement("td");
          cell.appendChild(freeCell);
          row.appendChild(cell);
        } else {
          image = this.images.pop();
          this.images.unshift(image);
          cell = document.createElement("td");
          cell.appendChild(image);
          row.appendChild(cell);
        }
      }
      card.appendChild(row);
    }
  }
};
