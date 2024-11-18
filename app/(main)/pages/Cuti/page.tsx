"use client"

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LeaveRequest {
    id: number;
    id_karyawan: string;
    tgl_mulai: string;
    tgl_selesai: string;
    alasan: string;
    keterangan: string;
    durasi: string;
    status: string;
}

interface Karyawan {
    id: string;
    nama_karyawan: string;
}

interface ErrorResponse {
    message: string;
}

const Cuti = () => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [newRequest, setNewRequest] = useState<LeaveRequest>({
        id: 0,
        id_karyawan: '',
        tgl_mulai: '',
        tgl_selesai: '',
        alasan: '',
        keterangan: '',
        durasi: '0',
        status: 'menunggu',
    });
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchRequests = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token tidak tersedia. Pastikan Anda sudah login.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/cuti', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRequests(response.data);
        } catch (error) {
            handleAxiosError(error, 'permohonan cuti');
        }
    };

    const fetchKaryawanList = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token tidak tersedia. Pastikan Anda sudah login.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/karyawan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKaryawanList(response.data);
        } catch (error) {
            handleAxiosError(error, 'data karyawan');
        }
    };

    const handleAxiosError = (error: unknown, context: string) => {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<ErrorResponse>;
            console.error(`Terjadi kesalahan saat mengambil ${context}:`, err.response?.data.message || err.message);
        } else {
            console.error('Terjadi kesalahan:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchKaryawanList();
    }, []);

    const toggleStatus = (id: number) => {
        const updatedRequest = requests.find((request) => request.id === id);
        const updatedStatus = updatedRequest?.status === 'disetujui' ? 'ditolak' : 'disetujui';

        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === id ? { ...request, status: updatedStatus } : request
            )
        );
    };

    const statusBodyTemplate = (rowData: LeaveRequest) => {
        const status = rowData?.status || 'Status Tidak Tersedia';
        let label = '';
        let className = '';

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
                label = 'Menunggu';
                className = 'p-button-secondary';
                break;
        }

        return (
            <Button
                label={label}
                className={className}
                style={{ padding: '5px 10px' }}
                onClick={() => toggleStatus(rowData.id)}
            />
        );
    };

    const addNewLeaveRequest = () => {
        setDialogVisible(true);
        resetNewRequest();
        setIsEditMode(false);
    };

    const editLeaveRequest = (request: LeaveRequest) => {
        setNewRequest(request);
        setIsEditMode(true);
        setDialogVisible(true);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token tidak tersedia. Pastikan Anda sudah login.');
            return;
        }

        try {
            let response;

            if (isEditMode) {
                response = await axios.put(`http://localhost:8000/api/cuti/${newRequest.id}`, {
                    id_karyawan: newRequest.id_karyawan,
                    tgl_mulai: newRequest.tgl_mulai,
                    tgl_selesai: newRequest.tgl_selesai,
                    alasan: newRequest.alasan,
                    keterangan: newRequest.keterangan,
                    durasi: Number(newRequest.durasi),
                    status: newRequest.status,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                response = await axios.post('http://localhost:8000/api/cuti', {
                    id_karyawan: newRequest.id_karyawan,
                    tgl_mulai: newRequest.tgl_mulai,
                    tgl_selesai: newRequest.tgl_selesai,
                    alasan: newRequest.alasan,
                    keterangan: newRequest.keterangan,
                    durasi: Number(newRequest.durasi),
                    status: newRequest.status,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            if (isEditMode) {
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.id === response.data.id ? response.data : request
                    )
                );
            } else {
                setRequests((prevRequests) => [...prevRequests, response.data]);
            }

            setDialogVisible(false);
            resetNewRequest();
        } catch (error) {
            handleAxiosError(error, 'data permohonan cuti');
        }
    };

    const resetNewRequest = () => {
        setNewRequest({
            id: 0,
            id_karyawan: '',
            tgl_mulai: '',
            tgl_selesai: '',
            alasan: '',
            keterangan: '',
            durasi: '0',
            status: 'menunggu',
        });
    };

    const deleteLeaveRequest = async (id: number) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token tidak tersedia. Pastikan Anda sudah login.');
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/cuti/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
        } catch (error) {
            handleAxiosError(error, 'menghapus permohonan cuti');
        }
    };

    const actionBodyTemplate = (rowData: LeaveRequest) => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-success" onClick={() => editLeaveRequest(rowData)} />
                <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deleteLeaveRequest(rowData.id)} />
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Data Permohonan Cuti</h5>

                    <div className="table-header">
                        <Button label="Tambah" icon="pi pi-plus" className="p-button-primary mr-2" onClick={addNewLeaveRequest} />
                    </div>

                    <DataTable value={requests} responsiveLayout="scroll" className="custom-datatable">
                        <Column field="id_karyawan" header="ID Karyawan" style={{ width: '10%' }} />
                        <Column field="tgl_mulai" header="Tanggal Mulai" style={{ width: '15%' }} />
                        <Column field="tgl_selesai" header="Tanggal Selesai" style={{ width: '15%' }} />
                        <Column field="alasan" header="Alasan" style={{ width: '20%' }} />
                        <Column field="keterangan" header="Keterangan" style={{ width: '20%' }} />
                        <Column field="durasi" header="Durasi" style={{ width: '10%' }} />
                        <Column field="status" header="Status" body={statusBodyTemplate} style={{ width: '10%' }} />
                        <Column body={actionBodyTemplate} style={{ width: '10%' }} />
                    </DataTable>

                    <Dialog header="Permohonan Cuti" visible={dialogVisible} onHide={() => setDialogVisible(false)}>
                        <div className="field">
                            <label htmlFor="id_karyawan">ID Karyawan</label>
                            <InputText id="id_karyawan" value={newRequest.id_karyawan} onChange={(e) => setNewRequest({ ...newRequest, id_karyawan: e.target.value })} />
                        </div>

                        <div className="field">
                            <label htmlFor="tgl_mulai">Tanggal Mulai</label>
                            <InputText id="tgl_mulai" value={newRequest.tgl_mulai} onChange={(e) => setNewRequest({ ...newRequest, tgl_mulai: e.target.value })} />
                        </div>

                        <div className="field">
                            <label htmlFor="tgl_selesai">Tanggal Selesai</label>
                            <InputText id="tgl_selesai" value={newRequest.tgl_selesai} onChange={(e) => setNewRequest({ ...newRequest, tgl_selesai: e.target.value })} />
                        </div>

                        <div className="field">
                            <label htmlFor="alasan">Alasan</label>
                            <InputText id="alasan" value={newRequest.alasan} onChange={(e) => setNewRequest({ ...newRequest, alasan: e.target.value })} />
                        </div>

                        <div className="field">
                            <label htmlFor="keterangan">Keterangan</label>
                            <InputText id="keterangan" value={newRequest.keterangan} onChange={(e) => setNewRequest({ ...newRequest, keterangan: e.target.value })} />
                        </div>

                        <Button label="Simpan" icon="pi pi-check" onClick={handleSubmit} />
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Cuti;
