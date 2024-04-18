import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Shared/Modal";
import { FaRegTrashAlt } from "react-icons/fa";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Parameters() {
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
  const [totalItems, setTotalItems] = useState(10);
  const [totalPages, SetTotalPages] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [pageSize, SetPageSize] = useState(10);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [comboNames, setComboNames] = useState([]);
  const [selectedOptionCombo, setSelectedOptionCombo] = useState(null);
  const [selectedReference, setSelectedReference] = useState(null);
  const [selectedOption, setSelectedOption] = useState({
    text: "All Categories",
    value: "All",
  }); // State untuk menyimpan opsi yang dipilih

  const dropdownOptions = [
    { text: "All Categories", value: "All" },
    { text: "Reference name", value: "RefereceName" },
    { text: "Description", value: "Description" },
    { text: "Order", value: "Order" },
  ];
  const [editDataFromApi, setEditDataFromApi] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    DataReferenceId: "",
    RefereceName: "",
  });

  const openModal = () => {
    setShowModal(true);
  };

  const handleEdit = async (data) => {
    setEditData(data);
    setShowModal(true);
    try {
      const response = await axios.get(`${api}/api/ParamChecks/${data.Id}`);
      setFormData({
        ...response.data,
        RefereceName: response.data.RefereceName,
        DataReferenceId: response.data.DataReferenceId,
      });
      setSelectedReference({
        value: response.data.Id,
        label: response.data.RefereceName,
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${api}/api/ParamChecks/${editData.Id}`,
        formData
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
      await axios.delete(`${api}/api/ParamChecks/${Id}`);
      // Tampilkan notifikasi sukses
      toast.success("Data berhasil dihapus");
      // Muat ulang data setelah penghapusan
      setSaveData(true);
    } catch (error) {
      // Tangani kesalahan
      toast.error("Gagal menghapus data");
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
      DataReferenceId: "",
      RefereceName: "",
    });
    setEditData(null);
    setEditDataFromApi(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // formData.RefereceName
  };
  const handlerecordPerPage = (event) => {
    event.preventDefault();
    const page = event.target.value;
    SetPageSize(page);
  };
  const handleSubmit = async (e) => {
    
    console.log("Form Data:", formData);
    console.log("Submitting form data...");
    e.preventDefault();
    if (editData) {
      handleUpdate();
    } else {
      console.log("Coba simpan");
      try {
        const newFormData = {
          ...formData,
          ParameterChecks: dynamicInputsData,
        };
        setFormData(newFormData);
        console.log(`${api}/api/ParamChecks`, newFormData);
        const response = await axios.post(`${api}/api/ParamChecks`, newFormData);

        toast.success("Data berhasil disimpan");
        setFormData({
          DataReferenceId: "",
          RefereceName: "",
        });
        closeModal();
        setSaveData(true);
      } catch (error) {
        toast.error(error.response.data);
      }
      
    }
  };

  useEffect(() => {
    if (!error && !showModal) {
      setError("");
    }
  }, [showModal, error]);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    SetCurrentPage(currentPage);
  };

  useEffect(() => {
    fetchData("Change", currentPage, pageSize);
  }, [pageSize, currentPage, saveData, showModal, openDlg]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const nextInput = e.target.form.querySelector(
        "input:not([disabled]):not([readonly])"
      );

      if (nextInput) {
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
    const fetchComboNames = async () => {
      try {
        const response = await axios.get(`${api}/api/DataReference`);
        // Format data dari API sesuai dengan kebutuhan react-select
        const formattedData = response.data.Items.$values.map((item) => ({
          value: item.Id,
          label: item.RefereceName,
        }));
        setComboNames(formattedData);
      } catch (error) {
        toast.error("Error fetching Station names:" + error);
      }
    };

    fetchComboNames();
  }, []);
  const handleStationSelect = (selectedOption) => {
    setSelectedReference(selectedOption);

    if (selectedOption) {
      setFormData({
        ...formData,
        DataReferenceId: selectedOption.value,
        RefereceName: selectedOption.RefereceName,
      });
    }
    // Lakukan apa pun yang perlu Anda lakukan dengan stasiun yang dipilih di sini
  };
  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible); // Toggle state ketika tombol dropdown diklik
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false); // Menutup dropdown setelah opsi dipilih
  };
  const transformData = (data) => {
    const transformedItems = data.Items.$values.reduce((result, item) => {
      const { DataReferenceId, DataReference, ...parameterCheck } = item;
      const existingItem = result.find((i) => i.Id === DataReferenceId);

      if (existingItem) {
        existingItem.ParameterChecks.push(parameterCheck);
      } else {
        result.push({
          ...DataReference,
          ParameterChecks: [parameterCheck],
        });
      }

      return result;
    }, []);

    return {
      Items: transformedItems,
      TotalItems: transformedItems.length,
      TotalPages: data.TotalPages,
      CurrentPage: data.CurrentPage,
      PageSize: data.PageSize,
    };
  };

  const fetchData = async (dari = "sana", pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        `${api}/api/ParamChecks?pageNumber=${pageNumber}&pageSize=${pageSize}&SearchQuery=${searchQuery}&Category=${selectedOption.value}`
      );

      const transformedData = transformData(response.data);
      setdataProduct(transformedData.Items);
      setTotalItems(transformedData.TotalItems);
      SetTotalPages(transformedData.TotalPages || 1);
    } catch (error) {
      toast.error(`Error fetching data:${dari} -  ${error.message}`, {});
    }
  };
  function Row({ dataItem, index }) {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <TableRow
          sx={{
            "& > *": {
              borderBottom: "unset",
            },

            backgroundColor: index % 2 === 0 ? "white" : "lightgrey", // Warna latar belakang baris bergantung pada indeks (ganjil/genap)
          }}
          style={{ height: "20px" }}
        >
          <TableCell className="w-1">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              sx={{ p: 1 }} // Set padding to 1
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {dataItem.RefereceName}
          </TableCell>
          <TableCell align="right">
            <IconButton aria-label="edit" sx={{ color: "blue" }}>
              {" "}
              {/* Edit button color set to yellow */}
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" sx={{ color: "red" }}>
              {" "}
              {/* Delete button color set to red */}
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Parameter Checks
                </Typography>
                <Table size="small" aria-label="parameter-checks">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataItem.ParameterChecks.map((check) => (
                      <TableRow key={check.Id}>
                        <TableCell>{check.Description}</TableCell>
                        <TableCell>{check.Order}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
  const [inputValues, setInputValues] = useState([""]); // State untuk menyimpan nilai input box
  const [valIn, setValIn] = useState([]);
  const handleAddIn = () => {
    const abc = [...valIn, []];
    setValIn(abc);
  };
  const handleChangeIn = (onChangeValue, i) => {
    const inputdata = [...valIn];
    inputdata[i] = onChangeValue.target.value;
    setValIn(inputdata);
  };
  const handleDeleteIn = (i) => {
    const deletVal = [...valIn];
    deletVal.splice(i, 1);
    setValIn(deletVal);
  };

  const dynamicInputsData = valIn.map((value, index) => ({
    Description: value,
    Order: index + 1, // Menambahkan nomor urutan
  }));
  const handleMoveUp = (index) => {
    if (index === 0) return; // Jika sudah di posisi paling atas, jangan lakukan apa-apa
    const updatedInputs = [...valIn];
    const temp = updatedInputs[index - 1];
    updatedInputs[index - 1] = updatedInputs[index];
    updatedInputs[index] = temp;
    setValIn(updatedInputs);
  };
  
  const handleMoveDown = (index) => {
    if (index === valIn.length - 1) return; // Jika sudah di posisi paling bawah, jangan lakukan apa-apa
    const updatedInputs = [...valIn];
    const temp = updatedInputs[index + 1];
    updatedInputs[index + 1] = updatedInputs[index];
    updatedInputs[index] = temp;
    setValIn(updatedInputs);
  };
  return (
    <div className="z-0 ">
      <div className="fixed top-0 right-4 mb-4 mr-2 mt-11 z-30">
        <button
          onClick={openModal}
          className=" bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          ADD Parameter
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
            placeholder="Search Reference Station Id, Station Name ..."
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
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead className="bg-green-600 text-white">
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Reference Name
                      </TableCell>{" "}
                      {/* Gaya teks diubah menjadi putih dan tebal */}
                      <TableCell
                        align="right"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Actions
                      </TableCell>{" "}
                      {/* Gaya teks diubah menjadi putih dan tebal */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataProduct.map((item, index) => (
                      <Row key={item.Id} dataItem={item} index={index} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                    <strong>Reference </strong>
                    <span>
                      {" "}
                      : {data.RefereceName ? data.RefereceName : "-"}
                    </span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Station Id </strong>
                    <span>
                      {" "}
                      :{" "}
                      {data.ParameterChecks.Description
                        ? data.ParameterChecks.Description
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <span>
                      {" "}
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => handleEdit(data)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => confirmDelete(data.Id, data.StationID)}
                      >
                        Delete
                      </button>
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
            <h2 className="text-lg font-bold mb-4">
              {editData ? "Edit Parameter" : "Add Parameter"}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            <form 
            id="parameterForm"
            onSubmit={handleSubmit}>
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Reference Name
              </label>
              <Select
                className="mb-3"
                options={comboNames}
                value={selectedReference}
                onChange={handleStationSelect}
              />
              {selectedReference && (
                <div className="mb-7">
                  <button
                    type="button" // Tambahkan atribut type="button" di sini
                    onClick={() => handleAddIn()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                  >
                    Next Parameter
                  </button>
                  {valIn.map((data, i) => {
                    return (
                      <div className="mb-4" key={i}>
                        <input
                          value={data}
                          onChange={(e) => handleChangeIn(e, i)}
                          className="border rounded py-2 px-3 mr-2"
                        />
                        <button
                          onClick={() => handleDeleteIn(i)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          x
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex justify-between">
              <button
                type="submit"
                // onClick={handleSubmit}
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
