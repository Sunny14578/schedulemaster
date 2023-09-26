function onDataPost() {
    const idInput = document.querySelector('#id').value;
    const pwInput = document.querySelector('#pw').value;

    const apiUrl = '/api/login/';

    const data = {
        email: idInput,
        password: pwInput
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
            const token = data.token; // 토큰 저장
            const userdata = data.user; // 관리자 여부 저장

            localStorage.setItem('authToken', JSON.stringify(token));
            localStorage.setItem('user', JSON.stringify(userdata));

            window.location.href = '/';
        } else {
            
            const labelElement = document.querySelector('label[for="id"]');
            const labelElement2 = document.querySelector('label[for="pw"]');
            if (labelElement || labelElement2) { // label 요소가 존재하는지 확인
                labelElement.classList.add('warning');
                labelElement2.classList.add('warning');
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
