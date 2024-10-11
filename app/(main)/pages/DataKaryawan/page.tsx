"use client"; 
import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Swal from "sweetalert2"; 

interface Employee {
  id: string;
  nik: string;
  nama_karyawan: string;
  email: string;
  no_handphone: string;
  alamat: string;
  password: string;
}

const API_URL = "http://localhost:8000/api/karyawan"; 

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
  });
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    fetchEmployees(); 
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem('authToken'); 
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setEmployees(response.data);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching employees:", errorMessage);
      if ((error as any).response) {
        console.error("Response data:", (error as any).response.data);
        alert("Error fetching employees: " + ((error as any).response.data.message || errorMessage));
      } else {
        alert("Error fetching employees: " + errorMessage);
      }
    }
  };

  const saveEmployee = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const employeeData: any = {
        nik: newEmployee.nik,
        nama_karyawan: newEmployee.nama_karyawan,
        email: newEmployee.email,
        no_handphone: newEmployee.no_handphone,
        alamat: newEmployee.alamat,
        password: newEmployee.password,
      };

      if (!employeeData.nik || !employeeData.nama_karyawan || !employeeData.email || !employeeData.no_handphone || !employeeData.alamat || !employeeData.password) {
        Swal.fire({
          title: "Kesalahan!",
          text: "Semua kolom harus diisi!",
          icon: "error",
        });
        return;
      }

      if (newEmployee.id === "0") {
        await axios.post(`${API_URL}/created`, employeeData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: "Berhasil!",
          text: "Data karyawan berhasil ditambahkan.",
          icon: "success",
        });
      } else {
        await axios.put(`${API_URL}/${newEmployee.id}`, employeeData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title: "Berhasil!",
          text: "Data karyawan berhasil diperbarui.",
          icon: "success",
        });
      }

      setDisplayDialog(false);
      fetchEmployees(); 
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
          await axios.delete(`${API_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          });
          fetchEmployees(); 
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

  const openNew = () => {
    setNewEmployee({
      id: "0",
      nik: "",
      nama_karyawan: "",
      email: "",
      no_handphone: "",
      alamat: "",
      password: "",
    });
    setDisplayDialog(true);
  };

  const hideDialog = () => {
    setDisplayDialog(false);
  };

  const actionBodyTemplate = (rowData: Employee) => {
    return (
      <>
        <Button label="Update" className="p-button-success mr-2" onClick={() => editEmployee(rowData)} />
        <Button label="Delete" className="p-button-danger" onClick={() => deleteEmployee(rowData.id)} />
      </>
    );
  };

  const editEmployee = (employee: Employee) => {
    setNewEmployee(employee);
    setDisplayDialog(true);
  };

  const header = (
    <div className="table-header">
      <Button label="Tambah" icon="pi pi-plus" className="p-button-primary mr-2" onClick={openNew} />
    </div>
  );

  return (
    <div className="card">
      <h5>Data Karyawan</h5>
      <DataTable value={employees} responsiveLayout="scroll" header={header}>
        <Column body={(rowData, { rowIndex }) => rowIndex + 1} header="No" style={{ width: '50px' }} /> {/* Menambahkan kolom nomor */}
        <Column field="nama_karyawan" header="Nama Karyawan"></Column>
        <Column field="nik" header="NIK"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="no_handphone" header="No Handphone"></Column>
        <Column field="alamat" header="Alamat"></Column>
        <Column field="password" header="Password"></Column>
        <Column body={actionBodyTemplate} header="Aksi"></Column>
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
              type={showPassword ? "text" : "password"}
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              required
            />
            <Button
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              onClick={() => setShowPassword(!showPassword)}
              className="p-button-text"
              style={{ marginLeft: "5px" }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataKaryawan;
