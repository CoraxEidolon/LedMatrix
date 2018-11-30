/**
 * Данная функция практически аналогична той, что была в "создание шрифтов", однако тут
 * присутствует множественный выбор. Можно выбрать только один шрифт одного типа.
 * Например Один русский, один английский... и тп.
 * В случае повторного выбора такого же типа шрифта, выделение с уже выбранного шрифта
 * снимается и будет выбран новый шрифт
 * @param event
 * @constructor
 */
function SelectFont(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target.tagName === "TD") {
        var classObject = "";
        if (target.parentNode.childNodes[1].classList.contains("russiaSVG")) {
            classObject = "russiaSVG";
        } else if (target.parentNode.childNodes[1].classList.contains("unitedKingdomSVG")) {
            classObject = "unitedKingdomSVG";
        }
        else if (target.parentNode.childNodes[1].classList.contains("numberSVG")) {
            classObject = "numberSVG";
        }
        var buf = document.getElementsByClassName(classObject);
        var ok = 0;
        for (var i = 0; i < buf.length; i++) {
            if (buf[i].parentNode.childNodes[0].classList.contains("tickerSelectFont")) {
                buf[i].parentNode.childNodes[0].classList.remove("tickerSelectFont");
                target.classList.add("tickerSelectFont");
                ok = 1;
                break;
            }
        }
        if (ok === 0) {
            target.classList.add("tickerSelectFont");
        }
    }
}

/**
 * Основная функция создания бегущей строки.
 * Срабатывает при нажатии соответствующей кнопки.
 * Так при вводе огромного текста, расчеты занимают время и чтобы пользователь понимал,
 * что программа считает появляется окно загрузки.
 * В следствии этого данная функция вызывается асинхронна из функции loading();
 * @constructor
 */
function CreateTicker() {
    var text = document.getElementById("TickerInput").value;//Текст бегущей строки
        var binaryFont = GetBinary(text);//Двоичное представление бегущей строки по столбцам
        console.log(binaryFont);
        /*Размер шрифта, определяется от количествка строк в матрице*/
        var fontSize = Number(document.getElementById("MatrixRows").value);

        /*Результирующий массив, содержит готовый массив бегущей строки, для загрузки в МК*/
        var arResult = new Array(fontSize);
        for (var i = 0; i < fontSize; i++) {
            arResult[i] = GetTicker(binaryFont[i]);
        }

        CodeOutput(arResult,text);

        console.log(arResult);
        /*После того, как код бегущей строки получен, отключаем загрузку и показываем окно кода*/
        document.getElementById("Loading").classList.remove("loader");
        document.getElementById("CodeTickerResult").classList.remove("displayNone");
}


/**
 * Создает бинарное представление бегущей строки
 * @param text -Текст бегущей строки
 * @returns {Array} - Возвращает бинарное представление всей бегущей строки
 * @constructor
 */
