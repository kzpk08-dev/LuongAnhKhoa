from flask import Flask, render_template, request, redirect, url_for
import sqlite3 # Đổi từ pyodbc sang sqlite3 có sẵn của Python

app = Flask(__name__)

# ==========================================
# HÀM KHỞI TẠO TỰ ĐỘNG CƠ SỞ DỮ LIỆU
# ==========================================
def init_db():
    # Tự động tạo file database.db trong cùng thư mục
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    # Tự động tạo bảng nếu chưa có
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS MeetingRooms (
            RoomID INTEGER PRIMARY KEY AUTOINCREMENT,
            RoomName TEXT NOT NULL,
            Capacity INTEGER,
            Equipment TEXT,
            Status TEXT DEFAULT 'Active'
        )
    ''')
    conn.commit()
    conn.close()

# Gọi hàm khởi tạo ngay khi code chạy
init_db()

# ==========================================
# 1. CHỨC NĂNG XEM DANH SÁCH PHÒNG
# ==========================================
@app.route('/')
def quan_ly_phong():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute("SELECT RoomID, RoomName, Capacity, Equipment, Status FROM MeetingRooms")
        danh_sach_phong = cursor.fetchall()
        conn.close()
        return render_template('giaodien_quanly.html', phongs=danh_sach_phong)
    except Exception as e:
        return f"Lỗi: {e}"

# ==========================================
# 2. CHỨC NĂNG THÊM PHÒNG MỚI
# ==========================================
@app.route('/them-phong', methods=['POST'])
def them_phong():
    ten = request.form['ten_phong']
    cho_ngoi = request.form['so_cho']
    thiet_bi = request.form['thiet_bi']
    
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO MeetingRooms (RoomName, Capacity, Equipment, Status)
        VALUES (?, ?, ?, 'Active')
    """, (ten, cho_ngoi, thiet_bi))
    
    conn.commit()
    conn.close()
    return redirect(url_for('quan_ly_phong'))

# ==========================================
# 3. CHỨC NĂNG SỬA THÔNG TIN PHÒNG
# ==========================================
@app.route('/sua-phong/<int:id>', methods=['POST'])
def sua_phong(id):
    ten = request.form['ten_phong']
    cho_ngoi = request.form['so_cho']
    thiet_bi = request.form['thiet_bi']
    trang_thai = request.form['trang_thai'] 
    
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE MeetingRooms 
        SET RoomName = ?, Capacity = ?, Equipment = ?, Status = ?
        WHERE RoomID = ?
    """, (ten, cho_ngoi, thiet_bi, trang_thai, id))
    
    conn.commit()
    conn.close()
    return redirect(url_for('quan_ly_phong'))

# ==========================================
# 4. CHỨC NĂNG XÓA PHÒNG
# ==========================================
@app.route('/xoa-phong/<int:id>')
def xoa_phong(id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    # Chú ý: (id,) là bắt buộc trong SQLite để truyền 1 biến
    cursor.execute("DELETE FROM MeetingRooms WHERE RoomID = ?", (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('quan_ly_phong'))

# ==========================================
# KHỞI CHẠY SERVER
# ==========================================
if __name__ == '__main__':
    app.run(debug=True)
