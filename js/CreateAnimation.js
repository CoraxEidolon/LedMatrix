
/**
 * Строим матрицу заданного размера.
 * Срабатывает при изменение значений в input количества матриц по горизонтали и вертикали
 * @constructor
 */
function Animation_BuildMatrix(){
    InputsTableBuild("Div_MatrixTableInput","MatrixLine","MatrixColumns");
    var build=false;
    if( document.getElementById("AnimationFrame").innerHTML!=="") {
        var ok = confirm("ВНИМАНИЕ! При изменение размера матрицы будут утеряны текущие кадры");
        if(ok){
            document.getElementById("AnimationFrame").innerHTML="";
            build=true;
        }
    } else{build=true;}

    if(build===true) {
        var Columns = document.getElementById("MatrixColumns").value;
        var Lines = document.getElementById("MatrixLine").value;
        document.getElementById("Matrix").innerHTML = "";
        document.getElementById("FrameAmount").innerHTML="0";
        var buf = "<tr>";
        for (var i = 0; i < Lines * 8; i++) {
            for (var j = 0; j < Columns; j++) {
                buf += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
            }
            buf += "</tr>";
            document.getElementById("Matrix").innerHTML = buf;
        }
    }

}

/**
 * Отмечает кадр как выбранный, присваиванием ему соответствующего id. Показывает содержимое кадра
 * @param event - клик на иконку кадра
 * @constructor
 */
