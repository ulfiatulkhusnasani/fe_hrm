'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';

interface DinasLuarKotaEntry {
    no: number;
    id: string;
    nama: string;
    tanggalBerangkat: Date | null;
    tanggalKembali: Date | null;
    kotaTujuan: string;
    keperluan: string;
    biayaTransport: number;
    biayaPenginapan: number;
    uangHarian: number;
    totalBiaya: number;
}

interface Employee {
    id: string;
    nama_karyawan: string;
}

const DinasLuarKota = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [dinasLuarKota, setDinasLuarKota] = useState<DinasLuarKotaEntry[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [newEntry, setNewEntry] = useState<DinasLuarKotaEntry>({
        no: 0,
        id: '',
        nama: '',
        tanggalBerangkat: null,  
        tanggalKembali: null,    
        kotaTujuan: '',
        keperluan: '',
        biayaTransport: 0,
        biayaPenginapan: 0,
        uangHarian: 0,
        totalBiaya: 0,
    });

    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem('authToken');
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

    const handleTambahClick = () => {
        setShowDialog(true); 
    };

    const handleSave = async () => {
        const newEntryData = { 
            ...newEntry,
            id_karyawan: newEntry.id, 
            tgl_berangkat: newEntry.tanggalBerangkat?.toISOString(), 
            tgl_kembali: newEntry.tanggalKembali?.toISOString()
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:8000/api/dinas-luar-kota', newEntryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setDinasLuarKota([...dinasLuarKota, response.data]);
            setShowDialog(false);
            setNewEntry({
                no: 0,
                id: '',
                nama: '',
                tanggalBerangkat: null,
                tanggalKembali: null,
                kotaTujuan: '',
                keperluan: '',
                biayaTransport: 0,
                biayaPenginapan: 0,
                uangHarian: 0,
                totalBiaya: 0,
            });
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data berhasil ditambahkan!', life: 3000 });
        } catch (error) {
            console.error('Error saving data:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data.', life: 3000 });
        }
    };

    const handleChange = (e: any, field: string) => {
        const value = field === 'tanggalBerangkat' || field === 'tanggalKembali' ? e.value : e.target.value;
        setNewEntry({ ...newEntry, [field]: value });
    };

    const handleNumberChange = (e: any, field: string, value: number | null | undefined) => {
        setNewEntry({ ...newEntry, [field]: value !== undefined ? value : null });
    };

    const dialogFooter = (
        <div>
            <Button label="Batal" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" onClick={handleSave} />
        </div>
    );

    return (
        <div className="card">
            <h5>Data Dinas Luar Kota</h5>
            <Button label="Tambah Dinas" icon="pi pi-plus" onClick={handleTambahClick} className="p-mb-3" />
            <Toast ref={toast} />
            <DataTable value={dinasLuarKota}>
                <Column field="no" header="No" />
                <Column field="id" header="ID" />
                <Column field="nama" header="Nama Karyawan" />
                <Column field="tanggalBerangkat" header="Tanggal Berangkat" body={(rowData) => rowData.tanggalBerangkat ? new Date(rowData.tanggalBerangkat).toLocaleDateString() : ''} />
                <Column field="tanggalKembali" header="Tanggal Kembali" body={(rowData) => rowData.tanggalKembali ? new Date(rowData.tanggalKembali).toLocaleDateString() : ''} />
                <Column field="kotaTujuan" header="Kota Tujuan" />
                <Column field="keperluan" header="Keperluan" />
                <Column field="biayaTransport" header="Biaya Transport" />
                <Column field="biayaPenginapan" header="Biaya Penginapan" />
                <Column field="uangHarian" header="Uang Harian" />
                <Column field="totalBiaya" header="Total Biaya" />
            </DataTable>

            <Dialog header="Tambah Dinas Luar Kota" visible={showDialog} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => setShowDialog(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label>ID</label>
                        <InputText value={newEntry.id} onChange={(e) => handleChange(e, 'id')} />
                    </div>
                    <div className="p-field">
                        <label>Nama Karyawan</label>
                        <InputText value={newEntry.nama} onChange={(e) => handleChange(e, 'nama')} />
                    </div>
                    <div className="p-field">
                        <label>Tanggal Berangkat</label>
                        <Calendar value={newEntry.tanggalBerangkat} onChange={(e) => handleChange(e, 'tanggalBerangkat')} dateFormat="yy-mm-dd" />
                    </div>
                    <div className="p-field">
                        <label>Tanggal Kembali</label>
                        <Calendar value={newEntry.tanggalKembali} onChange={(e) => handleChange(e, 'tanggalKembali')} dateFormat="yy-mm-dd" />
                    </div>
                    <div className="p-field">
                        <label>Kota Tujuan</label>
                        <InputText value={newEntry.kotaTujuan} onChange={(e) => handleChange(e, 'kotaTujuan')} />
                    </div>
                    <div className="p-field">
                        <label>Keperluan</label>
                        <InputText value={newEntry.keperluan} onChange={(e) => handleChange(e, 'keperluan')} />
                    </div>
                    <div className="p-field">
                        <label>Biaya Transport</label>
                        <InputNumber value={newEntry.biayaTransport} onValueChange={(e) => handleNumberChange(e, 'biayaTransport', e.value)} />
                    </div>
                    <div className="p-field">
                        <label>Biaya Penginapan</label>
                        <InputNumber value={newEntry.biayaPenginapan} onValueChange={(e) => handleNumberChange(e, 'biayaPenginapan', e.value)} />
                    </div>
                    <div className="p-field">
                        <label>Uang Harian</label>
                        <InputNumber value={newEntry.uangHarian} onValueChange={(e) => handleNumberChange(e, 'uangHarian', e.value)} />
                    </div>
                    <div className="p-field">
                        <label>Total Biaya</label>
                        <InputNumber value={newEntry.totalBiaya} onValueChange={(e) => handleNumberChange(e, 'totalBiaya', e.value)} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default DinasLuarKota;