function GetBinary(text) {

    /*определяет длину пустого столбца (только нули) */
    function ZeroLength(fontSize) {
        var zeroBuf = "";
        for (var i = 0; i < fontSize; i++) {
            zeroBuf += "00000000";
        }
        return (zeroBuf);
    }

    /*список выбранных шрифтов*/
    var fontList = document.getElementsByClassName("tickerSelectFont");

    /* В fontTypeList-Первичный ключ будет содержать тип шрифта, который содержит имя выбранного шрифта*/
    var fontTypeList = [];
    for (var i = 0; i < fontList.length; i++) {
        fontTypeList.push(GLOBAL_Fonts[fontList[i].innerHTML]["type"]);
        fontTypeList[GLOBAL_Fonts[fontList[i].innerHTML]["type"]] = fontList[i].innerHTML;
    }

    /*Результирующий массив, который будет содержать конечный результат (бинарное представление строки) */
    var binaryTickerResult = [];

    for (var i = 0; i < text.length; i++) {
        var buf = text[i];//Берем по одному символу строки

        /*Так как все символы алфавита записаны в верхнем регистре, переводим символ в верхний регистр*/
        buf = buf.toUpperCase();

        /*Шестнадцатеричное представление полученного символа*/
        var letter16 = "";

        /*Проверяем, к какому типу алфавитов относится символ*/
        if (/[А-яЁё]/.test(buf)) {
            letter16 = GLOBAL_Fonts[fontTypeList["rus"]]["Alphabet"][buf];
        } else if (/[a-zA-Z]/.test(buf)) {
            letter16 = GLOBAL_Fonts[fontTypeList["eng"]]["Alphabet"][buf];
        } else if (/[0-9,+\-*/=()?!]/.test(buf)) {
            letter16 = GLOBAL_Fonts[fontTypeList["num"]]["Alphabet"][buf];
        }

        /*Размер шрифта, определяется от количествка строк в матрице*/
        var fontSize = document.getElementById("MatrixRows").value;

        /*Удаляем все лишние элементы, оставляя "чистый" код символы*/
        letter16 = letter16.split(",");

        /*Так как пробел представляет отдельную группу и для него отдельная
         настройка длинны, то имеем отдельное правило*/
        if (/[\s]/.test(buf)) {

            /*Длина пробела, в зависимости от заданной*/
            var spaceLength = document.getElementById("SpaceLength").value;
            for (var spaceCounter = 0; spaceCounter < spaceLength; spaceCounter++) {
                binaryTickerResult.push(ZeroLength(fontSize));
            }
        } else {

            /*Удаляем пустые лишние строки из начала(лево), оставляя только "чистый" символ*/
            while (true) {
                if (letter16[0] === "0") {
                    letter16.shift();
                } else break;
            }
            /*Удаляем пустые лишние строки из конца(право),оставляя только "чистый" символ*/
            while (true) {
                if (letter16[letter16.length - 1] === "0") {
                    letter16.pop();
                } else break;
            }

            /*Так как js при расчётах убирает не значащие нули, возвращаем их, так как нам они нужны.
             Добиваемся, нужной длинны: fontSize*8 */
            for (var j = 0; j < letter16.length; j++) {
                var bufBinary = letter16[j];
                bufBinary = parseInt(bufBinary, 16).toString(2);
                if (bufBinary.length < (fontSize * 8)) {
                    var zeroAdd = "";
                    for (var z = 0; z < (fontSize * 8) - bufBinary.length; z++) {
                        zeroAdd += "0";
                    }
                    zeroAdd += bufBinary;
                    bufBinary = zeroAdd;
                }
                binaryTickerResult.push(bufBinary);
            }//j

            /*Проверяем не выходит ли следующий символ, за длину строки*/
            if (text.length >= (i + 1)) {
                /*Если следующий символ пробел, то расстояние между символами не добавляем*/
                if (/[\s]/.test(text[i + 1]) === false) {
                    /*Добавляем расстояние между символами, в зависимости от заданного*/
                    var spacingBetweenLetters = document.getElementById("SpacingBetweenLetters").value;
                    for (var distance = 0; distance < spacingBetweenLetters; distance++) {
                        binaryTickerResult.push(ZeroLength(fontSize));
                    }
                }
            }
        }//i
    }//не пробел

    var MatrixLength = document.getElementById("MatrixColumns").value;//Количество матриц по горизонтали (столбцы)
    /*Чтобы текст прошел полностью, плюс пустые матрицы по окончанию*/
    for (var i = 0; i < (MatrixLength * 8); i++) {
        binaryTickerResult.push(ZeroLength(fontSize));
    }

    /*Разбиваем полученный массив на массивы для каждой строки (по 8 элементов)*/
    var binaryMas = new Array(Number(fontSize));
    for (var i = 0; i < binaryMas.length; i++) {
        binaryMas[i] = new Array(binaryTickerResult.length);
    }
    for (var i = 0; i < binaryTickerResult.length; i++) {
        for (var j = 0; j < fontSize; j++) {
            binaryMas[j][i] = binaryTickerResult[i].substr(j * 8, 8);
        }
    }

    return (binaryMas);
}//GetBinary

/**
 * Принимает двоичное представление бегущей строки (0-диод не горит, 1 горит) и преобразует его в 16ричный код, понятный микроконтроллеру.
 * @param binaryFont
 * @returns {Array} - Возвращает массив пригодный для загрузки в микроконтроллер (16 ричный код).
 * @constructor
 */
