'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';

interface SalaryData {
    id: number;
    name: string;
    hadir: number;
    cuti: number;
    lembur: number;
    dinasKeluarKota: number;
    potongan: number;
    baseSalary: number;
}

const DataGajiKaryawan = () => {
    const [salaries, setSalaries] = useState<SalaryData[]>([
        { id: 1, name: 'Andi', hadir: 20, cuti: 2, lembur: 5, dinasKeluarKota: 1, potongan: 200000, baseSalary: 4000000 },
        { id: 2, name: 'Budi', hadir: 22, cuti: 1, lembur: 0, dinasKeluarKota: 0, potongan: 0, baseSalary: 2500000 },
        { id: 3, name: 'Citra', hadir: 21, cuti: 1, lembur: 3, dinasKeluarKota: 2, potongan: 150000, baseSalary: 2200000 },
        { id: 4, name: 'Dedi', hadir: 19, cuti: 3, lembur: 4, dinasKeluarKota: 1, potongan: 300000, baseSalary: 2500000 },
    ]);

    const [showDialog, setShowDialog] = useState(false);
    const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null);
    const [formData, setFormData] = useState<SalaryData>({
        id: 0,
        name: '',
        hadir: 0,
        cuti: 0,
        lembur: 0,
        dinasKeluarKota: 0,
        potongan: 0,
        baseSalary: 0,
    });

    const toastRef = React.useRef<Toast>(null);

    const actionTemplate = (rowData: SalaryData) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-mr-2"
                    style={{ backgroundColor: '#28a745' }}
                    onClick={() => editSalary(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    style={{ backgroundColor: '#dc3545' }}
                    onClick={() => deleteSalary(rowData.id)}
                />
            </div>
        );
    };

    const editSalary = (salary: SalaryData) => {
        setFormData({ ...salary });
        setSelectedSalary(salary);
        setShowDialog(true);
    };

    const deleteSalary = (id: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data gaji karyawan ini akan dihapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                setSalaries(salaries.filter((salary) => salary.id !== id));
                Swal.fire('Dihapus!', 'Data gaji karyawan telah dihapus.', 'success');
            }
        });
    };

    const saveSalary = () => {
        if (selectedSalary) {
            // Update existing salary
            setSalaries(
                salaries.map((salary) =>
                    salary.id === selectedSalary.id ? { ...selectedSalary, ...formData } : salary
                )
            );
        } else {
            // Add new salary
            setSalaries([...salaries, { ...formData, id: salaries.length + 1 }]);
        }
        setShowDialog(false);
        toastRef.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data gaji karyawan berhasil disimpan' });
    };

    const hideDialog = () => {
        setShowDialog(false);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SalaryData) => {
        const value = e.target.value;
        setFormData({ ...formData, [field]: value ? parseFloat(value) : 0 });
    };

    return (
        <div className="datatable-templating-demo">
            <div className="card">
                <h5>Data Gaji Karyawan</h5>
                <div className="p-grid p-align-center p-justify-between p-mb-3">
                    <Button
                        label="Tambah"
                        icon="pi pi-plus"
                        className="p-button-primary"
                        onClick={() => {
                            setSelectedSalary(null);
                            setFormData({ id: 0, name: '', hadir: 0, cuti: 0, lembur: 0, dinasKeluarKota: 0, potongan: 0, baseSalary: 0 });
                            setShowDialog(true);
                        }}
                    />
                </div>

                <DataTable value={salaries} responsiveLayout="scroll">
                    <Column field="id" header="ID" style={{ width: '10%' }}></Column>
                    <Column field="name" header="Nama Karyawan" style={{ width: '20%' }}></Column>
                    <Column field="hadir" header="Jumlah Hadir" style={{ width: '15%' }}></Column>
                    <Column field="cuti" header="Cuti" style={{ width: '10%' }}></Column>
                    <Column field="lembur" header="Lembur" style={{ width: '10%' }}></Column>
                    <Column field="dinasKeluarKota" header="Dinas Keluar Kota" style={{ width: '15%' }}></Column>
                    <Column field="potongan" header="Potongan" style={{ width: '15%' }}></Column>
                    <Column
                        field="baseSalary"
                        header="Gaji Pokok"
                        body={(data) => `Rp. ${data.baseSalary.toLocaleString('id-ID')}`}
                        style={{ width: '15%' }}
                    ></Column>
                    <Column header="Aksi" body={actionTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>

            <Dialog
                visible={showDialog}
                style={{ width: '450px' }}
                header={selectedSalary ? 'Edit Gaji Karyawan' : 'Tambah Gaji Karyawan'}
                modal
                footer={
                    <div>
                        <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                        <Button
                            label="Simpan"
                            icon="pi pi-check"
                            className="p-button-primary"
                            onClick={saveSalary}
                        />
                    </div>
                }
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="name">Nama Karyawan</label>
                    <InputText
                        id="name"
                        value={formData.name}
                        onChange={(e) => onInputChange(e, 'name')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="hadir">Jumlah Hadir</label>
                    <InputText
                        id="hadir"
                        value={formData.hadir.toString()}
                        onChange={(e) => onInputChange(e, 'hadir')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="cuti">Cuti</label>
                    <InputText
                        id="cuti"
                        value={formData.cuti.toString()}
                        onChange={(e) => onInputChange(e, 'cuti')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="lembur">Lembur</label>
                    <InputText
                        id="lembur"
                        value={formData.lembur.toString()}
                        onChange={(e) => onInputChange(e, 'lembur')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="dinasKeluarKota">Dinas Keluar Kota</label>
                    <InputText
                        id="dinasKeluarKota"
                        value={formData.dinasKeluarKota.toString()}
                        onChange={(e) => onInputChange(e, 'dinasKeluarKota')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="potongan">Potongan</label>
                    <InputText
                        id="potongan"
                        value={formData.potongan.toString()}
                        onChange={(e) => onInputChange(e, 'potongan')}
                    />
                </div>
                <div className="field">
                    <label htmlFor="baseSalary">Gaji Pokok</label>
                    <InputText
                        id="baseSalary"
                        value={formData.baseSalary.toString()}
                        onChange={(e) => onInputChange(e, 'baseSalary')}
                    />
                </div>
            </Dialog>

            <Toast ref={toastRef} />
        </div>
    );
};

export default DataGajiKaryawan;
