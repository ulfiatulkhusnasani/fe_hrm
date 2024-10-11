'use client';

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const cuti = () => {
    // Data contoh untuk ditampilkan di tabel
    const [requests, setRequests] = useState([
        { 
            id_karyawan: 'K001', 
            durasi: '8 jam', 
            tanggal_mulai: '2024-10-01', 
            tanggal_selesai: '2024-10-01', 
            keterangan: 'Libur Nasional', 
            status: 'disetujui' 
        },
        { 
            id_karyawan: 'K002', 
            durasi: '4 jam', 
            tanggal_mulai: '2024-10-02', 
            tanggal_selesai: '2024-10-02', 
            keterangan: 'Cuti', 
            status: 'ditolak' 
        },
        { 
            id_karyawan: 'K003', 
            durasi: '6 jam', 
            tanggal_mulai: '2024-10-03', 
            tanggal_selesai: '2024-10-03', 
            keterangan: 'Libur Sakit', 
            status: 'disetujui' 
        },
        { 
            id_karyawan: 'K004', 
            durasi: '8 jam', 
            tanggal_mulai: '2024-10-04', 
            tanggal_selesai: '2024-10-04', 
            keterangan: 'Libur Penuh', 
            status: 'ditolak' 
        },
        { 
            id_karyawan: 'K005', 
            durasi: '8 jam', 
            tanggal_mulai: '2024-10-05', 
            tanggal_selesai: '2024-10-05', 
            keterangan: 'Libur Keluarga', 
            status: 'disetujui' 
        }
    ]);

    // Template untuk menampilkan status dengan warna berbeda
    const statusBodyTemplate = (rowData: any) => {
        const status = rowData?.status || 'Status Tidak Tersedia';
        let backgroundColor = '';

        // Switch case untuk menentukan warna berdasarkan status
        switch (status) {
            case 'disetujui':
                backgroundColor = 'green';
                break;
            case 'ditolak':
                backgroundColor = 'red';
                break;
            default:
                backgroundColor = 'gray';
                break;
        }

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
                    <h5>Data Permohonan Cuti</h5>
                    <DataTable value={requests} paginator rows={5} responsiveLayout="scroll">
                        <Column field="id_karyawan" header="ID Karyawan" />
                        <Column field="durasi" header="Durasi" />
                        <Column field="tanggal_mulai" header="Tanggal Mulai" />
                        <Column field="tanggal_selesai" header="Tanggal Selesai" />
                        <Column field="keterangan" header="Keterangan" />
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

export default cuti;
