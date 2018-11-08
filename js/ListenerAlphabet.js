/**
 * Обработчик событий
 * срабатывает при старте программы, после чего навешиваются остальные события
 * для кроссбраузерности висит на body ибо IE не поддерживает некоторые DOM события
 */
function onLoad() {
    document.getElementById("Matrix").addEventListener("click", OnOffLed);
    document.getElementById("SaveAlphabet").addEventListener("click", SaveFile);
    document.getElementById("TableAlphabetRus").addEventListener("click", SelectCharInAlphabet);
    document.getElementById("TableAlphabetEng").addEventListener("click", SelectCharInAlphabet);
    document.getElementById("TableAlphabetNum").addEventListener("click", SelectCharInAlphabet);
    document.getElementById("AddCharInList").addEventListener("click", AddCodeCharInAlphabet);
    document.getElementById("WashedMatrix").addEventListener("click", WashedMatrix);
    document.getElementById("WashedTableAlphabet").addEventListener("click",WashedTableAlphabet);
    document.getElementById("rus").addEventListener("click", LanguageSelection);
    document.getElementById("eng").addEventListener("click", LanguageSelection);
    document.getElementById("num").addEventListener("click", LanguageSelection);
    document.getElementById("FontSelection").addEventListener("click", SelectFont);
    document.getElementById("NameDownloadFont").addEventListener("change", ValidationNameDownloadFont);
    document.getElementById("DiodeSize").addEventListener("change",  DiodeSize);
    document.getElementById("MatrixSize").addEventListener("change",  MatrixSize);
    /*Функция следит за нажатием клавиши Ctrl (№17), при
    этой зажатой клавише над полем создания шрифта, можно "рисовать" символ*/
    runOnKeys(function() {document.getElementById("Matrix").addEventListener("mouseover", OnOffLed);}, 17 );
    AddFont("../font/");
}
