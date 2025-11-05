// Main JavaScript file for University CRUD System

const API_URL = 'http://localhost:8080/universitas-crud/backend/api.php/records';

// Current page state
let currentPage = '';
let currentData = [];

// Table configurations
const tableConfigs = {
    fakultas: {
        title: 'Data Fakultas',
        icon: 'bi-building',
        columns: ['ID', 'Nama Fakultas', 'Dekan', 'Aksi'],
        fields: ['id', 'nama_fakultas', 'dekan']
    },
    jurusan: {
        title: 'Data Jurusan',
        icon: 'bi-diagram-3',
        columns: ['ID', 'Fakultas', 'Nama Jurusan', 'Ketua Jurusan', 'Aksi'],
        fields: ['id', 'fakultas_id', 'nama_jurusan', 'ketua_jurusan'],
        relation: { fakultas_id: 'fakultas' }
    },
    dosen: {
        title: 'Data Dosen',
        icon: 'bi-person-badge',
        columns: ['ID', 'Nama', 'NIDN', 'Email', 'Jurusan', 'Aksi'],
        fields: ['id', 'nama', 'nidn', 'email', 'jurusan_id'],
        relation: { jurusan_id: 'jurusan' }
    },
    mahasiswa: {
        title: 'Data Mahasiswa',
        icon: 'bi-people',
        columns: ['ID', 'NIM', 'Nama', 'Email', 'Jurusan', 'Angkatan', 'Aksi'],
        fields: ['id', 'nim', 'nama', 'email', 'jurusan_id', 'angkatan'],
        relation: { jurusan_id: 'jurusan' }
    },
    mata_kuliah: {
        title: 'Data Mata Kuliah',
        icon: 'bi-book',
        columns: ['ID', 'Kode MK', 'Nama MK', 'SKS', 'Jurusan', 'Aksi'],
        fields: ['id', 'kode_mk', 'nama_mk', 'sks', 'jurusan_id'],
        relation: { jurusan_id: 'jurusan' }
    },
    kelas: {
        title: 'Data Kelas',
        icon: 'bi-door-open',
        columns: ['ID', 'Nama Kelas', 'Dosen', 'Mata Kuliah', 'Semester', 'Aksi'],
        fields: ['id', 'nama_kelas', 'dosen_id', 'mata_kuliah_id', 'semester'],
        relation: { dosen_id: 'dosen', mata_kuliah_id: 'mata_kuliah' }
    },
    jadwal: {
        title: 'Data Jadwal',
        icon: 'bi-calendar-week',
        columns: ['ID', 'Kelas', 'Hari', 'Jam Mulai', 'Jam Selesai', 'Ruang', 'Aksi'],
        fields: ['id', 'kelas_id', 'hari', 'jam_mulai', 'jam_selesai', 'ruang'],
        relation: { kelas_id: 'kelas' }
    },
    nilai: {
        title: 'Data Nilai',
        icon: 'bi-clipboard-data',
        columns: ['ID', 'Mahasiswa', 'Mata Kuliah', 'Nilai Angka', 'Nilai Huruf', 'Semester', 'Aksi'],
        fields: ['id', 'mahasiswa_id', 'mata_kuliah_id', 'nilai_angka', 'nilai_huruf', 'semester'],
        relation: { mahasiswa_id: 'mahasiswa', mata_kuliah_id: 'mata_kuliah' }
    },
    pembayaran: {
        title: 'Data Pembayaran',
        icon: 'bi-credit-card',
        columns: ['ID', 'Mahasiswa', 'Tanggal', 'Jumlah', 'Keterangan', 'Aksi'],
        fields: ['id', 'mahasiswa_id', 'tanggal', 'jumlah', 'keterangan'],
        relation: { mahasiswa_id: 'mahasiswa' }
    },
    user_akademik: {
        title: 'Data User Akademik',
        icon: 'bi-person-lock',
        columns: ['ID', 'Username', 'Password', 'Role', 'Aksi'],
        fields: ['id', 'username', 'password', 'role']
    }
};

// Load page content
async function loadPage(page) {
    currentPage = page;

    // Update active menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase().includes(page.replace('_', ' '))) {
            link.classList.add('active');
        }
    });

    const contentDiv = document.getElementById('content');

    if (page === 'dashboard') {
        loadDashboard();
    } else if (tableConfigs[page]) {
        loadTablePage(page);
    }
}

