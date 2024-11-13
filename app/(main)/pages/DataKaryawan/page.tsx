"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Karyawan {
  id?: string;
  nip: string;
  nik: string;
  nama_karyawan: string;
  email: string;
  no_handphone: string;
  alamat: string;
  password: string; // Pastikan field password ada di sini
  jabatan: string;
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
    password: "", // Pastikan ini ada
    jabatan: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    ambilKaryawan();
  }, []);

  const ambilKaryawan = async () => {
    const token = localStorage.getItem("authToken");
    console.log('AuthToken:', token);

    if (!token) {
      Swal.fire("Kesalahan!", "Token tidak ditemukan! Anda harus login terlebih dahulu.", "error");
      return;
    }

    try {
      const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setKaryawan(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message === "Unauthenticated.") {
        Swal.fire("Kesalahan!", "Token tidak valid atau sudah kadaluarsa, silakan login kembali.", "error");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
  };

  const simpanKaryawan = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire("Kesalahan!", "Token tidak ditemukan! Anda harus login terlebih dahulu.", "error");
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
        password: karyawanBaru.password, // Sertakan password di sini
        jabatan: karyawanBaru.jabatan,
      };

      if (karyawanBaru.id) {
        await axios.put(`${API_URL}/${karyawanBaru.id}`, dataKaryawan, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil!", "Data karyawan berhasil diperbarui.", "success");
      } else {
        await axios.post(`${API_URL}/created`, dataKaryawan, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil!", "Data karyawan berhasil ditambahkan.", "success");
      }

      setTampilDialog(false);
      ambilKaryawan();
    } catch (error) {
      Swal.fire("Kesalahan!", `Terjadi kesalahan saat menyimpan data karyawan.`, "error");
    }
  };

  const hapusKaryawan = async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire("Kesalahan!", "Token tidak ditemukan! Anda harus login terlebih dahulu.", "error");
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
            headers: { Authorization: `Bearer ${token}` },
          });
          ambilKaryawan();
          Swal.fire("Dihapus!", "Data karyawan telah dihapus.", "success");
        } catch (error) {
          Swal.fire("Kesalahan!", "Terjadi masalah saat menghapus karyawan.", "error");
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
      password: "", // Reset password ketika membuka dialog
      jabatan: "",
    });
    setTampilDialog(true);
  };

  const sembunyikanDialog = () => {
    setTampilDialog(false);
  };

  const templateTindakan = (rowData: Karyawan) => (
    <>
      <Button label="Edit" className="p-button-success mr-2" onClick={() => editKaryawan(rowData)} />
      <Button label="Delete" className="p-button-danger" onClick={() => hapusKaryawan(rowData.id!)} />
    </>
  );

  const editKaryawan = (karyawan: Karyawan) => {
    setKaryawanBaru(karyawan);
    setTampilDialog(true);
  };

  const header = (
    <div className="table-header">
      <Button label="Tambah" icon="pi pi-plus" className="p-button-primary mr-2" onClick={bukaBaru} />
    </div>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKaryawan = karyawan.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        </li>
        {Array.from({ length: Math.ceil(karyawan.length / itemsPerPage) }, (_, i) => (
          <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === Math.ceil(karyawan.length / itemsPerPage) ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="card">
      <h5>Data Karyawan</h5>
      <DataTable value={currentKaryawan} responsiveLayout="scroll" header={header}>
        <Column body={(rowData, { rowIndex }) => indexOfFirstItem + rowIndex + 1} header="No" style={{ width: "50px" }} />
        <Column field="nama_karyawan" header="Nama Karyawan" />
        <Column field="nip" header="NIP" />
        <Column field="nik" header="NIK" />
        <Column field="email" header="Email" />
        <Column field="no_handphone" header="No Handphone" />
        <Column field="alamat" header="Alamat" /> {/* Kolom alamat yang baru */}
        <Column field="jabatan" header="Jabatan" />
        <Column body={templateTindakan} header="Aksi" />
      </DataTable>

      {renderPagination()}

      <Dialog header="Form Karyawan" visible={tampilDialog} style={{ width: "30vw" }} onHide={sembunyikanDialog}>
        <Panel header="Input Data Karyawan" className="p-3">
          <div className="p-fluid p-formgrid p-grid">
            <Divider />

            <div className="p-field p-col-6">
              <label htmlFor="nama_karyawan">Nama Karyawan</label>
              <InputText id="nama_karyawan" value={karyawanBaru.nama_karyawan} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, nama_karyawan: e.target.value })} />
            </div>

            <div className="p-field p-col-6">
              <label htmlFor="nip">NIP</label>
              <InputText id="nip" value={karyawanBaru.nip} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, nip: e.target.value })} />
            </div>

            <div className="p-field p-col-6">
              <label htmlFor="nik">NIK</label>
              <InputText id="nik" value={karyawanBaru.nik} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, nik: e.target.value })} />
            </div>

            <div className="p-field p-col-6">
              <label htmlFor="email">Email</label>
              <InputText id="email" value={karyawanBaru.email} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, email: e.target.value })} />
            </div>

            <div className="p-field p-col-6">
              <label htmlFor="no_handphone">No Handphone</label>
              <InputText id="no_handphone" value={karyawanBaru.no_handphone} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, no_handphone: e.target.value })} />
            </div>

            <div className="p-field p-col-12">
              <label htmlFor="alamat">Alamat</label>
              <InputText id="alamat" value={karyawanBaru.alamat} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, alamat: e.target.value })} />
            </div>

            <div className="p-field p-col-6">
              <label htmlFor="password">Password</label>
              <InputText id="password" type="password" value={karyawanBaru.password} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, password: e.target.value })} />
            </div>

            <div className="p-field p-col-6">
              <label htmlFor="jabatan">Jabatan</label>
              <InputText id="jabatan" value={karyawanBaru.jabatan} onChange={(e) => setKaryawanBaru({ ...karyawanBaru, jabatan: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-content-end">
            <Button label="Batal" icon="pi pi-times" className="p-button-danger ml-2" onClick={sembunyikanDialog} />
            <Button label="Simpan" icon="pi pi-check" className="p-button-success" onClick={simpanKaryawan} />
          </div>
        </Panel>
      </Dialog>
    </div>
  );
};

export default DataKaryawan;
