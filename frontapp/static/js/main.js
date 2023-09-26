console.log(1);

document.addEventListener('DOMContentLoaded', function () {
    // 토큰 정보 가져오기
    const token = localStorage.getItem('authToken');

    const userLink = document.getElementById('user-a');
    const userLink2 = document.getElementById('user2-a');
    const loginLink = document.getElementById('login-a');

    if (token) {
        // 토큰이 존재하는 경우
        userLink.style.display = 'inline'; 
        userLink2.style.display = 'inline'; 
        loginLink.style.display = 'none';  // 로그인 a태그를 숨김

        const userdata = JSON.parse(localStorage.getItem('user'));

        // 사용자 데이터를 HTML에 표시
        userLink.innerHTML = userdata.name + '님 환영합니다.';
    } else {
        // 토큰이 존재하지 않는 경우
        userLink.style.display = 'none';   
        userLink2.style.display = 'none';  
        loginLink.style.display = 'inline'; // 로그인 a태그를 보이게 함
    }


});

function onLogout() {
    // DELETE 요청 보내기
    const apiUrl = '/api/logout/';

    fetch(apiUrl, {
        method: 'delete',
        credentials: 'include', // 쿠키를 서버로 보내기 위해 필요한 옵션
    })
    .then(response => {
        if (response.ok) {
            // 로그아웃 성공
            console.log('로그아웃 성공');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            window.location.href = '/';
            // 여기에서 필요한 처리를 수행할 수 있습니다.
        } else {
            // 로그아웃 실패 또는 다른 상태 코드를 처리할 수 있습니다.
            console.error('로그아웃 실패');
        }
    })
    .catch(error => {
        console.error('오류 발생:', error);
    });
}