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
            nama_karyawan: 'John Doe', 
            durasi: '8 jam', 
            tanggal_mulai: '2024-10-01', 
            tanggal_selesai: '2024-10-01', 
            keterangan: 'Libur Nasional', 
            status: 'disetujui' 
        },
        { 
            id_karyawan: 'K002', 
            nama_karyawan: 'Jane Smith', 
            durasi: '4 jam', 
            tanggal_mulai: '2024-10-02', 
            tanggal_selesai: '2024-10-02', 
            keterangan: 'Cuti', 
            status: 'ditolak' 
        },
        { 
            id_karyawan: 'K003', 
            nama_karyawan: 'Alice Johnson', 
            durasi: '6 jam', 
            tanggal_mulai: '2024-10-03', 
            tanggal_selesai: '2024-10-03', 
            keterangan: 'Libur Sakit', 
            status: 'disetujui' 
        },
        { 
            id_karyawan: 'K004', 
            nama_karyawan: 'Bob Brown', 
            durasi: '8 jam', 
            tanggal_mulai: '2024-10-04', 
            tanggal_selesai: '2024-10-04', 
            keterangan: 'Libur Penuh', 
            status: 'ditolak' 
        },
        { 
            id_karyawan: 'K005', 
            nama_karyawan: 'Charlie Davis', 
            durasi: '8 jam', 
            tanggal_mulai: '2024-10-05', 
            tanggal_selesai: '2024-10-05', 
            keterangan: 'Libur Keluarga', 
            status: 'disetujui' 
        }
    ]);

    // Fungsi untuk mengubah status ketika tombol diklik
    const toggleStatus = (id_karyawan: string) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id_karyawan === id_karyawan
                    ? {
                          ...request,
                          status: request.status === 'disetujui' ? 'ditolak' : 'disetujui'
                      }
                    : request
            )
        );
    };

    // Template untuk menampilkan status sebagai button yang bisa diklik
    const statusBodyTemplate = (rowData: any) => {
        const status = rowData?.status || 'Status Tidak Tersedia';
        let label = '';
        let className = '';

        // Mengatur label dan className berdasarkan status
        switch (status) {
            case 'disetujui':
                label = 'Disetujui';
                className = 'p-button-success';
                break;
            case 'ditolak':
                label = 'Ditolak';
                className = 'p-button-danger';
                break;
            default:
                label = 'Tidak Tersedia';
                className = 'p-button-secondary';
                break;
        }

        return (
            <Button 
                label={label} 
                className={className} 
                style={{ padding: '5px 10px' }} 
                onClick={() => toggleStatus(rowData.id_karyawan)} // Mengubah status ketika tombol diklik
            />
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Data Permohonan Cuti</h5>
                    <DataTable value={requests} paginator rows={5} responsiveLayout="scroll">
                        <Column field="id_karyawan" header="ID Karyawan" />
                        <Column field="nama_karyawan" header="Nama Karyawan" />
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