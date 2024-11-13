"use client";

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
    id_karyawan: number;
    nama: string;
    tgl_lembur: string;
    jam_lembur: string;
    upah_lembur: number | null;
}

interface Employee {
    id: string;
    nama_karyawan: string;
}

const Lembur = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [overtime, setOvertime] = useState<OvertimeEntry[]>([]);
    const [newEntry, setNewEntry] = useState<{
        id_karyawan: number;
        nama: string;
        tgl_lembur: Date | null;
        jam_lembur: string;
    }>({
        id_karyawan: 0,
        nama: '',
        tgl_lembur: null,
        jam_lembur: '17:00:00',
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

    const getEmployeeNameById = (id_karyawan: number) => {
        const employee = employees.find((emp) => parseInt(emp.id) === id_karyawan);
        return employee ? employee.nama_karyawan : 'Unknown';
    };

    const handleDialogOpen = () => {
        setNewEntry({ id_karyawan: 0, nama: '', tgl_lembur: null, jam_lembur: '17:00:00' });
        setEditingEntry(null); // Reset entry ketika membuka dialog
        setDialogVisible(true);
    };

    const handleSubmit = async () => {
        // Validasi
        if (!newEntry.id_karyawan || !newEntry.tgl_lembur || newEntry.jam_lembur === '00:00:00') {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Field id_karyawan, tgl_lembur, dan jam_lembur harus diisi dengan benar.', life: 3000 });
            return;
        }

        const newOvertime: OvertimeEntry = {
            no: editingEntry ? editingEntry.no : overtime.length + 1,
            id_karyawan: newEntry.id_karyawan,
            nama: getEmployeeNameById(newEntry.id_karyawan),
            tgl_lembur: newEntry.tgl_lembur?.toISOString().split('T')[0] || '',
            jam_lembur: newEntry.jam_lembur,
            upah_lembur: null,
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = editingEntry
                ? await axios.put(`http://localhost:8000/api/lembur/${editingEntry.no}`, newOvertime, {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  })
                : await axios.post('http://localhost:8000/api/lembur', newOvertime, {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  });

            if (response.status === 200 || response.status === 201) {
                setOvertime((prevOvertime) => {
                    if (editingEntry) {
                        return prevOvertime.map((entry) =>
                            entry.no === editingEntry.no ? { ...entry, ...newOvertime } : entry
                        ) as OvertimeEntry[];
                    } else {
                        return [...prevOvertime, newOvertime] as OvertimeEntry[];
                    }
                });
                setDialogVisible(false);
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data lembur berhasil disimpan!', life: 3000 });
            } else {
                console.error('Gagal menyimpan data lembur:', response.statusText);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error Response Data:', error.response?.data);
            } else {
                console.error('Error:', error);
            }
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data lembur.', life: 3000 });
        }
    };

    const handleEdit = (entry: OvertimeEntry) => {
        setEditingEntry(entry);
        setNewEntry({
            id_karyawan: entry.id_karyawan,
            nama: entry.nama,
            tgl_lembur: new Date(entry.tgl_lembur),
            jam_lembur: entry.jam_lembur
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
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error Response Data:', error.response?.data);
            } else {
                console.error('Error:', error);
            }
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

                    <DataTable value={overtime} responsiveLayout="scroll" className="p-datatable-striped" style={{ padding: '1rem' }}>
    <Column 
        field="no" 
        header="No" 
        className="text-center" 
        style={{ width: '50px', textAlign: 'right', padding: '8px' }} 
    />
    <Column 
        field="tgl_lembur" 
        header="Tanggal Lembur" 
        className="text-center" 
        style={{ width: '150px', textAlign: 'right', padding: '8px' }} 
    />
    <Column 
        field="jam_lembur" 
        header="Jam Lembur" 
        className="text-center" 
        style={{ width: '100px', textAlign: 'right', padding: '8px' }} 
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
        style={{ width: '50px', textAlign: 'right', padding: '8px' }}
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
                                value={newEntry.id_karyawan}
                                options={employees}
                                onChange={(e) => setNewEntry({ ...newEntry, id_karyawan: parseInt(e.value || '0') })}
                                optionLabel="nama_karyawan"
                                optionValue="id"
                                placeholder="Pilih Karyawan"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="tgl_lembur">Tanggal Lembur</label>
                            <Calendar
                                id="tgl_lembur"
                                value={newEntry.tgl_lembur ?? null}
                                onChange={(e) => setNewEntry({ ...newEntry, tgl_lembur: e.value ?? null })}
                                dateFormat="yy-mm-dd"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="jam_lembur">Jam Lembur</label>
                            <InputNumber
                                id="jam_lembur"
                                value={parseInt(newEntry.jam_lembur.split(':')[0]) - 17}
                                onValueChange={(e) => {
                                    if (e.value != null) {
                                        const updatedHour = 17 + e.value;
                                        setNewEntry({ ...newEntry, jam_lembur: `${updatedHour.toString().padStart(2, '0')}:00:00` });
                                    }
                                }}
                                mode="decimal"
                                min={0}
                                max={24 - 17}
                                suffix=" jam"
                                step={1}
                            />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Lembur;
