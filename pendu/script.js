const engAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const frAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'ï', 'ô', 'û', 'ù'];

let API = '';
let alphabet = [];
let word = "";
let score = 0;

$(document).ready(function () {

    $(".language").click(function () {
        $("#game").slideDown("slow");
        $("#languageChoice").hide();

        let id = $(this).attr('id');

        if (id === 'eng') {
            API = 'https://random-word-api.herokuapp.com/word';
            alphabet = engAlphabet;
        }

        if (id === 'fr') {
            API = 'https://trouve-mot.fr/api/random';
            alphabet = frAlphabet;
        }

        startProgram();
    })
})

function startProgram() {
    for (let i = 0; i < alphabet.length; i++) {
        $("#alphabetContainer").append("<span class='alphabetLetter'>" + alphabet[i].toUpperCase() + "</span>")
    }

    $.ajax({
        url: API,
        type: 'GET',
        dataType: 'json',
        success: showWord,
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error!');
        }
    });
}

function showWord(data) {
    if (alphabet === frAlphabet) {
        word = data[0].name.toUpperCase();
    }
    if (alphabet === engAlphabet) {
        word = data[0].toUpperCase();
    }
    for (let i = 0; i < word.length; i++) {
        $("#wordContainer").append("<div class='letter'></div>")
    }

    startPlaying();
}

function startPlaying() {
    let hp = 6;
    let numberOfLetters = word.length;

    $("#hp").text(hp);

    $(".alphabetLetter").click(function () {
        const letter = $(this).text();
        let letterGuessed = false;

        for (let i = 0; i < word.length; i++) {

            if (word[i] === letter) {
                $(".letter").eq(i).text(letter);
                $(this).addClass("hidden");
                letterGuessed = true;
                numberOfLetters -= 1;
            }
        }

        if (!letterGuessed && hp > 0) {
            hp -= 1;
            $("#hp").text(hp);
        }

        if (hp > 0 && numberOfLetters === 0) {
            $("#gameEnd").html(
                "<div>YOUPII YOU WON! " +
                    "<button onClick='window.location.reload();'>Play Again?</button><br>" +
                "<div id='result'></div>").slideDown("slow");
            $("#game").hide();
            score += 1;

            if (localStorage.getItem("results")) {
                $("#result").text(localStorage.getItem("results"));
            } else {
                $("#result").html(
                    "<form id='pseudoForm'>" +
                        "<label for='pseudo'>Leave your pseudo to save your score:</label><br>" +
                        "<input type='text' id='pseudo'<br>" +
                        "<input type='submit' value='Save'/>" +
                    "</form>")

                $("#pseudoForm").submit(function(e) {
                    e.preventDefault();
                    let pseudo = $("#pseudo").val();
                    let results = {
                        "name": pseudo,
                        "score": score
                    }
                    localStorage.setItem("results", JSON.stringify(results));
                })
            }
        }

        if (hp === 0 && numberOfLetters !== 0) {
            $("#gameEnd").html(
                "<div>Oh no you lost! The word was: " + word +
                " <button onClick='window.location.reload();'>Play Again?</button>" +
                "</div>").slideDown("slow");
            $("#game").hide();
        }
    })
}