let model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
  ],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunc(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
  isSunc: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  geneteShipLocation: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    let direction = Math.floor(Math.random() * 2);
    let row, col;
    if (direction === 1) {//horizontal
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else { //vertical
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    let newShipLocation = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocation.push(row + "" + (col + i));
      } else {
        newShipLocation.push((row + i) + "" + col);
      }
    }
    return newShipLocation;
  },
  collision : function(locations){
    for (var i = 0; i < this.numShips; i++){
      let ship = model.ships[i];
      for( let j = 0; j < locations.length; j++){
        if(ship.locations.indexOf(locations[j]) >= 0){
          return true
        }
      }
    }
    return false;
  },
};
var view = {
  displayMessage: function (msg) {
    let elem = document.querySelector("#messageArea");
    elem.innerHTML = msg;
    console.log(elem);
  },
  displayHit: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
};
let controller = {
  guesses: 0,
  processGuess: function (guess) {
    let location = parseGeass(guess);
    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(`Победа, ${model.numShips} русских военных корабля 
                              отправили по направлению. попыток:${this.guesses} `);
      }
    }
  },
};
function parseGeass(guess) {
  let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess == null || guess.length !== 2) {
    view.displayMessage(
      'Неправильный формат, введите координаты выстрела например "A0"'
    );
  } else {
    let row = alphabet.indexOf(guess[0].toUpperCase());
    let column = guess[1];
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn`t on the board.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Oops, that isn`t on the board.");
    } else {
      return row + column;
    }
  }
  return null;
};
function handlerButton() {
  let guessImput = document.getElementById("guessInput");
  let guess = guessImput.value;
  controller.processGuess(guess);
  guessImput.value = "";
};
function handleKeyPress(e) {
  let fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
};
window.onload = init;
function init() {
  let fireButton = document.getElementById("fireButton");
  fireButton.onclick = handlerButton;
  let guessImput = document.getElementById("guessInput");
  guessImput.onkeypress = handleKeyPress;
  model.geneteShipLocation();
};
