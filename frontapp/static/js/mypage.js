const token = localStorage.getItem('authToken');
    
let userdata = 1;

if (token) {
        userdata = JSON.parse(localStorage.getItem('user'));
} 