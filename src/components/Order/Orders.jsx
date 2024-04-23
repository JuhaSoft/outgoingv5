import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import globalConfig from '../../config'
import axios from "axios";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import OrdersInfo from "./OrdersInfo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Orders() {
  const appConfig = window.globalConfig || { siteName: process.env.REACT_APP_SITENAME} 
  const api =appConfig.APIHOST
  const [error, setError] = useState("");
  const [saveData, setSaveData] = useState(Boolean);
  const [dataProduct, setdataProduct] = useState([]);
  const [tbldata, settbldata] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [totalItems, setTotalItems] = useState(10);
  const [totalPages, SetTotalPages] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [pageSize, SetPageSize] = useState(10);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    text: "All Categories",
    value: "All",
  }); // State untuk menyimpan opsi yang dipilih
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("UserId");

  const dropdownOptions = [
    { text: "All Categories", value: "All" },
    { text: "Work Order", value: "WoNumber" },
    { text: "Sales Order", value: "SONumber" },
    { text: "Reference", value: "WoReferenceID" },
    { text: "Wo Qty", value: "WoQTY" },
    { text: "Wo Status", value: "WoStatus" },
    { text: "User", value: "DisplayName" },
    { text: "Date", value: "WoCreate" },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    WoNumber: "",
    SONumber: "",
    WoReferenceID: "",
    WoQTY: "",
    WoStatus: "Open",
    // WoCreate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    UserIdCreate: userId,
    WOisDeleted: false,
  });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset nilai input ke nilai awal
    setFormData({
      WoNumber: "",
      SONumber: "",
      WoReferenceID: "",
      WoQTY: "",
      WoStatus: "Open",
      UserIdCreate: userId,
      WOisDeleted: false,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handlerecordPerPage = (event) => {
    event.preventDefault();
    const page = event.target.value;
    SetPageSize(page);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.post(`${api}/api/WO`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      

      // Menampilkan notifikasi sukses
      toast.success("Data berhasil disimpan");
      setFormData({
        WoNumber: "",
        SONumber: "",
        WoReferenceID: "",
        WoQTY: "",
        WoStatus: "Open",
        // WoCreate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        UserIdCreate: "35940325-2c3f-4319-8279-6a29dc1ef508",
        WOisDeleted: false,
      });
      // Tutup modal
      if (saveData) {
        setSaveData(false);
      } else {
        setSaveData(true);
      }

      closeModal();
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
        toast.error("Terjadi kesalahan");
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
  };
  useEffect(() => {
    if (!error && !showModal) {
      // Reset error state jika tidak ada kesalahan dan modal ditutup
      setError("");
    }
  }, [showModal, error]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    SetCurrentPage(currentPage);
    // fetchData("Handle Page ", currentPage, pageSize);
    
  };
  // useEffect(() => {
  //   fetchData("Loading Awal");
  // }, []);
  useEffect(() => {
   fetchData("Change",currentPage,pageSize);
  }, [pageSize, currentPage, saveData]);
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
    // console.log("test");
    event.preventDefault();

    fetchData("handleSearch"); // Panggil fungsi fetchData dengan parameter default
    // Untuk mengomentari kode, gunakan shortcut berikut:
    // - Di Windows/Linux: Ctrl + /
    // - Di MacOS: Cmd + /
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible); // Toggle state ketika tombol dropdown diklik
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false); // Menutup dropdown setelah opsi dipilih
  };
  const fetchData = async (dari = "sana", pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        `${api}/api/WO?pageNumber=${pageNumber}&pageSize=${pageSize}&SearchQuery=${searchQuery}&Category=${selectedOption.value}`
      );
      setdataProduct(response.data.Items.$values);
      setTotalItems(response.data.TotalItems);
      if (response.data.TotalPages) {
        SetTotalPages(response.data.TotalPages);
      } else {
        SetTotalPages(1); // Atau tetapkan ke 1 jika tidak ada TotalPages
      }
    } catch (error) {
      // toast.error(`Error fetching data dari :${dari} ${error.message}
      toast.error(`Error fetching data:${dari} -  ${error.message}`, {});
    }
  };

  return (
    <div className="z-0 ">
      
      {/* <button
        type="button"
        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 absolute -top-3 left-3"
        onClick={openModal}
      >
        ADD WO
      </button> */}
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
            placeholder="Search Work Order, Sales Order, Reference ..."
            
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
        <div className="fixed top-0 right-4 mb-4 mr-2 mt-11 z-30">
        <button
          onClick={openModal}
          className=" bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          ADD Order
        </button>
      </div>
        <section className="container mx-auto p-2 font-mono hidden sm:table w-full">
          <div className="w-full mb-2 overflow-hidden rounded-lg shadow-lg">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-md font-semibold tracking-wide text-left text-white bg-green-600 uppercase border-b border-gray-600">
                    <th className="px-4 ">WO Number</th>
                    <th className="px-4">SO Number</th>
                    <th className="px-4 ">Reference</th>
                    <th className="px-4 ">WO QTY</th>
                    <th className="px-4 ">WO STATUS</th>
                    <th className="px-4 ">Date</th>
                    <th className="px-4 ">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {dataProduct.map((data, index) => (
                    <tr className="text-gray-700" key={index}>
                      <td
                        data-name="PSN"
                        className="px-2 text-ms font-semibold border"
                      >
                        {data.WoNumber ? data.WoNumber : "-"}
                      </td>
                      <td
                        data-name="Reference"
                        className="px-2  text-xs border"
                      >
                        {data.SONumber ? data.SONumber : "-"}
                      </td>
                      <td data-name="WO" className="px-2 text-xs border">
                        {data.WoReferenceID ? data.WoReferenceID : "-"}
                      </td>
                      <td
                        data-name="LastStation"
                        className="px-2  text-xs border"
                      >
                        {data.WoQTY ? data.WoQTY : "-"}
                      </td>
                      <td data-name="Wostatus" className="px-2  text-xs border">
                        {data.WoStatus ? data.WoStatus : "-"}
                      </td>
                      <td data-name="Date" className="px-2 py-1 text-xs border">
                        {format(new Date(data.WoCreate), "dd-MM-yyyy HH:mm:ss")
                          ? format(
                              new Date(data.WoCreate),
                              "dd-MM-yyyy HH:mm:ss"
                            )
                          : "NOt Valid"}
                        {/* {data.trackingDateCreate} */}
                      </td>
                      <td
                        data-name="Date"
                        className="px-2 py-1 text-xs border text-center"
                      >
                        {/* <button
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          Detail
                        </button> */}
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
            <div className="w-full overflow-x-auto ">
              {dataProduct.map((data, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 shadow-lg rounded-lg sm:flex sm:flex-wrap sm:justify-normal ${
                    index % 2 === 0 ? "bg-green-200" : "bg-white"
                  } border-5`}
                >
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>WO Number </strong>
                    <span> : {data.WoNumber ? data.WoNumber : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>SO Number </strong>
                    <span> : {data.SONumber ? data.SONumber : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Reference </strong>
                    <span>
                      {" "}
                      : {data.WoReferenceID ? data.WoReferenceID : "-"}
                    </span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>WO QTY </strong>
                    <span> : {data.WoQTY ? data.WoQTY : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>WO STATUS </strong>
                    <span> : {data.WoStatus ? data.WoStatus : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Date </strong>
                    <span>
                      {" "}
                      :{" "}
                      {data.WoCreate
                        ? format(new Date(data.WoCreate), "dd-MM-yyyy HH:mm:ss")
                        : "Not Valid"}
                    </span>
                  </div>
                  {/* Tempat untuk tombol aksi jika diperlukan */}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className=" mt-1 w-full">
        <div className="flex flex-col md:flex-row justify-start md:justify-between">
          <div className="w-full mt-2">
            <div className="sm:flex-none sm:object-center ">
              <select
                name="item"
                className="  w-16   text-base   bg-white text-gray-800 border border-green-700 rounded items-center   align-middle  justify-start"
                onChange={(e) => handlerecordPerPage(e)}
              >
                <option>10</option>
                <option>20</option>
                <option>30</option>
                <option>50</option>
                <option>100</option>
                <option>{totalItems}</option>
              </select>
              <div>From {totalItems} Record</div>
            </div>
          </div>
          <div className="flex align-middle  md:justify-end ">
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex justify-center mt-4"}
              pageClassName={"mx-1"}
              pageLinkClassName={
                "px-3 py-2 bg-white text-green-500 border border-green-500 rounded-md"
              }
              previousClassName={"mr-1"}
              previousLinkClassName={
                "px-3 py-2 bg-white text-green-500 border border-green-500 rounded-md"
              }
              nextClassName={"ml-1"}
              nextLinkClassName={
                "px-3 py-2 bg-white text-green-500 border border-green-500 rounded-md"
              }
              breakClassName={"mx-1"}
              breakLinkClassName={
                "px-3 py-2 bg-white text-green-500 border border-green-500 rounded-md"
              }
              activeClassName={"font-bold  text-white"}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">ADD Work Order</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Work Order
              </label>
              <input
                type="text"
                name="WoNumber"
                value={formData.WoNumber}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Mendeteksi tombol Enter
                placeholder="Work Order"
                className="mb-2 p-2 border rounded"
                style={{ width: "100%" }} // Menetapkan lebar 100%
                tabIndex={0}
              />
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sales Order
              </label>
              <input
                type="text"
                name="SONumber"
                value={formData.SONumber}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Mendeteksi tombol Enter
                placeholder="SO"
                className="mb-2 p-2 border rounded"
                tabIndex={1}
              />
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Reference
              </label>
              <input
                type="text"
                name="WoReferenceID"
                value={formData.WoReferenceID}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Reference"
                className="mb-2 p-2 border rounded"
                tabIndex={2}
              />
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Quantity
              </label>
              <input
                type="text"
                name="WoQTY"
                value={formData.WoQTY}
                onChange={handleChange}
                placeholder="Quantity"
                className="mb-4 p-2 border rounded"
                tabIndex={3}
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Save
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
    </div>
  );
}
