'use client'; // Penting untuk Next.js agar menjalankan komponen ini di sisi klien

/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types'; // Pastikan tipe data sudah benar di sini

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext); // Mengambil konfigurasi layout dari context

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard Admin', icon: 'pi pi-fw pi-home', to: '/' }] // Dashboard mengarah ke halaman utama '/'
        },
        {
            label: 'KELOLA',
            items: [
                { label: 'Karyawan', icon: 'pi pi-fw pi-check-square', to: '/pages/DataKaryawan' },
                {
                    label: 'Data',
                    icon: 'pi pi-fw pi-id-card',
                    items: [
                        { label: 'Data Pegawai', icon: 'pi pi-fw pi-user', to: '/pages/Datapegawai' },
                        { label: 'Data Jabatan', icon: 'pi pi-fw pi-briefcase', to: '/pages/Datajabatan' }
                    ]
                },                
                { label: 'Overtime', icon: 'pi pi-fw pi-clock', class: 'rotated-icon' },
                {
                    label: 'Absensi',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Hadir', icon: 'pi pi-fw pi-info-circle', to: '/pages/Hadir' },
                        { label: 'Libur', icon: 'pi pi-fw pi-info-circle', to: '/pages/Libur' },
                        { label: 'Alfa', icon: 'pi pi-fw pi-info-circle', to: '/uikit/absensi/alfa' },
                        { label: 'Izin/cuti', icon: 'pi pi-fw pi-info-circle', to: '/uikit/absensi/izin-cuti' }
                    ]
                },
                { label: 'Lembur', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                { label: 'Lokasi', icon: 'pi pi-fw pi-map', to: '/uikit/Lokasi', preventExact: true }, // Ikon lokasi
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
                { label: 'Kurva', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' }
            ]
        },
        {
            label: 'DATA',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Data penggajian',
                    icon: 'pi pi-fw pi-user',
                    // Path dapat ditambahkan jika diperlukan
                },
                {
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/timeline'
                },
            ]
        },
        {
            label: 'Pintasan',
            items: [
                {
                    label: 'Keluar Akun',
                    icon: 'pi pi-fw pi-sign-out',
                    target: '_blank'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => (
                    <AppMenuitem item={item} root={true} index={i} key={item.label} />
                ))}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
