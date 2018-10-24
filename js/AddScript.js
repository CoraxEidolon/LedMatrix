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

