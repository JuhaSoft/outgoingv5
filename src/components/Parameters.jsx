import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaEye, FaEdit } from "react-icons/fa";
import { format } from "date-fns";

export default function Parameters() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [openDlg, setOpenDlg] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageCount, setpageCount] = useState(0);

  const [error, setError] = useState("");
  const [idDelete, setidDelete] = useState("");
  const [StationIDDelete, setStationIDDelete] = useState("");
  const [saveData, setSaveData] = useState(Boolean);
  const [dataProduct, setdataProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalItems, setTotalItems] = useState(10);
  const [totalPages, SetTotalPages] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [pageSize, SetPageSize] = useState(10);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [comboNames, setComboNames] = useState([]);
  const [selectedReference, setSelectedReference] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = React.useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  let token = localStorage.getItem("token");
  const [currentImageModalImages, setCurrentImageModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showEnlargedModal, setShowEnlargedModal] = useState(false);
  const [openCollapse, setOpenCollapse] = useState({});
  const [detailDataMap, setDetailDataMap] = useState({});
  const [selectedOption, setSelectedOption] = useState({
    text: "All Categories",
    value: "All",
  }); // State untuk menyimpan opsi yang dipilih
  const toggleWebcam = () => {
    setShowWebcam(!showWebcam);
  };
  const dropdownOptions = [
    { text: "All Categories", value: "All" },
    { text: "Reference name", value: "RefereceName" },
    { text: "Description", value: "Description" },
    { text: "Order", value: "Order" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [formData, setFormData] = useState({
    Description: "",
    ErrorCode: [],
  });

  const openModal = () => {
    setShowModal(true);
    setShowWebcam(null);
    setCapturedImage(null);
    // Reset nilai state yang terkait dengan data di modal ke nilai awal
    setFormData({
      Description: "",
      ErrorCode: [],
    });
    setValIn([]);
    setSelectedReference(null); // Reset juga selected reference jika diperlukan
  };
  const resetFoto = () => {
    setShowModal(true);
    setShowWebcam(null);
    setCapturedImage(null);
  };
  const fetchErrorMessages = async () => {
    try {
      const response = await axios.get(`${api}/api/ErrorMessage`);
      const formattedData = response.data.Items.$values.map((item) => ({
        value: item.Id,
        label: `${item.ErrorCode} -> ${item.ErrorDescription}`,
      }));
      setErrorMessages(formattedData);
    } catch (error) {
      toast.error("Error fetching error messages:" + error);
    }
  };
  const handleImageClick = (images, index) => {
    setCurrentImageModalImages(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };
  const handleUpdate = async () => {
    try {
      const newFormData = {
        ...formData,
        ParameterChecks: dynamicInputsData,
      };
      const response = await axios.put(
        `${api}/api/ParamChecks/${editData.Id}`,
        newFormData
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
  const fetchDetailData = async (id) => {
    try {
      const response = await axios.get(`${api}/api/Paramchecks/${id}`);

      setDetailDataMap((prevMap) => ({
        ...prevMap,
        [id]: response.data.ParameterCheckErrorMessages.$values,
      }));
    } catch (error) {
      toast.error("Error fetching detail data:", error);
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setCapturedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowWebcam(null);
  }, [webcamRef]);
  const closeModal = () => {
    setShowModal(false);
    // Reset nilai input ke nilai awal
    setFormData({
      Description: "",
      ErrorCode: [],
    });
    setEditData(null);
  };

  const handlerecordPerPage = (event) => {
    event.preventDefault();
    const page = event.target.value;
    SetPageSize(page);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormData = {
      ...formData,
      ErrorCode: dynamicInputsData,
      ImageSampleUrl: capturedImage, // Menambahkan capturedImage ke formData
    };
    setFormData(newFormData);
    if (editData) {
      handleUpdate();
    } else {
      try {
        const response = await axios.post(
          `${api}/api/ParamChecks`,
          newFormData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Data berhasil disimpan");
        setFormData({
          Description: "",
          ErrorCode: [],
          CapturedImage: null, // Reset capturedImage setelah berhasil dikirim
        });
        setCapturedImage(null); // Reset capturedImage setelah berhasil dikirim
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

  useEffect(() => {
    fetchErrorMessages();
  }, []);
  const handleMoveUp = (index) => {
    if (index === 0) return; // Tidak dapat memindahkan elemen pertama ke atas

    const updatedValIn = [...valIn];
    // Tukar posisi elemen dengan elemen sebelumnya
    [updatedValIn[index], updatedValIn[index - 1]] = [
      updatedValIn[index - 1],
      updatedValIn[index],
    ];
    // Perbarui nilai Order untuk elemen yang terpengaruh
    updatedValIn[index].Order = index + 1;
    updatedValIn[index - 1].Order = index;
    setValIn(updatedValIn);
  };

  const handleMoveDown = (index) => {
    if (index === valIn.length - 1) return; // Tidak dapat memindahkan elemen terakhir ke bawah

    const updatedValIn = [...valIn];
    // Tukar posisi elemen dengan elemen setelahnya
    [updatedValIn[index], updatedValIn[index + 1]] = [
      updatedValIn[index + 1],
      updatedValIn[index],
    ];
    // Perbarui nilai Order untuk elemen yang terpengaruh
    updatedValIn[index].Order = index + 1;
    updatedValIn[index + 1].Order = index + 2;
    setValIn(updatedValIn);
  };

  const fetchData = async (dari = "sana", pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        `${api}/api/ParamChecks?pageNumber=${pageNumber}&pageSize=${pageSize}&SearchQuery=${searchQuery}&Category=${selectedOption.value}`
      );

      setdataProduct(response.data.Items.$values);
      setTotalItems(response.data.TotalItems);
      setTotalRecord(response.data.TotalItems);
      SetTotalPages(response.data.TotalPages || 1);
      setpageCount(response.data.TotalPages);
    } catch (error) {
      toast.error(`Error fetching data:${dari} -  ${error.message}`, {});
    }
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible); // Toggle state ketika tombol dropdown diklik
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false); // Menutup dropdown setelah opsi dipilih
  };
  const handleSearch = (event) => {
    event.preventDefault();
    fetchData(); // Panggil fungsi fetchData dengan parameter default
  };
  const [valIn, setValIn] = useState([]);
  const handleAddIn = () => {
    if (valIn.length < errorMessages.length) {
      const abc = [...valIn, []];
      setValIn(abc);
    } else {
      toast.error("Maximum number of error code reached.");
    }
  };

  const handleChangeIn = (onChangeValue, i) => {
    const updatedValIn = [...valIn];
    if (i < updatedValIn.length) {
      updatedValIn[i] = {
        Description: onChangeValue.target.value,
        Order: i + 1,
      };
    } else {
      updatedValIn.push({
        Description: onChangeValue.target.value,
        Order: updatedValIn.length + 1,
      });
    }
    setValIn(updatedValIn);
  };

  const handleDeleteIn = (i) => {
    const deletVal = [...valIn];
    deletVal.splice(i, 1);
    setValIn(deletVal);
  };
  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
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
  const dynamicInputsData = valIn.map((value, index) => ({
    ...value, // Menyalin properti dari objek value
    Order: index + 1, // Menambahkan nomor urutan
  }));
  const handleDetailClick = (id, psn) => {
    setOpenCollapse((prevOpenCollapse) => ({
      ...prevOpenCollapse,
      [id]: !prevOpenCollapse[id],
    }));

    fetchDetailData(id);
  };
  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`${api}/api/ParamChecks/${id}`);
      const editData = response.data;

      setEditData(editData);
      setCapturedImage(`${api}${editData.ImageSampleUrl}`);
      setFormData({
        Description: editData.Description,
        ErrorCode: editData.ErrorCode,
        ImageSampleUrl: `${api}${editData.ImageSampleUrl}`,
      });
      setValIn(
        editData.ParameterCheckErrorMessages.$values.map((code, index) => {
          return {
            value: code.ErrorMessage.Id,
            label: `${code.ErrorMessage.ErrorCode} -> ${code.ErrorMessage.ErrorDescription}`,
            order: index + 1,
          };
        })
      );

      setShowModal(true);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };
  return (
    <>
    
    <div className="z-0 sm:w-full w-auto lg:w-full">
      
      <form
        className="max-w-lg mx-auto md:flex md:items-center md:flex-row-reverse "
        onSubmit={handleSearch}
      >
        <div className="relative flex-grow  sm:w-3/4 md:w-auto">
          <label htmlFor="search-dropdown" className="sr-only">
            Search
          </label>
          <input
            type="search"
            id="search-dropdown"
            className=" block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder="Search PSN, WO, Ref ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
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
                className="py-2 text-sm text-gray-700 dark:text-gray-200 z-21"
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
      <div className="fixed top-0 mb-2 z-30 mt-11 sm:mt-24 md:mt-11 lg:mt-11 xl:mt-11">
        <button
          onClick={openModal}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          ADD Parameter
        </button>
      </div>

      <div className="overflow-x-auto   shadow-md sm:rounded-lg mt-6">
        <section className="container mx-auto p-2 font-mono hidden sm:table w-full">
          <div className="w-3/4 mb-2 overflow-hidden rounded-lg shadow-lg">
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto  rounded-lg">
                <thead className="bg-green-500 text-white rounded-tl-2xl">
                  <tr>
                    <th className="px-4 py-2 w-1/3">Description</th>
                    <th className="px-4 py-2 w-1/3">Image</th>
                    <th className="px-4 py-2 w-1/3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataProduct.map((track) => (
                    <React.Fragment key={track.Id}>
                      <tr className={`border-b  rounded-full `}>
                        <td className="px-4 py-2  sm:table-cell  ">
                          {track.Description}
                        </td>
                        <td className="px-4 py-2  sm:table-cell  ">
                          {track.ImageSampleUrl && (
                            <img
                              src={`${api}${track.ImageSampleUrl}`}
                              alt="Sample Image"
                              className="w-32 h-16"
                              onClick={() => {
                                setEnlargedImage(
                                  `${api}${track.ImageSampleUrl}`
                                );
                                setShowEnlargedModal(true);
                              }}
                            />
                          )}
                        </td>
                        <td className="px-4 py-2  ">
                          <div className="flex">
                            <button
                              className="mr-2 hover:text-blue-500"
                              onClick={() =>
                                handleDetailClick(track.Id, track.TrackPSN)
                              }
                            >
                              <FaEye size={20} title="Detail" />
                            </button>
                            <button
                              className="hover:text-green-500"
                              onClick={() => handleEditClick(track.Id)}
                            >
                              <FaEdit size={20} title="Edit" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {openCollapse[track.Id] && detailDataMap[track.Id] && (
                        <tr>
                          <td colSpan="9" className="px-1 py-2">
                            <div className="">
                              <h2 className="text-xl font-bold">
                                Detail Data for Track ID: {track.Description}
                              </h2>
                              <table className="w-full ">
                                <tbody className="bg-slate-100">
                                  {detailDataMap[track.Id].map(
                                    (detail, index) => (
                                      <tr
                                        key={index}
                                        className={`border-b    rounded-full `}
                                      >
                                        <td className="w-auto">
                                          {detail.ErrorMessage.ErrorCode}
                                        </td>
                                        <td className="w-auto">
                                          {detail.ErrorMessage.ErrorDescription}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
                    <strong>Description </strong>
                    <span> : {data.Description ? data.Description : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Image </strong>
                    <span>
                      {" "}
                      : {data.ImageSampleUrl ? data.ImageSampleUrl : "-"}
                    </span>
                  </div>

                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1 mt-3">
                    <button
                      type="button"
                      className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Detail
                    </button>
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
              </select>
              <div>From {totalRecord} Record</div>
            </div>
          </div>
          <div className="flex align-middle  md:justify-end ">
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={pageCount}
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

      
    </div>
    {/* modal form */}
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-max bg-gray-800 bg-opacity-75 overflow-auto">
          <div className="bg-white p-8 rounded-lg shadow-md w-1/2 overflow-auto max-h-1/2">
            <h2 className="text-lg font-bold mb-4">
              {editData ? "Edit Parameter" : "Add Parameter"}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            <form id="parameterForm" onSubmit={handleSubmit}>
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <input
                type="text"
                name="Description"
                value={formData.Description}
                onChange={handleChange} // ubah onchange menjadi onChange
                onKeyDown={handleKeyDown} // ubah onkeydown menjadi onKeyDown
                placeholder="Parameter check"
                className="mb-2 p-2 border rounded"
                style={{ width: "100%" }} // Menetapkan lebar 100%
                tabIndex={0}
              />

              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Image Pattern
              </label>
              <div className="mb-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "user",
                  }}
                  className={`absolute inset-0 ${
                    showWebcam ? "block" : "hidden"
                  }`}
                />
                <button
                  onClick={toggleWebcam}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2 z-52"
                >
                  {/* {showWebcam ? "Hide Webcam" : "Show Webcam"} */}
                  <FaCamera />
                </button>

                 
              </div>

              {/* Input file untuk mengambil gambar dari local folder */}
              <div className="mb-4 flex gap-3 items-center ">
                <label
                  htmlFor="fileUpload"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  <GrGallery className="inline-block mr-2" />
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={resetFoto}
                  className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2 z-52"
                >
                  Hapus foto
                </button>
              </div>

              {/* Menampilkan gambar yang diambil */}
              {capturedImage && (
                <div className="mb-4">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="max-w-full h-auto max-h-48"
                    onClick={() => {
                      setEnlargedImage(capturedImage);
                      setShowEnlargedModal(true);
                    }}
                  />
                </div>
              )}
              <div className="mb-7">
                {valIn.map((data, i) => (
                  <div className="mb-4 flex items-center" key={i}>
                    <Select
                      value={data}
                      options={errorMessages}
                      onChange={(selectedOption) => {
                        const updatedValIn = [...valIn];
                        updatedValIn[i] = selectedOption;
                        setValIn(updatedValIn);
                      }}
                      className="border rounded py-2 px-3 mr-2 w-3/4"
                    />
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(i)}
                        disabled={i === 0}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${
                          i === 0 ? "opacity-50 cursor-not-allowed" : ""
                        } w-auto`}
                      >
                        <MdKeyboardArrowUp />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(i)}
                        disabled={i === valIn.length - 1}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${
                          i === valIn.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } w-auto`}
                      >
                        <MdKeyboardArrowDown />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteIn(i)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
                <button
                  type="button" // Tambahkan atribut type="button" di sini
                  onClick={() => handleAddIn()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                  Next Error
                </button>
              </div>
              {showWebcam && (
                <button
                  onClick={capture}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 z-51"
                >
                  <FaCamera className="inline-block mr-2" />
                  Capture Photo
                </button>
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
      {showEnlargedModal && (
        <div className="fixed inset-0 flex items-center justify-center  z-max bg-gray-800 bg-opacity-75">
          <div className="relative">
            <img
              src={enlargedImage}
              alt="Enlarged"
              className="max-w-full max-h-screen"
            />
            <button
              className="absolute top-0 right-0 m-4 text-white hover:text-gray-300 bg-red-700 rounded-full"
              onClick={() => setShowEnlargedModal(false)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
