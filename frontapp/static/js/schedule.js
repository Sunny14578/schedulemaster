document.addEventListener('DOMContentLoaded', function () {
    // 토큰 정보 가져오기
   console.log(20);

});

const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    sidebar2 = body.querySelector(".sidebar2"),
    teacher = body.querySelector(".nav_link.teacher"),
    a = body.querySelector(".nav.a"),
    atext = body.querySelector(".text.nav-text.teacher"),
    aicon = body.querySelector(".bx.bx-pencil.icon.teacher")   

    toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
        sidebar2.classList.toggle("close2");
    })

    teacher.addEventListener("click", () => {
        sidebar2.classList.toggle("close");
    })

    a.addEventListener("click", () => {
        a.classList.toggle("close");
        const color1 = window.getComputedStyle(sidebar2).getPropertyValue("display");

        if (color1 === "none"){
            atext.style.color = "#FFF";
            aicon.style.color = "#FFF"
        }else{
            atext.style.color = "#707070";
            aicon.style.color = "#707070"
        }
    })



