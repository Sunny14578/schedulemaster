let roomNames;
let roomIdNames;
const bodyCalendar = document.querySelector(".body-calendar");
const leftarrow = document.querySelector(".bxs-left-arrow");
const rightarrow = document.querySelector(".bxs-right-arrow");
const calendarDate = document.querySelector(".calendarDate");
const totalhour = document.querySelector(".hour");

let yearInfo;
let monthInfo;
let dayInfo;
let timeInfo;
let lectureInfo;

let roomInfo = {};
let scheduleInfo = {};
let userId;

window.onload = function(){
    user = localStorage.getItem('user')
    const userData = JSON.parse(user);
    if (userData){
        userId = userData.id;
    }
    
    roomNames = localStorage.getItem('roomNames');
    roomIdNames = localStorage.getItem('roomIdNames');

    const rN = JSON.parse(roomNames);
    const rIn = JSON.parse(roomIdNames);

    for (let i = 0; i < rN.length; i++){
        roomInfo[rIn[i]] = rN[i];
    }
   
    onUserDataGet(userId, function() {
        curruntCreateDiv(); // 데이터를 가져온 후에 curruntCreateDiv 호출
    });
}

function onUserDataGet(user_id, callback){
    const apiUrl = '/api/schedule/' + user_id;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType:'json',
        success: function (data){
            totalhour.textContent = data.length+"h";
            const timeRanges = groupTimesByDate(data);
            
            for (const key in timeRanges){
                const date = key.split('-');
                const finalDate = date[0]+date[1].toString().padStart(2, '0')+date[2].toString().padStart(2, '0');
                
                const lecCnt = findTimeRanges(timeRanges[key]);
            
                if (scheduleInfo[finalDate]) {
                    // 이미 해당 날짜에 대한 정보가 scheduleInfo 객체에 존재하는 경우
                    scheduleInfo[finalDate] = { ...scheduleInfo[finalDate], ...lecCnt };
                } else {
                    // 해당 날짜에 대한 정보가 scheduleInfo 객체에 없는 경우
                    scheduleInfo[finalDate] = lecCnt;
                }
            }
            callback();
        }
    });
}

function groupTimesByDate(data) {
    const timeRanges = {};

    data.forEach(item => {
        const dateKey = `${item.year}-${item.month}-${item.day}-${item.lecture_room_id}`;
        if (!timeRanges[dateKey]) {
            timeRanges[dateKey] = { lecture_id: item.lecture_room_id, times: [] };
        }
        timeRanges[dateKey].times.push(item.time);
    });

    return timeRanges;
}

function findTimeRanges(timesByDate) {
    const lectureTimeRanges = {};


    const lecture_id = timesByDate.lecture_id;
    const times = timesByDate.times;
   
    if (!lectureTimeRanges[lecture_id]) {
        lectureTimeRanges[lecture_id] = [];
    }

    if (times.length === 0) {
        
    }

    const sortedTimes = times.sort(); // 시간을 정렬합니다.
    const timeRanges = [];
    let currentRange = [sortedTimes[0]];

    for (let i = 1; i < sortedTimes.length; i++) {
        const currentTime = sortedTimes[i];
        const previousTime = sortedTimes[i - 1];
        const currentTimeObject = new Date(`1970-01-01T${currentTime}`);
        const previousTimeObject = new Date(`1970-01-01T${previousTime}`);

            // 두 시간 사이의 차를 분 단위로 계산합니다.
        const timeDiff = (currentTimeObject - previousTimeObject) / (1000 * 60);

        if (timeDiff <= 60) {
                // 두 시간이 1시간(60분) 이내로 연속된 경우, 범위를 계속 확장합니다.
            currentRange.push(currentTime);
        } else {
                // 두 시간이 연속되지 않는 경우, 현재 범위를 저장하고 새로운 범위를 시작합니다.
            timeRanges.push(currentRange);
            currentRange = [currentTime];
        }
    }

        // 마지막 범위를 저장합니다.
    timeRanges.push(currentRange);

        // 최소 및 최대 시간을 찾합니다.
    const minMaxTimeRanges = timeRanges.map(range => {
        return {
            minTime: range[0],
            maxTime: range[range.length - 1],
        };
    });

    lectureTimeRanges[lecture_id] = minMaxTimeRanges;

    return lectureTimeRanges;
    }
    



let currentDate = new Date(); 
let currentYear = currentDate.getFullYear(); 
let currentMonth = currentDate.getMonth(); 
let currentDay = currentDate.getDate(); 

