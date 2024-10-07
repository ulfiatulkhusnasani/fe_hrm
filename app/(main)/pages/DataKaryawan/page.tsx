"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Swal from "sweetalert2"; // Import SweetAlert2

interface Employee {
  id: string;
  nik: string;
  nama_karyawan: string;
  email: string;
  no_handphone: string;
  alamat: string;
  password: string;
  status_aktif: boolean;
}

const API_URL = "http://localhost:8000/api/karyawan"; // Ganti URL API jika perlu

const DataKaryawan = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: "0",
    nik: "",
    nama_karyawan: "",
    email: "",
    no_handphone: "",
    alamat: "",
    password: "",
    status_aktif: false,
  });
  const [showPassword, setShowPassword] = useState(false); // State untuk mengatur visibilitas password

  useEffect(() => {
    fetchEmployees(); // Ambil data karyawan saat komponen dimuat
  }, []);

  // Mengambil data karyawan dari API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching employees:", errorMessage);
      if ((error as any).response) {
        alert("Error fetching employees: " + ((error as any).response.data.message || errorMessage));
      } else {
        alert("Error fetching employees: " + errorMessage);
      }
    }
  };

  // Menyimpan data karyawan
  const saveEmployee = async () => {
    try {
      const employeeData: any = {
        nik: newEmployee.nik,
        nama_karyawan: newEmployee.nama_karyawan,
        email: newEmployee.email,
        no_handphone: newEmployee.no_handphone,
        alamat: newEmployee.alamat,
        password: newEmployee.password,
        status_aktif: newEmployee.status_aktif,
      };

      // Validasi data sebelum mengirim
      if (!employeeData.nik || !employeeData.nama_karyawan || !employeeData.email || !employeeData.no_handphone || !employeeData.alamat || !employeeData.password) {
        Swal.fire({
          title: "Kesalahan!",
          text: "Semua kolom harus diisi!",
          icon: "error",
        });
        return;
      }

      if (newEmployee.id === "0") {
        // Tambah karyawan baru
        await axios.post(`${API_URL}/created`, employeeData);
        Swal.fire({
          title: "Berhasil!",
          text: "Data karyawan berhasil ditambahkan.",
          icon: "success",
        });
      } else {
        // Update karyawan
        await axios.put(`${API_URL}/${newEmployee.id}`, employeeData);
        Swal.fire({
          title: "Berhasil!",
          text: "Data karyawan berhasil diperbarui.",
          icon: "success",
        });
      }

      setDisplayDialog(false);
      fetchEmployees(); // Refresh data
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error saving employee:", errorMessage);
      if ((error as any).response) {
        const validationErrors = (error as any).response.data.errors;
        alert("Error saving employee: " + JSON.stringify(validationErrors));
      } else {
        alert("Error saving employee: " + errorMessage);
      }
    }
  };

  // Menghapus karyawan
  const deleteEmployee = async (id: string) => {
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
          await axios.delete(`${API_URL}/${id}`);
          fetchEmployees(); // Refresh data setelah dihapus
          Swal.fire({
            title: "Dihapus!",
            text: "Data karyawan telah dihapus.",
            icon: "success",
          });
        } catch (error) {
          const errorMessage = (error as Error).message;
          console.error("Error deleting employee:", errorMessage);
          Swal.fire({
            title: "Kesalahan!",
            text: "Terjadi masalah saat menghapus karyawan.",
            icon: "error",
          });
        }
      }
    });
  };

  // Membuka dialog untuk menambah karyawan baru
  const openNew = () => {
    setNewEmployee({
      id: "0",
      nik: "",
      nama_karyawan: "",
      email: "",
      no_handphone: "",
      alamat: "",
      password: "",
      status_aktif: false,
    });
    setDisplayDialog(true);
  };

  // Menyembunyikan dialog
  const hideDialog = () => {
    setDisplayDialog(false);
  };

  // Template untuk aksi dalam tabel
  const actionBodyTemplate = (rowData: Employee) => {
    return (
      <>
        <Button label="Update" className="p-button-success mr-2" onClick={() => editEmployee(rowData)} />
        <Button label="Delete" className="p-button-danger" onClick={() => deleteEmployee(rowData.id)} />
      </>
    );
  };

  // Mengedit data karyawan
  const editEmployee = (employee: Employee) => {
    setNewEmployee(employee);
    setDisplayDialog(true);
  };

  // Header untuk tabel
  const header = (
    <div className="table-header">
      <Button label="Tambah" icon="pi pi-plus" className="p-button-primary mr-2" onClick={openNew} />
    </div>
  );

  return (
    <div className="card">
      <h5>Data Karyawan</h5>
      <DataTable value={employees} responsiveLayout="scroll" header={header}>
        <Column field="nama_karyawan" header="Nama Karyawan"></Column>
        <Column field="nik" header="NIK"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="no_handphone" header="No Handphone"></Column>
        <Column field="alamat" header="Alamat"></Column>
        <Column field="password" header="Password"></Column>
        <Column header="Action" body={actionBodyTemplate}></Column>
      </DataTable>

      <Dialog
        visible={displayDialog}
        header={newEmployee.id === "0" ? "Tambah Data Karyawan" : "Update Data Karyawan"}
        modal
        style={{ width: "450px" }}
        footer={
          <>
            <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" className="p-button-text" onClick={saveEmployee} />
          </>
        }
        onHide={hideDialog}
      >
        <div className="p-field">
          <label htmlFor="nama_karyawan">Nama Karyawan</label>
          <InputText
            id="nama_karyawan"
            value={newEmployee.nama_karyawan}
            onChange={(e) => setNewEmployee({ ...newEmployee, nama_karyawan: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="nik">NIK</label>
          <InputText
            id="nik"
            value={newEmployee.nik}
            onChange={(e) => setNewEmployee({ ...newEmployee, nik: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="no_handphone">No Handphone</label>
          <InputText
            id="no_handphone"
            value={newEmployee.no_handphone}
            onChange={(e) => setNewEmployee({ ...newEmployee, no_handphone: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="alamat">Alamat</label>
          <InputText
            id="alamat"
            value={newEmployee.alamat}
            onChange={(e) => setNewEmployee({ ...newEmployee, alamat: e.target.value })}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="password">Password</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <InputText
              id="password"
              type={showPassword ? "text" : "password"} // Tipe input dinamis
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              required
            />
            <Button
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              onClick={() => setShowPassword(!showPassword)} // Toggle visibilitas password
              className="p-button-text"
              style={{ marginLeft: "5px" }}
            />
          </div>
        </div>

        <div className="p-field-checkbox">
          <label htmlFor="status_aktif">Status Aktif</label>
          <input
            type="checkbox"
            id="status_aktif"
            checked={newEmployee.status_aktif}
            onChange={(e) => setNewEmployee({ ...newEmployee, status_aktif: e.target.checked })}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default DataKaryawan;
