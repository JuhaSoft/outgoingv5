import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import globalConfig from '../../config'
import axios from "axios";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Shared/Modal";
import { FaRegTrashAlt } from "react-icons/fa";
export default function Users() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [openDlg, setOpenDlg] = useState(false);
  const [error, setError] = useState("");
  const [idDelete, setidDelete] = useState("");
  const [StationIDDelete, setStationIDDelete] = useState("");
  const [saveData, setSaveData] = useState(Boolean);
  const [dataProduct, setdataProduct] = useState([]);
  const [tbldata, settbldata] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [lineNames, setLineNames] = useState([]);
  let token = localStorage.getItem("token");
  const [selectedOption, setSelectedOption] = useState({
    text: "All Categories",
    value: "All",
  }); // State untuk menyimpan opsi yang dipilih

  const dropdownOptions = [
    { text: "All Categories", value: "All" },
    { text: "User Name", value: "UserName" },
    { text: "Role", value: "Role" },
    { text: "Status", value: "IsActive	" },
  ];
  const [editDataFromApi, setEditDataFromApi] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    DisplayName: "",
    UserName: "",
    Password:"Pass1234",
    Role: "",
    IsActive: true,
  });

  const openModal = () => {
    setShowModal(true);
  };

  const handleEdit = async (data) => {
    setEditData(data);
    setShowModal(true);
    
    try {
      const response = await axios.get(`${api}/api/Account/${data.Id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditDataFromApi(response.data);
      // Set formData with proper Role and IsActive values
      const formDataWithRole = {
        ...response.data,
        Role: response.data.Role ? response.data.Role : "Select Role",
        IsActive: response.data.IsActive ? "true" : "false",
        Image:response.data.Image ? response.data.Image : ""
      };
      setFormData(formDataWithRole);
    } catch (error) {
      toast.error(error.response.data);
    }
  };
 
  
  const handleUpdate = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Ganti yourAuthTokenHere dengan token yang sesuai
        },
      };
  
      const updateData = {
        DisplayName: "Nama yang ingin diperbarui", // Ganti dengan nilai yang sesuai
      };
  
      const response = await axios.put(
        `${api}/api/Account/update`,
        formData,
        config
      );
  
      // Menampilkan notifikasi sukses
      toast.success("Data berhasil diperbarui");
      // Tutup modal
      closeModal();
      // Membuat permintaan kembali untuk memperbarui data di tabel
      setSaveData(true);
    } catch (error) {
      if (error.response) {
        // Tangani kesalahan dari respons server
        if (error.response.data && error.response.data.errors) {
          // Tangani kesalahan validasi
          const validationErrors = error.response.data.errors;
          const errorMessage = Object.values(validationErrors)
            .map((errors) => errors.join(", "))
            .join("; ");
          setError(errorMessage);
        } else {
          // Tangani kesalahan lain dari respons server
          setError(error.response.data.message);
        }
        toast.error("Terjadi kesalahan: " + error.response.data);
      } else if (error.request) {
        // Tangani kesalahan tanpa respons dari server
        setError("Tidak ada respons dari server");
        toast.error("Tidak ada respons dari server");
      } else {
        // Tangani kesalahan lainnya
        toast.error("Terjadi kesalahan");
      }
    }
  };
  
  

  const handleDelete = async (Id) => {

    try {

     
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Ganti yourAuthTokenHere dengan token yang sesuai
        },
      };
      const dataToSend = {};
      
      const response = await axios.put(
        `${api}/api/Account/updateDelete/${Id}`,
        formData,
        config
      );
      // Tampilkan notifikasi sukses
      toast.success("Data berhasil dihapus");
      // Muat ulang data setelah penghapusan
      setSaveData(true);
    } catch (error) {
      toast.error('Error sending data:', error.response.data);

    }
    setOpenDlg(false);
  };
  const confirmDelete = (Gid, id) => {
    setidDelete(Gid);
    setStationIDDelete(id);
    setOpenDlg(true);
    // if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    //   handleDelete(Gid); // Jika pengguna menekan OK, panggil fungsi handleDelete
    // }
  };
  const closeModal = () => {
    setShowModal(false);
    // Reset nilai input ke nilai awal
    setFormData({
      DisplayName: "",
    UserName: "",
    Password:"Pass1234",
    Role: "",
      IsActive: true,
    });
    // Reset nilai editData untuk menandakan tidak ada data yang sedang diedit
    setEditData(null);
    // Reset nilai editDataFromApi untuk menghapus data yang diambil dari API
    setEditDataFromApi(null);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "Role") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name === "IsActive") {
      // Konversi nilai "true" atau "false" menjadi tipe boolean
      const isActiveValue = value === "true";
      setFormData({
        ...formData,
        [name]: isActiveValue,
      });
    } else {
      // Check jika dalam mode edit, dan jika nama adalah UserName
      if (editData && name === "UserName") {
        // Jangan perbarui UserName dalam mode edit
        setFormData({
          ...formData,
          // Gunakan UserName yang sudah ada dari editData
          [name]: editData.UserName,
        });
      } else {
        setFormData({
          ...formData,
          [name]: event.target.value,
        });
      }
    }
  };
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (editData) {
      handleUpdate();
    } else {
      try {
        const response = await axios.post(`${api}/api/Account/register`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success("Data berhasil disimpan");
        setFormData({
          DisplayName: "",
    UserName: "",
    Password:"Pass1234",
    Role: "",
          IsActive: true,
        });
        closeModal();
        setSaveData(true);
      } catch (error) {
        if (error.response) {
          // Tangani kesalahan dari respons server
          if (error.response.data && error.response.data.errors) {
            // Tangani kesalahan validasi
            const validationErrors = error.response.data.errors;
            const errorMessage = Object.values(validationErrors)
              .map((errors) => errors.join(", "))
              .join("; ");
            setError(errorMessage);
          } else {
            // Tangani kesalahan lain dari respons server
            setError(error.response.data.message);
          }
          // Menampilkan error dari respons server
          toast.error("Error: " + error.response.data.message);
        } else if (error.request) {
          // Tangani kesalahan tanpa respons dari server
          setError("Tidak ada respons dari server");
          toast.error("Tidak ada respons dari server");
        } else {
          // Tangani kesalahan lainnya
          setError("Terjadi kesalahan");
          toast.error("Terjadi kesalahan");
        }
      }
    }
  };
  

  useEffect(() => {
    if (!error && !showModal) {
      setError("");
    }
  }, [showModal, error]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Temukan input berikutnya dalam urutan tab
      const nextInput = e.target.form.querySelector(
        "input:not([disabled]):not([readonly])"
      );

      if (nextInput) {
        // Pindahkan fokus ke input berikutnya
        nextInput.focus();
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputs = e.target.form.elements;
      const index = Array.prototype.indexOf.call(inputs, e.target);
      if (inputs[index + 1]) {
        inputs[index + 1].focus();
      }
      e.preventDefault();
    }
  };
  const handleSearch = (event) => {
    event.preventDefault();

    fetchData("handleSearch");
  };
  useEffect(() => {
    const fetchLineNames = async () => {
      try {
        const response = await axios.get(`${api}/api/DataLine`);
        setLineNames(response.data.Items.$values);
      } catch (error) {
        toast.error("Error fetching line names:" + error);
      }
    };

    fetchLineNames();
  }, []);
  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible); // Toggle state ketika tombol dropdown diklik
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false); // Menutup dropdown setelah opsi dipilih
  };
  useEffect(() => {
    fetchData("Change");
  }, [saveData, showModal, openDlg]);

  const fetchData = async (dari = "sana") => {
    try {
     

      const response = await axios.get(`${api}/api/Account/allUsers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menggunakan token dari localStorage
        },
      });
      setdataProduct(response.data.$values);
    } catch (error) {
      // toast.error(`Error fetching data dari :${dari} ${error.message}`);
      toast.error(`Error fetching data: ${dari} - ${error.message}`);
    }
  };
  return (
    <div className="z-0 ">
      <div className="fixed top-0 right-4 mb-4 mr-2 mt-11 z-30">
        <button
          onClick={openModal}
          className=" bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          ADD User
        </button>
      </div>

      <form
        className="max-w-lg mx-auto md:flex md:items-center md:flex-row-reverse items-center "
        onSubmit={handleSearch}
      >
        <div className="relative flex-grow  sm:w-3/4 md:w-auto ">
          <label htmlFor="search-dropdown" className="sr-only">
            Search
          </label>
          <input
            type="search"
            id="search-dropdown"
            className=" block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder="Search Display Name,User Name ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-green-600 rounded-r-lg border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
        <div className="md:ml-4">
          <div className="relative  sm:w-3/4 md:w-auto ">
            <label htmlFor="dropdown-button" className="sr-only ">
              Select Category
            </label>
            <button
              id="dropdown-button"
              onClick={handleDropdownToggle}
              className="flex-shrink-0 inline-flex items-center justify-center w-full md:w-auto py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg md:rounded-none md:rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            >
              {selectedOption.text}{" "}
              <svg
                className="w-2.5 h-2.5 ml-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdown"
              className={`absolute top-full left-0 z-20 ${
                dropdownVisible ? "" : "hidden"
              } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200 z-21 text-right"
                aria-labelledby="dropdown-button"
              >
                {dropdownOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto   shadow-md sm:rounded-lg mt-6">
        <section className="container mx-auto p-2 font-mono hidden sm:table w-full">
          <div className="w-full mb-2 overflow-hidden rounded-lg shadow-lg">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-md font-semibold tracking-wide text-left text-white bg-green-600 uppercase border-b border-gray-600">
                    <th className="px-4 ">Display Name</th>
                    <th className="px-4 ">User Name</th>
                    <th className="px-4">Role</th>
                    <th className="px-4">Active</th>
                    <th className="px-4 w-[200px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {dataProduct.map((data, index) => (
                    <tr className="text-gray-700" key={index}>
                      <td
                        data-name="PSN"
                        className="px-2 text-ms font-semibold border"
                      >
                        {data.DisplayName ? data.DisplayName : "-"}
                      </td>
                      <td
                        data-name="PSN"
                        className="px-2 text-ms font-semibold border"
                      >
                        {data.UserName ? data.UserName : "-"}
                      </td>
                      <td
                        data-name="Reference"
                        className="px-2  text-xs border"
                      >
                        {data.Role ? data.Role : "Not Set"}
                      </td>
                      <td
  data-name="Reference"
  className="px-2 text-xs border"
>
{data.IsActive !== null ? (data.IsActive === true ? "Active" : "Non Active") : "Active"}


</td>
                      <td className="px-2 flex justify-center items-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                          onClick={() => handleEdit(data)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                          onClick={() => confirmDelete(data.Id, data.UserName)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="container mx-auto p-2 font-mono sm:hidden">
          <div className="w-full mb-2 overflow-hidden rounded-lg shadow-lg">
            <div className="w-full overflow-x-auto "></div>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">
              {editData ? "Edit User" : "Add User"}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Display Name
              </label>
              <input
                type="text"
                name="DisplayName"
                value={formData.DisplayName}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Mendeteksi tombol Enter
                placeholder="Display Name"
                className="mb-2 p-2 border rounded"
                style={{ width: "100%" }} // Menetapkan lebar 100%
                tabIndex={0}
              />
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                User Name
              </label>
              <input
                type="text"
                name="UserName"
                value={formData.UserName}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Mendeteksi tombol Enter
                placeholder="User Name"
                className="mb-2 p-2 border rounded"
                style={{ width: "100%" }} // Menetapkan lebar 100%
                tabIndex={0}
              />
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Role
              </label>
              <select
                id="Role"
                name="Role"
                value={formData.Role}
                onChange={handleChange}
                className="mb-2 p-2 border rounded"
                tabIndex={1}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Staf">Staf</option>
                <option value="LI">LI</option>
                <option value="Teknisi">Teknisi</option>
                <option value="Operator">Operator</option>
              </select>
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <select
                id="IsActive"
                name="IsActive"
                value={formData.IsActive}
                onChange={handleChange}
                className="mb-2 p-2 border rounded"
                tabIndex={1}
              >
               <option value="true">Active</option>
                <option value="false">Non Active</option>
              </select>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {editData ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Modal open={openDlg} onClose={() => setOpenDlg(false)}>
        <div className="text-center w-56">
          <FaRegTrashAlt size={56} className="mx-auto text-red-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this item ?
            </p>
            <p>{StationIDDelete}</p>
          </div>
          <div className="flex gap-4">
            <button
              className="btn btn-danger w-full"
              onClick={() => handleDelete(idDelete)}
            >
              Delete
            </button>
            <button
              className="btn btn-light w-full"
              onClick={() => setOpenDlg(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
