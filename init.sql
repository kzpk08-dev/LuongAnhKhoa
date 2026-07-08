CREATE TABLE IF NOT EXISTS VaiTro (
    MaVaiTro TEXT PRIMARY KEY,
    TenVaiTro TEXT NOT NULL
);

INSERT OR IGNORE INTO VaiTro (MaVaiTro, TenVaiTro) VALUES 
('ADMIN', 'Quản trị viên'),
('MANAGER', 'Quản lý phòng họp (Meeting Manager)'),
('EMPLOYEE', 'Nhân viên');

CREATE TABLE IF NOT EXISTS NguoiDung (
    MaND INTEGER PRIMARY KEY AUTOINCREMENT,
    HoTen TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    MatKhau TEXT NOT NULL,
    MaVaiTro TEXT REFERENCES VaiTro(MaVaiTro) DEFAULT 'EMPLOYEE',
    TrangThai TEXT DEFAULT 'Hoạt động'
);