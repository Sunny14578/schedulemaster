let currentDate = new Date(); 
let currentYear = currentDate.getFullYear(); 
let currentMonth = currentDate.getMonth(); 
let currentDay = currentDate.getDate(); 

function onUserDataGet(){
    const apiUrl = '/api/schedule/';

    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType:'json',
        success: function (data){
            pschedule = data;
            currentTotalHout(currentYear, currentMonth);
      
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