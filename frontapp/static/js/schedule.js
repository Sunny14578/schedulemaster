var indexTime = ["08:00:00","09:00:00","10:00:00","11:00:00","12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00"];
var bgcolor = ["#5F00FF", "#003399", "#FF5E00", "#22741C", "#F15F5F", "#D941C5", "#5D5D5D", "#664B00", "#5F00FF", "#003399", "#FF5E00", "#22741C"];
var monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const modifiedTdIds = [];
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
    main_body = body.querySelector(".home.table-menu"),
    table_tools = body.querySelectorAll(".border-menu i");
    
    editCells = []

    // tools
    let preTool = null

    table_tools.forEach((tool, index) =>{
        tool.addEventListener("mouseover", ()=>{

            if (preTool){
                preTool.style.backgroundColor = "";
            }
            tool.style.backgroundColor = "#E4E9F7";
            preTool = tool;
        });

        tool.addEventListener("click", ()=>{
            if (index == 6){
                let rowIndexList = []
                let cellIndexList = []
                console.log(selectedTds);
                selectedTds.forEach((td)=>{
                    const rowIndex = td.parentElement.rowIndex;
                    const cellIndex = td.cellIndex;

                    rowIndexList.push(rowIndex);
                    cellIndexList.push(cellIndex);
                })

                const rowMax = Math.max(...rowIndexList);
                const rowMin = Math.min(...rowIndexList);
                const colMax = Math.max(...cellIndexList);
                const colMin = Math.min(...cellIndexList);

                console.log(rowMax, rowMin, colMax, colMin);

                selectedTds.forEach((td, index)=>{
                    const rowIndex = td.parentElement.rowIndex;
                    const cellIndex = td.cellIndex;
                    
                    if (rowIndex == rowMin){
                        td.style.borderTop = "2px solid black";
                    }

                    if (rowIndex == rowMax){
                        td.style.borderBottom = "2px solid black";
                    }

                    if (cellIndex == colMin){
                        td.style.borderLeft = "2px solid black";
                    }

                    if (cellIndex == colMax){
                        td.style.borderRight = "2px solid black";
                    }
                })
            }
            border_modal.classList.toggle("hidden");
        })
        
    });

    // save icon
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === "s") {
            event.preventDefault(); // 기본 저장 동작을 막음 (브라우저에서의 저장)
            console.log("저장~!");
        }
    });

    // tools end

    // icon
    plus_icon = body.querySelector(".bx.bx-plus.icon.plus");

    plus_icon.addEventListener("click", async() =>{
        plusMonthCreateCell();
    })

    border_modal = body.querySelector("#border_modal");
    border_icon = body.querySelector('.bx.bx-border-all.icon.border');
    borderAdd_icon = body.querySelector('.bx.bx-chevron-down.icon.arrow');
    borderAdd_icon.addEventListener("click", async() =>{
        const iconRect = borderAdd_icon.getBoundingClientRect();
    
        // 모달 창의 너비와 높이를 가져오기
        const modalWidth = border_modal.offsetWidth;
        const modalHeight = border_modal.offsetHeight;

        // 모달 창의 위치 계산
        const left = iconRect.right + window.scrollX; // 클릭한 요소의 오른쪽
        const bottom = iconRect.bottom + window.scrollY + 30; // 클릭한 요소의 위

        // 모달 창의 위치 설정
        border_modal.style.left = left + "px";
        border_modal.style.top = bottom + "px";

        border_modal.classList.toggle("hidden");
    })

    // icon event end //

    // teacher color add //
    let teacher_check = false
    let teacher_color = null

    teacher_menu.addEventListener("click", function(evnet){
        teacher_check = true
        const clickedElement = event.target;
        if (clickedElement.tagName === "A"){
            const inputColor = clickedElement.querySelector("input[type='color']")
            

            if (inputColor) {
                const colorValue = inputColor.value;
                teacher_color = colorValue;
                drawColorAtMousePosition(colorValue, event.clientX, event.clientY);
            }
        }
    })

    function drawColorAtMousePosition(color, x, y) {
        const canvas = document.createElement("canvas");

        canvas.width = 10; // 점의 너비
        canvas.height = 10; // 점의 높이
        const context = canvas.getContext("2d");
        context.fillStyle = color;
        context.beginPath();
        context.arc(5, 5, 5, 0, 2 * Math.PI);
        context.fill();
    
        canvas.style.position = "fixed";
   
        canvas.style.left = x + "px";
        canvas.style.top = y + "px";
    
        document.body.appendChild(canvas);
          // 마우스 이동 이벤트를 감지하여 canvas 위치 업데이트

        document.addEventListener("mousedown", (event) => {
            const clickedElement = event.target
            if (clickedElement.tagName == "TD" && color){
                clickedElement.style.backgroundColor = color;

                editCells.push(clickedElement)
                console.log(editCells);
            }
        })

        document.addEventListener("mousemove", (event) => {
            x = (event.clientX-5) - canvas.width / 2; // 마우스 X 좌표
            y = (event.clientY-5) - canvas.height / 2; // 마우스 Y 좌표

            // canvas 위치 업데이트
            canvas.style.left = x + "px";
            canvas.style.top = y + "px";
        });

        document.addEventListener("contextmenu", (event) => {
            event.preventDefault(); // 기본 컨텍스트 메뉴를 표시하지 않음
            teacher_color = null
            document.body.removeChild(canvas); // canvas 제거
          });
    }

   
    //


    // table td event
    function getBorderStyles(element) {
        const computedStyle = window.getComputedStyle(element);
        return {
          borderTop: computedStyle.getPropertyValue("border-top"),
          borderBottom: computedStyle.getPropertyValue("border-bottom"),
          borderLeft: computedStyle.getPropertyValue("border-left"),
          borderRight: computedStyle.getPropertyValue("border-right")
        };
      }
      
    let selectedTd = null;
    let preBorderStyle = null;

    table.addEventListener("click", function(event) {
        
        const clickedElement = event.target;
        // 클릭한 요소가 td 요소인 경우만 처리
        if (clickedElement.tagName === "TD" && !teacher_color) {
            preBorderStyle = getBorderStyles(clickedElement);
            
            clickedElement.contentEditable = true;

        // 클릭한 td 요소에 포커스를 줌
            clickedElement.focus();

            // td 요소에서 포커스가 빠져나갈 때 처리
            clickedElement.addEventListener("blur", function() {
                // td 요소의 내용을 편집 불가능 상태로 변경
                clickedElement.contentEditable = false;
            });

            const tdId = clickedElement.getAttribute("id");

        // td 요소에서 키 입력 이벤트 처리
        clickedElement.addEventListener("keydown", function(event) {
            // 엔터 키를 누르면 편집 모드를 끝내고 값을 적용
            if (event.key === "Enter"){
                event.preventDefault(); // 엔터 키의 기본 동작 방지
                clickedElement.contentEditable = false; // 편집 모드 종료
                // modifiedTdIds.push(tdId);
            }
        });
    
            clickedElement.style.border = "2px solid #695CFE";
            selectedTd = clickedElement;

            if (selectedTd){
                selectedTd.style.borderTop = preBorderStyle.borderTop;
                selectedTd.style.borderBottom = preBorderStyle.borderBottom;
                selectedTd.style.borderLeft = preBorderStyle.borderLeft;
                selectedTd.style.borderRight = preBorderStyle.borderRight;
            }
        }
    });
    // event end

    // mouse block designation
    let idsMouseDown = false;
    let startTd = null;
    let endTd = null;
    let startRowIndex, startColIndex, endRowIndex, endColIndex;
    let selectedTds = [];
    let mouseDownTimer;

    table.addEventListener("mousedown", (event) => {
        deselectTds();
        const clickedElement = event.target

        mouseDownTimer = setTimeout(function() {
            if (clickedElement.tagName == "TD" && !teacher_color){
                idsMouseDown = true;
                startTd = clickedElement;
                endTd = clickedElement;
                
                const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
    
                startRowIndex = endRowIndex = clickedElement.parentElement.rowIndex;
                startColIndex = endColIndex = tdIndex;
                selectedTds.push(clickedElement);
                clickedElement.classList.toggle("selected");
            }else if (clickedElement.tagName == "TD" && teacher_color){
                idsMouseDown = true;
                startTd = clickedElement;
                endTd = clickedElement;
                
                const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
    
                startRowIndex = endRowIndex = clickedElement.parentElement.rowIndex;
                startColIndex = endColIndex = tdIndex;
                selectedTds.push(clickedElement);
            }
        }, 250);
    });

    table.addEventListener("mousemove", (event) => {
        const clickedElement = event.target
        if (clickedElement.tagName == "TD" && idsMouseDown && !teacher_color){
            if(selectedTds[0] != event.target){
                const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
                endRowIndex = clickedElement.parentElement.rowIndex;
                endColIndex = tdIndex;

                selectTds();
            }
        }else if(clickedElement.tagName == "TD" && idsMouseDown && teacher_color){
            if(selectedTds[0] != event.target){
                const tdIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
                endRowIndex = clickedElement.parentElement.rowIndex;
                endColIndex = tdIndex;

                selectTds(teacher_color);
            }
        }
    });

    table.addEventListener("mouseup", () => {
        clearTimeout(mouseDownTimer);
        idsMouseDown = false;
    });

    function selectTds(color) {
        if (color){
            selectedTds.forEach((td) => {
                td.style.backgroundColor = color;
                if (!editCells.includes(td)) {
                    editCells.push(td);
                }
            });
        }else{
            selectedTds.forEach((td) => {
                td.classList.toggle("selected");
            });
        }
    
      
        selectedTds = [];
      
        // 선택된 영역의 TD 선택
        for (let i = Math.min(startRowIndex, endRowIndex); i <= Math.max(startRowIndex, endRowIndex); i++) {
          const row = table.rows[i];
          for (let j = Math.min(startColIndex, endColIndex); j <= Math.max(startColIndex, endColIndex); j++) {
            const td = row.cells[j];
            selectedTds.push(td);
            td.classList.toggle("selected");
          }
        }
      } 

      function deselectTds() {
        // 모든 선택된 TD 초기화
        selectedTds.forEach((td) => {
          td.classList.remove("selected");
        });
        selectedTds = [];
      }

    
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