// Load dashboard
async function loadDashboard() {
    const contentDiv = document.getElementById('content');

    // Fetch counts for statistics
    const stats = await Promise.all([
        fetchData('fakultas'),
        fetchData('jurusan'),
        fetchData('dosen'),
        fetchData('mahasiswa')
    ]);

    contentDiv.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2"><i class="bi bi-speedometer2"></i> Dashboard</h1>
        </div>
        
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card stat-card primary">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="stat-label">Fakultas</div>
                                <div class="stat-number">${stats[0].records.length || 0}</div>
                            </div>
                            <div class="col-auto">
                                <i class="bi bi-building fs-1 text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card stat-card success">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="stat-label">Jurusan</div>
                                <div class="stat-number">${stats[1].records.length || 0}</div>
                            </div>
                            <div class="col-auto">
                                <i class="bi bi-diagram-3 fs-1 text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card stat-card info">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="stat-label">Dosen</div>
                                <div class="stat-number">${stats[2].records.length || 0}</div>
                            </div>
                            <div class="col-auto">
                                <i class="bi bi-person-badge fs-1 text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card stat-card warning">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="stat-label">Mahasiswa</div>
                                <div class="stat-number">${stats[3].records.length || 0}</div>
                            </div>
                            <div class="col-auto">
                                <i class="bi bi-people fs-1 text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <i class="bi bi-info-circle"></i> Informasi Sistem
            </div>
            <div class="card-body">
                <h5 class="card-title">Selamat Datang di Sistem Informasi Universitas</h5>
                <p class="card-text">
                    Sistem ini menyediakan fitur CRUD (Create, Read, Update, Delete) untuk mengelola data:
                </p>
                <ul>
                    <li>Master Data: Fakultas, Jurusan, Dosen, Mahasiswa, Mata Kuliah</li>
                    <li>Akademik: Kelas, Jadwal, Nilai</li>
                    <li>Administrasi: Pembayaran, User Akademik</li>
                </ul>
                <p class="text-muted">
                    <small>Gunakan menu di sebelah kiri untuk navigasi ke halaman yang diinginkan.</small>
                </p>
            </div>
        </div>
    `;
}

// Load table page
async function loadTablePage(table) {
    const config = tableConfigs[table];
    const contentDiv = document.getElementById('content');

    contentDiv.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2"><i class="${config.icon}"></i> ${config.title}</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <button class="btn btn-primary" onclick="showAddForm('${table}')">
                    <i class="bi bi-plus-circle"></i> Tambah Data
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="search-box">
                            <input type="text" class="form-control" id="searchInput" 
                                   placeholder="Cari data..." onkeyup="searchTable()">
                            <i class="bi bi-search search-icon"></i>
                        </div>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <div class="loading">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Load data
    const data = await fetchData(table);
    currentData = data.records || [];
    renderTable(table, currentData);
}

// Fetch data from API
async function fetchData(table) {
    try {
        const response = await fetch(`${API_URL}/${table}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Error loading data: ' + error.message, 'danger');
        return { records: [], results: 0 };
    }
}

