"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const UsersPage = ({ users }) => {
  const [data, setData] = useState(users || []);

  const handleModal = () => {
    document.getElementById("my_modal_1").showModal();
  };

  const handleClose = () => {
    document.getElementById("my_modal_1").close();
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newData = Object.fromEntries(formData);

    try {
      const response = await axios.post(
        "https://crud-api-fahri.vercel.app/users",
        newData
      );
      setData([...data, response.data]);
      console.log(response.data);

      document.getElementById("my_modal_1").close();
      form.reset();
      Swal.fire({
        title: "Berhasil",
        text: "Data berhasil ditambahkan",
        icon: "success",
      });
    } catch (error) {
      document.getElementById("my_modal_1").close();
      console.log(error);

      Swal.fire({
        title: "Gagal",
        text: "Data gagal ditambahkan",
        icon: "error",
      });
    }
  };

  return (
    <>
      <h1 className="text-center font-semibold my-5 text-4xl">Tabel Akun</h1>
      <div className="flex justify-center items-center w-full flex-col">
        <button onClick={handleModal} className="btn bg-slate-900 text-white">
          Tambah akun
        </button>
        <div className="overflow-x-scroll max-w-6xl w-full p-4">
          <table className="overflow-x-scroll table-auto text-left w-full  bg-slate-900 p-2 text-white border-collapse">
            <thead>
              <tr>
                <th className="p-2">No</th>
                <th className="p-2">Email</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Pasword</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-600">
              {data?.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="divide-x divide-slate-700">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.email || "-"}</td>
                    <td className="p-2">{item.name || "-"}</td>
                    <td className="p-2">{item.password || "-"}</td>
                    <td className="p-2 flex gap-y-2 md:gap-x-2 flex-col md:flex-row">
                      <button className="text-white px-3  rounded-md hover:bg-slate-900/40 bg-slate-900">
                        Edit
                      </button>
                      <button className="text-white px-3 rounded-md border-2 border-white hover:bg-white hover:text-slate-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Tidak ada data tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah data</h3>
          <div className="py-4">
            <form onSubmit={handleForm}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="w-full mt-1 input "
                id="email"
                name="email"
                required
              />
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="w-full mt-1 input "
                id="name"
                name="name"
                required
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="w-full mt-1 input "
                id="password"
                name="password"
                required
              />
              <button className="mt-5 btn w-full text-white bg-slate-900">
                Create
              </button>
            </form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button onClick={handleClose} className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default UsersPage;
