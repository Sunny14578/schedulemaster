var indexTime = ["08:00:00","09:00:00","10:00:00","11:00:00","12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00"];
var bgcolor = ["#5F00FF", "#003399", "#FF5E00", "#22741C", "#F15F5F", "#D941C5", "#5D5D5D", "#664B00", "#5F00FF", "#003399", "#FF5E00", "#22741C"];
const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    sidebar2 = body.querySelector(".sidebar2"),
    teacher = body.querySelector(".nav_link.teacher"),
    teacher_add_btn = body.querySelector(".bx.bx-user-plus.toggle"),
    modal = body.querySelector(".modal"),
    exit = body.querySelector(".exit"),
    sidebar_nav_a = body.querySelectorAll(".sidebar .nav.a.close"),
    sidebar22 = body.querySelectorAll(".sidebar2"),
    sidebar22_icon = body.querySelectorAll(".nav_link > a > i"), 
    sidebar22_text = body.querySelectorAll(".nav_link > a > span"),
    lecture_modal = body.querySelector("#lecture_modal"),
    lecture_add_btn = body.querySelector(".bx.bx-user-plus.toggle.room"),
    lecture_exit = body.querySelector(".exit.room"),
    lecture_room_menu = body.querySelector("#sidebar_room .menu-links"),

    teacher_menu = body.querySelector("#sidebar_teacher .menu-links"),
    table_lecture_room = body.querySelector(".lecture_room"),
    table = body.querySelector(".cell-table"),
    main_body = body.querySelector(".home.table-menu");
    
    toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
        
        sidebar22.forEach((side, index2) => {
            side.classList.toggle("close2");
        })
    })


    exit.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    })

    lecture_exit.addEventListener("click", () => {
        lecture_modal.classList.toggle("hidden");
    })


    teacher_add_btn.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    })

    lecture_add_btn.addEventListener("click", () => {
        lecture_modal.classList.toggle("hidden");
    })   

    let preNavindex = null;
    
    sidebar_nav_a.forEach((nav, index) => {
        nav.addEventListener("click", () => {
            
            if (preNavindex === nav){
                main_body.classList.toggle("close");
                preNavindex = null;
            }else{
                if(preNavindex){
                    preNavindex = nav;
                }else{
                    main_body.classList.toggle("close");
                    preNavindex = nav;
                }
            }
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
                if (index == 0){
                    onDataTeacherGet();
                }

                if (index == 1){
                    onDataLectureGet();
                }
                
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
        if (event.keyCode === 13 && modal.classList.toString() === "modal") {
            onDataPost(); // 
        }
    });

function onDataLecturePost() {
    const roomInput = document.querySelector('#room_name').value;
   
        
    const token = localStorage.getItem('authToken');
    let userdata = 1;
    
    if (token) {
            userdata = JSON.parse(localStorage.getItem('user'));
    } 
    const apiUrl = '/api/lecture/';

    const data = {
        room_name: roomInput,
        company_id: userdata.company_id,
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
            roomInput.value = "";
 
        } else {
            const labelElement = document.querySelector('label[for="room_name"]');
                
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
        if (event.keyCode === 13 && lecture_modal.classList.toString() === "modal") {
            onDataLecturePost(); // 
        }
    });

    window.onload = function(){
        onDataLectureRoomGet();
        // onCreateCell();
        onDataCellGet();
    }


function onDataLectureGet(){
    const apiUrl = '/api/lecture/';

    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        lecture_room_menu.innerHTML = '';
        const roomNames = data.map(item => item.room_name);

        for (var i=0; i<roomNames.length; i++){
            var new_litag = document.createElement("li");
            new_litag.className = "nav_link room";

            var new_atag = document.createElement("a");
            new_atag.className = "nav a close";

            var new_span = document.createElement("span");
            new_span.className = "text nav-text name";
            new_span.textContent = roomNames[i];

            new_litag.appendChild(new_atag);
            new_atag.appendChild(new_span);
            lecture_room_menu.appendChild(new_litag);
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
}

function onDataTeacherGet(){
    const apiUrl = '/api/teacher/';

    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        teacher_menu.innerHTML = '';
        const teacherNames = data.map(item => item.name);
        const colors = data.map(item => item.color)

        for (var i=0; i<teacherNames.length; i++){
            var new_litag = document.createElement("li");
            new_litag.className = "nav_link teacher";

            var new_atag = document.createElement("a");
            new_atag.className = "nav a close";

            var new_span = document.createElement("span");
            new_span.className = "text nav-text name";
            new_span.textContent = teacherNames[i];

            var new_input = document.createElement("input");
            new_input.className = "nav-color color";
            new_input.type = "color"
            new_input.value = colors[i];


            new_litag.appendChild(new_atag);
            new_atag.appendChild(new_span);
            new_atag.appendChild(new_input);
            teacher_menu.appendChild(new_litag);
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
}

function onDataLectureRoomGet(){
    const apiUrl = '/api/lecture/';

    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        table_lecture_room.innerHTML = '';
        const roomNames = data.map(item => item.room_name);
        const roomIdNames = data.map(item => item.room_id);

        localStorage.setItem('roomIdNames', roomIdNames);

        for (var i=0; i<roomNames.length; i++){
            var new_litag = document.createElement("li");
            new_litag.contentEditable = true;
            new_litag.textContent = roomNames[i];

            table_lecture_room.appendChild(new_litag);
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
}

function onCreateCell(lecture_room_id){

    const apiUrl = '/api/schedule/'; 

    var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    data_group = [] // post 요청을 줄이기위해 데이터 그룹화

    for (let index = 0; index < indexTime.length; index++){
        for (let day = 1; day <= monthsDays[0]; day++){
            data = {
                "lecture_room_id":6,
                "day":day,
                "month":1,
                "time":indexTime[index]
            }

        data_group.push(data);
        }
    }
    
    postData(data_group);
}

async function postData(dataList) {
    const apiUrl = '/api/schedule/';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataList), 
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('데이터 전송 성공:', responseData);
        } else {
            console.error('데이터 전송 실패:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

function onDataCellGet(){
    const apiUrl = '/api/schedule/';

    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const rooms = localStorage.getItem('roomIdNames');
        const splitRooms = rooms.split(',');
        const months = data.map(item => item.month);
        const maxMonth = Math.max(...months);
        let thead;

        for (let i = 0; i < splitRooms.length; i++){
            const FilterData = data.filter(item => item.lecture_room_id == splitRooms[i]);
            
            if (FilterData.length > 0){
                if (i%2==0){
                    thead = document.createElement('thead');
                    const theadRowFragment = document.createDocumentFragment();
                    const FilterRowData = FilterData.filter(item => item.time == indexTime[0]);
                    const cols = FilterRowData.length;

                    const tr = document.createElement('tr');
                    
                    for (let j = 0; j < cols; j++){
                        const td = document.createElement('td');
                        td.textContent = FilterRowData[j].day;
                        theadRowFragment.appendChild(td);
                    }
                    
                
                    const tr2 = document.createElement('tr');
                    const theadRowFragment2 = document.createDocumentFragment();
                    
                    for (let m = 0; m < maxMonth; m++){
                        const td2 = document.createElement('td');
                        td2.textContent = m+1+"월";
                        td2.setAttribute('colspan', monthsDays[m]);
                        theadRowFragment2.appendChild(td2);
                        tr.style.backgroundColor = bgcolor[m];
                        tr2.style.backgroundColor = bgcolor[m];
                    }
                    tr.appendChild(theadRowFragment);
                    thead.appendChild(tr)
                    tr2.appendChild(theadRowFragment2);
                    thead.appendChild(tr2);
                    table.appendChild(thead);
                }
                
                const tbody = document.createElement('tbody');
                tbody.setAttribute('id', rooms[i]+"tbody");

                for (let i = 0; i < 10; i++){
                    const tr = document.createElement('tr');
                    if (i == 5){
                        tr.setAttribute('class', "row-block");
                    }

                    const rowfragment = document.createDocumentFragment();
                    const FilterRowData = FilterData.filter(item => item.time == indexTime[i]);

                    const cols = FilterRowData.length;

                    for (let j = 0; j < cols; j++){
                        const td = document.createElement('td');
                        td.setAttribute('id', FilterRowData[j].schedule_cell+"td");

                        rowfragment.appendChild(td);
                    }
                    tr.appendChild(rowfragment);
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);
            }
            
            
            
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
}