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
    id_karyawan: number;
    nama: string;
    nama_karyawan?: string;
    tanggalBerangkat: Date | null | undefined;  // Allow undefined
    tanggalKembali: Date | null | undefined;    // Allow undefined
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
        id_karyawan: 0,
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
        const fetchData = async () => {
            await fetchEmployees();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (employees.length > 0) {
            fetchDinasLuarKota();
        }
    }, [employees]);

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

    const fetchDinasLuarKota = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:8000/api/dinas_luarkota', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const updatedData = response.data.map((entry: any, index: number) => {
                const employee = employees.find(emp => emp.id === entry.id_karyawan.toString());
                return {
                    ...entry,
                    no: index + 1,
                    nama: employee ? employee.nama_karyawan : 'Unknown'
                };
            });
            setDinasLuarKota(updatedData);
        } catch (error) {
            console.error('Error fetching dinas luar kota:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data dinas luar kota.', life: 3000 });
        }
    };

    const handleTambahClick = () => {
        setShowDialog(true); 
    };

    const handleSave = async () => {
        const newEntryData = { 
            nama_karyawan: newEntry.nama_karyawan,  // Gunakan nama_karyawan
            tgl_berangkat: newEntry.tanggalBerangkat ? newEntry.tanggalBerangkat.toISOString().split('T')[0] : '',
            tgl_kembali: newEntry.tanggalKembali ? newEntry.tanggalKembali.toISOString().split('T')[0] : '',
            kota_tujuan: newEntry.kotaTujuan,
            keperluan: newEntry.keperluan,
            biaya_transport: newEntry.biayaTransport,
            biaya_penginapan: newEntry.biayaPenginapan,
            uang_harian: newEntry.uangHarian,
        };
    
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:8000/api/dinas_luarkota', newEntryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const savedEntry = {
                ...response.data,
                no: dinasLuarKota.length + 1,
                nama_karyawan: response.data.nama_karyawan || 'Unknown'  // Update dengan nama_karyawan
            };
            setDinasLuarKota([...dinasLuarKota, savedEntry]);
            setShowDialog(false);
            setNewEntry({
                no: 0,
                id: '',
                id_karyawan: 0,
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
            if (axios.isAxiosError(error) && error.response) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Gagal menyimpan data: ${JSON.stringify(error.response.data)}`, life: 3000 });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data.', life: 3000 });
            }
        }
    };    

    const handleChange = (e: any, field: string) => {
        const value = field === 'tanggalBerangkat' || field === 'tanggalKembali' ? e.value : e.target.value;
        setNewEntry({ ...newEntry, [field]: value });
    };

    const handleNumberChange = (e: any, field: string, value: number | null | undefined) => {
        setNewEntry({ ...newEntry, [field]: value !== undefined ? value : null });
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:8000/api/dinas_luarkota/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setDinasLuarKota(dinasLuarKota.filter((entry) => entry.id !== id));
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data berhasil dihapus!', life: 3000 });
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus data.', life: 3000 });
        }
    };

    const handleEdit = (entry: DinasLuarKotaEntry) => {
        setNewEntry(entry);
        setShowDialog(true);
    };

    const dialogFooter = (
        <div>
            <Button label="Batal" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" onClick={handleSave} />
        </div>
    );

    const actionBodyTemplate = (rowData: DinasLuarKotaEntry) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => handleEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} />
            </div>
        );
    };

    return (
        <div className="card">
            <h5>Data Dinas Luar Kota</h5>
            <Button label="Tambah Dinas" icon="pi pi-plus" onClick={handleTambahClick} className="p-mb-3" />
            <Toast ref={toast} />
            <DataTable value={dinasLuarKota} paginator rows={10} rowsPerPageOptions={[5, 10, 20]}>
    <Column field="no" header="No" />
    <Column field="nama_karyawan" header="Nama Karyawan" />  {/* Ganti id_karyawan menjadi nama_karyawan */}
    <Column field="tgl_berangkat" header="Tanggal Berangkat" body={(rowData) => rowData.tgl_berangkat ? new Date(rowData.tgl_berangkat).toLocaleDateString() : ''} />
    <Column field="tgl_kembali" header="Tanggal Kembali" body={(rowData) => rowData.tgl_kembali ? new Date(rowData.tgl_kembali).toLocaleDateString() : ''} />
    <Column field="kota_tujuan" header="Kota Tujuan" />
    <Column field="keperluan" header="Keperluan" />
    <Column field="biaya_transport" header="Biaya Transport" />
    <Column field="biaya_penginapan" header="Biaya Penginapan" />
    <Column field="uang_harian" header="Uang Harian" />
    <Column field="total_biaya" header="Total Biaya" />
    <Column body={actionBodyTemplate} header="Aksi" />
</DataTable>

            <Dialog header="Tambah Dinas Luar Kota" visible={showDialog} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => setShowDialog(false)}>
                <div className="p-fluid">
                    
                    <div className="p-field">
    <label>Nama Karyawan</label>
    <select value={newEntry.id} onChange={(e) => {
        const selectedEmployee = employees.find(emp => emp.id === e.target.value);
        setNewEntry({
            ...newEntry,
            id: e.target.value,
            id_karyawan: parseInt(e.target.value),
            nama: selectedEmployee ? selectedEmployee.nama_karyawan : ''
        });
    }}>
        <option value="">Pilih Karyawan</option>
        {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>{employee.nama_karyawan}</option>
        ))}
    </select>
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