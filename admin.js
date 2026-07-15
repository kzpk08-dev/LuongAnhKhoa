// ===============================
// admin.js
// Quản lý người dùng (Admin)
// ===============================

// Khi trang được tải
window.onload = function () {
    loadUsers();
};

// Lấy danh sách người dùng
function loadUsers() {

    fetch("/api/users")
        .then(response => response.json())
        .then(result => {

            const tbody = document.getElementById("user-table-body");
            tbody.innerHTML = "";

            result.data.forEach(user => {

                let button = "";

                if (user.TrangThai === "Hoạt động") {

                    button = `
                        <button class="btn-lock"
                            onclick="toggleStatus(${user.MaND}, 'Bị khóa')">
                            Khóa tài khoản
                        </button>
                    `;

                } else {

                    button = `
                        <button class="btn-unlock"
                            onclick="toggleStatus(${user.MaND}, 'Hoạt động')">
                            Mở khóa
                        </button>
                    `;

                }

                tbody.innerHTML += `
                    <tr>
                        <td>${user.MaND}</td>
                        <td>${user.HoTen}</td>
                        <td>${user.Email}</td>
                        <td>${user.MaVaiTro}</td>
                        <td>${user.TrangThai}</td>
                        <td>${button}</td>
                    </tr>
                `;

            });

        })
        .catch(err => {

            console.error(err);
            alert("Không thể tải danh sách người dùng.");

        });

}

// Khóa / Mở khóa tài khoản
function toggleStatus(maND, trangThaiMoi) {

    fetch("/api/users/toggle-status", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            maND: maND,
            trangThaiMoi: trangThaiMoi
        })

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        // Tải lại danh sách
        loadUsers();

    })

    .catch(err => {

        console.error(err);
        alert("Cập nhật thất bại.");

    });

}
