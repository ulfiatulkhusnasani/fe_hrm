"use client";

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import Swal from 'sweetalert2';

interface EmployeeData {
    id: number;
    position: string;
    baseSalary: number;
}

const DataJabatan: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
    const [tampilDialog, setTampilDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
    const [formData, setFormData] = useState<EmployeeData>({
        id: 0,
        position: '',
        baseSalary: 0,
    });
    const toastRef = React.useRef<Toast>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            Swal.fire("Kesalahan!", "Token tidak ditemukan! Anda harus login terlebih dahulu.", "error");
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/jabatan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(response.data)) {
                const mappedData: EmployeeData[] = response.data.map((item) => ({
                    id: item.id,
                    position: item.jabatan,
                    baseSalary: parseFloat(item.gaji_pokok),
                }));
                setEmployees(mappedData);
            } else {
                console.error('Expected an array but received:', response.data);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error: any) => {
        if (error.response) {
            if (error.response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthorized',
                    text: 'Sesi Anda telah berakhir, silakan login kembali.',
                }).then(() => {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message || 'Terjadi kesalahan tidak diketahui!',
                });
            }
        } else {
            console.error('Error fetching data:', error);
        }
    };

    const actionTemplate = (rowData: EmployeeData) => (
        <div>
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2"
                onClick={() => editEmployee(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteEmployee(rowData.id)}
            />
        </div>
    );

    const editEmployee = (employee: EmployeeData) => {
        setFormData({ ...employee });
        setSelectedEmployee(employee);
        setTampilDialog(true);
    };

    const deleteEmployee = async (id: number) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            Swal.fire("Kesalahan!", "Token tidak ditemukan! Anda harus login terlebih dahulu.", "error");
            return;
        }

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data karyawan ini akan dihapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8000/api/jabatan/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setEmployees(employees.filter((employee) => employee.id !== id));
                    Swal.fire('Dihapus!', 'Data karyawan telah dihapus.', 'success');
                } catch (error) {
                    handleError(error);
                }
            }
        });
    };

    const saveEmployee = async () => {
        try {
            if (!formData.position || formData.baseSalary <= 0) {
                throw new Error('Semua field harus diisi dan gaji pokok harus lebih dari 0');
            }

            const payload = {
                jabatan: formData.position,
                gaji_pokok: formData.baseSalary,
            };

            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan, silakan login ulang.');
            }

            if (selectedEmployee) {
                // Update existing employee using PUT
                const response = await axios.put(`http://localhost:8000/api/jabatan/${selectedEmployee.id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEmployees(
                    employees.map((employee) =>
                        employee.id === selectedEmployee.id ? response.data : employee
                    )
                );
            } else {
                // Create new employee using POST
                const response = await axios.post('http://localhost:8000/api/jabatan', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEmployees([...employees, response.data]);
            }

            setTampilDialog(false);
            fetchEmployees();
            toastRef.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data karyawan berhasil disimpan' });
        } catch (error) {
            handleError(error);
        }
    };

    const hideDialog = () => {
        setTampilDialog(false);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value;
        if (field === 'baseSalary') {
            setFormData({ ...formData, [field]: value ? parseFloat(value) : 0 });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    return (
        <div className="datatable-templating-demo">
            <div className="card">
                <h5>Data Jabatan</h5>
                <div className="p-grid p-align-center p-justify-between p-mb-3">
                    <Button
                        label="Tambah"
                        icon="pi pi-plus"
                        className="p-button-primary"
                        onClick={() => {
                            setSelectedEmployee(null);
                            setFormData({ id: 0, position: '', baseSalary: 0 });
                            setTampilDialog(true);
                        }}
                    />
                </div>

                <DataTable value={employees} responsiveLayout="scroll">
                    <Column field="id" header="No" style={{ width: '10%' }}></Column>
                    <Column field="position" header="Jabatan" style={{ width: '30%' }}></Column>
                    <Column
                        field="baseSalary"
                        header="Gaji Pokok"
                        body={(data) => data.baseSalary !== undefined && data.baseSalary !== null 
                            ? `Rp. ${data.baseSalary.toLocaleString('id-ID')}` 
                            : 'Rp. 0'}
                        style={{ width: '20%' }}
                    ></Column>
                    <Column header="Aksi" body={actionTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>

            <Dialog
                visible={tampilDialog}
                style={{ width: '450px' }}
                header={selectedEmployee ? 'Edit Karyawan' : 'Tambah Karyawan'}
                modal
                footer={
                    <div>
                        <Button label="Batal" icon="pi pi-times" onClick={hideDialog} />
                        <Button label="Simpan" icon="pi pi-check" onClick={saveEmployee} />
                    </div>
                }
                onHide={hideDialog}
            >
                <div className="p-field">
                    <label htmlFor="position">Jabatan</label>
                    <InputText
                        id="position"
                        value={formData.position}
                        onChange={(e) => onInputChange(e, 'position')}
                        required
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="baseSalary">Gaji Pokok</label>
                    <InputText
                        id="baseSalary"
                        value={formData.baseSalary !== null ? formData.baseSalary.toString() : ''}
                        onChange={(e) => onInputChange(e, 'baseSalary')}
                        required
                    />
                </div>
            </Dialog>

            <Toast ref={toastRef} />
        </div>
    );
};

export default DataJabatan; 