// Render table
function renderTable(table, data) {
    const config = tableConfigs[table];
    const tableContainer = document.querySelector('.table-responsive');

    if (data.length === 0) {
        tableContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> Tidak ada data tersedia
            </div>
        `;
        return;
    }

    let tableHTML = `
        <table class="table table-hover">
            <thead>
                <tr>
                    ${config.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(row => {
        tableHTML += '<tr>';
        config.fields.forEach(field => {
            if (field === 'id') {
                tableHTML += `<td>${row[field]}</td>`;
            } else if (config.relation && config.relation[field]) {
                // For foreign keys, show ID for now (can be enhanced to show related data)
                tableHTML += `<td>${row[field] || '-'}</td>`;
            } else if (field === 'jumlah') {
                // Format currency for payment amount
                const amount = parseFloat(row[field]) || 0;
                tableHTML += `<td>Rp ${amount.toLocaleString('id-ID')}</td>`;
            } else if (field === 'password') {
                // Hide password
                tableHTML += `<td>••••••••</td>`;
            } else {
                tableHTML += `<td>${row[field] || '-'}</td>`;
            }
        });

        tableHTML += `
            <td>
                <button class="btn btn-sm btn-warning btn-action" onclick="showEditForm('${table}', ${row.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteRecord('${table}', ${row.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Show add form
async function showAddForm(table) {
    const config = tableConfigs[table];
    const modal = new bootstrap.Modal(document.getElementById('formModal'));

    document.getElementById('modalTitle').innerHTML = `<i class="bi bi-plus-circle"></i> Tambah ${config.title}`;

    let formHTML = await generateForm(table, null);
    formHTML += `
        <div class="text-end">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary" onclick="saveRecord('${table}', null)">
                <i class="bi bi-save"></i> Simpan
            </button>
        </div>
    `;

    document.getElementById('modalBody').innerHTML = formHTML;
    modal.show();
}

// Show edit form
async function showEditForm(table, id) {
    const config = tableConfigs[table];
    const modal = new bootstrap.Modal(document.getElementById('formModal'));

    document.getElementById('modalTitle').innerHTML = `<i class="bi bi-pencil"></i> Edit ${config.title}`;

    // Fetch record data
    const response = await fetch(`${API_URL}/${table}/${id}`);
    const record = await response.json();

    let formHTML = await generateForm(table, record);
    formHTML += `
        <div class="text-end">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary" onclick="saveRecord('${table}', ${id})">
                <i class="bi bi-save"></i> Update
            </button>
        </div>
    `;

    document.getElementById('modalBody').innerHTML = formHTML;
    modal.show();
}

// Generate form fields
async function generateForm(table, record) {
    const config = tableConfigs[table];
    let formHTML = '<form id="dataForm">';

    for (let field of config.fields) {
        if (field === 'id') continue;

        const value = record ? record[field] || '' : '';
        const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        formHTML += `<div class="mb-3">`;
        formHTML += `<label for="${field}" class="form-label">${fieldLabel}</label>`;

        if (config.relation && config.relation[field]) {
            // Create dropdown for foreign keys
            const relatedTable = config.relation[field];
            const relatedData = await fetchData(relatedTable);

            formHTML += `<select class="form-select" id="${field}" name="${field}" required>`;
            formHTML += `<option value="">Pilih ${fieldLabel}</option>`;

            relatedData.records.forEach(item => {
                const selected = value == item.id ? 'selected' : '';
                let displayText = item.id;

                // Show meaningful text based on table
                if (relatedTable === 'fakultas') {
                    displayText = item.nama_fakultas;
                } else if (relatedTable === 'jurusan') {
                    displayText = item.nama_jurusan;
                } else if (relatedTable === 'dosen') {
                    displayText = item.nama;
                } else if (relatedTable === 'mahasiswa') {
                    displayText = `${item.nim} - ${item.nama}`;
                } else if (relatedTable === 'mata_kuliah') {
                    displayText = `${item.kode_mk} - ${item.nama_mk}`;
                } else if (relatedTable === 'kelas') {
                    displayText = item.nama_kelas;
                }

                formHTML += `<option value="${item.id}" ${selected}>${displayText}</option>`;
            });

            formHTML += `</select>`;
        } else if (field === 'role') {
            // Dropdown for role
            formHTML += `<select class="form-select" id="${field}" name="${field}" required>`;
            formHTML += `<option value="">Pilih Role</option>`;
            formHTML += `<option value="admin" ${value === 'admin' ? 'selected' : ''}>Admin</option>`;
            formHTML += `<option value="dosen" ${value === 'dosen' ? 'selected' : ''}>Dosen</option>`;
            formHTML += `<option value="mahasiswa" ${value === 'mahasiswa' ? 'selected' : ''}>Mahasiswa</option>`;
            formHTML += `</select>`;
        } else if (field === 'semester') {
            // Dropdown for semester
            formHTML += `<select class="form-select" id="${field}" name="${field}" required>`;
            formHTML += `<option value="">Pilih Semester</option>`;
            formHTML += `<option value="Ganjil" ${value === 'Ganjil' ? 'selected' : ''}>Ganjil</option>`;
            formHTML += `<option value="Genap" ${value === 'Genap' ? 'selected' : ''}>Genap</option>`;
            formHTML += `</select>`;
        } else if (field === 'hari') {
            // Dropdown for days
            const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            formHTML += `<select class="form-select" id="${field}" name="${field}" required>`;
            formHTML += `<option value="">Pilih Hari</option>`;
            days.forEach(day => {
                formHTML += `<option value="${day}" ${value === day ? 'selected' : ''}>${day}</option>`;
            });
            formHTML += `</select>`;
        } else if (field === 'angkatan') {
            // Year input
            formHTML += `<input type="number" class="form-control" id="${field}" name="${field}" 
                         value="${value}" min="2000" max="2030" required>`;
        } else if (field === 'sks') {
            // Number input for SKS
            formHTML += `<input type="number" class="form-control" id="${field}" name="${field}" 
                         value="${value}" min="1" max="6" required>`;
        } else if (field === 'nilai_angka') {
            // Number input for grade
            formHTML += `<input type="number" class="form-control" id="${field}" name="${field}" 
                         value="${value}" min="0" max="100" step="0.01" required>`;
        } else if (field === 'nilai_huruf') {
            // Dropdown for letter grade
            const grades = ['A', 'B', 'C', 'D', 'E'];
            formHTML += `<select class="form-select" id="${field}" name="${field}" required>`;
            formHTML += `<option value="">Pilih Nilai</option>`;
            grades.forEach(grade => {
                formHTML += `<option value="${grade}" ${value === grade ? 'selected' : ''}>${grade}</option>`;
            });
            formHTML += `</select>`;
        } else if (field === 'tanggal') {
            // Date input
            formHTML += `<input type="date" class="form-control" id="${field}" name="${field}" 
                         value="${value}" required>`;
        } else if (field === 'jumlah') {
            // Number input for amount
            formHTML += `<input type="number" class="form-control" id="${field}" name="${field}" 
                         value="${value}" min="0" step="1000" required>`;
        } else if (field.includes('jam')) {
            // Time input
            formHTML += `<input type="time" class="form-control" id="${field}" name="${field}" 
                         value="${value}" required>`;
        } else if (field === 'email') {
            // Email input
            formHTML += `<input type="email" class="form-control" id="${field}" name="${field}" 
                         value="${value}" required>`;
        } else if (field === 'password') {
            // Password input
            formHTML += `<input type="password" class="form-control" id="${field}" name="${field}" 
                         value="${value}" ${record ? '' : 'required'} 
                         placeholder="${record ? 'Kosongkan jika tidak ingin mengubah' : ''}">`;
        } else {
            // Default text input
            formHTML += `<input type="text" class="form-control" id="${field}" name="${field}" 
                         value="${value}" required>`;
        }

        formHTML += `</div>`;
    }

    formHTML += '</form>';
    return formHTML;
}

// Save record (create or update)
async function saveRecord(table, id) {
    const form = document.getElementById('dataForm');
    const formData = new FormData(form);
    const data = {};

    // Convert FormData to JSON
    formData.forEach((value, key) => {
        if (value !== '') {
            data[key] = value;
        }
    });

    // Skip password field if empty on update
    if (id && table === 'user_akademik' && !data.password) {
        delete data.password;
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${table}/${id}` : `${API_URL}/${table}`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save data');
        }

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('formModal')).hide();

        // Show success message
        showAlert(`Data berhasil ${id ? 'diupdate' : 'ditambahkan'}`, 'success');

        // Reload table
        loadTablePage(table);
    } catch (error) {
        console.error('Error saving data:', error);
        showAlert('Error: ' + error.message, 'danger');
    }
}

// Delete record
async function deleteRecord(table, id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${table}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete data');
        }

        showAlert('Data berhasil dihapus', 'success');
        loadTablePage(table);
    } catch (error) {
        console.error('Error deleting data:', error);
        showAlert('Error: ' + error.message, 'danger');
    }
}

// Search table
function searchTable() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = currentData.filter(row => {
        return Object.values(row).some(value =>
            String(value).toLowerCase().includes(searchValue)
        );
    });
    renderTable(currentPage, filteredData);
}

// Show alert message
function showAlert(message, type) {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
             style="z-index: 9999;" role="alert">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', alertHTML);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 3000);
}
