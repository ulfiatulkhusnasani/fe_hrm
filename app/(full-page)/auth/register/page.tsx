'use client';
/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Register = () => {
    const [namaKaryawan, setNamaKaryawan] = useState('');
    const [nik, setNik] = useState('');
    const [email, setEmail] = useState('');
    const [noHandphone, setNoHandphone] = useState('');
    const [alamat, setAlamat] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleRegister = async () => {
        // Validate email with regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: "error",
                title: "Email Tidak Valid",
                text: "Silakan masukkan alamat email yang valid."
            });
            return;
        }

        // Validate that password is not empty
        if (!password.trim()) {
            Swal.fire({
                icon: "error",
                title: "Password Diperlukan",
                text: "Silakan masukkan kata sandi."
            });
            return;
        }

        // Validate that password and confirm password match
        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Kata sandi tidak cocok!",
                footer: '<a href="#">Mengapa saya mengalami masalah ini?</a>'
            });
            return;
        }

        // Validate that checkbox "Setuju" is checked
        if (!checked) {
            Swal.fire({
                icon: "error",
                title: "Ketentuan Tidak Diterima",
                text: "Anda harus setuju dengan Syarat dan Ketentuan."
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama_karyawan: namaKaryawan,
                    nik,
                    email,
                    no_handphone: noHandphone,
                    alamat,
                    kata_sandi: password,
                    konfirmasi_kata_sandi: confirmPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Pendaftaran gagal');
            }

            const data = await response.json();
            console.log('Pendaftaran berhasil', data);

            Swal.fire({
                icon: "success",
                title: "Akun Dibuat",
                text: "Akun Anda telah berhasil dibuat!",
            }).then(() => {
                router.push('/auth/login');
            });

        } catch (error) {
            console.error('Kesalahan saat pendaftaran:', error);
            Swal.fire({
                icon: "error",
                title: "Pendaftaran Gagal",
                text: "Terjadi kesalahan saat pendaftaran. Silakan coba lagi."
            });
        }
    };

    return (
        <div
            className={containerClassName}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F2F3F7',
                padding: '2rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    maxWidth: '900px',
                    overflow: 'hidden',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        flex: 1,
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <h3 className="text-center text-900 text-3xl font-medium mb-5">Register</h3>

                    <div className="mb-3">
                        <label htmlFor="namaKaryawan" className="block text-900 text-xl font-medium mb-2">
                            Nama Karyawan
                        </label>
                        <InputText
                            id="namaKaryawan"
                            type="text"
                            placeholder="Nama Karyawan"
                            value={namaKaryawan}
                            onChange={(e) => setNamaKaryawan(e.target.value)}
                            className="w-full p-3 md:w-30rem"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="nik" className="block text-900 text-xl font-medium mb-2">
                            NIK
                        </label>
                        <InputText
                            id="nik"
                            type="text"
                            placeholder="Nomor Induk Karyawan"
                            value={nik}
                            onChange={(e) => setNik(e.target.value)}
                            className="w-full p-3 md:w-30rem"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="noHandphone" className="block text-900 text-xl font-medium mb-2">
                            No Handphone
                        </label>
                        <InputText
                            id="noHandphone"
                            type="text"
                            placeholder="Nomor Handphone"
                            value={noHandphone}
                            onChange={(e) => setNoHandphone(e.target.value)}
                            className="w-full p-3 md:w-30rem"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="alamat" className="block text-900 text-xl font-medium mb-2">
                            Alamat
                        </label>
                        <InputText
                            id="alamat"
                            type="text"
                            placeholder="Alamat"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            className="w-full p-3 md:w-30rem"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                            Email
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            placeholder="Alamat Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 md:w-30rem"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="block text-900 text-xl font-medium mb-2">
                            Kata Sandi
                        </label>
                        <Password
                            inputId="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Kata Sandi"
                            toggleMask
                            className="w-full"
                            inputClassName="w-full p-3 md:w-30rem"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="block text-900 text-xl font-medium mb-2">
                            Konfirmasi Kata Sandi
                        </label>
                        <Password
                            inputId="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Konfirmasi Kata Sandi"
                            toggleMask
                            className="w-full"
                            inputClassName="w-full p-3 md:w-30rem"
                        />
                    </div>

                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                        <div className="flex align-items-center">
                            <Checkbox
                                inputId="agreeTerms"
                                checked={checked}
                                onChange={(e) => setChecked(e.checked ?? false)}
                                className="mr-2"
                            />
                            <label htmlFor="agreeTerms">
                                Saya setuju dengan <a href="#" className="font-medium" style={{ color: 'var(--primary-color)' }}>Syarat dan Ketentuan</a>
                            </label>
                        </div>
                    </div>

                    <Button
                        label="Daftar"
                        className="w-full p-3 text-xl"
                        style={{ backgroundColor: '#007bff', borderColor: '#007bff' }} 
                        onClick={handleRegister}
                    />

                    <div className="text-center mt-5">
                        <span className="text-600">Sudah memiliki akun?</span>
                        <Link href="/auth/login" className="font-medium" style={{ color: 'var(--primary-color)', marginLeft: '5px' }}>
                            Masuk sekarang
                        </Link>
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        background: 'linear-gradient(to bottom, #ffffff, #1E90FF)', 
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3rem',
                    }}
                >
                    <div className="text-center">
                        <img
                            src="/layout/images/payrollmetrics1.png"
                            alt="Gambar Selamat Datang"
                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem', width: '80%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
