'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import 'bootstrap/dist/css/bootstrap.min.css';

interface AttendanceEntry {
    id: number;
    idKaryawan: string;
    tanggal: string;
    jam_masuk: string;
    foto_masuk: string;
    latitude_masuk: number;
    longitude_masuk: number;
    status: string;
}

interface Employee {
    id: string;
    nama_karyawan: string;
}

const Hadir = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [newEntry, setNewEntry] = useState<{
        id?: number;
        idKaryawan: string;
        tanggal: Date | null;
        jam_masuk: Date;
        status: string;
        foto_masuk: string | File | null;
        latitude_masuk: number;
        longitude_masuk: number;
    }>({
        id: undefined,
        idKaryawan: '',
        tanggal: null,
        jam_masuk: new Date(),
        status: 'Tepat Waktu',
        foto_masuk: null,
        latitude_masuk: -7.636952968680463,
        longitude_masuk: 111.54260035904063,
    });

    const [isEditing, setIsEditing] = useState(false);
    const toast = useRef<Toast>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchEmployees();
        fetchAttendance();
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:8000/api/karyawan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data karyawan.', life: 3000 });
        }
    };

    const fetchAttendance = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:8000/api/absensi', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const attendanceData = response.data.map((entry: any) => ({
                id: entry.id,
                idKaryawan: entry.id_karyawan.toString(),
                tanggal: entry.tanggal,
                jam_masuk: entry.jam_masuk,
                foto_masuk: entry.foto_masuk,
                latitude_masuk: entry.latitude_masuk,
                longitude_masuk: entry.longitude_masuk,
                status: entry.status,
            }));
            setAttendance(attendanceData);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data absensi.', life: 3000 });
        }
    };

    const handleShowForm = () => {
        setIsEditing(false);
        setFormVisible(true);
        setNewEntry({
            idKaryawan: '',
            tanggal: null,
            jam_masuk: new Date(),
            status: 'Tepat Waktu',
            foto_masuk: null,
            latitude_masuk: -7.636952968680463,
            longitude_masuk: 111.54260035904063,
        });
    };

    const handleEdit = (attendance: AttendanceEntry) => {
        setIsEditing(true);
        setFormVisible(true);
        setNewEntry({
            id: attendance.id,
            idKaryawan: attendance.idKaryawan,
            tanggal: new Date(attendance.tanggal),
            jam_masuk: new Date(`1970-01-01T${attendance.jam_masuk}`),
            status: attendance.status,
            foto_masuk: attendance.foto_masuk,
            latitude_masuk: attendance.latitude_masuk ?? -7.636952968680463,
            longitude_masuk: attendance.longitude_masuk ?? 111.54260035904063,
        });
    };

    const handleDelete = async (attendanceId: number) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:8000/api/absensi/${attendanceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data absensi berhasil dihapus!', life: 3000 });
            fetchAttendance();
        } catch (error) {
            console.error('Error deleting attendance:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus data absensi.', life: 3000 });
        }
    };

    const handleSubmit = async () => {
        if (!newEntry.idKaryawan || !newEntry.tanggal || !newEntry.jam_masuk) {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Semua field harus diisi.', life: 3000 });
            return;
        }
    
        const formattedTanggal = newEntry.tanggal instanceof Date && !isNaN(newEntry.tanggal.getTime())
            ? newEntry.tanggal.toISOString().split('T')[0]
            : '';
    
        const formattedJamMasuk = newEntry.jam_masuk.toTimeString().split(' ')[0].slice(0, 5);
    
        const latitude = Number(newEntry.latitude_masuk);
        const longitude = Number(newEntry.longitude_masuk);
    
        if (isNaN(latitude) || isNaN(longitude)) {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Latitude dan longitude harus berupa angka yang valid.', life: 3000 });
            return;
        }
    
        // Convert the photo to Base64 if it exists
        let fotoMasukBase64 = '';
        if (newEntry.foto_masuk && newEntry.foto_masuk instanceof File) {
            const maxFileSize = 20 * 1024 * 1024; // 20 MB in bytes
            if (newEntry.foto_masuk.size > maxFileSize) {
                toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Ukuran foto melebihi 20 MB.', life: 3000 });
                return;
            }
            fotoMasukBase64 = await convertToBase64(newEntry.foto_masuk) as string;
    
            // Check if the length of the Base64 string exceeds a certain limit
            const maxLength = 255; // Adjust this to match your database's column size
            if (fotoMasukBase64.length > maxLength) {
                fotoMasukBase64 = fotoMasukBase64.substring(0, maxLength);
            }
        }
    
        const newAttendanceData = {
            id_karyawan: newEntry.idKaryawan,
            tanggal: formattedTanggal,
            jam_masuk: formattedJamMasuk,
            foto_masuk: fotoMasukBase64,
            latitude_masuk: latitude,
            longitude_masuk: longitude,
            status: newEntry.status,
        };
    
        const token = localStorage.getItem('authToken');
        try {
            const url = isEditing
                ? `http://localhost:8000/api/absensi/${newEntry.id}`
                : 'http://localhost:8000/api/absensi';
    
            const method = isEditing ? 'put' : 'post';
    
            const response = await axios({
                method,
                url,
                data: newAttendanceData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200 || response.status === 201) {
                fetchAttendance();
                setFormVisible(false);
                setNewEntry({
                    idKaryawan: '',
                    tanggal: null,
                    jam_masuk: new Date(),
                    status: 'Tepat Waktu',
                    foto_masuk: null,
                    latitude_masuk: 0,
                    longitude_masuk: 0,
                });
    
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data absensi berhasil disimpan!', life: 3000 });
            }
        } catch (error: any) {
            console.error('Error saving attendance:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Gagal menyimpan data absensi: ${error.response.data.message || 'Periksa data Anda.'}`, life: 3000 });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data absensi.', life: 3000 });
            }
        }
    };
    
    const convertToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const getEmployeeNameById = (idKaryawan: string) => {
        const employee = employees.find(emp => emp.id.toString() === idKaryawan);
        return employee ? employee.nama_karyawan : 'Tidak Diketahui';
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Absensi Karyawan</h5>
                    <Button label="Tambah" icon="pi pi-plus" className="mb-3" onClick={handleShowForm} />

                    <CSSTransition 
                        nodeRef={formRef} 
                        in={isFormVisible} 
                        timeout={300} 
                        classNames="fade" 
                        unmountOnExit
                    >
                        <div ref={formRef} className="p-fluid grid formgrid">
                            <div className="field col-4">
                                <label htmlFor="karyawan">Pilih Karyawan</label>
                                <Dropdown 
                                    id="karyawan" 
                                    value={newEntry.idKaryawan} 
                                    options={employees.map(emp => ({ label: emp.nama_karyawan, value: emp.id }))} 
                                    onChange={(e) => setNewEntry({ ...newEntry, idKaryawan: e.value })} 
                                    placeholder="Pilih Karyawan" 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="tanggal">Tanggal</label>
                                <Calendar 
                                    id="tanggal" 
                                    value={newEntry.tanggal} 
                                    onChange={(e) => setNewEntry({ ...newEntry, tanggal: e.value || null })} 
                                    dateFormat="yy-mm-dd" 
                                    showIcon 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="jamMasuk">Jam Masuk</label>
                                <input 
                                    type="time" 
                                    id="jamMasuk" 
                                    value={newEntry.jam_masuk.toTimeString().split(' ')[0]} 
                                    onChange={(e) => setNewEntry({ ...newEntry, jam_masuk: new Date(`1970-01-01T${e.target.value}:00`) })} 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="status">Status</label>
                                <Dropdown 
                                    id="status" 
                                    value={newEntry.status} 
                                    options={[{ label: 'Tepat Waktu', value: 'Tepat Waktu' }, { label: 'Terlambat', value: 'Terlambat' }]} 
                                    onChange={(e) => setNewEntry({ ...newEntry, status: e.value })} 
                                    placeholder="Pilih Status" 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="fotoMasuk">Foto Masuk</label>
                                <input 
                                    type="file" 
                                    id="fotoMasuk" 
                                    onChange={(e) => setNewEntry({ ...newEntry, foto_masuk: e.target.files ? e.target.files[0] : null })} 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="latitude">Latitude</label>
                                <input 
                                    type="number" 
                                    id="latitude" 
                                    value={newEntry.latitude_masuk} 
                                    readOnly 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="longitude">Longitude</label>
                                <input 
                                    type="number" 
                                    id="longitude" 
                                    value={newEntry.longitude_masuk} 
                                    readOnly 
                                />
                            </div>
                            <div className="field col-12">
                                <Button label="Simpan" icon="pi pi-check" onClick={handleSubmit} />
                                <Button label="Batal" icon="pi pi-times" className="ml-2" onClick={() => setFormVisible(false)} />
                            </div>
                        </div>
                    </CSSTransition>

                    <DataTable value={attendance} paginator rows={10} header="Daftar Absensi" className="mt-3">
    <Column field="idKaryawan" header="Karyawan" body={(rowData) => getEmployeeNameById(rowData.idKaryawan)} />
    <Column field="tanggal" header="Tanggal" />
    <Column field="jam_masuk" header="Jam Masuk" />
    <Column field="status" header="Status" />
    <Column 
        header="Aksi" 
        body={(rowData) => (
            <div className="d-flex">
                <Button label="Edit" icon="pi pi-pencil" onClick={() => handleEdit(rowData)} className="mr-2 p-button-success" />
                <Button label="Delete" icon="pi pi-trash" onClick={() => handleDelete(rowData.id)} className="p-button-danger" />
            </div>
        )} 
    />
</DataTable>

                </div>
            </div>
        </div>
    );
};

export default Hadir;