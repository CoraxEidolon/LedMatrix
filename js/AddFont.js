/*Глобальный массив, содержит список всех шрифтов*/
var GLOBAL_Fonts=[];

/*Для более удобного добавления новых типов шрифтов, содержит всю основную информацию. Является глобальным.*/
var FontType = {
    "rus": {"TableID": "TableAlphabetRus", "img": "russiaSVG"},
    "eng": {"TableID": "TableAlphabetEng", "img": "unitedKingdomSVG"},
    "num": {"TableID": "TableAlphabetNum", "img": "numberSVG"}
};


/**
 * Получает список всех имеющихся шрифтов. Срабатывает раз, при загрузки страницы
 * @constructor
 */
function GetListFonts() {
    var keys = Object.keys(GLOBAL_Fonts);
    var buf = "<table>";
    var href = String(window.location);
    var ticker = false;
    if (href.indexOf("/pages/Ticker") >= 0) {
        ticker = true;
    }

    for (var i = 0; i < keys.length; i++) {
        if (ticker === true && GLOBAL_Fonts[keys[i]]["size"] !== "1") {
            buf += "<tr class='displayNone'>";
        } else {
            buf += "<tr>";
        }
        buf += "<td>" + keys[i] + "</td>";
        buf += "<th class='" + FontType[GLOBAL_Fonts[keys[i]]["type"]]["img"] + "'>&emsp;</th>"
        buf += "<th>" + GLOBAL_Fonts[keys[i]]["size"] + "</th>"
        buf += "</tr>";
    }
    buf += "</table>";
    document.getElementById("FontSelection").innerHTML = buf;
}
