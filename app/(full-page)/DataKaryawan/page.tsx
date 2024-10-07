// "use client";
// import { useState } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";
// import { InputText } from "primereact/inputtext";
// import { Checkbox } from "primereact/checkbox";
// import { InputMask } from "primereact/inputmask";
// import { Password } from "primereact/password";
// import axios from "axios";

// interface Employee {
//     id: number;
//     nik: string;
//     nama_karyawan: string;
//     email: string;
//     no_handphone: string;
//     alamat: string;
//     password: string;
//     status_aktif: boolean;
// }

// const KaryawanDemo = () => {
//     const [employees, setEmployees] = useState<Employee[]>([
//         {
//             id: 1,
//             nik: "17300002",
//             nama_karyawan: "Ahmad Santoso",
//             email: "ahmad@example.com",
//             no_handphone: "08123456789",
//             alamat: "Jl. Mawar No. 12",
//             password: "",
//             status_aktif: true,
//         },
//         {
//             id: 2,
//             nik: "17300003",
//             nama_karyawan: "Siti Nurhaliza",
//             email: "siti@example.com",
//             no_handphone: "08123456788",
//             alamat: "Jl. Melati No. 21",
//             password: "",
//             status_aktif: false,
//         },
//     ]);

//     const [displayDialog, setDisplayDialog] = useState(false);
//     const [newEmployee, setNewEmployee] = useState<Employee>({
//         id: 0,
//         nik: "",
//         nama_karyawan: "",
//         email: "",
//         no_handphone: "",
//         alamat: "",
//         password: "",
//         status_aktif: false,
//     });

//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const openNew = () => {
//         setNewEmployee({ id: 0, nik: "", nama_karyawan: "", email: "", no_handphone: "", alamat: "", password: "", status_aktif: false });
//         setConfirmPassword("");
//         setDisplayDialog(true);
//     };

//     const hideDialog = () => {
//         setDisplayDialog(false);
//     };

//     const saveEmployee = () => {
//         // Validasi sederhana sebelum menyimpan
//         if (!newEmployee.nik || !newEmployee.nama_karyawan || !newEmployee.email || !newEmployee.no_handphone || !newEmployee.alamat || !newEmployee.password) {
//             alert("Mohon lengkapi semua data karyawan.");
//             return;
//         }

//         if (newEmployee.password !== confirmPassword) {
//             alert("Konfirmasi kata sandi tidak sesuai.");
//             return;
//         }

//         // Menyimpan data karyawan baru
//         setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);

//         // Reset form setelah menyimpan
//         setNewEmployee({
//             id: 0,
//             nik: "",
//             nama_karyawan: "",
//             email: "",
//             no_handphone: "",
//             alamat: "",
//             password: "",
//             status_aktif: false,
//         });

//         setConfirmPassword("");
//         setDisplayDialog(false);
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const actionBodyTemplate = (rowData: Employee) => {
//         return (
//             <>
//                 <Button label="Update" className="p-button-success mr-2" />
//                 <Button label="Delete" className="p-button-danger" />
//             </>
//         );
//     };

//     const header = (
//         <div className="table-header">
//             <Button label="Tambah" icon="pi pi-plus" className="p-button-primary mr-2" onClick={openNew} />
//             <Button label="Logout" icon="pi pi-sign-out" className="p-button-danger" />
//         </div>
//     );

//     return (
//         <div className="card">
//             <h5>Halaman Daftar Karyawannn</h5>
//             <DataTable value={employees} responsiveLayout="scroll" header={header}>
//                 <Column field="id" header="No" body={(data) => data.id}></Column>
//                 <Column field="nik" header="NIK"></Column>
//                 <Column field="nama_karyawan" header="Nama Karyawan"></Column>
//                 <Column field="email" header="Email"></Column>
//                 <Column field="no_handphone" header="No Handphone"></Column>
//                 <Column field="alamat" header="Alamat"></Column>
//                 <Column header="Action" body={actionBodyTemplate}></Column>
//             </DataTable>

//             <Dialog
//                 visible={displayDialog}
//                 header="Tambah Data Karyawan"
//                 modal
//                 style={{ width: "450px" }}
//                 footer={
//                     <>
//                         <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
//                         <Button label="Simpan" icon="pi pi-check" className="p-button-text" onClick={saveEmployee} />
//                     </>
//                 }
//                 onHide={hideDialog}
//             >
//                 <div className="p-field">
//                     <label htmlFor="nik">NIK</label>
//                     <InputText
//                         id="nik"
//                         value={newEmployee.nik}
//                         onChange={(e) => setNewEmployee({ ...newEmployee, nik: e.target.value })} />
//                 </div>
//                 <div className="p-field">
//                     <label htmlFor="nama_karyawan">Nama Karyawan</label>
//                     <InputText
//                         id="nama_karyawan"
//                         value={newEmployee.nama_karyawan}
//                         onChange={(e) => setNewEmployee({ ...newEmployee, nama_karyawan: e.target.value })} />
//                 </div>
//                 <div className="p-field">
//                     <label htmlFor="email">Email</label>
//                     <InputText
//                         id="email"
//                         value={newEmployee.email}
//                         onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
//                 </div>
//                 <div className="p-field">
//                     <label htmlFor="no_handphone">No Handphone</label>
//                     <InputText
//                         id="no_handphone"
//                         value={newEmployee.no_handphone}
//                         onChange={(e) => setNewEmployee({ ...newEmployee, no_handphone: e.target.value })} />
//                 </div>
//                 <div className="p-field">
//                     <label htmlFor="alamat">Alamat</label>
//                     <InputText
//                         id="alamat"
//                         value={newEmployee.alamat}
//                         onChange={(e) => setNewEmployee({ ...newEmployee, alamat: e.target.value })} />
//                 </div>
//                 <div className="p-field">
//                     <label htmlFor="password">Password</label>
//                     <div className="p-inputgroup">
//                         <InputText
//                             id="password"
//                             type={showPassword ? "text" : "password"}
//                             value={newEmployee.password}
//                             onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} />
//                         <Button icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} onClick={togglePasswordVisibility} />
//                     </div>
//                 </div>
//                 <div className="p-field">
//                     <label htmlFor="confirm_password">Konfirmasi Password</label>
//                     <InputText
//                         id="confirm_password"
//                         type={showPassword ? "text" : "password"}
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)} />
//                 </div>
//             </Dialog>
//         </div>
//     );
// };

// export default KaryawanDemo;
