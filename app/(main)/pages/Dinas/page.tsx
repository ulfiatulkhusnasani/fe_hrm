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
import { InputText } from 'primereact/inputtext';

interface DinasLuarKotaEntry {
    no: number;
    idKaryawan: string;
    nama: string;
    tanggalBerangkat: string;
    tanggalKembali: string;
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
    const [isFormVisible, setFormVisible] = useState(false);
    const [newEntry, setNewEntry] = useState<{
        idKaryawan: string;
        nama: string;
        tanggalBerangkat: Date | null;
        tanggalKembali: Date | null;
        kotaTujuan: string;
        keperluan: string;
        biayaTransport: number;
        biayaPenginapan: number;
        uangHarian: number;
    }>({
        idKaryawan: '',
        nama: '',
        tanggalBerangkat: null,
        tanggalKembali: null,
        kotaTujuan: '',
        keperluan: '',
        biayaTransport: 0,
        biayaPenginapan: 0,
        uangHarian: 0,
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
            tanggalBerangkat: new Date(),
            tanggalKembali: new Date(),
        }));
    };

    const calculateTotalBiaya = () => {
        const { biayaTransport, biayaPenginapan, uangHarian } = newEntry;
        const totalBiaya = biayaTransport + biayaPenginapan + uangHarian;
        return totalBiaya;
    };

    const handleSubmit = async () => {
        console.log('Data yang dikirim:', newEntry);
        
        if (!newEntry.idKaryawan || !newEntry.tanggalBerangkat || !newEntry.tanggalKembali || newEntry.kotaTujuan.trim() === '' || newEntry.keperluan.trim() === '' || newEntry.biayaTransport <= 0 || newEntry.biayaPenginapan <= 0 || newEntry.uangHarian <= 0) {
            toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Semua field harus diisi dengan benar.', life: 3000 });
            return;
        }

        const newDinas: DinasLuarKotaEntry = {
            no: dinasLuarKota.length + 1,
            idKaryawan: newEntry.idKaryawan,
            nama: getEmployeeNameById(newEntry.idKaryawan),
            tanggalBerangkat: newEntry.tanggalBerangkat?.toISOString().split('T')[0],
            tanggalKembali: newEntry.tanggalKembali?.toISOString().split('T')[0],
            kotaTujuan: newEntry.kotaTujuan,
            keperluan: newEntry.keperluan,
            biayaTransport: newEntry.biayaTransport,
            biayaPenginapan: newEntry.biayaPenginapan,
            uangHarian: newEntry.uangHarian,
            totalBiaya: calculateTotalBiaya(),
        };

        console.log('Data dinas luar kota yang dikirim ke server:', newDinas);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:8000/api/dinas-luar-kota', newDinas, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setDinasLuarKota((prevDinas) => [...prevDinas, newDinas]);
                setFormVisible(false);
                setNewEntry({
                    idKaryawan: '',
                    nama: '',
                    tanggalBerangkat: null,
                    tanggalKembali: null,
                    kotaTujuan: '',
                    keperluan: '',
                    biayaTransport: 0,
                    biayaPenginapan: 0,
                    uangHarian: 0,
                });
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data dinas luar kota berhasil disimpan!', life: 3000 });
            } else {
                console.error('Gagal menyimpan data dinas luar kota:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data dinas luar kota.', life: 3000 });
        }        
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Dinas Luar Kota</h5>
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
                                <label htmlFor="tanggalBerangkat">Tanggal Berangkat</label>
                                <Calendar 
                                    id="tanggalBerangkat" 
                                    value={newEntry.tanggalBerangkat} 
                                    onChange={(e) => setNewEntry({ ...newEntry, tanggalBerangkat: e.value as Date })} 
                                    showIcon 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="tanggalKembali">Tanggal Kembali</label>
                                <Calendar 
                                    id="tanggalKembali" 
                                    value={newEntry.tanggalKembali} 
                                    onChange={(e) => setNewEntry({ ...newEntry, tanggalKembali: e.value as Date })} 
                                    showIcon 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="kotaTujuan">Kota Tujuan</label>
                                <InputText 
                                    id="kotaTujuan" 
                                    value={newEntry.kotaTujuan} 
                                    onChange={(e) => setNewEntry({ ...newEntry, kotaTujuan: e.target.value })} 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="keperluan">Keperluan</label>
                                <InputText 
                                    id="keperluan" 
                                    value={newEntry.keperluan} 
                                    onChange={(e) => setNewEntry({ ...newEntry, keperluan: e.target.value })} 
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="biayaTransport">Biaya Transport</label>
                                <InputNumber 
                                    id="biayaTransport" 
                                    value={newEntry.biayaTransport} 
                                    onChange={(e) => setNewEntry({ ...newEntry, biayaTransport: e.value || 0 })} 
                                    min={0} 
                                    showButtons 
                                    mode="currency" 
                                    currency="IDR"
                                    useGrouping={true}
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="biayaPenginapan">Biaya Penginapan</label>
                                <InputNumber 
                                    id="biayaPenginapan" 
                                    value={newEntry.biayaPenginapan} 
                                    onChange={(e) => setNewEntry({ ...newEntry, biayaPenginapan: e.value || 0 })} 
                                    min={0} 
                                    showButtons 
                                    mode="currency" 
                                    currency="IDR"
                                    useGrouping={true}
                                />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="uangHarian">Uang Harian</label>
                                <InputNumber 
                                    id="uangHarian" 
                                    value={newEntry.uangHarian} 
                                    onChange={(e) => setNewEntry({ ...newEntry, uangHarian: e.value || 0 })} 
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

                    <DataTable value={dinasLuarKota} responsiveLayout="scroll">
                        <Column field="no" header="No" />
                        <Column field="idKaryawan" header="ID Karyawan" />
                        <Column field="nama" header="Nama" />
                        <Column field="tanggalBerangkat" header="Tanggal Berangkat" />
                        <Column field="tanggalKembali" header="Tanggal Kembali" />
                        <Column field="kotaTujuan" header="Kota Tujuan" />
                        <Column field="keperluan" header="Keperluan" />
                        <Column field="biayaTransport" header="Biaya Transport" />
                        <Column field="biayaPenginapan" header="Biaya Penginapan" />
                        <Column field="uangHarian" header="Uang Harian" />
                        <Column field="totalBiaya" header="Total Biaya" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default DinasLuarKota;
