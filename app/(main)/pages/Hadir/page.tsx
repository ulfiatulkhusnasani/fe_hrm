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

interface AttendanceEntry {
    no: number;
    idKaryawan: string;
    nama: string;
    tanggal: string;
    timeIn: string;
    timeOut: string;
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
        idKaryawan: string;
        nama: string;
        tanggal: Date | null;
        timeIn: Date;
        timeOut: Date;
        status: string;
    }>({
        idKaryawan: '',
        nama: '',
        tanggal: null,
        timeIn: new Date(),
        timeOut: new Date(),
        status: 'Hadir',
    });

    const toast = useRef<Toast>(null);
    const nodeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem('authToken');
        console.log('Fetching employees with token:', token);
        try {
            const response = await axios.get('http://localhost:8000/api/karyawan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error response data:', error.response.data);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.message || 'Gagal mengambil data karyawan.', life: 3000 });
            } else {
                console.error('Error:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data karyawan.', life: 3000 });
            }
        }
    };

    const getEmployeeNameById = (idKaryawan: string) => {
        const employee = employees.find((emp) => emp.id === idKaryawan);
        return employee ? employee.nama_karyawan : 'Unknown';
    };

    const handleEmployeeChange = (e: { value: string }) => {
        const employee = employees.find((emp) => emp.id === e.value);
        setNewEntry((prev) => ({
            ...prev,
            idKaryawan: e.value,
            nama: employee?.nama_karyawan || '',
        }));
    };

    const handleShowForm = () => {
        setFormVisible(true);
        setNewEntry((prev) => ({
            ...prev,
            timeIn: new Date(),
            timeOut: new Date(),
        }));
    };

    const handleSubmit = async () => {
        console.log('Data yang dikirim:', newEntry);
        
        if (!newEntry.idKaryawan || !newEntry.tanggal || !newEntry.timeIn || !newEntry.timeOut) {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Semua field harus diisi.', life: 3000 });
            return;
        }

        if (newEntry.timeOut <= newEntry.timeIn) {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Jam keluar harus lebih besar dari jam masuk.', life: 3000 });
            return;
        }

        const isLate = newEntry.timeIn > new Date(newEntry.tanggal.setHours(9));
        const attendanceStatus = isLate ? 'late' : 'ontime';

        const newAttendance: AttendanceEntry = {
            no: attendance.length + 1,
            idKaryawan: newEntry.idKaryawan,
            nama: getEmployeeNameById(newEntry.idKaryawan),
            tanggal: newEntry.tanggal?.toISOString().split('T')[0],
            timeIn: newEntry.timeIn.toTimeString().split(' ')[0],
            timeOut: newEntry.timeOut.toTimeString().split(' ')[0],
            status: newEntry.status === 'Hadir' ? attendanceStatus : newEntry.status,
        };

        console.log('Data absensi yang dikirim ke server:', newAttendance);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:8000/api/absensi', newAttendance, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setAttendance((prevAttendance) => [...prevAttendance, newAttendance]);
                setFormVisible(false);
                setNewEntry({ idKaryawan: '', nama: '', tanggal: null, timeIn: new Date(), timeOut: new Date(), status: 'Hadir' });
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data absensi berhasil disimpan!', life: 3000 });
            } else {
                console.error('Gagal menyimpan data absensi:', response.statusText);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.message || 'Gagal menyimpan data absensi.', life: 3000 });
            } else {
                console.error('Error:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data absensi.', life: 3000 });
            }
        }        
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Absensi Karyawan</h5>
                    <Button label="Tambah" icon="pi pi-plus" className="mb-3" onClick={handleShowForm} />

                    <CSSTransition 
                        nodeRef={nodeRef} 
                        in={isFormVisible} 
                        timeout={300} 
                        classNames="fade" 
                        unmountOnExit
                    >
                        <div ref={nodeRef} className="p-fluid grid formgrid">
                            <div className="field col-4">
                                <label htmlFor="karyawan">Pilih Karyawan</label>
                                <Dropdown 
                                    id="karyawan" 
                                    value={newEntry.idKaryawan} 
                                    options={employees.map(emp => ({ label: emp.nama_karyawan, value: emp.id }))} 
                                    onChange={handleEmployeeChange} 
                                    placeholder="Pilih Karyawan" 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="tanggal">Tanggal</label>
                                <Calendar 
                                    id="tanggal" 
                                    value={newEntry.tanggal} 
                                    onChange={(e) => setNewEntry({ ...newEntry, tanggal: e.value as Date })} 
                                    showIcon 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="timeIn">Jam Masuk</label>
                                <Calendar 
                                    id="timeIn" 
                                    value={newEntry.timeIn} 
                                    onChange={(e) => setNewEntry({ ...newEntry, timeIn: e.value as Date })} 
                                    showTime timeOnly hourFormat="24" showIcon 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="timeOut">Jam Keluar</label>
                                <Calendar 
                                    id="timeOut" 
                                    value={newEntry.timeOut} 
                                    onChange={(e) => setNewEntry({ ...newEntry, timeOut: e.value as Date })} 
                                    showTime timeOnly hourFormat="24" showIcon 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="status">Status</label>
                                <Dropdown 
                                    id="status" 
                                    value={newEntry.status} 
                                    options={[
                                        { label: 'Hadir', value: 'Hadir' },
                                        { label: 'Izin', value: 'Izin' },
                                        { label: 'Alfa', value: 'Alfa' },
                                        { label: 'Sakit', value: 'Sakit' },
                                    ]} 
                                    onChange={(e) => setNewEntry({ ...newEntry, status: e.value })} 
                                />
                            </div>
                            <div className="field col-12">
                                <Button label="Simpan" icon="pi pi-check" onClick={handleSubmit} />
                            </div>
                        </div>
                    </CSSTransition>

                    <DataTable value={attendance} responsiveLayout="scroll">
                        <Column field="no" header="No" />
                        <Column field="idKaryawan" header="ID Karyawan" />
                        <Column field="nama" header="Nama" />
                        <Column field="tanggal" header="Tanggal" />
                        <Column field="timeIn" header="Jam Masuk" />
                        <Column field="timeOut" header="Jam Keluar" />
                        <Column field="status" header="Status" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Hadir;
