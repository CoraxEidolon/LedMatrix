function ShowAuthor() {
    var RedBall = document.getElementById("RedBall");
    var AuthorLogo = document.getElementById("AuthorLogo");
    var button =  document.getElementById("ShowAuthor");

    if (RedBall.classList.contains("displayNone")) {
        RedBall.classList.remove("displayNone");
        AuthorLogo.classList.add("displayNone");
        button.innerHTML="&bull;Об авторе";
    } else {
        AuthorLogo.classList.remove("displayNone");
        RedBall.classList.add("displayNone");
        button.innerHTML="&bull;Вернуть шар =)";
    }
}

function onLoad() {
    document.getElementById("ShowAuthor").addEventListener("click", ShowAuthor);
}
