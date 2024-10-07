'use client';

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const Hadir = () => {
    // Data contoh untuk ditampilkan di tabel
    const [requests, setRequests] = useState([
        { 
            no: 1, 
            tanggal: '09-06-2022', 
            mitra: 'CV. Mitra Sekawan', 
            noPermohonan: '123e', 
            tambang: 'Kapal Isap Produksi', 
            unit: 'Unit Produksi Kundur', 
            status: 'Permohonan Diterima' 
        },
        { 
            no: 2, 
            tanggal: '09-06-2022', 
            mitra: 'CV. Mitra Sekawan', 
            noPermohonan: '123-123', 
            tambang: 'Tambang Besar', 
            unit: 'Unit Produksi Darat Bangka', 
            status: 'Persetujuan Kepala' 
        },
        { 
            no: 3, 
            tanggal: '22-04-2022', 
            mitra: 'CV. Mitra Sekawan', 
            noPermohonan: '002204', 
            tambang: 'Kapal Isap Produksi', 
            unit: 'Unit Produksi Laut Bangka', 
            status: 'Permohonan Diterima' 
        },
        { 
            no: 4, 
            tanggal: '27-04-2022', 
            mitra: 'CV. Mitra Sekawan', 
            noPermohonan: 'spk/darat/2022', 
            tambang: 'Tambang Besar', 
            unit: 'Unit Produksi Belitung', 
            status: 'Permohonan Diterima' 
        },
        { 
            no: 5, 
            tanggal: '21-04-2022', 
            mitra: 'CV. Mitra Sekawan', 
            noPermohonan: 'spk/darat/01', 
            tambang: 'Tambang Besar', 
            unit: 'Unit Produksi Belitung', 
            status: 'Perpanjangan Diterima' 
        },
        { 
            no: 6, 
            tanggal: '19-04-2022', 
            mitra: 'CV. Mitra Sekawan', 
            noPermohonan: 'spk/01', 
            tambang: 'Kapal Isap Produksi', 
            unit: 'Unit Produksi Laut Bangka', 
            status: 'Persetujuan Kepala' 
        }
    ]);

    // Template untuk menampilkan status dengan warna berbeda
    const statusBodyTemplate = (rowData: any) => {
        // Jika rowData atau rowData.status tidak tersedia, tampilkan fallback
        const status = rowData?.status || 'Status Tidak Tersedia';
        let backgroundColor = '';

        // Switch case untuk menentukan warna berdasarkan status
        switch (status) {
            case 'Permohonan Diterima':
                backgroundColor = 'green';
                break;
            case 'Persetujuan Kepala':
                backgroundColor = 'purple';
                break;
            case 'Perpanjangan Diterima':
                backgroundColor = 'blue';
                break;
            default:
                backgroundColor = 'gray';
                break;
        }

        // Mengembalikan JSX untuk menampilkan status dengan warna yang sesuai
        return (
            <span 
                style={{ 
                    backgroundColor, 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '5px' 
                }}>
                {status}
            </span>
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Data Permohonan SPK</h5>
                    <DataTable value={requests} paginator rows={5} responsiveLayout="scroll">
                        <Column field="no" header="No" />
                        <Column field="tanggal" header="Tanggal" />
                        <Column field="mitra" header="Mitra" />
                        <Column field="noPermohonan" header="No Permohonan" />
                        <Column field="tambang" header="Tambang" />
                        <Column field="unit" header="Unit" />
                        <Column field="status" header="Status" body={statusBodyTemplate} />
                    </DataTable>
                    <Button 
                        label="Muat Ulang" 
                        icon="pi pi-refresh" 
                        className="mt-3" 
                        onClick={() => setRequests([...requests])} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Hadir;
