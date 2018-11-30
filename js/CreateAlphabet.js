/**
 * Добавляет или удаляет класс css в зависимости от включен или выключен диод
 * срабатывает при клике на "диод" на матрице
 * @param event
 * @constructor
 */
function OnOffLed(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target.tagName === "TD") {
        if (target.className === "ledON") {
            target.removeAttribute("class");
        } else {
            target.className = "ledON";
        }
    }
}

/**
 * Функция следит за нажатием и отжатием кнопки для "рисования" на таблице создания символа
 * Входные данные функция с обработчиком событий и кнопка или набор клавиш(сочетание клавиш),
 *  для отслеживания нажатия
 * @param func
 */
function runOnKeys(func) {
    var codes = [].slice.call(arguments, 1);
    var pressed = {};
    document.onkeydown = function(e) {
        e = e || window.event;
        pressed[e.keyCode] = true;
        for (var i = 0; i < codes.length; i++) { // проверить, все ли клавиши нажаты
            if (!pressed[codes[i]]) {
                return;
            }
        }
        pressed = {};
        func();
    };
    document.onkeyup = function(e) {
        e = e || window.event;
        delete pressed[e.keyCode];
        document.getElementById("Matrix").removeEventListener("mouseover", OnOffLed);
    };
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
    if (target.tagName === "TD") {
        document.getElementById("EditCharInAlphabet").removeAttribute("id");
        target.id = "EditCharInAlphabet";
        /*При клике на уже записанном коде буквы, она будет показываться на матрице*/
        if (target.getAttribute("data-letterCode") !== "") {
            /* убираем лишние символы и очищаем матрицу */
            var buf = target.getAttribute("data-letterCode");
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

                    if (result[document.getElementById('Matrix').rows.length - 1 - j] === "1") {
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
    var result = "";
    for (var i = 0; i < document.getElementById('Matrix').rows[0].cells.length; i++) {
        var buf = "";
        for (var j = document.getElementById('Matrix').rows.length - 1; j >= 0; j--) {
            if (document.getElementById('Matrix').rows[j].cells[i].getAttribute("class") === null) {
                buf += "0";
            } else {
                buf += "1";
            }
        }
        var row = parseInt(buf, 2).toString(16);
        result += row.toUpperCase();
        if (i !== document.getElementById('Matrix').rows[0].cells.length - 1) {
            result += ",";
        }
    }
    /*Находим выделенную букву в списке алфавита и добавляем новый код*/
    document.getElementById("EditCharInAlphabet").setAttribute("data-letterCode",result);
    document.getElementById("EditCharInAlphabet").innerHTML="&#9745;";
    document.getElementById("EditCharInAlphabet").classList.add("addOk");
    /*убираем класс с вращением, чтобы при новом нажатие вращение работало*/
    setTimeout(function(){document.getElementById("EditCharInAlphabet").removeAttribute("class");}, 500);
}

/**
 * Переключает таблицы языков срабатывает при клике на соответствующую кноаку
 * @constructor
 */
function LanguageSelection(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    LanguageSwitch(target.id );
}

/**
 * Осуществляет переключение языков и таблицы алфавитов
 * @param choice - Выбор языка
 * @constructor
 */
function LanguageSwitch(choice) {
    var keys = Object.keys(FontType);
    document.getElementById("LanguageSelection").setAttribute("data-CurrentLanguage",choice);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== choice) {
            ClearItem(FontType[keys[i]]["TableID"]);
            document.getElementById("LanguageSelection").classList.remove(FontType[keys[i]]["img"]);
            document.getElementById(FontType[keys[i]]["TableID"]).classList.add("displayNone");
        }
    }
    document.getElementById("EditCharInAlphabet").removeAttribute("id");
    document.getElementById(FontType[choice]["TableID"]).rows[0].cells[1].id = "EditCharInAlphabet";
    document.getElementById("LanguageSelection").classList.add(FontType[choice]["img"]);
    document.getElementById(FontType[choice]["TableID"]).classList.remove("displayNone");
}

/**
 * Очищает все "включенные диоды" и удаляет соответствующие классы с матрицы
 * срабатывает при нажатии на левую стрелку
 * @constructor
 */
function WashedMatrix() {
    var ok = confirm("Очистить матрицу?");
    if (ok === true) {
        ClearItem("Matrix");
    }
}

/**
 * Очищает таблицу алфавита, срабатывает при нажатие на кнопку очистки
 * @constructor
 */
function WashedTableAlphabet() {
    var ok=confirm("Очистить таблицу символов текущего шрифта?");
    if(ok===true) {
        var CurrentLanguage= document.getElementById("LanguageSelection").getAttribute("data-CurrentLanguage");
        ClearItem(FontType[CurrentLanguage]["TableID"]);
    }
}

/**
 * Очищает элементы до стандартных значений
 * @param element - ID Элемента, который необходимо очистить
 * @constructor
 */
function ClearItem(element) {
    if (element === "Matrix") {
        var elements = document.getElementsByClassName("ledON");
        while (elements.length > 0) {
            elements[0].removeAttribute("class");
        }
    } else {
        for (var i = 0; i <  document.getElementById(element).rows.length; i++) {
            document.getElementById(element).rows[i].cells[1].innerHTML = "&#9746";
            document.getElementById(element).rows[i].cells[1].setAttribute("data-letterCode","");
        }
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
    textbox += "\"type\":";
    var ID="";
    var CurrentLanguage= document.getElementById("LanguageSelection").getAttribute("data-CurrentLanguage");
    textbox += "\""+CurrentLanguage+"\",\r\n";
    ID=FontType[CurrentLanguage]["TableID"];
    textbox += "\"size\":" + "\""+document.getElementById("MatrixSize").value+"\",\n";
    textbox += "\"Alphabet\":{\r\n";
    var ok = true;
    for (var i = 0; i < document.getElementById(ID).rows.length; i++) {
        var letter = document.getElementById(ID).rows[i].cells[0].innerHTML;
        var characterCode = document.getElementById(ID).rows[i].cells[1].getAttribute("data-letterCode");
        if (characterCode === "") {
            alert("Заполните все символы алфавита!");
            ok = false;
            break;
        }
        textbox += "\"" + letter + "\":\"" + characterCode + "\", \r\n";
    }
    textbox += "}\r\n};\n";
    if (ok === true) {
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(textbox);
        link.download = fontName + ".json";
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
    if (target.tagName === "TD") {
        if (document.getElementById("CurrentSelectedFont") !== null) {
            document.getElementById("CurrentSelectedFont").removeAttribute("id")
        }
        target.id = "CurrentSelectedFont";
        var fontName = document.getElementById("CurrentSelectedFont").innerHTML;
        BuildMatrix(GLOBAL_Fonts[fontName]["size"]);
        document.getElementById("MatrixSize").value=GLOBAL_Fonts[fontName]["size"];

        LanguageSwitch(GLOBAL_Fonts[fontName]["type"]);
        var id = FontType[GLOBAL_Fonts[fontName]["type"]]["TableID"];
        for (var i = 0; i < Object.keys(GLOBAL_Fonts[fontName]["Alphabet"]).length; i++) {
            var letter = document.getElementById(id).rows[i].cells[0].innerHTML;
            document.getElementById(id).rows[i].cells[1].innerHTML ="&#9745;";
            document.getElementById(id).rows[i].cells[1].setAttribute("data-letterCode", GLOBAL_Fonts[fontName]["Alphabet"][letter]);
        }
        document.getElementById("NameDownloadFont").value = fontName;
    }
}

/**
 * Проверка корректности введённого имени шрифта, запрет на спец символы и тп
 * @constructor
 */
function ValidationNameDownload(Name_id) {
   var fontName= document.getElementById(Name_id).value;
    fontName=fontName.replace(/[^А-яЁёa-zA-Z-0-9]/g, "");
if (fontName.length>20){
    var cut=fontName.length-20;
    fontName=fontName.substr(0,fontName.length-cut);
}
    document.getElementById(Name_id).value=fontName;
}

/**
 * Определяет размер "диода" в таблице создания символа
 * @constructor
 */
function DiodeSize() {
    var size=document.getElementById("DiodeSize").value+"px";
    var styles = document.getElementsByTagName('style'); // все стили
    var sheet = styles[0].sheet; // первая таблица стилей
    var rules = sheet.rules; // правила первой таблицы
   for (var i=0; i<4; i++) {
       var style = rules[0].style; // набор свойств первого правила первой таблицы
       var property = style[i]; // первое свойство первого правила первой таблицы
       style[property]=size;
   }
}

/**
 * Срабатывает при изменение значений в поле "Размер матрицы". Изменяет размер таблицы
 * @constructor
 */
function MatrixSize() {
    var size=document.getElementById("MatrixSize").value;
    var CurrentLanguage= document.getElementById("LanguageSelection").getAttribute("data-CurrentLanguage");
    ClearItem(FontType[CurrentLanguage]["TableID"]);
    BuildMatrix(size);
}

/**
 * Строит новую таблицу согласно заданному параметру размера
 * @param size -размер таблицы
 * @constructor
 */
function BuildMatrix(size){
    document.getElementById("Matrix").innerHTML="";
    var buf="<tr>";
    for(var i=0; i<size*8; i++) {
        for (var j = 0; j < size; j++) {
            buf += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
        }
        buf += "</tr>";
        document.getElementById("Matrix").innerHTML=buf;
    }
}