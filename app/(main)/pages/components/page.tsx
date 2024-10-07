import React, { useState } from 'react';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface KaryawanData {
    nama_karyawan: string;
    nik: string;
    email: string;
    no_handphone: string;
    alamat: string;
    password: string;
}

const KaryawanDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [karyawan, setKaryawan] = useState<KaryawanData>({
        nama_karyawan: '',
        nik: '',
        email: '',
        no_handphone: '',
        alamat: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setKaryawan({ ...karyawan, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/created', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(karyawan),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Data karyawan berhasil dikirim:', data);
                onClose(); // Tutup dialog setelah berhasil
            } else {
                const errorData = await response.json();
                console.error('Gagal mengirim data:', errorData.errors);
                // Tampilkan pesan kesalahan kepada pengguna jika diperlukan
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    return (
        <Dialog
            visible={open}
            header="Tambah Data Karyawan"
            modal
            style={{ width: "450px" }}
            footer={
                <>
                    <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                    <Button label="Simpan" icon="pi pi-check" className="p-button-text" onClick={handleSubmit} />
                </>
            }
            onHide={onClose}
        >
            <div className="p-field">
                <label htmlFor="nik">NIK</label>
                <InputText
                    id="nik"
                    name="nik"
                    value={karyawan.nik}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="p-field">
                <label htmlFor="nama_karyawan">Nama Karyawan</label>
                <InputText
                    id="nama_karyawan"
                    name="nama_karyawan"
                    value={karyawan.nama_karyawan}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="p-field">
                <label htmlFor="email">Email</label>
                <InputText
                    id="email"
                    name="email"
                    value={karyawan.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="p-field">
                <label htmlFor="no_handphone">No Handphone</label>
                <InputText
                    id="no_handphone"
                    name="no_handphone"
                    value={karyawan.no_handphone}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="p-field">
                <label htmlFor="alamat">Alamat</label>
                <InputText
                    id="alamat"
                    name="alamat"
                    value={karyawan.alamat}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="p-field">
                <label htmlFor="password">Password</label>
                <InputText
                    id="password"
                    name="password"
                    type="password"
                    value={karyawan.password}
                    onChange={handleChange}
                    required
                />
            </div>
        </Dialog>
    );
};

export default KaryawanDialog;
