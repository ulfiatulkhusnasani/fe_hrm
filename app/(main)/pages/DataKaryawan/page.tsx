"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Swal from "sweetalert2";

interface Karyawan {
  id?: string; // id dijadikan optional
  nip: string;
  nik: string;
  nama_karyawan: string;
  email: string;
  no_handphone: string;
  alamat: string;
  password: string;
}

const API_URL = "http://localhost:8000/api/karyawan";

const DataKaryawan = () => {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [tampilDialog, setTampilDialog] = useState(false);
  const [karyawanBaru, setKaryawanBaru] = useState<Karyawan>({
    nip: "",
    nik: "",
    nama_karyawan: "",
    email: "",
    no_handphone: "",
    alamat: "",
    password: "",
  });
  const [tampilkanPassword, setTampilkanPassword] = useState(false);

  useEffect(() => {
    ambilKaryawan();
  }, []);

  const ambilKaryawan = async () => {
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);

    if (!token) {
      Swal.fire({
        title: "Kesalahan!",
        text: "Token tidak ditemukan! Anda harus login terlebih dahulu.",
        icon: "error",
      });
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKaryawan(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire({
        title: "Kesalahan!",
        text: "Terjadi kesalahan saat mengambil data karyawan.",
        icon: "error",
      });
    }
  };

  const simpanKaryawan = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire({
        title: "Kesalahan!",
        text: "Token tidak ditemukan! Anda harus login terlebih dahulu.",
        icon: "error",
      });
      return;
    }

    try {
      const dataKaryawan: Karyawan = {
        nip: karyawanBaru.nip,
        nik: karyawanBaru.nik,
        nama_karyawan: karyawanBaru.nama_karyawan,
        email: karyawanBaru.email,
        no_handphone: karyawanBaru.no_handphone,
        alamat: karyawanBaru.alamat,
        password: karyawanBaru.password,
      };

      if (!dataKaryawan.nip || !dataKaryawan.nik || !dataKaryawan.nama_karyawan || !dataKaryawan.email || !dataKaryawan.no_handphone || !dataKaryawan.alamat || !dataKaryawan.password) {
        Swal.fire({
          title: "Kesalahan!",
          text: "Semua kolom harus diisi!",
          icon: "error",
        });
        return;
      }

      if (karyawanBaru.id) { // Update existing employee
        await axios.put(`${API_URL}/${karyawanBaru.id}`, dataKaryawan, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: "Berhasil!",
          text: "Data karyawan berhasil diperbarui.",
          icon: "success",
        });
      } else { // Create new employee
        await axios.post(`${API_URL}/created`, dataKaryawan, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: "Berhasil!",
          text: "Data karyawan berhasil ditambahkan.",
          icon: "success",
        });
      }

      setTampilDialog(false);
      ambilKaryawan();
    } catch (error) {
      console.error("Error saving employee:", error);
      Swal.fire({
        title: "Kesalahan!",
        text: "Terjadi kesalahan saat menyimpan data karyawan.",
        icon: "error",
      });
    }
  };

  const hapusKaryawan = async (id: string) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      Swal.fire({
        title: "Kesalahan!",
        text: "Token tidak ditemukan! Anda harus login terlebih dahulu.",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data karyawan ini akan dihapus dan tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          ambilKaryawan();
          Swal.fire({
            title: "Dihapus!",
            text: "Data karyawan telah dihapus.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting employee:", error);
          Swal.fire({
            title: "Kesalahan!",
            text: "Terjadi masalah saat menghapus karyawan.",
            icon: "error",
          });
        }
      }
    });
  };

  const bukaBaru = () => {
    setKaryawanBaru({
      nip: "",
      nik: "",
      nama_karyawan: "",
      email: "",
      no_handphone: "",
      alamat: "",
      password: "",
    });
    setTampilDialog(true);
  };

  const sembunyikanDialog = () => {
    setTampilDialog(false);
  };

  const templateTindakan = (rowData: Karyawan) => {
    return (
      <>
        <Button label="Update" className="p-button-success mr-2" onClick={() => editKaryawan(rowData)} />
        <Button label="Delete" className="p-button-danger" onClick={() => hapusKaryawan(rowData.id!)} />
      </>
    );
  };

  const editKaryawan = (karyawan: Karyawan) => {
    setKaryawanBaru(karyawan);
    setTampilDialog(true);
  };

  const header = (
    <div className="table-header">
      <Button label="Tambah" icon="pi pi-plus" className="p-button-primary mr-2" onClick={bukaBaru} />
    </div>
  );

  return (
    <div className="card">
      <h5>Data Karyawan</h5>
      <DataTable value={karyawan} responsiveLayout="scroll" header={header}>
        <Column body={(rowData, { rowIndex }) => rowIndex + 1} header="No" style={{ width: '50px' }} />
        <Column field="nama_karyawan" header="Nama Karyawan"></Column>
        <Column field="nip" header="NIP"></Column>
        <Column field="nik" header="NIK"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="no_handphone" header="No Handphone"></Column>
        <Column field="alamat" header="Alamat"></Column>
        <Column body={templateTindakan} header="Aksi"></Column>
      </DataTable>

      <Dialog
        visible={tampilDialog}
        header={karyawanBaru.id ? "Update Data Karyawan" : "Tambah Data Karyawan"}
        modal
        style={{ width: "450px" }}
        footer={
          <>
            <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={sembunyikanDialog} />
            <Button label="Simpan" icon="pi pi-check" className="p-button-text" onClick={simpanKaryawan} />
          </>
        }
        onHide={sembunyikanDialog}
      >
        <div className="p-field">
          <label htmlFor="nama_karyawan">Nama Karyawan</label>
          <InputText
            id="nama_karyawan"
            value={karyawanBaru.nama_karyawan}
            onChange={(e) => setKaryawanBaru({ ...karyawanBaru, nama_karyawan: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="nip">NIP</label>
          <InputText
            id="nip"
            value={karyawanBaru.nip}
            onChange={(e) => setKaryawanBaru({ ...karyawanBaru, nip: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="nik">NIK</label>
          <InputText
            id="nik"
            value={karyawanBaru.nik}
            onChange={(e) => setKaryawanBaru({ ...karyawanBaru, nik: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            value={karyawanBaru.email}
            onChange={(e) => setKaryawanBaru({ ...karyawanBaru, email: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="no_handphone">No Handphone</label>
          <InputText
            id="no_handphone"
            value={karyawanBaru.no_handphone}
            onChange={(e) => setKaryawanBaru({ ...karyawanBaru, no_handphone: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="alamat">Alamat</label>
          <InputText
            id="alamat"
            value={karyawanBaru.alamat}
            onChange={(e) => setKaryawanBaru({ ...karyawanBaru, alamat: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="password">Password</label>
          <InputText
            id="password"
            value={karyawanBaru.password}
            onChange={(e) => setKaryawanBaru({ ...karyawanBaru, password: e.target.value })}
            required
            type={tampilkanPassword ? "text" : "password"}
          />
          <Button
            icon={tampilkanPassword ? "pi pi-eye-slash" : "pi pi-eye"}
            className="p-button-text"
            onClick={() => setTampilkanPassword(!tampilkanPassword)}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default DataKaryawan;