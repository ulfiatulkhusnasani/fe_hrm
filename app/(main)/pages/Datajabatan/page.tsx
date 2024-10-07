'use client';

import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface PositionData {
    id: number;
    name: string;
    baseSalary: number;
    transportAllowance: number;
    mealAllowance: number;
}

const DataJabatan = () => {
    const [positions, setPositions] = useState<PositionData[]>([
        { id: 1, name: 'HRD', baseSalary: 4000000, transportAllowance: 600000, mealAllowance: 400000 },
        { id: 2, name: 'Staff Marketing', baseSalary: 2500000, transportAllowance: 300000, mealAllowance: 200000 },
        { id: 3, name: 'Admin', baseSalary: 2200000, transportAllowance: 300000, mealAllowance: 200000 },
        { id: 4, name: 'Sales', baseSalary: 2500000, transportAllowance: 300000, mealAllowance: 200000 },
    ]);

    // Fungsi untuk menghitung total
    const calculateTotal = (rowData: PositionData) => {
        return rowData.baseSalary + rowData.transportAllowance + rowData.mealAllowance;
    };

    // Template untuk kolom Actions
    const actionTemplate = () => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" />
            </div>
        );
    };

    // Fungsi untuk menambahkan item baru (placeholder)
    const addNewItem = () => {
        // Tambahkan logika untuk menambah data 
        alert("Tambah Data diklik!");
    };

    return (
        <div className="datatable-templating-demo">
            <div className="card">
                <div className="p-grid p-align-center p-justify-between p-mb-3">
                    {/* Tombol Tambah Data */}
                    <Button
                        label="Tambah Data"
                        icon="pi pi-plus"
                        className="p-button-success"
                        onClick={addNewItem}
                    />

                    {/* Input pencarian */}
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search..." />
                    </span>
                </div>

                <h5>Data Jabatan</h5>

                <DataTable value={positions} responsiveLayout="scroll">
                    <Column field="id" header="No" style={{ width: '5%' }}></Column>
                    <Column field="name" header="Nama Jabatan" style={{ width: '20%' }}></Column>
                    <Column field="baseSalary" header="Gaji Pokok" body={(data) => `Rp. ${data.baseSalary.toLocaleString('id-ID')}`} style={{ width: '20%' }}></Column>
                    <Column field="transportAllowance" header="Tunjangan Transport" body={(data) => `Rp. ${data.transportAllowance.toLocaleString('id-ID')}`} style={{ width: '20%' }}></Column>
                    <Column field="mealAllowance" header="Uang Makan" body={(data) => `Rp. ${data.mealAllowance.toLocaleString('id-ID')}`} style={{ width: '20%' }}></Column>
                    <Column field="total" header="Total" body={(data) => `Rp. ${calculateTotal(data).toLocaleString('id-ID')}`} style={{ width: '20%' }}></Column>
                    <Column header="Actions" body={actionTemplate} style={{ width: '15%' }}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default DataJabatan;
