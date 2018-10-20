/**
 * Обработчик событий
 * срабатывает при старте программы, после чего навешиваются остальные события
 * для кроссбраузерности висит на body ибо IE не поддерживает некоторые DOM события
 */
function onLoad() {
    document.getElementById("Matrix").addEventListener("click", OnOffLed );
    document.getElementById("SaveAlphabet").addEventListener("click", SaveFile );
    document.getElementById("TableAlphabetRus").addEventListener("click", SelectCharInAlphabet );
    document.getElementById("AddCharInList").addEventListener("click", AddCodeCharInAlphabet );
    document.getElementById("WashedMatrix").addEventListener("click", WashedMatrix );
    document.getElementById("LanguageSelection").addEventListener("click", LanguageSelection );
    GetListFonts();
}
