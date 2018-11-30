/**
 * Обработчик событий
 * срабатывает при старте программы, после чего навешиваются остальные события
 * для кроссбраузерности висит на body ибо IE не поддерживает некоторые DOM события
 */
function onLoad() {
    document.getElementById("FontSelection").addEventListener("click", SelectFont);
    document.getElementById("CreateTicker").addEventListener("click", loading);
    document.getElementById("MatrixRows").addEventListener("change", BuildTable);
    document.getElementById("MatrixColumns").addEventListener("change", BuildTable);
    document.getElementById("TickerInput").addEventListener("change", ValidationTickerTextBox);
    document.getElementById("SaveArduinoCode").addEventListener("click",SaveArduinoFile.bind(null,"CodeTickerResult", "downloadlink"));
    document.getElementById("WashedTickerInput").addEventListener("click",WashedTickerInput);
    document.getElementById("WashedCodeTickerResult").addEventListener("click",WashedCodeTickerResult.bind(null,"CodeTickerResult"));
    document.getElementById("ShowHideConnectMicrocontroller").addEventListener("click", Ticker_ShowHide);
    document.getElementById("ShowHideArduinoCode").addEventListener("click", Ticker_ShowHide);
    GetListFonts();
}
