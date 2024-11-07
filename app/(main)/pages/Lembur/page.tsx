'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

interface OvertimeEntry {
    no: number;
    idKaryawan: string;
    nama: string;
    tanggalLembur: string;
    jamLembur: number;
    upahLembur: number;
}

interface Employee {
    id: string;
    nama_karyawan: string;
}

const Lembur = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [overtime, setOvertime] = useState<OvertimeEntry[]>([]);
    const [newEntry, setNewEntry] = useState<{
        idKaryawan: string;
        nama: string;
        tanggalLembur: Date | null;
        jamLembur: number;
        upahLembur: number;
    }>({
        idKaryawan: '',
        nama: '',
        tanggalLembur: null,
        jamLembur: 0,
        upahLembur: 0,
    });
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [editingEntry, setEditingEntry] = useState<OvertimeEntry | null>(null);
    const toast = useRef<Toast>(null);

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
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data karyawan.', life: 3000 });
        }
    };

    const getEmployeeNameById = (idKaryawan: string) => {
        const employee = employees.find((emp) => emp.id === idKaryawan);
        return employee ? employee.nama_karyawan : 'Unknown';
    };

    const handleDialogOpen = () => {
        setNewEntry({ idKaryawan: '', nama: '', tanggalLembur: null, jamLembur: 0, upahLembur: 0 });
        setEditingEntry(null); // Reset entry ketika membuka dialog
        setDialogVisible(true);
    };

    const formatTime = (hours: number) => {
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        const s = Math.round(((hours - h) * 60 - m) * 60);
        return `${h} jam ${m} menit ${s} detik`;
    };    

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };    

    const handleSubmit = async () => {
        // Validasi
        if (!newEntry.idKaryawan || !newEntry.tanggalLembur || newEntry.jamLembur <= 0 || newEntry.upahLembur <= 0) {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Semua field harus diisi dengan benar.', life: 3000 });
            return;
        }

        const newOvertime: OvertimeEntry = {
            no: editingEntry ? editingEntry.no : overtime.length + 1, // Gunakan no yang sama jika sedang mengedit
            idKaryawan: newEntry.idKaryawan,
            nama: getEmployeeNameById(newEntry.idKaryawan),
            tanggalLembur: newEntry.tanggalLembur?.toISOString().split('T')[0] || '', // Tambahkan penanganan untuk null
            jamLembur: newEntry.jamLembur,
            upahLembur: newEntry.upahLembur,
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = editingEntry 
                ? await axios.put(`http://localhost:8000/api/lembur/${editingEntry.no}`, newOvertime, { // Update jika sedang mengedit
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                : await axios.post('http://localhost:8000/api/lembur', newOvertime, { // Tambah jika baru
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200 || response.status === 201) {
                setOvertime((prevOvertime) => {
                    if (editingEntry) {
                        return prevOvertime.map((entry) => entry.no === editingEntry.no ? newOvertime : entry); // Update data lembur
                    } else {
                        return [...prevOvertime, newOvertime]; // Tambah data lembur baru
                    }
                });
                setDialogVisible(false);
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data lembur berhasil disimpan!', life: 3000 });
            } else {
                console.error('Gagal menyimpan data lembur:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data lembur.', life: 3000 });
        }
    };

    const handleEdit = (entry: OvertimeEntry) => {
        setEditingEntry(entry);
        setNewEntry({
            idKaryawan: entry.idKaryawan,
            nama: entry.nama,
            tanggalLembur: new Date(entry.tanggalLembur),
            jamLembur: entry.jamLembur,
            upahLembur: entry.upahLembur,
        });
        setDialogVisible(true);
    };

    const handleDelete = async (entry: OvertimeEntry) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:8000/api/lembur/${entry.no}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOvertime((prevOvertime) => prevOvertime.filter((o) => o.no !== entry.no));
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data lembur berhasil dihapus!', life: 3000 });
        } catch (error) {
            console.error('Error deleting overtime:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus data lembur.', life: 3000 });
        }
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Lembur Karyawan</h5>
                    <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button 
                            label="Tambah" 
                            icon="pi pi-plus" 
                            style={{ backgroundColor: '#003366', color: 'white' }} 
                            onClick={handleDialogOpen} 
                        />
                    </div>

                    <DataTable value={overtime} responsiveLayout="scroll" className="p-datatable-striped">
                        <Column 
                            field="no" 
                            header="No" 
                            className="text-center" 
                            style={{ width: '50px', textAlign: 'center' }} 
                        />
                        <Column 
                            field="tanggalLembur" 
                            header="Tanggal Lembur" 
                            className="text-center" 
                            style={{ width: '150px', textAlign: 'right' }} 
                        />
                        <Column 
                            field="jamLembur" 
                            header="Jam Lembur" 
                            body={(rowData) => formatTime(rowData.jamLembur)} 
                            className="text-center" 
                            style={{ width: '170px', textAlign: 'right' }} 
                        />
                        <Column 
                            field="upahLembur" 
                            header="Upah Lembur" 
                            body={(rowData) => formatCurrency(rowData.upahLembur)} 
                            className="text-center" 
                            style={{ width: '150px', textAlign: 'right' }} 
                        />
                        <Column
                            header="Aksi"
                            body={(rowData) => (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button 
                                        icon="pi pi-pencil" 
                                        className="mr-2 p-button-success" 
                                        onClick={() => handleEdit(rowData)} 
                                    />
                                    <Button 
                                        icon="pi pi-trash" 
                                        className="p-button-danger" 
                                        onClick={() => handleDelete(rowData)} 
                                    />
                                </div>
                            )}
                        />
                    </DataTable>

                    <Dialog 
                        visible={isDialogVisible} 
                        onHide={() => setDialogVisible(false)} 
                        header={editingEntry ? 'Edit Lembur' : 'Tambah Lembur'}
                        footer={
                            <div>
                                <Button label="Batal" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
                                <Button label="Simpan" icon="pi pi-check" onClick={handleSubmit} className="p-button" style={{ backgroundColor: '#003366', color: 'white' }} />
                            </div>
                        }
                    >
                        <div className="p-field">
                            <label htmlFor="idKaryawan">Karyawan</label>
                            <Dropdown
                                id="idKaryawan"
                                value={newEntry.idKaryawan}
                                options={employees}
                                onChange={(e) => setNewEntry({ ...newEntry, idKaryawan: e.value })}
                                optionLabel="nama_karyawan"
                                placeholder="Pilih Karyawan"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="tanggalLembur">Tanggal Lembur</label>
                            <Calendar
    id="tanggalLembur"
    value={newEntry.tanggalLembur ?? null}
    onChange={(e) => setNewEntry({ ...newEntry, tanggalLembur: e.value ?? null })}
    dateFormat="yy-mm-dd"
/>
                        </div>
                        <div className="p-field">
                            <label htmlFor="jamLembur">Jam Lembur</label>
                            <InputNumber
                                id="jamLembur"
                                value={newEntry.jamLembur}
                                onValueChange={(e) => setNewEntry({ ...newEntry, jamLembur: e.value || 0 })}
                                mode="decimal"
                                min={0}
                                max={24}
                                suffix=" jam"
                                step={0.25}
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="upahLembur">Upah Lembur</label>
                            <InputNumber
                                id="upahLembur"
                                value={newEntry.upahLembur}
                                onValueChange={(e) => setNewEntry({ ...newEntry, upahLembur: e.value || 0 })}
                                mode="currency"
                                currency="IDR"
                                locale="id-ID"
                            />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Lembur;
