// ẤN thanh phản ứng responsive
// Khai báo các phần tử liên quan
const menuToggle = document.getElementById('menu-toggle'); // Nút để mở hoặc đóng menu
const menu = document.getElementById('menu'); // Phần tử menu cần được mở hoặc đóng
const overlay = document.getElementById('overlay'); // Lớp phủ mờ khi menu được mở
const menuItems = document.querySelectorAll('.header_navbar-item a'); // Chọn tất cả các mục menu (liên kết)

// Mở hoặc đóng menu và overlay khi nhấn vào nút toggle
menuToggle.addEventListener('click', function () {
    menu.classList.toggle('open'); // Toggle (bật/tắt) class "open" cho menu
    overlay.classList.toggle('show'); // Toggle (bật/tắt) class "show" cho overlay
});

// Đóng menu và overlay khi nhấn vào overlay
overlay.addEventListener('click', function () {
    closeMenu(); // Gọi hàm `closeMenu` để đóng menu và overlay
});

// Đóng menu khi nhấn ngoài menu và overlay
document.addEventListener('click', function (event) {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu(); // Đóng menu và overlay nếu người dùng nhấn vào bất cứ đâu ngoài menu và nút toggle
    }
});

// Đóng menu và overlay khi nhấn vào một mục trong menu
menuItems.forEach(item => {
    item.addEventListener('click', function () {
        closeMenu(); // Gọi hàm `closeMenu` khi người dùng nhấn vào một mục trong menu
    });
});

// Hàm đóng menu và overlay
function closeMenu() {
    menu.classList.remove('open'); // Loại bỏ class "open" từ menu
    overlay.classList.remove('show'); // Loại bỏ class "show" từ overlay
}



// Hàm đăng xuất
function logout() {
    // Xóa trạng thái đăng nhập khỏi LocalStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    // Tải lại trang hoặc chuyển hướng người dùng
    window.location.reload();
}
setTimeout(logout, 300000); // 20000 milliseconds = 20 seconds ->5p


// Kiểm tra trạng thái đăng nhập khi tài liệu được tải hoàn toàn
document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // Lấy trạng thái đăng nhập từ LocalStorage
    const username = localStorage.getItem("username"); // Lấy tên người dùng từ LocalStorage

    if (isLoggedIn === "true") {
        // Ẩn liên kết đăng nhập và đăng ký nếu người dùng đã đăng nhập
        document.getElementById("loginLink").style.display = "none";
        document.getElementById("registerLink").style.display = "none";
        document.getElementById("userInfo").style.display = "flex"; // Hiển thị thông tin người dùng

        // Hiển thị tên người dùng hoặc "Admin" nếu không có tên người dùng
        document.querySelector(".user-name").textContent = username || "Admin";
    } else {
        // Nếu chưa đăng nhập, hiển thị liên kết Đăng Nhập và Đăng Ký
        document.getElementById("loginLink").style.display = "block";
        document.getElementById("registerLink").style.display = "block";
        document.getElementById("userInfo").style.display = "none"; // Ẩn thông tin người dùng
    }
});




document.getElementById('searchInput').addEventListener('keydown', function (event) {
    // Nếu người dùng nhấn Enter (keyCode = 13)
    if (event.key === "Enter") {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form
        search(); // Gọi hàm tìm kiếm
    }
});

function search() {
    // Lấy giá trị từ ô tìm kiếm
    const searchQuery = document.getElementById('searchInput').value.toLowerCase(); // Chuyển về chữ thường để tìm kiếm chính xác hơn

    // Danh sách địa điểm và trang tương ứng
    const locations = {
        "hà nội": "region/region-MB/hanoi.html",
        "ha noi": "region/region-MB/hanoi.html",
        "hn": "region/region-MB/hanoi.html",
        "điện biên": "region/region-MB/dienbien.html",
        "dien bien": "region/region-MB/dienbien.html",
        "hòa bình": "region/region-MB/hoabinh.html",
        "hoa binh": "region/region-MB/hoabinh.html",
        "quảng ninh": "region/region-MB/quangninh.html",
        "quang ninh": "region/region-MB/quangninh.html",
        "lào cai": "region/region-MB/laocai.html",
        "lao cai": "region/region-MB/laocai.html",

        "bà rịa vũng tàu": "region/region-MN/br-vt.html",
        "ba ria vung tau": "region/region-MN/br-vt.html",
        "sài gòn": "region/region-MN/tphcm.html",
        "sai gon": "region/region-MN/tphcm.html",
        "tphcm": "region/region-MN/tphcm.html",
        "thành phố hồ chí minh": "region/region-MN/tphcm.html",
        "tp hồ chí minh": "region/region-MN/tphcm.html",
        "cần thơ": "region/region-MN/cantho.html",
        "can tho": "region/region-MN/cantho.html",
        "đồng tháp": "region/region-MN/dongthap.html",
        "đong thap": "region/region-MN/dongthap.html",
        "tây ninh": "region/region-MN/tayninh.html",
        "tay ninh": "region/region-MN/tayninh.html",

        "bình định": "region/region-MT/binhdinh.html",
        "binh dinh": "region/region-MT/binhdinh.html",
        "đà nẵng": "region/region-MT/danang.html",
        "da nang": "region/region-MT/danang.html",
        "huế": "region/region-MT/hue.html",
        "hue": "region/region-MT/hue.html",
        "nghệ an": "region/region-MT/nghean.html",
        "nghe an": "region/region-MT/nghean.html",
        "quảng ngãi": "region/region-MT/quangngai.html",
        "quang ngai": "region/region-MT/quangngai.html",

        "daklak": "region/region-TN/daklak.html",
        "đắc lắc": "region/region-TN/daklak.html",
        "đắc nông": "region/region-TN/daknong.html",
        "daknong": "region/region-TN/daknong.html",
        "gia lai": "region/region-TN/gialai.html",
        "kontum": "region/region-TN/kontum.html",
        "lam dong": "region/region-TN/lamdong.html",
        "lâm đồng": "region/region-TN/lamdong.html",
    };

    // Kiểm tra xem địa điểm có trong danh sách không
    if (locations[searchQuery]) {
        // Điều hướng đến trang tương ứng
        window.location.href = locations[searchQuery];
    } else {
        alert('Không tìm thấy địa điểm này. Vui lòng thử lại!');
    }
}



function filterProducts() {
    // Lấy giá trị tìm kiếm từ ô input và chuyển thành chữ thường để so sánh không phân biệt chữ hoa/chữ thường
    const query = document.getElementById('searchInput2').value.toLowerCase();

    // Lấy tất cả các sản phẩm có class "book-nav_item-content"
    const products = document.querySelectorAll('.book-nav_item-content');

    // Duyệt qua từng địa điểm để kiểm tra tên
    products.forEach(product => {
        // Lấy giá trị thuộc tính "data-name" của mỗi sản phẩm và chuyển thành chữ thường để so sánh
        const productName = product.getAttribute('data-name').toLowerCase();

        // Kiểm tra nếu tên địa điểm chứa từ khóa tìm kiếm
        if (productName.includes(query)) {
            // Hiển thị địa điểm nếu khớp với từ khóa tìm kiếm
            product.style.display = 'flex';
        } else {
            // Ẩn các địa điểm nếu không khớp với từ khóa tìm kiếm
            product.style.display = 'none';
        }
    });
}




