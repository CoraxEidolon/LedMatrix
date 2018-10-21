/**
 * Добавляет или удаляет класс css в зависимости от включен или выключен диод
 * срабатывает при клике на "диод" на матрице
 * @param event
 * @constructor
 */
function OnOffLed(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target.tagName == "TD") {
        if (target.className == "ledON") {
            target.removeAttribute("class");
        } else {
            target.className = "ledON";
        }
    }
}

/**
 * Выбор буквы из алфавита, для которой будет создаваться код
 * срабатывает при клике на свободное поле напротив нужной буквы
 * @param event
 * @constructor
 */
function SelectCharInAlphabet(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target.tagName == "TD") {
        document.getElementById("EditCharInAlphabet").removeAttribute("id");
        target.id = "EditCharInAlphabet";
        /*При клике на уже записанном коде буквы, она будет показываться на матрице*/
        if (target.innerHTML != "?") {
            /* Чтобы все точно работало, поэтапно убираем лишние символы и очищаем матрицу */
            var buf = target.innerHTML;
            buf = buf.replace(/{/g, "");
            buf = buf.replace(/}/g, "");
            buf = buf.replace(/0x/g, "");
            buf = buf.split(",")
            ClearItem("Matrix");
            /*Вывод в матрицу*/
            for (var i = 0; i < document.getElementById('Matrix').rows[0].cells.length; i++) {
                buf[i] = parseInt(buf[i], 16).toString(2);//Перевод из 16ричной в 2ичную
                /*Js при вычисление отбрасывает незначащие нули, но нам они нужны, возвращаем*/
                var result = "";
                for (var z = 0; z < document.getElementById('Matrix').rows[0].cells.length - buf[i].length; z++) {
                    result += "0";
                }
                result += buf[i];
                for (var j = document.getElementById('Matrix').rows.length - 1; j >= 0; j--) {

                    if (result[document.getElementById('Matrix').rows.length - 1 - j] == "1") {
                        document.getElementById('Matrix').rows[j].cells[i].classList.add("ledON");
                    }
                    else {
                        document.getElementById('Matrix').rows[j].cells[i].removeAttribute("class");
                    }
                }
            }
        }
    }
}

/**
 * Преобразовывает нарисованный символ на матрице в код и добавляет его в список алфавита
 * срабатывает при клике на соответствующую кнопку
 * @constructor
 */
function AddCodeCharInAlphabet() {
    var result = "{";
    for (var i = 0; i < document.getElementById('Matrix').rows[0].cells.length; i++) {
        var buf = "";
        for (var j = document.getElementById('Matrix').rows.length - 1; j >= 0; j--) {
            if (document.getElementById('Matrix').rows[j].cells[i].getAttribute("class") == null) {
                buf += "0";
            } else {
                buf += "1";
            }
        }
        var row = parseInt(buf, 2).toString(16);
        result += "0x";
        if (row.length < 2) {
            result += "0";
        }
        result += row;
        if (i != document.getElementById('Matrix').rows[0].cells.length - 1) {
            result += ",";
        }
    }
    result += "}";
    /*Находим выделенную букву в списке алфавита и добавляем новый код*/
    document.getElementById("EditCharInAlphabet").innerHTML = result;
}

/**
 * Переключает таблицы языков русский, английский
 *срабатывает при клике на соответствующую кноаку
 * @constructor
 */
function LanguageSelection() {
    if (document.getElementById("LanguageSelection").classList.contains("russia") == true) {
        LanguageSwitch("eng");
    }
    else {
        LanguageSwitch("rus");
    }
}

/**
 * Осуществляет переключение языков и таблицы алфавитов
 * @param choice - Выбор языка
 * @constructor
 */
function LanguageSwitch(choice) {
    if (choice == "eng") {
        ClearItem("TableAlphabetRus");
        document.getElementById("LanguageSelection").classList.remove("russia");
        document.getElementById("LanguageSelection").classList.add("unitedKingdom");
        document.getElementById("EditCharInAlphabet").removeAttribute("id");
        document.getElementById('TableAlphabetEng').rows[0].cells[1].id = "EditCharInAlphabet";
        document.getElementById("TableAlphabetEng").classList.remove("displayNone");
        document.getElementById("TableAlphabetRus").classList.add("displayNone");
    }
    if (choice == "rus") {
        ClearItem("TableAlphabetEng");
        document.getElementById("LanguageSelection").classList.remove("unitedKingdom");
        document.getElementById("LanguageSelection").classList.add("russia");
        document.getElementById("EditCharInAlphabet").removeAttribute("id");
        document.getElementById('TableAlphabetRus').rows[0].cells[1].id = "EditCharInAlphabet";
        document.getElementById("TableAlphabetRus").classList.remove("displayNone");
        document.getElementById("TableAlphabetEng").classList.add("displayNone");
    }
}

