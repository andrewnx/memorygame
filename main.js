"use strict";

let player_name = "";

let num_cards = 48;

let cards;

let cards_array = new Array(24);

let matches = 0;

let matches_array = new Array();

let num_turns = 0;

let highscore = 0;

for (let i = 0; i < cards_array.length; i++) {
  cards_array[i] = new Image();
  const card_num = i + 1;
  cards_array[i].src = "images/card_" + card_num.toString() + ".png";
}

const Gameboard = () => {
  num_cards = parseInt(sessionStorage.num_cards);
  if (isNaN(num_cards) || num_cards <= 0) {
    num_cards = 48; // Default value if sessionStorage is not set or invalid
  }

  const num_rows = Math.floor(num_cards / 8);
  let row_string = "";

  let cards = new Array(num_cards);
  for (let num = 0; num < cards.length; num += 2) {
    const card = Math.floor(Math.random() * 24) + 1;
    cards[num] = cards_array[card];
    cards[num + 1] = cards_array[card];
  }

  cards.sort(() => Math.random() - 0.5);

  if (num_rows > 0) {
    for (let i = 0; i < num_rows; i++) {
      const x = i + 1;
      row_string += `<div id="row` + x.toString() + `"></div>`;
    }
    $("#cards").html(row_string);

    let count = 0;
    for (let row = 0; row < num_rows; row++) {
      let rows = row + 1;
      let card_string = "";
      for (let img = count; img < count + 8; img++) {
        card_string += `<img src="images/back.png" alt=${cards[img].src}>`;
      }
      count += 8;

      $(`#row${rows}`).html(card_string);
    }
  }
}; // End of Gameboard function

$(document).ready(() => {
  $("#tabs").tabs();

  $("#player_name").val(sessionStorage.player_name);
  $("#num_cards").val(sessionStorage.num_cards);
  $("#player").text(sessionStorage.player_name);
  $("#high_score").text(sessionStorage.highscore);

  $("#save_settings").click(() => {
    let isValid = true;

    const player_name = $("#player_name").val();
    const num_cards = $("#num_cards").val();
    const highscore = $("#high_score").text();

    if (player_name === "") {
      isValid = false;
      alert("Please enter a name.");
    }

    if (isValid) {
      sessionStorage.player_name = player_name;
      sessionStorage.num_cards = num_cards;
      sessionStorage.highscore = highscore;

      location.reload();
    }
  });
  Gameboard();

  let num_flips = 1;
  const Flipcard = (card_img) => {
    let game_flip = card_img.attr("alt");
    card_img.attr("class", `flipped${num_flips}`);
    card_img.attr("alt", card_img.attr("src"));
    card_img.attr("src", game_flip);
    matches_array.push(game_flip);
    num_flips += 1;
  };

  const Unflipcard = (card_img) => {
    let game_flip = card_img.attr("alt");
    card_img.attr("class", "");
    card_img.attr("alt", card_img.attr("src"));
    card_img.attr("src", game_flip);
  };

  $("img").on("click", function (evt) {
    const delay = 1000;
    let card_img = $(this);
    Flipcard(card_img);

    console.log(matches_array);

    if (matches_array.length > 1) {
      if (matches_array[0] === matches_array[1]) {
        console.log("Match!");

        $(".flipped1").attr("class", "match");
        $(".flipped2").attr("class", "match");

        $(".match").attr("src", "images/blank.png");
        num_flips = 1;
        matches_array.pop();
        matches_array.pop();
        matches += 1;
        num_turns += 1;

        let correct = (matches / (num_cards / 2)) * 100;
        $("#correct").text(correct);

        if (matches === num_cards / 2) {
          if (num_turns < highscore || highscore === 0) {
            sessionStorage.highscore = num_turns;
            console.log(sessionStorage.highscore);
            $("img").css({
              "pointer-events": "auto",
            });
            $("#high_score").text(sessionStorage.highscore);
          }
        }
      } else {
        console.log("Not a match!");
        $("img").css({
          "pointer-events": "none",
        });
        setTimeout(function () {
          Unflipcard($(".flipped1"));
          Unflipcard($(".flipped2"));

          $("img").css({
            "pointer-events": "auto",
          });
        }, delay);
        num_flips = 1;
        num_turns += 1;

        matches_array.pop();
        matches_array.pop();
      }
    }
    console.log("Turns", num_turns);
  });
});