function GetTicker(binaryFont) {
    /* Создаем многомерный массив*/
    var matrix = new Array(8);
    for (var i = 0; i < matrix.length; i++) matrix[i] = new Array(8);
    /* Обнуляем matrix  */
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            matrix [i][j] = 0;
        }
    }
    var arResult = [];//Результирующий массив, в конце вычислений будет содержать готовый массив, для загрузки в МК
    for (var z = 0; z < binaryFont.length; z++) {
        /*Сдвиг в лево. Очень важный момент, сдвиг нужно начинать слева и "тянуть остальные значения на лево"*/
        for (var i = 0; i < 8; i++) {
            for (var j = 1; j < 8; j++)
                matrix [i][j - 1] = matrix [i][j];
        }//i

        /*Присваиваем крайней правой части символы*/
        for (var i = 7; i >= 0; i--) {
            matrix [i][7] = binaryFont[z][i];

        }//i
        var result = "{";
        for (var i = 0; i < 8; i++) {
            var bufResult = "";
            for (var j = 0; j < 8; j++) {
                bufResult += matrix[j][i];
            }
            var row = parseInt(bufResult, 2).toString(16);
            row = row.toUpperCase();
            result += "0x";
            if (row.length < 2) {
                result += "0";
            }
            result += row;
            if (i !== 7) {
                result += ",";
            }
        }
        result += "}";
        arResult.push(result);
    }//z
    return arResult;
}

/**
 * Выводит код пригодный для загрузки в МК в соответствующее поле на экране
 * @param arResult - Массив содержащий шестнадцатеричный код бегущей строки
 * @constructor
 */
