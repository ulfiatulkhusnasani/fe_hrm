'use client';

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';

interface DropdownItem {
    name: string;
    code: string;
}

const datapegawai = () => {
    // State untuk dropdown
    const [gender, setGender] = useState<DropdownItem | null>(null);
    const [position, setPosition] = useState<DropdownItem | null>(null);
    const [status, setStatus] = useState<DropdownItem | null>(null);
    const [access, setAccess] = useState<DropdownItem | null>(null);

    // Opsi dropdown
    const genderOptions: DropdownItem[] = [
        { name: 'Laki-Laki', code: 'M' },
        { name: 'Perempuan', code: 'F' }
    ];

    const positionOptions: DropdownItem[] = [
        { name: 'Admin', code: 'Admin' },
        { name: 'HRD', code: 'HRD' },
        { name: 'Staff', code: 'Staff' }
    ];

    const statusOptions: DropdownItem[] = [
        { name: 'Karyawan Tetap', code: 'Permanent' },
        { name: 'Karyawan Tidak Tetap', code: 'NonPermanent' }
    ];

    const accessOptions: DropdownItem[] = [
        { name: 'Admin', code: 'Admin' },
        { name: 'Pegawai', code: 'Employee' }
    ];

    // Mengatur nilai default untuk dropdown saat komponen pertama kali dirender
    useEffect(() => {
        setGender(genderOptions[0]);
        setPosition(positionOptions[0]);
        setStatus(statusOptions[0]);
        setAccess(accessOptions[0]);
    }, []);

    return (
        <div className="grid p-fluid" style={{ maxWidth: '100%', padding: '20px' }}>
            <div className="col-12">
                <div className="card p-fluid">
                    <h5>Data Pegawai</h5>

                    <div className="field">
                        <label htmlFor="nik">NIK</label>
                        <InputText id="nik" type="text" placeholder="Masukkan NIK" />
                    </div>

                    <div className="field">
                        <label htmlFor="name">Nama Pegawai</label>
                        <InputText id="name" type="text" placeholder="Masukkan Nama" />
                    </div>

                    <div className="field">
                        <label htmlFor="gender">Jenis Kelamin</label>
                        <Dropdown
                            id="gender"
                            value={gender}
                            options={genderOptions}
                            onChange={(e) => setGender(e.value)}
                            optionLabel="name"
                            placeholder="Pilih Jenis Kelamin"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="position">Jabatan</label>
                        <Dropdown
                            id="position"
                            value={position}
                            options={positionOptions}
                            onChange={(e) => setPosition(e.value)}
                            optionLabel="name"
                            placeholder="Pilih Jabatan"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="entryDate">Tanggal Masuk</label>
                        <Calendar id="entryDate" showIcon />
                    </div>

                    <div className="field">
                        <label htmlFor="status">Status</label>
                        <Dropdown
                            id="status"
                            value={status}
                            options={statusOptions}
                            onChange={(e) => setStatus(e.value)}
                            optionLabel="name"
                            placeholder="Pilih Status"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="access">Hak Akses</label>
                        <Dropdown
                            id="access"
                            value={access}
                            options={accessOptions}
                            onChange={(e) => setAccess(e.value)}
                            optionLabel="name"
                            placeholder="Pilih Hak Akses"
                        />
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card p-fluid">
                    <h5>Upload Photo</h5>
                    <FileUpload name="demo[]" url="./upload" accept="image/*" maxFileSize={1000000} mode="basic" />
                </div>
            </div>

            <div className="col-12">
                <Button label="Submit" />
            </div>
        </div>
    );
};

export default datapegawai;
