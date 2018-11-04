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
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Ps Пока тут очень много всего и прям мясо, потом нужно разбить на функции...
 * Или наконец запилить класс хз =)
 * @constructor
 */
function CreateTicker() {
    var fontList = document.getElementsByClassName("tickerSelectFont");//список выбранных шрифтов
    /*fontTypeList-Первичный ключ будет содержать тип шрифта, который содержит имя выбранного шрифта*/
    var fontTypeList = [];
    for (var i = 0; i < fontList.length; i++) {
        fontTypeList.push(GLOBAL_Fonts[fontList[i].innerHTML]["type"]);
        fontTypeList[GLOBAL_Fonts[fontList[i].innerHTML]["type"]] = fontList[i].innerHTML;
    }
    var text = document.getElementById("TickerInput").value;//Текст бегущей строки
    var binaryFont = [];//Двоичное представление бегущей строки по столбцам, например 00000000
    for (var i = 0; i < text.length; i++) {
        var buf = text[i];//Берем по одному символу строки
        buf = buf.toUpperCase();
        var letter = "";
        /*Проверяем, к какому типу алфавитов относится символ*/
        if (/[А-яЁё]/.test(buf)) {
            letter = GLOBAL_Fonts[fontTypeList["rus"]]["Alphabet"][buf];
        } else if (/[a-zA-Z]/.test(buf)) {
            letter = GLOBAL_Fonts[fontTypeList["eng"]]["Alphabet"][buf];
        } else if (/[0-9,+\-*/=()?!]/.test(buf)) {
            letter = GLOBAL_Fonts[fontTypeList["num"]]["Alphabet"][buf];
        }
        /*Удаляем все лишние элементы, оставляя "чистый" код*/
        letter = letter.replace(/{/g, "");
        letter = letter.replace(/}/g, "");
        letter = letter.replace(/0x/g, "");
        letter = letter.split(",");
        /*Так как пробел представляет отдельную группу и для него отдельная
        настройка длинны, то имеем отдельное правило*/
        if (/[\s]/.test(buf)) {
            /*Длина пробела, в зависимости от заданной*/
            var spaceLength = document.getElementById("SpaceLength").value;
            for (var spaceCounter = 0; spaceCounter < spaceLength; spaceCounter++) {
                binaryFont.push("00000000");
            }
        } else {
            /*Удаляем пустые лишние строки из начала(лево), оставляя только "чистый" символ*/
            while (true) {
                if (letter[0] === "00") {
                    letter.shift();
                } else break;
            }
            /*Удаляем пустые лишние строки из конца(право),оставляя только "чистый" символ*/
            while (true) {
                if (letter[letter.length - 1] === "00") {
                    letter.pop();
                } else break;
            }

            /*Так как js при расчётах убирает не значащие нули, возвращаем их, так как нам они нужны.
            Добиваемся, длинны 8 (размер одной матрицы)*/
            for (var j = 0; j < letter.length; j++) {
                var bufBinary = letter[j];
                bufBinary = parseInt(bufBinary, 16).toString(2);
                if (buf.length < 8) {
                    var zeroAdd = "";
                    for (var z = 0; z < 8 - bufBinary.length; z++) {
                        zeroAdd += "0";
                    }
                    zeroAdd += bufBinary;
                    bufBinary = zeroAdd;
                }
                binaryFont.push(bufBinary);
            }//j
            /*Добавляем расстояние между символами, в зависимости от заданного*/
            var spacingBetweenLetters = document.getElementById("SpacingBetweenLetters").value;
            for (var distance = 0; distance < spacingBetweenLetters; distance++) {
                binaryFont.push("00000000");
            }
        }//i
    }//не пробел
    /*Чтобы текст прошел полностью, плюс пустые матрицы по окончанию*/
    for (var i = 0; i <32; i++) {
        binaryFont.push("00000000");
    }
    /*Результирующий массив, содержит готовый массив, для загрузки в МК*/
    var arResult = GetTicker(binaryFont);

    /*________________________ВЫВОД________________________*/
    var Columns = document.getElementById("MatrixColumns").value;
    var Rows = document.getElementById("MatrixRows").value;
    document.getElementById("CodeTickerResult").value+="int i;\nint j;\n";
    /*Подключение к микроконтроллеру.
    В этот раз все удобно, расположение матриц на экране, соответствует матрицам в жизни*/
    for (var i = 0; i < Columns; i++) {
        document.getElementById("CodeTickerResult").value +="//Матрица "+i+"\n";
        document.getElementById("CodeTickerResult").value +="int M"+i+"_CLK ="+document.getElementById("0_"+i+"_CLK").value+";\n";
        document.getElementById("CodeTickerResult").value +="int M"+i+"_CS ="+document.getElementById("0_"+i+"_CS").value+";\n";
        document.getElementById("CodeTickerResult").value +="int M"+i+"_DIN ="+document.getElementById("0_"+i+"_DIN").value+";\n";
    }
    document.getElementById("CodeTickerResult").value +="const uint8_t line0["+arResult.length+"][8]PROGMEM ={\n";

    /*Вывод массива бегущей строки*/
    for (var i = 0; i < arResult.length; i++) {
        document.getElementById("CodeTickerResult").value += arResult[i] + ",\n";
    }
    document.getElementById("CodeTickerResult").value +="};\n\n";

    /*Функции вывода*/
    document.getElementById("CodeTickerResult").value +="void Write_Matr_byte(unsigned char DATA, int CS, int CLK, int DIN) {\n";
    document.getElementById("CodeTickerResult").value +="   unsigned char i;\n";
    document.getElementById("CodeTickerResult").value +="    digitalWrite(CS,LOW);\n";
    document.getElementById("CodeTickerResult").value +="    for(i=8;i>=1;i--) {\n";
    document.getElementById("CodeTickerResult").value +="        digitalWrite(CLK,LOW);\n";
    document.getElementById("CodeTickerResult").value +="        digitalWrite(DIN,DATA&0x80);\n";
    document.getElementById("CodeTickerResult").value +="        DATA = DATA<<1;\n";
    document.getElementById("CodeTickerResult").value +="        digitalWrite(CLK,HIGH);\n";
    document.getElementById("CodeTickerResult").value +="    }\n";
    document.getElementById("CodeTickerResult").value +=" }\n\n";
    document.getElementById("CodeTickerResult").value +="void Write_Matr(unsigned char address,unsigned char dat, int CS, int CLK, int DIN){\n";
    document.getElementById("CodeTickerResult").value +="    digitalWrite(CS,LOW);\n";
    document.getElementById("CodeTickerResult").value +="    Write_Matr_byte(address,CS, CLK, DIN);\n";
    document.getElementById("CodeTickerResult").value +="    Write_Matr_byte(dat,CS,CLK,DIN);\n";
    document.getElementById("CodeTickerResult").value +="    digitalWrite(CS,HIGH);\n";
    document.getElementById("CodeTickerResult").value +="}\n\n";
    document.getElementById("CodeTickerResult").value +=" void Init_Matr(int CS, int CLK, int DIN){\n";
    document.getElementById("CodeTickerResult").value +="    Write_Matr(0x09, 0x00,CS, CLK, DIN);\n";
    document.getElementById("CodeTickerResult").value +="    Write_Matr(0x0a, 0x03,CS, CLK, DIN);\n";
    document.getElementById("CodeTickerResult").value +="    Write_Matr(0x0b, 0x07,CS, CLK, DIN);\n";
    document.getElementById("CodeTickerResult").value +="    Write_Matr(0x0c, 0x01,CS, CLK, DIN);\n";
    document.getElementById("CodeTickerResult").value +="    Write_Matr(0x0f, 0x00,CS, CLK, DIN);\n";
    document.getElementById("CodeTickerResult").value +="}\n\n";
    document.getElementById("CodeTickerResult").value +="void setup() {\n";

    /*Настраиваем пинов вывода матрицы*/
    for (var i = 0; i < Columns; i++) {
        document.getElementById("CodeTickerResult").value +="//Настраиваем выводы матрицы "+i+" как выходы:\n";
        document.getElementById("CodeTickerResult").value +="pinMode(M"+i+"_CLK,OUTPUT);\n";
        document.getElementById("CodeTickerResult").value +="pinMode(M"+i+"_CS,OUTPUT);\n";
        document.getElementById("CodeTickerResult").value +="pinMode(M"+i+"_DIN,OUTPUT);\n";
    }
    document.getElementById("CodeTickerResult").value +="delay(50);\n";

    /*Инициализация матриц*/
    for (var i = 0; i < Columns; i++) {
        document.getElementById("CodeTickerResult").value +="Init_Matr(M"+i+"_CS, M"+i+"_CLK, M"+i+"_DIN);\n";
    }
    document.getElementById("CodeTickerResult").value +="}\n\n";
    document.getElementById("CodeTickerResult").value +="void loop(){\n\n";
    document.getElementById("CodeTickerResult").value +="for (j = 0; j < "+arResult.length+"; j++) {\n";
    for (var i = Columns-1; i >=0; i--) {
        var coefficient=(Columns-1)-i;
      if(i===(Columns-1)){
          document.getElementById("CodeTickerResult").value +="for (i = 1; i < 9; i++) {\n";
          document.getElementById("CodeTickerResult").value +="    Write_Matr(i, pgm_read_byte( &line0[j][i - 1]), M"+i+"_CS, M"+i+"_CLK, M"+i+"_DIN);\n";
          document.getElementById("CodeTickerResult").value +="}\n\n";
      }else{
          document.getElementById("CodeTickerResult").value +="if (j <= "+(coefficient*8-1)+") {\n";
          document.getElementById("CodeTickerResult").value +="    Write_Matr(i, 0x00, M"+i+"_CS, M"+i+"_CLK, M"+i+"_DIN);\n";
          document.getElementById("CodeTickerResult").value +="} else {\n";
          document.getElementById("CodeTickerResult").value +="    for (i = 1; i < 9; i++) {\n";
          document.getElementById("CodeTickerResult").value +="        Write_Matr(i, pgm_read_byte( &line0[j - "+(coefficient*8)+"][i - 1]), M"+i+"_CS, M"+i+"_CLK, M"+i+"_DIN);\n";
          document.getElementById("CodeTickerResult").value +="    }\n";
          document.getElementById("CodeTickerResult").value +="}\n\n";
      }///!
    }/////!
    document.getElementById("CodeTickerResult").value +="delay("+document.getElementById("speedTicker").value+");//Скорость вывода\n";
    document.getElementById("CodeTickerResult").value +="    }\n";
    document.getElementById("CodeTickerResult").value +="}\n";
    /*После того, как код бегущей строки получен, отключаем загрузку и показываем окно кода*/
    document.getElementById("Loading").classList.remove("loader");
    document.getElementById("CodeTickerResult").classList.remove("displayNone");
}

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
 * Сопоставляет типы введённого текста для бегущей строки с выбранными шрифтами
 * @returns {boolean} -Возвращает true, типы введенного шрифта совпадают с типами выбранного иначе false
 * @constructor
 */