function CodeOutput(arResult,Text) {
    /*________________________ВЫВОД________________________*/
    var Columns = Number(document.getElementById("MatrixColumns").value);
    var Rows = Number(document.getElementById("MatrixRows").value);
    var CodeArduino= document.getElementById("CodeTickerResult");//Поле вывода кода
    CodeArduino.value +="/*"+Text+"*/\n";
    var d = new Date();
    var timeCreation = d.getDate() + "." + Number(d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    CodeArduino.value +="/* Дата создания: "+timeCreation+"*/\n";
    CodeArduino.value +="/* Количество матриц по горизонтали :"+Columns+" */\n";
    CodeArduino.value +="/* Количество матриц по вертикали :"+Rows+" */\n";
    CodeArduino.value += "int i;\nint j;\n";
    /*Подключение к микроконтроллеру.
     В этот раз все удобно, расположение матриц на экране, соответствует матрицам в жизни*/
    CodeArduino.value +="//M_Строка_Столбец\n";
    for (var j = 0; j < Rows; j++) {
        for (var i = 0; i < Columns; i++) {
            CodeArduino.value += "//Матрица " + j + "_" + i + "\n";
            CodeArduino.value += "int M_" + j + "_" + i + "_CLK =" + document.getElementById(j + "_" + i + "_CLK").value + ";\n";
            CodeArduino.value += "int M_" + j + "_" + i + "_CS =" + document.getElementById(j + "_" + i + "_CS").value + ";\n";
            CodeArduino.value += "int M_" + j + "_" + i + "_DIN =" + document.getElementById(j + "_" + i + "_DIN").value + ";\n";
        }
    }
    for (var j = 0; j < Rows; j++) {
        CodeArduino.value += "const uint8_t line" + j + "[" + arResult[j].length + "][8]PROGMEM ={\n";

        /*Вывод массива бегущей строки*/
        for (var i = 0; i < arResult[j].length; i++) {
            CodeArduino.value += arResult[j][i] + ",\n";
        }
        CodeArduino.value += "};\n\n";
    }
    CodeArduino.value += "\n";
    /*Функции вывода*/
    CodeArduino.value += "void Write_Matr_byte(unsigned char DATA, int CS, int CLK, int DIN) {\n";
    CodeArduino.value += "   unsigned char i;\n";
    CodeArduino.value += "    digitalWrite(CS,LOW);\n";
    CodeArduino.value += "    for(i=8;i>=1;i--) {\n";
    CodeArduino.value += "        digitalWrite(CLK,LOW);\n";
    CodeArduino.value += "        digitalWrite(DIN,DATA&0x80);\n";
    CodeArduino.value += "        DATA = DATA<<1;\n";
    CodeArduino.value += "        digitalWrite(CLK,HIGH);\n";
    CodeArduino.value += "    }\n";
    CodeArduino.value += " }\n\n";
    CodeArduino.value += "void Write_Matr(unsigned char address,unsigned char dat, int CS, int CLK, int DIN){\n";
    CodeArduino.value += "    digitalWrite(CS,LOW);\n";
    CodeArduino.value += "    Write_Matr_byte(address,CS, CLK, DIN);\n";
    CodeArduino.value += "    Write_Matr_byte(dat,CS,CLK,DIN);\n";
    CodeArduino.value += "    digitalWrite(CS,HIGH);\n";
    CodeArduino.value += "}\n\n";
    CodeArduino.value += " void Init_Matr(int CS, int CLK, int DIN){\n";
    CodeArduino.value += "    Write_Matr(0x09, 0x00,CS, CLK, DIN);\n";
    CodeArduino.value += "    Write_Matr(0x0a, 0x03,CS, CLK, DIN);\n";
    CodeArduino.value += "    Write_Matr(0x0b, 0x07,CS, CLK, DIN);\n";
    CodeArduino.value += "    Write_Matr(0x0c, 0x01,CS, CLK, DIN);\n";
    CodeArduino.value += "    Write_Matr(0x0f, 0x00,CS, CLK, DIN);\n";
    CodeArduino.value += "}\n\n";
    CodeArduino.value += "void setup() {\n";

    /*Настраиваем пинов вывода матрицы*/
    for (var j = 0; j < Rows; j++) {
        for (var i = 0; i < Columns; i++) {
            CodeArduino.value += "//Настраиваем выводы матрицы " + i + " как выходы:\n";
            CodeArduino.value += "pinMode(M_" + j + "_" + i + "_CLK,OUTPUT);\n";
            CodeArduino.value += "pinMode(M_" + j + "_" + i + "_CS,OUTPUT);\n";
            CodeArduino.value += "pinMode(M_" + j + "_" + i + "_DIN,OUTPUT);\n";
        }
    }
    CodeArduino.value += "delay(50);\n";

    /*Инициализация матриц*/
    for (var j = 0; j < Rows; j++) {
        for (var i = 0; i < Columns; i++) {
            CodeArduino.value += "Init_Matr(M_" + j + "_" + i + "_CS, M_" + j + "_" + i + "_CLK, M_" + j + "_" + i + "_DIN);\n";
        }
    }
    CodeArduino.value += "}\n\n";
    CodeArduino.value += "void loop(){\n\n";
    CodeArduino.value += "for (j = 0; j < " + arResult[0].length + "; j++) {\n";

    for (var j = 0; j < Rows; j++) {
        for (var i = Columns - 1; i >= 0; i--) {
            var coefficient = (Columns - 1) - i;
            if (i === (Columns - 1)) {
                CodeArduino.value += "for (i = 1; i < 9; i++) {\n";
                CodeArduino.value += "    Write_Matr(i, pgm_read_byte( &line" + j + "[j][i - 1]), M_" + j + "_" + i + "_CS, M_" + j + "_" + i + "_CLK, M_" + j + "_" + i + "_DIN);\n";
                CodeArduino.value += "}\n\n";
            } else {
                CodeArduino.value += "if (j <= " + (coefficient * 8 - 1) + ") {\n";
                CodeArduino.value += "    Write_Matr(i, 0x00, M_" + j + "_" + i + "_CS, M_" + j + "_" + i + "_CLK, M_" + j + "_" + i + "_DIN);\n";
                CodeArduino.value += "} else {\n";
                CodeArduino.value += "    for (i = 1; i < 9; i++) {\n";
                CodeArduino.value += "        Write_Matr(i, pgm_read_byte( &line" + j + "[j - " + (coefficient * 8) + "][i - 1]), M_" + j + "_" + i + "_CS, M_" + j + "_" + i + "_CLK, M_" + j + "_" + i + "_DIN);\n";
                CodeArduino.value += "    }\n";
                CodeArduino.value += "}\n\n";
            }///!
        }//i
    }//j
    CodeArduino.value += "delay(" + document.getElementById("speedTicker").value + ");//Скорость вывода\n";
    CodeArduino.value += "    }\n";
    CodeArduino.value += "}\n";
}

/**
 * Сопоставляет типы введённого текста для бегущей строки с выбранными шрифтами
 * @returns {boolean} -Возвращает true, типы введенного шрифта совпадают с типами выбранного иначе false
 * @constructor
 */
function CheckAvailableFonts() {
    /*Получаем список используемых шрифтов*/
    var fontList = document.getElementsByClassName("tickerSelectFont");//список выбранных шрифтов

    var text = document.getElementById("TickerInput").value;//Текст бегущей строки
    if(text.length===0){
        alert("Введите текст бегущей строки!");
        return false;
    } else
    if (fontList.length === 0) {
        alert("Выберете шрифты для работы!");
        return false;
    } else {
        var result = true;
        /*Получаем список типов выбранных шрифтов*/
        var fontTypeList = [];
        for (var i = 0; i < fontList.length; i++) {
            fontTypeList.push(GLOBAL_Fonts[fontList[i].innerHTML]["type"]);
        }

        /*Проверяем, содержит ли текст РУССКИЕ буквы и выбран ли соответствующий шрифт*/
        if (text.search(/[А-яЁё]/) >= 0) {
            var ok = false; //Если все необходимые типы шрифтов содержатся, то переменная будет равна true
            for (var i = 0; i < fontTypeList.length; i++) {
                if (fontTypeList[i] === "rus") {
                    ok = true;
                }
            }
            if (ok === false) {
                result = false;
                alert("Текст бегущей строки содержит русские символы, однако соответствующий шрифт не выбран");
            }
        }//rus

        /*Проверяем, содержит ли текст АНГЛИЙСКИЕ буквы и выбран ли соответствующий шрифт*/
        if (text.search(/[a-zA]/) >= 0) {
            var ok = false; //Если все необходимые типы шрифтов содержатся, то переменная будет равна true
            for (var i = 0; i < fontTypeList.length; i++) {
                if (fontTypeList[i] === "eng") {
                    ok = true;
                }
            }
            if (ok === false) {
                result = false;
                alert("Текст бегущей строки содержит английские символы, однако соответствующий шрифт не выбран");
            }
        }//eng
        /*Проверяем, содержит ли текст ЦИФРЫ, СКОБКИ, МАТ ЗНАКИ и выбран ли соответствующий шрифт*/
        if (text.search(/[0-9+\-*/=()?!]/) >= 0) {
            var ok = false; //Если все необходимые типы шрифтов содержатся, то переменная будет равна true
            for (var i = 0; i < fontTypeList.length; i++) {
                if (fontTypeList[i] === "num") {
                    ok = true;
                }
            }
            if (ok === false) {
                result = false;
                alert("Текст бегущей строки содержит цифры, скобки или математические символы, однако соответствующий шрифт не выбран");
            }
        }//eng
    }//else
    return result;
}//function

/**
 * Проверяет корректность текста для бегущей строки и удаляет запрещенные символы
 * @constructor
 */
function ValidationTickerTextBox() {
    var text = document.getElementById("TickerInput").value;
    text = text.replace(/[^А-яЁёa-zA-Z-0-9+\-*/=()?!\s]/g, "");
    document.getElementById("TickerInput").value = text;
}

/***
 * Запускает экран загрузки, в то время пока функция построения бегущей строки выполняет свою работу
 * @constructor
 */
function loading() {
    var ok = CheckAvailableFonts();
    if (ok) {
        document.getElementById("CodeTickerResult").value = "";
        document.getElementById("CodeTickerResult").classList.add("displayNone");
        document.getElementById("Loading").classList.add("loader");
        document.getElementById("CodeTickerResult").classList.remove("packageSVG");
        setTimeout(CreateTicker, 0);//Асинхронный запуск, самый простой вариант, но работает =)
    }
}

/**
 * Создает таблицу с полями для ввода подключений контактов бегущей строки, заданного размера
 * @constructor
 */
function BuildTable() {

    var SelectfontList = document.getElementsByClassName("tickerSelectFont");//список выбранных шрифтов

    /*Убираем выделения с выбранных шрифтов, так как под новый размер они могут не подойти*/
    for (var i = 0; i < SelectfontList.length; i++) {
        SelectfontList[i].classList.remove("tickerSelectFont");
    }

    document.getElementById('Div_MatrixTableInput').innerHTML = "";
    document.getElementById('Div_MatrixTableInput').innerHTML = "<table id='TableInput' class='tableInput'> </table>";
    SizeFontShow(document.getElementById("MatrixRows").value);
    for (var i = 0; i < document.getElementById("MatrixRows").value; i++) {
        var buf = "<tr>";
        for (var j = 0; j < document.getElementById("MatrixColumns").value; j++) {
            buf += "<td>";
            var id = i + "_" + j + "_CLK";
            buf += "CLK:<input type='number' min='0' value='0' class='inputNumber' id='" + id + "' ><br>";
            id = i + "_" + j + "_CS";
            buf += "CS:&nbsp;&ensp;<input type='number' min='0' value='0'  class='inputNumber'  id='" + id + "' ><br>";
            id = i + "_" + j + "_DIN";
            buf += "DIN:&nbsp;<input type='number' min='0' value='0'  class='inputNumber'  id='" + id + "' ><br>";
            buf += "</td>";
        }//j
        buf += "</tr>";
        document.getElementById('TableInput').innerHTML += buf;
    }//i
}

/**
 * Загружает на устройство скетч Arduino.
 * После чего его можно открыть в Arduino IDE и загрузить в МК.
 * @constructor
 */
function SaveArduinoFile(Content_id, Link_id) {
  if (document.getElementById(Content_id).value===""){
      alert("Программный код еще не сгенерирован!");
  } else {
      var textFile = null,
          makeTextFile = function (text) {
              var data = new Blob([text], {type: 'text/plain'});
              if (textFile !== null) {
                  window.URL.revokeObjectURL(textFile);
              }
              textFile = window.URL.createObjectURL(data);
              return textFile;
          };
      var d = new Date();
      var SketchName = "Sketch_" + d.getDate() + "." + Number(d.getMonth() + 1) + "." + d.getFullYear() + "_" + d.getHours() + "-" + d.getMinutes();
      var text = document.getElementById(Content_id).value;
      var link = document.getElementById(Link_id);
      link.href = makeTextFile(text);
      link.download = SketchName + ".ino";
      document.getElementById(Link_id).click();
  }
}

/**
 * Очищает текст поля бегущей строки
 * @constructor
 */
function WashedTickerInput() {
    var ok = confirm("Очистить текст бегущей строки?");
    if (ok === true) {
        document.getElementById("TickerInput").value = "";
    }
}
/**
 * Очищает поле программного кода
 * @constructor
 */
function WashedCodeTickerResult(Content_id) {
    var ok = confirm("Очистить полученный программный код?");
    if (ok === true) {
        document.getElementById(Content_id).value = "";
        document.getElementById(Content_id).classList.add("packageSVG");
    }
}

/**
 * Показывает шрифты заданного размера (количество матриц по вертикали)
 * @param sizeFont - количество матриц по вертикали (строки)
 * @constructor
 */
function SizeFontShow(sizeFont) {
    if (sizeFont === undefined) {
        sizeFont = "1";
    }
    var fontTable = document.getElementById("FontSelection").firstElementChild;
    for (var i = 0; i < fontTable.rows.length; i++) {
        if (fontTable.rows[i].cells[2].innerHTML === sizeFont) {
            if (fontTable.rows[i].classList.contains("displayNone") === true) {
                fontTable.rows[i].classList.remove("displayNone");
            }
        } else {
            if (fontTable.rows[i].classList.contains("displayNone") === false) {
                fontTable.rows[i].classList.add("displayNone");
            }
        }
    }
}

/**
 * Показывает или скрывает панель подключения матриц к микроконтроллеру и поле кода Arduino
 * @constructor
 */
function Ticker_ShowHide(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    var idElement = {
        "ShowHideConnectMicrocontroller": "Div_MatrixTableInput",
        "ShowHideArduinoCode": "CodeTickerResult"
    };
    if (document.getElementById(target.id).classList.contains("hideSVG")) {
        document.getElementById(idElement[target.id]).classList.add("displayNone");
        document.getElementById(target.id).classList.remove("hideSVG");
        document.getElementById(target.id).classList.add("showSVG");
    } else {
        document.getElementById(idElement[target.id]).classList.remove("displayNone");
        document.getElementById(target.id).classList.add("hideSVG");
        document.getElementById(target.id).classList.remove("showSVG");
    }
}

