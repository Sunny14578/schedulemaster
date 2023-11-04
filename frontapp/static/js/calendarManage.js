let currentDate = new Date(); 
let currentYear = currentDate.getFullYear(); 
let currentMonth = currentDate.getMonth(); 
let currentDay = currentDate.getDate(); 

var bgcolor = ["#003399", "#FF5E00", "#22741C", "#5D5D5D", "#664B00", "#5F00FF", "#003399", "#FF5E00", "#22741C", "#F15F5F", "#D941C5", "#5F00FF"];

const leftarrow = document.querySelector(".bxs-left-arrow");
const rightarrow = document.querySelector(".bxs-right-arrow");
const calendarDate = document.querySelector(".calendarDate");
const mainbody = document.querySelector(".main-contents");
const calendarIcon = document.querySelector(".bx.bx-calendar");
const dateModal = document.querySelector(".date");
const dateSelect = document.querySelector("#dateSelect");

window.onload = function(){
    onUserDataGet();
}

function onUserDataGet(sdate){
  
    let month;

    if(sdate){
        let y = sdate.split("-")[0];
        let m = sdate.split("-")[1];
        
        currentYear = parseInt(y);
        currentMonth = parseInt(m)-1;

        month = parseInt(currentMonth)+1;
    }else{
        month = parseInt(currentMonth)+1;
    }
  
    let apiUrl = '/api/schedule/?year=' + currentYear + '&month=' + month;
    const teacher = localStorage.getItem('teacherInfo');
    const teacher_info = JSON.parse(teacher);

    const rN = localStorage.getItem('roomNames');
    const rIn = localStorage.getItem('roomIdNames');
    const rN_info = JSON.parse(rN);
    const rIn_info = JSON.parse(rIn);

    calendarDate.textContent = currentYear +"년 " + month +"월"



    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType:'json',
        success: function (data){
            console.log(data);
            while (mainbody.firstChild) {
                mainbody.removeChild(mainbody.firstChild);
            }

            const fragment = document.createDocumentFragment();

            teacher_info.forEach(item =>{
                const name = item.name;
                const color = hexToRgb(item.color);
           
                const filteredData = data.filter(item => item.background_color == color);
                const totalHour = filteredData.length;
                const text = name + " / " + totalHour;

                const userDataDiv = document.createElement('div');
                userDataDiv.classList.add('user-data');
    
                // Create the user information div
                const userInfoDiv = document.createElement('div');
                userInfoDiv.textContent = text;

                const userLecTagDiv = document.createElement('div');
                userLecTagDiv.classList.add('user-lec-tag');

                rIn_info.forEach((rI, index) =>{
                    const lecture_data = filteredData.filter(item => item.lecture_room_id == rI);

                    if (lecture_data.length){
                        const lectureTag = document.createElement('div');
                        lectureTag.textContent = rN_info[index] + " / " + lecture_data.length;

                        userLecTagDiv.appendChild(lectureTag);



                        lectureTag.style.backgroundColor = bgcolor[index%12];
                    };
                })

                userDataDiv.appendChild(userInfoDiv);
                userDataDiv.appendChild(userLecTagDiv);

                fragment.appendChild(userDataDiv);
            });

            mainbody.appendChild(fragment);
        }
    });
}

function rgbToHex(rgb) {
    const values = rgb.match(/\d+/g);
  
    if (values) {
      // 각 숫자를 16진수로 변환하고 두 자리로 패딩
      const hex = values.map(value => {
        const hexValue = parseInt(value).toString(16);
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
      });
  
      return '#' + hex.join('');
    }
  
    return null;
  }

  function hexToRgb(hex) {
    // HEX 코드에서 # 기호 제거
    hex = hex.replace(/^#/, '');
  
    // HEX 코드를 R, G, B 세 개의 16진수로 나눔
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // RGB 형식으로 반환
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  leftarrow.addEventListener("click", function(event) {
    if (currentMonth == 0){
        currentYear -=1;
        currentMonth = 11;
    }else{
        currentMonth -=1;
    }
    onUserDataGet();
});

rightarrow.addEventListener("click", function(event) {
    if (currentMonth == 11){
        currentYear +=1;
        currentMonth = 0;
    }else{
        currentMonth +=1;
    }
    onUserDataGet();
});

calendarIcon.addEventListener("click", function(event) {
    dateModal.classList.toggle("hidden");

    const iconRect = calendarIcon.getBoundingClientRect();

    const left = iconRect.right + window.scrollX -160; // 클릭한 요소의 오른쪽
    const bottom = iconRect.bottom + window.scrollY; // 클릭한 요소의 위

    dateModal.style.left = left + "px";
    dateModal.style.top = bottom + "px";
});

dateSelect.addEventListener("click", function(event){
    const startMonth = document.getElementById("startMonthPicker");
    var sDate = startMonth.value;
 
    onUserDataGet(sDate);
    dateModal.classList.toggle("hidden");
});