function CheckAvailableFonts() {
    /*Получаем список используемых шрифтов*/
    var fontList = document.getElementsByClassName("tickerSelectFont");//список выбранных шрифтов
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
        var text = document.getElementById("TickerInput").value;//Текст бегущей строки

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
        /*Проверяем, содержит ли текст ЦИФРЫ, СКОБКИ, МАТ ЗНАКИ буквы и выбран ли соответствующий шрифт*/
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
        setTimeout(CreateTicker, 0);//Асинхронный запуск, самый простой вариант, работает =)
    }
}

/**
 * Создает таблицу с полями для ввода подключений контактов бегущей строки, заданного размера
 * @constructor
 */
function BuildTable() {
    document.getElementById('Div_MatrixTableInput').innerHTML = "";
    document.getElementById('Div_MatrixTableInput').innerHTML = "<table id='TableInput' class='tableInput'> </table>";
    for (var i = 0; i < document.getElementById("MatrixRows").value; i++) {
        var buf = "<tr>";
        for (var j = 0; j < document.getElementById("MatrixColumns").value; j++) {
            buf += "<td>";
            var id = i + "_" + j + "_CLK";
            buf += "CLK:<input type='number' min='0' value='0' class='inputNumber' id='" + id + "' ><br>";
             id = i + "_" + j + "_CS";
            buf += "CS&ensp;:<input type='number' min='0' value='0'  class='inputNumber'  id='" + id + "' ><br>";
             id = i + "_" + j + "_DIN";
            buf += "DIN:<input type='number' min='0' value='0'  class='inputNumber'  id='" + id + "' ><br>";
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
function SaveArduinoFile() {
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
    var SketchName = "Sketch_"+d.getDate()+"."+Number(d.getMonth() + 1)+"."+d.getFullYear()+"_"+d.getHours()+"-"+d.getMinutes();
    var text = document.getElementById("CodeTickerResult").value;
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(text);
        link.download = SketchName + ".ino";
        document.getElementById('downloadlink').click();
}

/**
 * Очищает текст поля бегущей строки
 * @constructor
 */
function WashedTickerInput() {
    var ok = confirm("Очистить текст бегущей строки?");
    if (ok === true) {
        document.getElementById("TickerInput").value="";
    }
}
/**
 * Очищает поле программного кода
 * @constructor
 */
function WashedCodeTickerResult() {
    var ok = confirm("Очистить полученный программный код?");
    if (ok === true) {
        document.getElementById("CodeTickerResult").value="";
        document.getElementById("CodeTickerResult").classList.add("packageSVG");
    }
}