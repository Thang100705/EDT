

// Chặn Kiểm tra trình duyệt
// document.addEventListener('contextmenu', function(event) { // Click chuột phải
//     event.preventDefault();     
// });
// window.addEventListener('keydown', function(event) {
//     if (event.keyCode === 123 ||
//         event.keyCode === 85 ||
//         event.keyCode === 73 ||
//         event.keyCode === 74 ||
//         event.keyCode === 67) 
//     { // F12 U I J C
//         event.preventDefault();
//     }
// });

// Light Mode 
const lightMode = document.querySelectorAll('.icon-light');
const darkMode = document.querySelectorAll('.icon-dark');
const htmlWeb = document.querySelector('html');

// Khởi tạo trang với chế độ Light Mode
document.addEventListener('DOMContentLoaded', function () {
    htmlWeb.classList.add('light'); // Light mode sẽ kích hoạt đầu tiên
});

lightMode.forEach(function (lightElem) {
    lightElem.addEventListener('click', function () {
        htmlWeb.classList.add('light');
        htmlWeb.classList.remove('dark');

        darkMode.forEach(function (darkElem) {
            setTimeout(function () {
                darkElem.style.transform = 'translate(-50%, -50%)';
                darkElem.style.opacity = '1';
            }, 100); // Đảm bảo thực hiện sau khi thêm class
        });
        lightElem.style.transform = 'translate(-50%, 100%)';
        lightElem.style.opacity = '0';
    });
});

darkMode.forEach(function (darkElem) {
    darkElem.addEventListener('click', function () {
        htmlWeb.classList.add('dark');
        htmlWeb.classList.remove('light');

        lightMode.forEach(function (lightElem) {
            setTimeout(function () {
                lightElem.style.transform = 'translate(-50%, -50%)';
                lightElem.style.opacity = '1';
            }, 100); // Đảm bảo thực hiện sau khi thêm class
        });
        darkElem.style.transform = 'translate(-50%, -200%)';
        darkElem.style.opacity = '0';
    });
});