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

