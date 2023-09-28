const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    sidebar2 = body.querySelector(".sidebar2"),
    teacher = body.querySelector(".nav_link.teacher"),
    teacher_add_btn = body.querySelector(".bx.bx-user-plus.toggle"),
    modal = body.querySelector(".modal"),
    exit = body.querySelector(".exit"),
    sidebar_nav_a = body.querySelectorAll(".nav.a.close"),
    sidebar22 = body.querySelectorAll(".sidebar2"),
    sidebar22_icon = body.querySelectorAll(".nav_link > a > i"), 
    sidebar22_text = body.querySelectorAll(".nav_link > a > span"),
    
    a = body.querySelector(".nav.a"),
    atext = body.querySelector(".text.nav-text.teacher"),
    aicon = body.querySelector(".bx.bx-pencil.icon.teacher")   

    toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
        sidebar2.classList.toggle("close2");
    })

    // teacher.addEventListener("click", () => {
    //     sidebar2.classList.toggle("close");
    // })

    exit.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    })

    // a.addEventListener("click", () => {
    //     a.classList.toggle("close");
    //     const color1 = window.getComputedStyle(sidebar2).getPropertyValue("display");

    //     if (color1 === "none"){
    //         atext.style.color = "#FFF";
    //         aicon.style.color = "#FFF"
    //     }else{
    //         atext.style.color = "#707070";
    //         aicon.style.color = "#707070"
    //     }
    // })

    teacher_add_btn.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    })

    

    sidebar_nav_a.forEach((nav, index) => {
        nav.addEventListener("click", () => {

            nav.classList.toggle("close");

            sidebar_nav_a.forEach((nav2, index2) => {
                if ( index != index2){
                    nav2.className = "nav a close"
                }
                
            })

            sidebar22[index].classList.toggle("close");
            sidebar22_icon[index].classList.toggle("close");
            sidebar22_text[index].classList.toggle("close");

            sidebar22.forEach((side, index2) => {
                if (index != index2){
                    if (sidebar.classList.toString() === "sidebar"){
                        side.className = "sidebar2 close"
                    }else{
                        side.className = "sidebar2 close close2"
                    }
                }
            })

            sidebar22_icon.forEach((side, index2) => {
                if (index != index2){
                    side.classList.add("close");
                }
            })

            sidebar22_text.forEach((side, index2) => {
                if (index != index2){
                    side.className = "text nav-text close"
                }
            })

            
          
        })
    })

    // sidebar2 select

    // sidebars.forEach((side, index) => {
    //     side.addEventListener("click", () => {
            
    //     })
    // })

    
function onDataPost() {
    const emInput = document.querySelector('#email').value;
    const nameInput = document.querySelector('#name').value;
    const pwInput = document.querySelector('#password').value;
    const pnInput = document.querySelector('#phonenumber').value;
    
    const token = localStorage.getItem('authToken');
    let userdata = 1;

    if (token) {
        userdata = JSON.parse(localStorage.getItem('user'));
    } 
    const apiUrl = '/api/join/user/';
    
    const data = {
        email: emInput,
        name:nameInput,
        password: pwInput,
        phone_number:pnInput,
        role:2,
        company_id:userdata.company_id
    };
    
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // console.log('서버 응답 데이터:', data);
        // 로그인 성공 또는 실패 여부를 처리
        if (data.message) {
            console.log('회원가입 성공');
            emInput.value = "";
            nameInput.value = "";
            pwInput.value = "";
            pnInput.value = "";
            alert("가입완료");

        } else {
            const labelElement = document.querySelector('label[for="email"]');
            
            if (labelElement) { // label 요소가 존재하는지 확인
                labelElement.classList.add('warning');
            }
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
    }
    
    // 전체 화면에서 키 입력을 감지
    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {
            onDataPost(); // 
        }
    });
    