function SelectFrame(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target.tagName === "DIV" && target.classList.contains("animationFrame")) {
        if (document.getElementById("SelectAnimationFrame") !== null) {
            document.getElementById("SelectAnimationFrame").removeAttribute("id");
        }
        target.setAttribute("id", "SelectAnimationFrame");
        /*При клике на уже записанном коде кадра, он будет показываться на матрице*/
        if (target.getAttribute("data-AnimationFrameCode") !== "") {
            /* убираем лишние символы и очищаем матрицу */
            var buf = target.getAttribute("data-AnimationFrameCode");
            buf = buf.split(",");
            ClearItem("Matrix");
            /*Вывод в матрицу*/
            for (var i = 0; i < document.getElementById('Matrix').rows[0].cells.length; i++) {
                buf[i] = parseInt(buf[i], 16).toString(2);//Перевод из 16ричной в 2ичную
                /*Js при вычисление отбрасывает незначащие нули, но нам они нужны, возвращаем*/
                var result = "";
                for (var z = 0; z < document.getElementById('Matrix').rows.length - buf[i].length; z++) {
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


function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

/**
 * Создает кадр
 * @constructor
 */
function CreateFrame() {
    /*создаем сначала кадр всего поля, для более простого предварительного просмотра*/
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

    /* Генерируем случайное число, соответствующее номеру иконки кадра */
    var rand = getRandomInt(1, 42);
    /*Получаем количество элементов с классом animationFrame, соответствует текущему кадры*/
    var animationFrameCount = document.getElementsByClassName("animationFrame").length + 1;

    /*Формируем массив для каждой матрицы*/
    var Columns = document.getElementById("MatrixColumns").value;
    var Lines = document.getElementById("MatrixLine").value;
    Columns *= 8;
    Lines *= 8;
    var arResult8 = [];
    for (var l = 8; l <= Lines + 1; l += 8) {
        for (var c = 8; c <= Columns + 1; c += 8) {
            var result8 = "";
            for (var i = c - 8; i < c; i++) {
                var buf8 = "";
                for (var j = l-1; j >=l - 8; j--) {

                    if (document.getElementById('Matrix').rows[j].cells[i].getAttribute("class") === null) {
                        buf8 += "0";
                    } else {
                        buf8 += "1";
                    }
                }
                var row8 = parseInt(buf8, 2).toString(16);
                result8 += "0x"+row8.toUpperCase();
                if (i !== c - 1) {
                    result8 += ",";
                }
            }
            arResult8.push(result8);
        }
    }
    /*Склеиваем массив в единую строку для добавления к кадру*/
   var JoinMatricesCode= arResult8.join("_");
    /*Добавляем полученный кадр*/


  if( document.getElementsByClassName("animationFrame").length<=0) {
      document.getElementById("AnimationFrame").innerHTML += "<div id='SelectAnimationFrame' class='frameSVG_" + rand + " animationFrame' title='Кадр: " + animationFrameCount + "' data-AnimationFrameCode='" + result + "' data-AnimationMatricesCode='" + JoinMatricesCode + "'></div>";
  } else{

      var current =document.getElementById("SelectAnimationFrame");
      document.getElementById("SelectAnimationFrame").removeAttribute("id");

      var div = document.createElement('div');
      div.id = "SelectAnimationFrame";
      div.className = "frameSVG_" + rand + " animationFrame";
      div.title = "Кадр: " + animationFrameCount;
      div.dataset.animationframecode = result;
      div.dataset.animationmatricescode = JoinMatricesCode;


      insertAfter(div,current);



  }




    document.getElementById("FrameAmount").innerHTML=String(animationFrameCount);
}


/**
 * Создает кадр по нажатию ПКМ над матрицей ввода
 * @param event
 * @constructor
 */
function CreateFrameOnMouse(event){
    CreateFrame();
    event.returnValue = false;
}

/**
 * Возвращает случайное целое число между min (включительно) и max (НЕ включая max)
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Строит таблицу содержащие поля для ввода подключения матриц к микроконтроллеру
 * @param Div_id - id элемента в котором будет построена таблица
 * @param InputRows_id - id поля содержащие количество матриц по вертикали (строки)
 * @param InputColumns_id - id поля содержащие количество матриц по горизонтали (столбцы)
 * @constructor
 */
function InputsTableBuild(Div_id,InputRows_id,InputColumns_id) {
    document.getElementById(Div_id).innerHTML = "";
    document.getElementById(Div_id).innerHTML = "<table id='TableInput' class='tableInput'> </table>";
    var Rows=Number(document.getElementById(InputRows_id).value);
    var Columns=Number(document.getElementById(InputColumns_id).value);
    for (var i = 0; i <Rows; i++) {
        var buf = "<tr>";
        for (var j = 0; j < Columns; j++) {
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
        document.getElementById("TableInput").innerHTML += buf;
    }//i
}

/**
 * Показывает или скрывает панель подключения матриц к микроконтроллеру и поле кода Arduino
 * @constructor
 */
function Animation_ShowHide(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    var idElement = {
        "ShowHideConnectMicrocontroller": "Div_MatrixTableInput",
        "ShowHideArduinoCode": "CodeFrameResult"
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

/**
 * Удаляет выбранный кадр
 * @constructor
 */
function DeleteCurrentFrame() {
    if (document.getElementById("SelectAnimationFrame") === null) {
        alert("Выберете кадр!");
    } else {
        var ok = confirm("Удалить выбранный кадр?");
        if (ok) {

            document.getElementById("SelectAnimationFrame").remove();
            var animationFrameCount = document.getElementsByClassName("animationFrame").length;
            var Frame = document.getElementsByClassName("animationFrame");
            /*После удаления кадра номера сбились. Возвращаем правильные номера*/
            for (var i = 0; i < animationFrameCount; i++) {
                Frame[i].setAttribute("title", "Кадр: " + (i + 1));
            }
            document.getElementById("FrameAmount").innerHTML=String(animationFrameCount);
        }
    }
}

/**
 * Генерирует код Arduino, "склеивает" анимацию из созданных кадров
 * @constructor
 */
function CreateAnimation() {
    /*________________________ВЫВОД________________________*/

    var Rows=Number(document.getElementById("MatrixLine").value);
    var Columns = Number(document.getElementById("MatrixColumns").value);
    var CodeArduino= document.getElementById("CodeFrameResult");//Поле вывода кода
    CodeArduino.value ="";//Очищаем поле вывода кода
    CodeArduino.classList.remove("packageSVG");//Убираем "пустую коробку" с фона, т.к. поле больше не пустое
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
    CodeArduino.value +="\n";
    /*-=ВЫВОД МАССИВОВ АНИМАЦИИ=-*/

    /*Формируем массив значений для каждой матрицы*/
    var Frame=[];
    var animationFrame= document.getElementsByClassName("animationFrame");
    for(var i=0; i<animationFrame.length; i++){
       var bufFrame=animationFrame[i].getAttribute("data-AnimationMatricesCode")
        bufFrame=bufFrame.split("_");
        Frame.push(bufFrame);
    }

    /*Для каждой матрицы*/
    for (var i= 0; i < Frame[0].length; i++) {
        CodeArduino.value += "const uint8_t display_" + i + "[" +  Frame.length + "][8]PROGMEM ={\n";

        /*Для каждого кадра*/
        for (var j = 0; j < Frame.length ; j++) {
            CodeArduino.value +="{"+ Frame[j][i] + "},\n";
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

    /*_____void setup()_____*/
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

    /*_____void loop()_____*/
    CodeArduino.value += "void loop(){\n\n";
    CodeArduino.value += "for (j = 0; j < " + Frame.length + "; j++) {\n";

    var matrixCount=0;
    for (var j = 0; j < Rows; j++) {
        for (var i = 0; i <Columns; i++) {
            CodeArduino.value += "//Матрица"+ matrixCount+":\n";
                CodeArduino.value += "for (i = 1; i < 9; i++) {\n";
                CodeArduino.value += "    Write_Matr(i, pgm_read_byte( &display_" + matrixCount + "[j][i - 1]), M_" + j + "_" + i + "_CS, M_" + j + "_" + i + "_CLK, M_" + j + "_" + i + "_DIN);\n";
                CodeArduino.value += "}\n\n";
            matrixCount++;
        }//i
    }//j
    CodeArduino.value += "delay(" + document.getElementById("AnimationSpeed").value + ");//Скорость вывода\n";
    CodeArduino.value += "    }\n}\n";
}

/**
 * Удаляет все созданные кадры
 * @constructor
 */
function ClearAllFrame() {
    var ok = confirm("Удалить все кадры ?");
    if (ok) {
        document.getElementById("AnimationFrame").innerHTML = "";
        document.getElementById("FrameAmount").innerHTML="0";
    }
}


/**
 * Сохраняем файл анимации и все текущие настройки анимации в файл json
 * @constructor
 */
function SaveAnimationFile() {
    var Content = document.getElementById("AnimationFrame").innerHTML;
    if (Content.length === 0) {
        alert("В анимации отсутствуют кадры!");
    } else {
        var AnimationName = document.getElementById("AnimationName").value;
        if(AnimationName.length===0){
            alert("Не заданно имя анимации!");
        } else {
            var Link_id = "downloadlink";
            var Rows = Number(document.getElementById("MatrixLine").value);
            var Columns = Number(document.getElementById("MatrixColumns").value);
            var Speed = document.getElementById("AnimationSpeed").value;
            var FrameAmount = document.getElementById("FrameAmount").innerHTML;

            var text = "";
            text += "{\n";
            text += "\"name\":\"" + AnimationName + "\",\n";
            text += "\"rows\":\"" + Rows + "\",\n";
            text += "\"columns\":\"" + Columns + "\",\n";
            text += "\"speed\":\"" + Speed + "\",\n";
            text += "\"frameAmount\":\"" + FrameAmount + "\",\n";

            /* Запоминаем подключение матриц к микроконтроллеру */
            for (var j = 0; j < Rows; j++) {
                for (var i = 0; i < Columns; i++) {

                    text += "\"" + j + "_" + i + "_CLK\":\"" + document.getElementById(j + "_" + i + "_CLK").value + "\",\n";
                    text += "\"" + j + "_" + i + "_CS\":\"" + document.getElementById(j + "_" + i + "_CS").value + "\",\n";
                    text += "\"" + j + "_" + i + "_DIN\":\"" + document.getElementById(j + "_" + i + "_DIN").value + "\",\n";
                }
            }

            Content = Content.replace(/"/g, "'"); //Т.к. будем заносить в строку, заменяем все двойные кавычки на одинарные
            text += "\"animation\":\"" + Content + "\" \n";
            text += "}";
            var textFile = null,
                makeTextFile = function (text) {
                    var data = new Blob([text], {type: 'text/plain'});
                    if (textFile !== null) {
                        window.URL.revokeObjectURL(textFile);
                    }
                    textFile = window.URL.createObjectURL(data);
                    return textFile;
                };

            var link = document.getElementById(Link_id);
            link.href = makeTextFile(text);
            link.download = AnimationName + ".json";
            document.getElementById(Link_id).click();
        }
    }
}

/**
 * Открыть файл с анимацией. Инициализирует click на <input type="file">
 * @constructor
 */
function OpenAnimationFile() {
    document.getElementById('OpenAnimationFileDialog').click();
}

/**
 * Загружает анимацию из файла и все ее настройки
 * @param evt - Срабатывает при выборе файла в <inputtype="file">
 * @constructor
 */
function OpenAnimationFileDialog(evt) {
    var ok = false;
    if (document.getElementById("AnimationFrame").innerHTML !== "") {
        ok = confirm("ВНИМАНИЕ! При открытие анимации все текущие кадры будут утеряны");
    } else {
        ok = true;
    }
    if (ok) {
        document.getElementById("AnimationFrame").innerHTML = "";
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            var text = reader.result;
            var AnimationParse = JSON.parse(text);//Перевод из формата JSON в объект js
            document.getElementById("AnimationName").value = AnimationParse["name"];
            document.getElementById("AnimationSpeed").value = AnimationParse["speed"];
            document.getElementById("MatrixLine").value = AnimationParse["rows"];
            document.getElementById("MatrixColumns").value = AnimationParse["columns"];
            Animation_BuildMatrix();
            document.getElementById("FrameAmount").innerHTML = AnimationParse["frameAmount"];
            document.getElementById("AnimationFrame").innerHTML = AnimationParse["animation"];

            /*Загружаем подключение матриц на форму: */
            for (var j = 0; j < AnimationParse["rows"]; j++) {
                for (var i = 0; i < AnimationParse["columns"]; i++) {

                    document.getElementById(j + "_" + i + "_CLK").value = AnimationParse[j + "_" + i + "_CLK"];
                    document.getElementById(j + "_" + i + "_CS").value = AnimationParse[j + "_" + i + "_CS"];
                    document.getElementById(j + "_" + i + "_DIN").value = AnimationParse[j + "_" + i + "_DIN"];
                }
            }
        }
    }
}