async function onDataLecturePost() {
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
        
    try{
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        
        if (!response.ok) {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const responseData = await response.json();
        
        if (responseData.message) {
            roomInput.value = "";
            console.log(responseData.data.room_id);
            onCreateCell(responseData.data.room_id);
           
        } else {
            const labelElement = document.querySelector('label[for="room_name"]');

            if (labelElement) { // label 요소가 존재하는지 확인
                labelElement.classList.add('warning');
            }
        }
    } catch (error){
        console.error("에러 발생:", error);
    }
}
    
        // 전체 화면에서 키 입력을 감지
    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 13 && lecture_modal.classList.toString() === "modal") {
            onDataLecturePost(); // 
        } else if (event.keyCode === 13 && plus_modal.classList.toString() === "modal"){
            console.log("하하");
        }
    });

    window.onload = function(){
        onDataLectureRoomGet();
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
        console.log("호출완료");
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


async function onDataLectureRoomGettest() {
    const apiUrl = '/api/lecture/';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const data = await response.json();
        const roomNames = data.map(item => item.room_name);
        const roomIdNames = data.map(item => item.room_id);
        console.log(roomIdNames, "확인");
        localStorage.setItem('roomIdNames', roomIdNames);
    
        const table_lecture_room_test = document.querySelector('.lecture_room');

        for (var i = 0; i < roomNames.length; i++) {
            var new_litag = document.createElement("li");
            new_litag.contentEditable = true;
            new_litag.textContent = roomNames[i];

            table_lecture_room_test.appendChild(new_litag);
        }
    } catch (error) {
        console.error('에러 발생:', error);
    }
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
        console.log(roomIdNames);
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

    var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    data_group = [] // post 요청을 줄이기위해 데이터 그룹화
   
    const maxMonthList = localStorage.getItem("maxMonthList");
    const minMonthList = localStorage.getItem("minMonthList");
    const yearListString = localStorage.getItem("yearList");
    const yearList = JSON.parse(yearListString);

    const yearMaxMonthList = maxMonthList.split(",").slice(0,yearList.length);
    const yearminMonthList = minMonthList.split(",").slice(0,yearList.length);

    for (let yy = 0; yy < yearList.length; yy++){
        if (isLeapYear((yearList[yy]))){
            monthsDays[1] = 29
        }
        for (let month = parseInt(yearminMonthList[yy]); month < parseInt(yearMaxMonthList[yy])+1; month++){
            for (let index = 0; index < indexTime.length; index++){
                for (let day = 1; day <= monthsDays[month-1]; day++){
                    data = {
                        "lecture_room_id":lecture_room_id,
                        "day":day,
                        "month":month,
                        "time":indexTime[index],
                        "year":yearList[yy]
                    }
                    
                data_group.push(data);
                }
            }
        }
    }
    onDataLectureRoomGet();
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

        console.log(response);

        if (response.ok) {
            const responseData = await response.json();
            console.log('데이터 전송 성공:', responseData);
            onDataCellGet();
        } else {
            console.error('데이터 전송 실패:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

// 달 추가
function plusMonthCreateCell(){
    let maxMonth = parseInt(localStorage.getItem('maxMonth'));
    const yearListString = localStorage.getItem("yearList");
    let yearList = JSON.parse(yearListString);
    
    if (maxMonth==12){
        yearList.push(yearList[yearList.length-1]+1);
        maxMonth=0;
    }
    
    const lastYear = (yearList[yearList.length-1]);

    var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const rooms = localStorage.getItem('roomIdNames');
    const splitRooms = rooms.split(',');
    console.log(splitRooms);
    console.log(typeof splitRooms[0]);

    data_group = []

    if (isLeapYear(lastYear)){
        monthsDays[1] = 29
    }

    console.log(maxMonth, "월");
    for (let room_id = 0; room_id < splitRooms.length; room_id++){
        for (let month = maxMonth; month < maxMonth+2; month++){
            for (let index = 0; index < indexTime.length; index++){
                for (let day = 1; day <= monthsDays[month]; day++){
                    data = {
                        "lecture_room_id":parseInt(splitRooms[room_id]),
                        "day":day,
                        "month":month+1,
                        "time":indexTime[index],
                        "year":lastYear
                    }
                    data_group.push(data);
                }
            }
        }
    }

    postData(data_group);
}
// 윤년판단

function isLeapYear(year) {
    // 4로 나누어 떨어지는 연도 중에서
    // 100으로 나누어 떨어지지 않거나 400으로 나누어 떨어지는 경우 윤년
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function onDataCellGet(){
    const apiUrl = '/api/schedule/';

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType:'json',
        success: function (data){
        table.innerHTML = '';
        var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const rooms = localStorage.getItem('roomIdNames');
        const splitRooms = rooms.split(',');
        const years = data.map(item => item.year);
        const maxYear = Math.max(...years);
        const minYear = Math.min(...years);

        const yearList = [];
        const maxMonthList = [];
        const minMonthList = [];

        for (let yy = minYear; yy <= maxYear; yy++) {
            yearList.push(yy);
        }

        localStorage.setItem('yearList', JSON.stringify(yearList));

        const maxYeardata = data.filter(item => item.year == maxYear);
        const months = maxYeardata.map(item => item.month);
        const maxMonth = Math.max(...months);

        const minYeardata = data.filter(item => item.year == minYear);
        const months2 = minYeardata.map(item => item.month);
        const minMonth = Math.min(...months2);

        localStorage.setItem('maxMonth', maxMonth);
        localStorage.setItem('minMonth', minMonth);

        let thead;

        for (let i = 0; i < splitRooms.length; i++){
            const FilterData = data.filter(item => item.lecture_room_id == splitRooms[i]);
            
            if (FilterData.length > 0){ 
                if (i%2==0){
                    thead = document.createElement('thead');
                    
                    const FilterRowData = FilterData.filter(item => item.time == indexTime[0]);
                    const cols = FilterRowData.length;
    
                    const tr = document.createElement('tr');
                    const theadRowFragment = document.createDocumentFragment();

                    const tr2 = document.createElement('tr');
                    const theadRowFragment2 = document.createDocumentFragment();
                    let MonthCnt = 0;   
                    let maxMonth2 = 0;
                    let minMonth2 = 0;
                    
                    for (let year = 0; year < yearList.length; year++){
                        
                        if (year == yearList.length-1){
                            MonthCnt = maxMonth;
                        }else{
                            MonthCnt = 12
                        }

                        if (isLeapYear(yearList[year])){
                            monthsDays[1] = 29
                        }else{
                            monthsDays[1] = 28
                        }

                        const FilterYearData = FilterRowData.filter(item => item.year == yearList[year]);
                        const months = FilterYearData.map(item => item.month);
                        maxMonth2 = Math.max(...months);

                        const months2 = FilterYearData.map(item => item.month);
                        minMonth2 = Math.min(...months2);
                        maxMonthList.push(JSON.stringify(maxMonth2));
                        minMonthList.push(JSON.stringify(minMonth2));
                        let monthRange = 0;

                        if (maxMonth2 == minMonth2){
                            monthRange = maxMonth2;
                        }else{
                            monthRange = maxMonth2;
                        }
                        
                        for (let mm = minMonth2; mm < monthRange+1; mm++){
                            const monthIndex = mm > 12 ? mm - 12 : mm;
                            
                            const FilteMonthData = FilterYearData.filter(item => item.month == monthIndex)
                            
                            for (let j = 0; j < monthsDays[monthIndex-1]; j++){
                                const td = document.createElement('td');
                                td.textContent = FilteMonthData[j].day;
                                td.style.backgroundColor = bgcolor[monthIndex-1];
                                theadRowFragment.appendChild(td);
                            }
                        }
                        
                        for (let m = minMonth2; m < monthRange+1; m++){
                            const monthIndex = m > 12 ? m - 12 : m;

                            const td2 = document.createElement('td');
                            td2.textContent = monthIndex+"월";
                            td2.setAttribute('colspan', monthsDays[monthIndex-1]);
                            theadRowFragment2.appendChild(td2);
                            td2.style.backgroundColor = bgcolor[monthIndex-1];
                        }
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

        localStorage.setItem('maxMonthList', maxMonthList);
        localStorage.setItem('minMonthList', minMonthList);

        },
        error: function (xhr, status, error){
            console.error('데이터 가져오기 실패:', status, error);
        }
    });
}
   
  
        
 
