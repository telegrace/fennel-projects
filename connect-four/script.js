(function () {
	console.log("Sanity check!", $);

	var currentPlayer = "player1";

	for (var i = $(".column").length - 1; i >= 0; i--) {
		$(".column" + i).on("click", function (event) {
			var col = $(event.currentTarget);
			var c = Number(event.currentTarget.className.slice(-1));
			var slotsInCol = col.children();
			for (var row = slotsInCol.length - 1; row >= 0; row--) {
				// checks that slot is does not have player 1 or player 2 as their class
				if (
					!slotsInCol.eq(row).hasClass("player1") &&
					!slotsInCol.eq(row).hasClass("player2")
				) {
					//stops from adding more
					slotsInCol.eq(row).addClass(currentPlayer);
					break;
				}
			}

			var slotsInRow = $(".row" + row);
			var r = row;

			if (row === -1) {
				return;
			}

			if (checkForVictory(slotsInCol)) {
				console.log(currentPlayer, " has a col victory!");
				setTimeout(restartGame, 500);
				setTimeout(winningPlayer, 480);
			} else if (checkForVictory(slotsInRow)) {
				console.log(currentPlayer, " has a row victory!");
				setTimeout(restartGame, 500);
				setTimeout(winningPlayer, 480);
			} else if (checkForBackwardDiagonalVictory(r, c)) {
				console.log(currentPlayer, " has a backward diagonal victory!");
				setTimeout(restartGame, 500);
				setTimeout(winningPlayer, 480);
			} else if (checkForForwardDiagonalVictory(r, c)) {
				console.log(currentPlayer, " has a forward diagonal victory!");
				setTimeout(restartGame, 500);
				setTimeout(winningPlayer, 480);
			} else {
				console.log("No victory yet!");
			}

			switchPlayer();
		});
	}

	function checkForVictory(slots) {
		//give any array
		var count = 0;
		for (var i = 0; i < slots.length; i++) {
			if (slots.eq(i).hasClass(currentPlayer)) {
				count++;
				if (count === 4) {
					return true;
				}
			} else {
				count = 0;
			}
		}
	}

	function checkForBackwardDiagonalVictory(r, c) {
		var count = 1;
		for (var i = 0; i < $(".column").length; i++) {
			c++;
			r++;
			if ($(".column" + c + " .row" + r).hasClass(currentPlayer)) {
				count++;
				if (count === 4) {
					return true;
				}
			} else {
				count = 0;
			}
		}
	}

	function checkForForwardDiagonalVictory(r, c) {
		var count = 1;
		for (var i = 0; i < $(".column").length; i++) {
			c--;
			r++;
			if ($(".column" + c + " .row" + r).hasClass(currentPlayer)) {
				count++;
				if (count === 4) {
					return true;
				}
			} else {
				count = 0;
			}
		}
	}

	function switchPlayer() {
		if (currentPlayer === "player1") {
			$(".p2").addClass("player2");
			$(".p1").css("animation", "none");
			$(".p1").removeClass("player1");
			$(".p2").css("animation", "slide 0.5s alternate infinite");

			currentPlayer = "player2";
		} else {
			currentPlayer = "player1";
			$(".p2").css("animation", "none");
			$(".p2").removeClass("player2");
			$(".p1").addClass("player1");
			$(".p1").css("animation", "slide 0.5s alternate infinite");
		}
		//                    [  if below is true ]  >>> [do this] >>> [if not do the second case]
		//currentPlayer = currentPlayer === "player1" ? "player2" :"player1";
	}

	function restartGame() {
		$(".outerBox").css("visibility", "visible");
	}

	function winningPlayer() {
		if (currentPlayer === "player2") {
			$(".winnerP1").css("visibility", "visible");
		} else {
			$(".winnerP2").css("visibility", "visible");
		}
	}
})();
