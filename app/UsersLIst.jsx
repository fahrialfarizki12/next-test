"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const UsersLIst = ({ DATA_USERS, page = 1, search, limit = 5, total }) => {
  const [dataUsers, setDataUsers] = useState(DATA_USERS);
  const [editUsers, setEditUsers] = useState(null);
  const [currentSearch, setCurrentSearch] = useState(search);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/?page=1&limit=${limit}&search=${currentSearch}`);
  };
  const handlePage = (newPage) => {
    router.push(`/?page=${newPage}&limit=${limit}&search=${currentSearch}`);
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang sudah dihapus akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://crud-api-fahri.vercel.app/users/${id}`);

        Swal.fire({
          title: "Data berhasil dihapus!",
          icon: "success",
        });

        setDataUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } catch (error) {
        Swal.fire({
          title: "Gagal menghapus data!",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  const openModal = (user = null) => {
    setEditUsers(user);
    document.getElementById("my_modal_1").showModal();
  };

  const closeModal = () => {
    setEditUsers(null);
    document.getElementById("my_modal_1").close();
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const dataForm = new FormData(form);
    const formData = Object.fromEntries(dataForm);

    try {
      if (editUsers) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/users/${editUsers.id}`,
          formData
        );

        Swal.fire({
          title: "Data berhasil diUpdate!",
          icon: "success",
        });

        setDataUsers((prevEdit) =>
          prevEdit.map((user) =>
            user.id === editUsers.id ? { ...user, ...formData } : user
          )
        );
      } else {
        router.push(`/?page=${page}&limit=${limit}&search=${currentSearch}`);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/users`,
          formData
        );

        Swal.fire({
          title: "Data berhasil disimpan!",
          icon: "success",
        });
        setDataUsers((prevUser) => [...prevUser, response.data]);
      }

      form.reset();
      closeModal();
    } catch (error) {
      closeModal();
      form.reset();
      Swal.fire({
        title: "Gagal menyimpan data!",
        text: error?.response?.data.message,
        icon: "error",
      });
    }
  };
  useEffect(() => {
    setDataUsers(DATA_USERS);
  }, [DATA_USERS]);
  return (
    <>
      <div className="w-full max-w-5xl flex mx-auto justify-between mt-10">
        <button
          onClick={() => openModal()}
          className="btn bg-slate-900 text-white"
        >
          Tambah Akun
        </button>
        <input
          type="text"
          placeholder="Cari user..."
          value={currentSearch}
          onChange={(e) => setCurrentSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={handleSearch} className="btn bg-slate-900 text-white">
          Cari
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <div className="overflow-x-auto w-full max-w-5xl mx-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Email</th>
                <th>Nama</th>
                <th>Password</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Data Tidak Ditemukan
                  </td>
                </tr>
              ) : (
                dataUsers.map((item, index) => (
                  <tr key={index}>
                    <th>{(page - 1) * limit + index + 1}</th>
                    <td>{item.email}</td>
                    <td>{item.name}</td>
                    <td>{item.password}</td>
                    <td className="flex gap-2 flex-col sm:flex-row">
                      <FaRegTrashAlt
                        onClick={() => handleDelete(item.id)}
                        className="cursor-pointer"
                        size={15}
                      />
                      <HiOutlinePencilSquare
                        onClick={() => openModal(item)}
                        className="cursor-pointer"
                        size={15}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {editUsers ? "Update Akun" : "Tambah Akun"}
          </h3>
          <div className="py-4">
            <form onSubmit={handleForm}>
              <div className="mb-3">
                <label className="mb-1">Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  defaultValue={editUsers?.email || ""}
                  className="w-full p-2 border rounded border-slate-200 focus:border-slate-800 transition duration-150 ease-in transform"
                />
              </div>
              <div className="mb-3">
                <label className="mb-1">Nama</label>
                <input
                  type="text"
                  required
                  name="name"
                  defaultValue={editUsers?.name || ""}
                  className="w-full p-2 border rounded border-slate-200 focus:border-slate-800 transition duration-150 ease-in transform"
                />
              </div>
              <div className="mb-3">
                <label className="mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  defaultValue={editUsers?.password || ""}
                  className="w-full p-2 border rounded border-slate-200 focus:border-slate-800 transition duration-150 ease-in transform"
                />
              </div>
              <div className="mb-3">
                <button className="btn bg-slate-900 w-full text-white">
                  {editUsers ? "Update" : "Buat akun"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button onClick={closeModal} className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* pagination */}
      <div className="flex justify-center mt-4 gap-6">
        <button
          className="btn bg-slate-900 text-white"
          onClick={() => handlePage(page - 1)}
          disabled={page === 1}
        >
          Sebelumnya
        </button>
        <span className="flex items-center">
          page {page} of {total}
        </span>
        <button
          className="btn bg-slate-900 text-white"
          onClick={() => handlePage(page + 1)}
          disabled={page === total}
        >
          Selanjutnya
        </button>
      </div>
    </>
  );
};

export default UsersLIst;
