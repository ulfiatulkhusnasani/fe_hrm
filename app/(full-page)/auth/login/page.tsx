/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { LayoutContext } from '../../../../layout/context/layoutcontext';

const HalamanLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State untuk kontrol visibilitas kata sandi
    const [token, setToken] = useState(null); // State untuk menyimpan token
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleSignIn = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Response data:', data); // Log respons dari server

            if (response.ok) {
                console.log('Token:', data.token); // Log token jika login berhasil
                setToken(data.token); // Simpan token di state

                // Simpan token di Local Storage
                localStorage.setItem('authToken', data.token); // Token akan terlihat di Application -> Local Storage

                Swal.fire({
                    title: 'Login Berhasil!',
                    text: 'Anda akan diarahkan ke dashboard.',
                    icon: 'success',
                }).then(() => {
                    router.push('/'); // Redirect ke halaman dashboard
                });
            } else {
                console.error('Login error:', data.message); // Log kesalahan jika login gagal
                Swal.fire({
                    title: 'Login Gagal',
                    text: data.message || 'Kredensial tidak valid.',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Kesalahan jaringan:', error); // Log kesalahan jaringan
            Swal.fire({
                title: 'Kesalahan',
                text: 'Tidak dapat terhubung ke server',
                icon: 'error',
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
                    height: '80vh',
                    overflow: 'hidden',
                    width: '100%',
                }}
            >
                {/* Sisi Kiri - Formulir Login */}
                <div
                    style={{
                        flex: 1,
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <div className="text-center mb-4">
                        <div className="text-900 text-3xl font-medium mb-3">Masuk</div>
                    </div>

                    <div>
                        <label
                            htmlFor="email1"
                            className="block text-900 text-xl font-medium mb-2"
                        >
                            Email
                        </label>
                        <InputText
                            id="email1"
                            type="text"
                            placeholder="Email"
                            className="w-full md:w-30rem mb-5"
                            style={{ padding: '1rem' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label
                            htmlFor="password1"
                            className="block text-900 font-medium text-xl mb-2"
                        >
                            Kata Sandi
                        </label>
                        <div style={{ position: 'relative' }}>
                            <InputText
                                id="password1"
                                type={passwordVisible ? 'text' : 'password'} // Kontrol tipe input berdasarkan state
                                placeholder="Kata Sandi"
                                className="w-full p-3 md:w-30rem"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* Ikon mata untuk menampilkan/menyembunyikan kata sandi */}
                            <i
                                className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: '#888',
                                }}
                            ></i>
                        </div>

                        <div className="flex align-items-center justify-content-between mb-5">
                            <a
                                className="font-medium no-underline text-right cursor-pointer"
                                style={{ color: '#000' }}
                            >
                                Lupa kata sandi Anda?
                            </a>
                        </div>
                        <Button
                            label="Masuk"
                            className="w-full p-3 text-xl"
                            style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
                            onClick={handleSignIn}
                        />

                        {/* Teks "Belum punya akun? Daftar sekarang" */}
                        <div className="text-center mt-5">
                            <span className="text-600">Belum punya akun? </span>
                            <Link href="/auth/register" className="font-medium no-underline" style={{ color: 'var(--primary-color)' }}>
                                Daftar sekarang
                            </Link>
                        </div>

                        {/* Menampilkan Token jika ada */}
                        {token && (
                            <div className="mt-4 p-2 border border-dashed border-gray-300 rounded">
                                <strong>Token Anda:</strong> <span>{token}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sisi Kanan - Gambar */}
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
                            alt="Gambar Sambutan"
                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem', width: '80%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HalamanLogin;