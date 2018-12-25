function onLoad() {
    document.getElementById("Matrix").addEventListener("click", OnOffLed);
    document.getElementById("WashedMatrix").addEventListener("click", WashedMatrix);
    document.getElementById("AnimationFrame").addEventListener("click", SelectFrame);
    document.getElementById("DiodeSize").addEventListener("change", DiodeSize);
    document.getElementById("AddNewFrame").addEventListener("click", CreateFrame);
    document.getElementById("EditSelectedFrame").addEventListener("click", EditSelectedFrame);
    document.getElementById("MatrixColumns").addEventListener("change", Animation_BuildMatrix);
    document.getElementById("MatrixLine").addEventListener("change", Animation_BuildMatrix);
    document.getElementById("ShowHideConnectMicrocontroller").addEventListener("click", Animation_ShowHide);
    document.getElementById("ShowHideArduinoCode").addEventListener("click", Animation_ShowHide);
    document.getElementById("DeleteCurrentFrame").addEventListener("click", DeleteCurrentFrame);
    document.getElementById("CreateAnimation").addEventListener("click", CreateAnimation);
    document.getElementById("SaveArduinoCode").addEventListener("click",SaveArduinoFile.bind(null,"CodeFrameResult", "downloadlink"));
    document.getElementById("SaveAnimation").addEventListener("click", SaveAnimationFile);
    document.getElementById("WashedCodeFrameResult").addEventListener("click",WashedCodeTickerResult.bind(null,"CodeFrameResult"));
    document.getElementById("ClearAllFrame").addEventListener("click", ClearAllFrame);
    document.getElementById("AnimationName").addEventListener("change", ValidationNameDownload.bind(null,"AnimationName"));
    document.getElementById('OpenAnimationFileDialog').addEventListener('change', OpenAnimationFileDialog, false);
    document.getElementById('OpenAnimationFileButton').addEventListener('click', OpenAnimationFile, false);
    document.getElementById("Matrix").addEventListener("contextmenu", CreateFrameOnMouse );

     /*Функция следит за нажатием клавиши Ctrl (№17), при
     этой зажатой клавише над полем создания анимации, можно "рисовать" символ*/
    runOnKeys(function () {
        document.getElementById("Matrix").addEventListener("mouseover", OnOffLed);
    }, 17);


}