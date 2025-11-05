-- Database: db_universitas

CREATE DATABASE IF NOT EXISTS db_universitas;
USE db_universitas;

-- 1. Fakultas
CREATE TABLE fakultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_fakultas VARCHAR(100),
    dekan VARCHAR(100)
);

INSERT INTO fakultas (nama_fakultas, dekan) VALUES
('Fakultas Teknik', 'Dr. Ir. Bambang Santoso'),
('Fakultas Ekonomi', 'Dr. Siti Rahmawati'),
('Fakultas Ilmu Komputer', 'Dr. Wahyu Nugroho'),
('Fakultas Hukum', 'Dr. Rina Dewi');

-- 2. Jurusan
CREATE TABLE jurusan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fakultas_id INT,
    nama_jurusan VARCHAR(100),
    ketua_jurusan VARCHAR(100),
    FOREIGN KEY (fakultas_id) REFERENCES fakultas(id)
);

INSERT INTO jurusan (fakultas_id, nama_jurusan, ketua_jurusan) VALUES
(1, 'Teknik Sipil', 'Ir. Dedi Prasetyo'),
(1, 'Teknik Elektro', 'Ir. Rudi Kurniawan'),
(3, 'Informatika', 'Dr. Andi Rahmat'),
(3, 'Sistem Informasi', 'Dr. Laila Fitriani'),
(2, 'Manajemen', 'Dr. Yuli Astuti'),
(2, 'Akuntansi', 'Dr. Iwan Hermawan');

-- 3. Dosen
CREATE TABLE dosen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100),
    nidn VARCHAR(20),
    email VARCHAR(100),
    jurusan_id INT,
    FOREIGN KEY (jurusan_id) REFERENCES jurusan(id)
);

INSERT INTO dosen (nama, nidn, email, jurusan_id) VALUES
('Dr. Rudi Kurniawan', '0112345678', 'rudi@univ.ac.id', 2),
('Dr. Laila Fitriani', '0112345679', 'laila@univ.ac.id', 4),
('Dr. Andi Rahmat', '0112345680', 'andi@univ.ac.id', 3),
('Dr. Yuli Astuti', '0112345681', 'yuli@univ.ac.id', 5),
('Dr. Iwan Hermawan', '0112345682', 'iwan@univ.ac.id', 6);

-- 4. Mahasiswa
CREATE TABLE mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20),
    nama VARCHAR(100),
    email VARCHAR(100),
    jurusan_id INT,
    angkatan YEAR,
    FOREIGN KEY (jurusan_id) REFERENCES jurusan(id)
);

INSERT INTO mahasiswa (nim, nama, email, jurusan_id, angkatan) VALUES
('20211001', 'Ahmad Fikri', 'fikri@univ.ac.id', 3, 2021),
('20211002', 'Sinta Ayu', 'sinta@univ.ac.id', 4, 2021),
('20211003', 'Bagus Pratama', 'bagus@univ.ac.id', 5, 2020),
('20221004', 'Rina Lestari', 'rina@univ.ac.id', 6, 2022),
('20201005', 'Yoga Saputra', 'yoga@univ.ac.id', 1, 2020),
('20201006', 'Tania Rahmah', 'tania@univ.ac.id', 2, 2020);

-- 5. Mata Kuliah
CREATE TABLE mata_kuliah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(10),
    nama_mk VARCHAR(100),
    sks INT,
    jurusan_id INT,
    FOREIGN KEY (jurusan_id) REFERENCES jurusan(id)
);

INSERT INTO mata_kuliah (kode_mk, nama_mk, sks, jurusan_id) VALUES
('IF101', 'Algoritma dan Pemrograman', 3, 3),
('IF102', 'Basis Data', 3, 3),
('SI101', 'Sistem Enterprise', 3, 4),
('MN101', 'Manajemen Umum', 2, 5),
('AK101', 'Akuntansi Dasar', 3, 6),
('TS101', 'Mekanika Tanah', 3, 1);

-- 6. Kelas
CREATE TABLE kelas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kelas VARCHAR(50),
    dosen_id INT,
    mata_kuliah_id INT,
    semester VARCHAR(10),
    FOREIGN KEY (dosen_id) REFERENCES dosen(id),
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id)
);

INSERT INTO kelas (nama_kelas, dosen_id, mata_kuliah_id, semester) VALUES
('IF-A', 3, 1, 'Ganjil'),
('IF-B', 2, 2, 'Genap'),
('SI-A', 2, 3, 'Ganjil'),
('MN-A', 4, 4, 'Genap'),
('AK-A', 5, 5, 'Ganjil');

-- 7. Jadwal
CREATE TABLE jadwal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kelas_id INT,
    hari VARCHAR(20),
    jam_mulai TIME,
    jam_selesai TIME,
    ruang VARCHAR(20),
    FOREIGN KEY (kelas_id) REFERENCES kelas(id)
);

INSERT INTO jadwal (kelas_id, hari, jam_mulai, jam_selesai, ruang) VALUES
(1, 'Senin', '08:00:00', '10:00:00', 'Lab 301'),
(2, 'Selasa', '10:00:00', '12:00:00', 'Lab 302'),
(3, 'Rabu', '13:00:00', '15:00:00', 'Ruang SI-1'),
(4, 'Kamis', '09:00:00', '11:00:00', 'Ruang MN-2'),
(5, 'Jumat', '08:00:00', '10:00:00', 'Ruang AK-3');

-- 8. Nilai
CREATE TABLE nilai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id INT,
    mata_kuliah_id INT,
    nilai_angka DECIMAL(4,2),
    nilai_huruf CHAR(2),
    semester VARCHAR(10),
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id),
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id)
);

INSERT INTO nilai (mahasiswa_id, mata_kuliah_id, nilai_angka, nilai_huruf, semester) VALUES
(1, 1, 85.00, 'A', 'Ganjil'),
(2, 2, 78.00, 'B', 'Genap'),
(3, 4, 90.00, 'A', 'Genap'),
(4, 5, 82.00, 'B', 'Ganjil'),
(5, 6, 70.00, 'C', 'Genap');

-- 9. User Akademik
CREATE TABLE user_akademik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(100),
    role ENUM('admin','dosen','mahasiswa')
);

INSERT INTO user_akademik (username, password, role) VALUES
('admin1', 'admin123', 'admin'),
('rudi', 'dosen123', 'dosen'),
('laila', 'dosen456', 'dosen'),
('fikri', 'mhs123', 'mahasiswa'),
('sinta', 'mhs456', 'mahasiswa');

-- 10. Pembayaran
CREATE TABLE pembayaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id INT,
    tanggal DATE,
    jumlah DECIMAL(12,2),
    keterangan VARCHAR(100),
    FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id)
);

INSERT INTO pembayaran (mahasiswa_id, tanggal, jumlah, keterangan) VALUES
(1, '2025-01-10', 3500000, 'UKT Semester Ganjil'),
(2, '2025-01-12', 3500000, 'UKT Semester Ganjil'),
(3, '2025-02-05', 4000000, 'UKT Semester Genap'),
(4, '2025-02-08', 4000000, 'UKT Semester Genap'),
(5, '2025-01-15', 3000000, 'UKT Semester Ganjil');
