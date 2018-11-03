/**
 * Так как js не позволяет подключать другой файл js внутри файла js,
 * данная функция даст такую возможность.
 * Добавляет тег <script> в <head>, однако так как получается своего рода ajax,
 * код из такого файла не будет доступен из основного документа, поэтому используем callBack функцию
 * @param src - путь к подключаемому скрипту
 * @param callBack - функция обратного вызова, которая сработает после загрузки скрипта
 */
function addScript(src, callBack) {
    var script = document.createElement('script');
    script.src = src;
    script.type = "text/javascript";
    script.async = false; // чтобы гарантировать порядок
    script.onreadystatechange = callBack;
    script.onload = callBack;
    document.head.appendChild(script);
}

/**
 * Добавляет подключенные шрифты в окно списка шрифтов
 * @constructor
 */
function AddFont(way) {
    if (FontList.length==0){
        document.getElementById("FontSelection").classList.add("packageSVG");
    }
    for(var i=0; i<FontList.length;i++){
        addScript(way+FontList[i],GetListFonts);
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
        if (GLOBAL_Fonts[keys[i]]["type"] === "rus") {
            buf += "<th class='russiaSVG'>&emsp;</th>"
        }else
        if (GLOBAL_Fonts[keys[i]]["type"] === "eng") {
            buf += "<th class='unitedKingdomSVG'>&emsp;</th>"
        }
        if (GLOBAL_Fonts[keys[i]]["type"] === "num") {
            buf += "<th class='numberSVG'>&emsp;</th>"
        }
        buf += "</tr>";
    }
    buf += "</table>";
    document.getElementById("FontSelection").innerHTML = buf;
}