function curruntCreateDiv(){
    const month = parseInt(currentMonth, 10)+1
    
    calendarDate.textContent = currentYear +"년 " + month +"월"

    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    const finalmonth = month.toString().padStart(2, '0');
   
    // 현재 달의 1일을 구하여 무슨 요일인지 파악
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (일요일)부터 6 (토요일)까지

    while (bodyCalendar.firstChild) {
        bodyCalendar.removeChild(bodyCalendar.firstChild);
    }
  
    let weekRow = document.createElement("div");
    weekRow.classList.add("week-row");

    const theadRowFragment = document.createDocumentFragment(); // DocumentFragment 생성

    // 빈 칸으로 시작하기 위해 firstDayOfWeek에 맞는 빈 cell div 생성
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement("div");
        weekRow.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const holidaycheck = currentYear+""+finalmonth+""+day.toString().padStart(2, '0');
        const cell = document.createElement("div");
        const cellContent = document.createElement("span");
        cellContent.textContent = day;
        cell.appendChild(cellContent);

        if (getWeekInMonth(day) == 0){
            cell.classList.add("sunday");
        }else if(getWeekInMonth(day) == 6){
            cell.classList.add("saturday");
        }else if(holiday[holidaycheck]){
            cell.classList.add("sunday");

            const cellspan = document.createElement("span");
            cellspan.textContent = "  "+holiday[holidaycheck];
            cell.appendChild(cellspan);
        }

        if (day === currentDay) {
            cell.classList.add("today"); // 현재 날짜에 스타일 적용
        }

        if (scheduleInfo[holidaycheck]){
            const keyArray = Object.keys(scheduleInfo[holidaycheck]);

            for (let key=0; key < keyArray.length; key++){
                const lecSchedule = scheduleInfo[holidaycheck][keyArray[key]];
                
                const roomName = roomInfo[keyArray[key]];
                for (let s=0; s < lecSchedule.length; s++){
                    const cellDiv = document.createElement("div");

                    const minTime = lecSchedule[s]['minTime'].split(':')[0];
                    const maxTime = lecSchedule[s]['maxTime'].split(':')[0];
                    const fmaxTime = parseInt(maxTime, 10)+1;
                   
                    cellDiv.innerHTML = roomName+" "+minTime+" ~ "+fmaxTime;
    
                    if (s == 0){
                        cellDiv.classList.add("schedule", "first");
                    }else
                    {   
                        cellDiv.classList.add("schedule");
                    }
                    
                    cell.appendChild(cellDiv);
                }
            }

            
        }
      
        weekRow.appendChild(cell);

        if (weekRow.children.length % 7 === 0 && day != daysInCurrentMonth) {
            // 7일마다 week-row의 한 주가 끝나도록 week-row를 추가
            bodyCalendar.appendChild(weekRow);
            weekRow = document.createElement("div");
            weekRow.classList.add("week-row");
        }
      }

    const range = 7-weekRow.children.length;

    for (let j = 0; j < range; j++){
        const cell = document.createElement("div");
        weekRow.appendChild(cell);
    }
      
      // DocumentFragment를 사용하여 theadRowFragment에 자식 노드를 추가
      
      theadRowFragment.appendChild(weekRow);
      
      // 실제 DOM에 추가
      bodyCalendar.appendChild(theadRowFragment);
}



function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getWeekInMonth(day){
    const firstDayOfMonth = new Date(currentYear, currentMonth, day);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    return firstDayOfWeek;
}

// arrow click
leftarrow.addEventListener("click", function(event) {
    if (currentMonth == 0){
        currentYear -=1;
        currentMonth = 11;
    }else{
        currentMonth -=1;
    }
    curruntCreateDiv();
});

rightarrow.addEventListener("click", function(event) {
    if (currentMonth == 11){
        currentYear +=1;
        currentMonth = 0;
    }else{
        currentMonth +=1;
    }
    curruntCreateDiv();
});


let data = {};

function holidayApiGet(){
    const currentDate = new Date(); 
    const currentYear = currentDate.getFullYear(); 
    const currentMonth = currentDate.getMonth(); 

    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'pZjBAV%2FeaR%2F0jb%2BBUSJAfnrOGf7qrtwq4J7h2%2Fqrahb4q3jPBjL0PHLJMNcykF3sMRtoHb7g7TCnz8Ssr9mS9w%3D%3D'; /*Service Key*/
    queryParams += '&' + encodeURIComponent('solYear') + '=' + encodeURIComponent('2023'); /**/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('30'); /**/
    // queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent('09'); /**/
    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
        
                // XML에서 원하는 데이터 추출
                var items = xmlDoc.getElementsByTagName("item");
                for (var i = 0; i < items.length; i++) {
                    var locdate = items[i].getElementsByTagName("locdate")[0].textContent;
                    var dateName = items[i].getElementsByTagName("dateName")[0].textContent;
        
                    data[locdate] = dateName;
                }
            } else {
                console.error('오류 발생. HTTP 상태 코드:', this.status);
            }
        }
    };
    
    xhr.send('');
}

let holiday = {"20230101": "신정", 
    "20230121": "설날", "20230122": "설날", 
    "20230123": "설날", "20230124": "대체공휴일", "20230301": "삼일절", 
    "20230505": "어린이날", "20230527": "부처님오신날", "20230529": "대체공휴일", 
    "20230606": "현충일", "20230815": "광복절", "20230928": "추석", 
    "20230929": "추석", "20230930": "추석", "20231002": "임시공휴일", 
    "20231003": "개천절", "20231009": "한글날", "20231225": "기독탄신일",
    "20240101": "신정", "20240209": "설날", "20240210": "설날", 
    "20240211": "설날", "20240212": "대체공휴일(설날)", 
    "20240301": "삼일절", "20240410": "국회의원선거", 
    "20240505": "어린이날", "20240506": "대체공휴일(어린이날)", 
    "20240515": "부처님오신날", "20240606": "현충일", "20240815": "광복절", 
    "20240916": "추석", "20240917": "추석", "20240918": "추석", 
    "20241003": "개천절", "20241009": "한글날", "20241225": "기독탄신일"
};