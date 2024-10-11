'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown'; 
import { Toast } from 'primereact/toast'; 
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

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
    const [isFormVisible, setFormVisible] = useState(false);
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
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data karyawan.', life: 3000 });
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
            tanggalLembur: new Date(),
        }));
    };

    const handleSubmit = async () => {
        console.log('Data yang dikirim:', newEntry);
        
        if (!newEntry.idKaryawan || !newEntry.tanggalLembur || newEntry.jamLembur <= 0 || newEntry.upahLembur <= 0) {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Semua field harus diisi dengan benar.', life: 3000 });
            return;
        }

        const newOvertime: OvertimeEntry = {
            no: overtime.length + 1,
            idKaryawan: newEntry.idKaryawan,
            nama: getEmployeeNameById(newEntry.idKaryawan),
            tanggalLembur: newEntry.tanggalLembur?.toISOString().split('T')[0],
            jamLembur: newEntry.jamLembur,
            upahLembur: newEntry.upahLembur,
        };

        console.log('Data lembur yang dikirim ke server:', newOvertime);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:8000/api/lembur', newOvertime, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setOvertime((prevOvertime) => [...prevOvertime, newOvertime]);
                setFormVisible(false);
                setNewEntry({ idKaryawan: '', nama: '', tanggalLembur: null, jamLembur: 0, upahLembur: 0 });
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data lembur berhasil disimpan!', life: 3000 });
            } else {
                console.error('Gagal menyimpan data lembur:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data lembur.', life: 3000 });
        }        
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Lembur Karyawan</h5>
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
                                <label htmlFor="tanggalLembur">Tanggal Lembur</label>
                                <Calendar 
                                    id="tanggalLembur" 
                                    value={newEntry.tanggalLembur} 
                                    onChange={(e) => setNewEntry({ ...newEntry, tanggalLembur: e.value as Date })} 
                                    showIcon 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="jamLembur">Jam Lembur</label>
                                <InputNumber 
                                    id="jamLembur" 
                                    value={newEntry.jamLembur} 
                                    onChange={(e) => setNewEntry({ ...newEntry, jamLembur: e.value || 0 })} 
                                    min={0}
                                    showButtons 
                                    mode="decimal" 
                                    useGrouping={false}
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="upahLembur">Upah Lembur</label>
                                <InputNumber 
                                    id="upahLembur" 
                                    value={newEntry.upahLembur} 
                                    onChange={(e) => setNewEntry({ ...newEntry, upahLembur: e.value || 0 })} 
                                    min={0} 
                                    showButtons 
                                    mode="currency" 
                                    currency="IDR"
                                    useGrouping={true}
                                />
                            </div>
                            <div className="field col-12">
                                <Button label="Simpan" icon="pi pi-check" onClick={handleSubmit} />
                            </div>
                        </div>
                    </CSSTransition>

                    <DataTable value={overtime} responsiveLayout="scroll">
                        <Column field="no" header="No" />
                        <Column field="idKaryawan" header="ID Karyawan" />
                        <Column field="nama" header="Nama" />
                        <Column field="tanggalLembur" header="Tanggal Lembur" />
                        <Column field="jamLembur" header="Jam Lembur" />
                        <Column field="upahLembur" header="Upah Lembur" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Lembur;
