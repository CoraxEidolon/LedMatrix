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
        document.getElementById("EditCharInAiphabet").removeAttribute("id");
        target.id = "EditCharInAiphabet";
        /*При клике на уже записанном коде буквы, она будет показываться на матрице*/
        if (target.innerHTML != "?") {
            /* Чтобы все точно работало, поэтапно убираем лишние символы и очищаем матрицу */
            var buf = target.innerHTML;
            buf = buf.replace(/{/g, "");
            buf = buf.replace(/}/g, "");
            buf = buf.replace(/0x/g, "");
            buf = buf.split(",")
            WashedMatrix(false);
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
    document.getElementById("EditCharInAiphabet").innerHTML = result;
}
/**
 * Переключает таблицы языков русский, английский
 *срабатывает при клике на соответствующую кноаку
 * @constructor
 */
function LanguageSelection() {
    if(document.getElementById("LanguageSelection").classList.contains("russia")==true){
        document.getElementById("LanguageSelection").classList.remove("russia");
        document.getElementById("LanguageSelection").classList.add("unitedKingdom");
        document.getElementById("EditCharInAiphabet").removeAttribute("id");
        document.getElementById('TableAlphabetEng').rows[0].cells[1].id = "EditCharInAiphabet";
        document.getElementById("TableAlphabetEng").classList.remove("displayNone");
        document.getElementById("TableAlphabetRus").classList.add("displayNone");
    }
    else{
        document.getElementById("LanguageSelection").classList.remove("unitedKingdom");
        document.getElementById("LanguageSelection").classList.add("russia");
        document.getElementById("EditCharInAiphabet").removeAttribute("id");
        document.getElementById('TableAlphabetRus').rows[0].cells[1].id = "EditCharInAiphabet";
        document.getElementById("TableAlphabetRus").classList.remove("displayNone");
        document.getElementById("TableAlphabetEng").classList.add("displayNone");
    }
}

/**
 * Очищает все "включенные диоды" и удаляет соответствующие классы с матрицы
 * срабатывает при нажатии на соответствующую кнопку
 * @param ask - если равен false, то окно с вопросом не появится
 * @constructor
 */
function WashedMatrix(ask) {
    var ok;
    if(ask==false){ok=false;} else{
    ok = confirm("Очистить матрицу?");
    }
    if (ok==true) {
        var elements = document.getElementsByClassName("ledON");
        while (elements.length > 0) {
            elements[0].removeAttribute("class");
        }
    }
}

/**
 * Получает список всех имеющихся шрифтов. Срабатывает раз, при загрузки страницы
 * @constructor
 */
function GetListFonts() {
    var keys=Object.keys(GLOBAL_Fonts);
    for(var i=0; i<keys.length;i++){
        var select = document.getElementById("FontSelection");
        var newOption = new Option(keys[i]);
        select.appendChild(newOption);
    }
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
    var ok = 1;
    for (var i = 0; i < document.getElementById('TableAlphabetRus').rows.length; i++) {
        var a = document.getElementById('TableAlphabetRus').rows[i].cells[0].innerHTML;
        var b = document.getElementById('TableAlphabetRus').rows[i].cells[1].innerHTML;
        if (b == "?") {
            alert("Заполните все символы алфавита!");
            ok = 0;
            break;
        }
        textbox += a + ":\"" + b + "\", \r\n";
    }
    textbox += "};";

    if (ok == 1) {
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(textbox);
        link.download = fontName + ".js";
        //link.style.display = 'block';
        document.getElementById('downloadlink').click();
    }

}

