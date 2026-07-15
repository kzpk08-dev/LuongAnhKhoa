const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json()); // Để đọc được dữ liệu JSON từ Frontend gửi lên

// Kết nối trực tiếp đến file Database SQLite bạn vừa tạo
const db = new sqlite3.Database('./quanlylichhop.db', (err) => {
    if (err) console.error("Lỗi kết nối DB:", err.message);
    else console.log("Đã kết nối thành công vào database SQLite!");
});

// ==========================================
// CÂU [TS-2.3]: API QUẢN LÝ NGƯỜI DÙNG (DÀNH CHO ADMIN)
// ==========================================

// 1. API lấy danh sách toàn bộ người dùng để hiện lên bảng Admin
app.get('/api/users', (req, res) => {
    const sql = "SELECT MaND, HoTen, Email, MaVaiTro, TrangThai FROM NguoiDung";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows }); // Trả dữ liệu về cho Frontend của Khoa hiển thị
    });
});

// 2. API Khóa / Mở khóa tài khoản nhân viên
app.put('/api/users/toggle-status', (req, res) => {
    const { maND, trangThaiMoi } = req.body; // Nhận dữ liệu từ Frontend gửi lên
    const sql = "UPDATE NguoiDung SET TrangThai = ? WHERE MaND = ?";
    
    db.run(sql, [trangThaiMoi, maND], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Cập nhật trạng thái tài khoản thành công!" });
    });
});

// Chạy server ở cổng 5000
app.listen(5000, () => {
    console.log("Server API đang chạy tại cổng 5000...");
});

// API Đăng ký
app.post('/api/register', (req, res) => {

    const { HoTen, Email, MatKhau } = req.body;

    if (!HoTen || !Email || !MatKhau) {
        return res.json({
            success: false,
            message: "Vui lòng nhập đầy đủ thông tin."
        });
    }

    // Kiểm tra email đã tồn tại chưa
    const checkSql = "SELECT * FROM NguoiDung WHERE Email = ?";

    db.get(checkSql, [Email], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (row) {
            return res.json({
                success: false,
                message: "Email đã tồn tại!"
            });
        }

        // Thêm tài khoản mới
        const insertSql = `
        INSERT INTO NguoiDung
        (HoTen, Email, MatKhau, MaVaiTro, TrangThai)
        VALUES (?, ?, ?, 'USER', 'Hoạt động')
        `;

        db.run(insertSql, [HoTen, Email, MatKhau], function(err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Đăng ký thành công!"
            });

        });

    });

});

// API Đăng nhập
app.post('/api/login', (req, res) => {

    const { Email, MatKhau } = req.body;

    if (!Email || !MatKhau) {
        return res.json({
            success: false,
            message: "Vui lòng nhập Email và Mật khẩu."
        });
    }

    const sql = `
    SELECT MaND,
           HoTen,
           Email,
           MaVaiTro,
           TrangThai
    FROM NguoiDung
    WHERE Email = ?
    AND MatKhau = ?
    `;

    db.get(sql, [Email, MatKhau], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (!row) {
            return res.json({
                success: false,
                message: "Sai Email hoặc mật khẩu."
            });
        }

        if (row.TrangThai === "Bị khóa") {
            return res.json({
                success: false,
                message: "Tài khoản đã bị khóa."
            });
        }

        res.json({
            success: true,
            message: "Đăng nhập thành công.",
            user: row
        });

    });

});