/**
 * Очищает все "включенные диоды" и удаляет соответствующие классы с матрицы
 * срабатывает при нажатии на левую стрелку
 * @constructor
 */
function WashedMatrix() {
    var ok = confirm("Очистить матрицу?");
    if (ok == true) {
        ClearItem("Matrix");
    }
}

/**
 * Очищает таблицу алфавита, срабатывает при нажатие на правую стрелку
 * @constructor
 */
function WashedTableAlphabet() {
    var ok=confirm("Очистить таблицу символов текущего шрифта?");
    if(ok==true) {
        if (document.getElementById("LanguageSelection").classList.contains("russia") == true) {
            ClearItem("TableAlphabetRus");
        }
        else {
            ClearItem("TableAlphabetEng");
        }
    }
}

/**
 * Очищает элементы то стандартных значений
 * @param element - Элемент, который необходимо очистить
 * @constructor
 */
function ClearItem(element) {
    switch (element) {
        case "Matrix":
            var elements = document.getElementsByClassName("ledON");
            while (elements.length > 0) {
                elements[0].removeAttribute("class");
            }
        case "TableAlphabetRus":
            for (var i = 0; i < 33; i++) {
                document.getElementById("TableAlphabetRus").rows[i].cells[1].innerHTML = "?";
            }
        case "TableAlphabetEng":
            for (var i = 0; i < 26; i++) {
                document.getElementById("TableAlphabetEng").rows[i].cells[1].innerHTML = "?";
            }
    }
}

/**
 * Получает список всех имеющихся шрифтов. Срабатывает раз, при загрузки страницы
 * @constructor
 */
function GetListFonts() {
    var keys = Object.keys(GLOBAL_Fonts);
    var buf = "<table>";
    for (var i = 0; i < keys.length; i++) {
        buf += "<tr><td>" + keys[i] + "</td>";
        if (GLOBAL_Fonts[keys[i]]["type"] == "rus") {
            buf += "<td class='russia'>&emsp;</td>"
        }
        if (GLOBAL_Fonts[keys[i]]["type"] == "eng") {
            buf += "<td class='unitedKingdom'>&emsp;</td>"
        }
        buf += "</tr>";
    }
    buf += "</table>";
    document.getElementById("FontSelection").innerHTML = buf;
}

/**
 * Генерирует файл шрифта и скачивает его на ПК пользователя
 * @constructor
 */
function SaveFile() {
    var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'});
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }
            textFile = window.URL.createObjectURL(data);
            return textFile;
        };
    var fontName = document.getElementById("NameDownloadFont").value;
    var textbox = "GLOBAL_Fonts[\"" + fontName + "\"]={\r\n";
    textbox += "\"type\":";
    if (document.getElementById("LanguageSelection").classList.contains("russia") == true) {
        textbox += "\"rus\",\r\n";
    } else {
        textbox += "\"eng\",\r\n";
    }
    textbox += "\"Alphabet\":{\r\n"
    var ok = 1;
    for (var i = 0; i < document.getElementById('TableAlphabetRus').rows.length; i++) {
        var letter = document.getElementById('TableAlphabetRus').rows[i].cells[0].innerHTML;
        var characterCode = document.getElementById('TableAlphabetRus').rows[i].cells[1].innerHTML;
        if (characterCode == "?") {
            alert("Заполните все символы алфавита!");
            ok = 0;
            break;
        }
        textbox += "\"" + letter + "\":\"" + characterCode + "\", \r\n";
    }
    textbox += "}\r\n};";
    if (ok == 1) {
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(textbox);
        link.download = fontName + ".js";
        //link.style.display = 'block';
        document.getElementById('downloadlink').click();
    }
}

/**
 * Производит загрузку выбранного шрифта в таблицу
 * @param event - нажатый элемент, в данном случае шрифт
 * @constructor
 */
function SelectFont(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target.tagName == "TD") {
        if (document.getElementById("CurrentSelectedFont") != null) {
            document.getElementById("CurrentSelectedFont").removeAttribute("id")
        }
        target.id = "CurrentSelectedFont";

        var fontName = document.getElementById("CurrentSelectedFont").innerHTML;
        var id = "";
        if (GLOBAL_Fonts[fontName]["type"] == "rus") {
            LanguageSwitch("rus");
            id = "TableAlphabetRus";
        }
        if (GLOBAL_Fonts[fontName]["type"] == "eng") {
            LanguageSwitch("eng");
            id = "TableAlphabetEng";
        }
        for (var i = 0; i < Object.keys(GLOBAL_Fonts[fontName]["Alphabet"]).length; i++) {
            var letter = document.getElementById(id).rows[i].cells[0].innerHTML;
            document.getElementById(id).rows[i].cells[1].innerHTML = GLOBAL_Fonts[fontName]["Alphabet"][letter];
        }
        document.getElementById("NameDownloadFont").value = fontName;
    }
}
