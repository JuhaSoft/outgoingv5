import React, { useEffect, useState } from "react";
// import globalConfig from '../../config'
import axios from "axios";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { FaEye, FaEdit } from "react-icons/fa";

export default function Dashboard() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [dataProduct, setdataProduct] = useState([]);
  const [openCollapse, setOpenCollapse] = useState({});
  const [pageCount, setpageCount] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [detailDataMap, setDetailDataMap] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [trackPSN, setTrackPSN] = useState("");
  const [currentImageModalImages, setCurrentImageModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState({
    text: "All Categories",
    value: "All",
  }); // State untuk menyimpan opsi yang dipilih

  const dropdownOptions = [
    { text: "All Categories", value: "All" },
    { text: "PSN", value: "TrackPSN" },
    { text: "Reference", value: "TrackReference" },
    { text: "Work Order", value: "TrackingWO" },
    { text: "Status", value: "TrackingResult" },
    { text: "User Name", value: "DisplayName" },
    { text: "Date", value: "TrackingDateCreate" },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        `${api}/api/DataTracks?pageNumber=${pageNumber}&pageSize=${pageSize}&SearchQuery=${searchQuery}&Category=${selectedOption.value}`
      );
      setdataProduct(response.data.DataTracks.$values);
      setTotalRecord(response.data.TotalItems);
      setpageCount(response.data.TotalPages);
    } catch (error) {
      toast.error("Error fetching data:" + error);
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
  const handlePageClick = (data) => {
    const currentPage = data.selected + 1;
    fetchData(currentPage);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleDetailClick = (id, psn) => {
    setOpenCollapse((prevOpenCollapse) => ({
      ...prevOpenCollapse,
      [id]: !prevOpenCollapse[id],
    }));
    fetchDetailData(id);
  };
  const fetchDetailData = async (id) => {
    try {
      const response = await axios.get(`${api}/api/DataTrackChecks/${id}`);
      setDetailDataMap((prevMap) => ({
        ...prevMap,
        [id]: response.data.$values,
      }));
      setTrackPSN(response.data.TrackPSN);
    } catch (error) {
      toast.error("Error fetching detail data:", error);
    }
  };
  const handleImageClick = (images, index) => {
    setCurrentImageModalImages(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };
  return (
    <div className="">
      <div className="flex items-center gap-3 mb-2 bg-green-500 text-white  pl-2 rounded-2xl">
         <span className="text-2xl py-2">Data Track</span>
      </div>
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

      <div className="overflow-x-auto   shadow-md sm:rounded-lg">
        <section className="container mx-auto p-2 font-mono hidden sm:table w-full">
          <div className="w-full mb-2 overflow-x-auto rounded-lg shadow-lg">
            <div className="w-full overflow-x-auto">
              <table className="table-auto w-full rounded-lg">
                <thead className="bg-green-500 text-white rounded-tl-2xl">
                  <tr>
                    <th className="px-4 py-2">PSN</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Order</th>
                    <th className="px-4 py-2">Reference</th>
                    <th className="px-4 py-2">Last Station</th>
                    <th className="px-4 py-2">Line</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">User Checked</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataProduct.map((track) => (
                    <React.Fragment key={track.Id}>
                      <tr
                        className={`border-b ${
                          track.TrackingStatus === "PASS"
                            ? "bg-white"
                            : "bg-red-100"
                        } rounded-full `}
                      >
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {track.TrackPSN}
                        </td>
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {track.TrackingStatus}
                        </td>
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {track.TrackingWO}
                        </td>
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {track.TrackReference?track.TrackReference:"N/A"}
                        </td>
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {track.LastStationID.StationName?track.LastStationID.StationName:"N/A"}
                        </td>
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {track.LastStationID.DataLine.LineName?track.LastStationID.DataLine.LineName:"N/A"}
                        </td>
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {new Date(track.TrackingDateCreate).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 hidden sm:table-cell">
                          {track.User.DisplayName?track.User.DisplayName:"N/A"}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex">
                            <button
                              className="mr-2 hover:text-blue-500"
                              onClick={() =>
                                handleDetailClick(track.Id, track.TrackPSN)
                              }
                            >
                              <FaEye size={20} title="Detail" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {openCollapse[track.Id] && detailDataMap[track.Id] && (
                        <tr>
                          <td colSpan="9" className="px-1 py-2">
                            <div className="">
                              <h2 className="text-xl font-bold">
                                Detail Data for Track ID: {track.TrackPSN}
                              </h2>
                              <table className="w-full ">
                                <tbody className="bg-slate-100">
                                  {detailDataMap[track.Id].map(
                                    (detail, index) => (
                                      <tr
                                        key={index}
                                        className={`border-b  ${
                                          detail.DTCValue === "Pass" ||
                                          detail.DTCValue === "PASS"
                                            ? "bg-white"
                                            : "bg-red-100"
                                        } rounded-full `}
                                      >
                                        <td className="w-auto">
                                          {detail.ParameterCheck.Description}
                                        </td>
                                        <td className="">{detail.DTCValue}</td>
                                        <td className="">
                                          <div className="flex gap-2">
                                            {detail.ImageDataChecks.$values.map(
                                              (image, imageIndex) => (
                                                <img
                                                  key={imageIndex}
                                                  src={`${api}${image.ImageUrl}`}
                                                  alt={`Image ${
                                                    imageIndex + 1
                                                  }`}
                                                  className="w-12 h-12 object-cover rounded cursor-pointer"
                                                  onClick={() =>
                                                    handleImageClick(
                                                      detail.ImageDataChecks
                                                        .$values,
                                                      imageIndex
                                                    )
                                                  }
                                                />
                                              )
                                            )}
                                          </div>
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
          {showImageModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
              <div className="relative max-w-2xl max-h-full overflow-hidden">
                <img
                  src={`${api}${currentImageModalImages[currentImageIndex].ImageUrl}`}
                  alt="Enlarged Image"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  className="absolute top-0 right-0 m-0 text-white hover:text-gray-300 bg-red-700 rounded-full z-51"
                  onClick={() => setShowImageModal(false)}
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
                <button
                  className="absolute top-1/2 left-0 m-1 text-white hover:text-gray-300 bg-green-500"
                  onClick={() =>
                    setCurrentImageIndex(
                      (currentImageIndex - 1 + currentImageModalImages.length) %
                        currentImageModalImages.length
                    )
                  }
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute top-1/2 right-0 m-1  text-white hover:text-gray-300 bg-green-500"
                  onClick={() =>
                    setCurrentImageIndex(
                      (currentImageIndex + 1) % currentImageModalImages.length
                    )
                  }
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
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
                    <strong>PSN </strong>
                    <span> : {data.TrackPSN ? data.TrackPSN : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Reference </strong>
                    <span>
                      {" "}
                      : {data.TrackReference ? data.TrackReference : "-"}
                    </span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Work Order </strong>
                    <span> : {data.TrackingWO ? data.TrackingWO : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Station Name </strong>
                    <span>
                      {" "}
                      :{" "}
                      {data.LastStationID.StationID
                        ? data.LastStationID.StationID
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Line Name </strong>
                    {/* <span> : {data.LastStationID.DataLine.LineName ? data.LastStationID.DataLine.LineName : "-"}</span> */}
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Status </strong>
                    <span>
                      {" "}
                      : {data.TrackingResult ? data.TrackingResult : "-"}
                    </span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>User </strong>
                    <span>
                      {" "}
                      : {data.User.DisplayName ? data.User.DisplayName : "-"}
                    </span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Date </strong>
                    <span>
                      {" "}
                      :{" "}
                      {data.TrackingDateCreate
                        ? format(
                            new Date(data.TrackingDateCreate),
                            "dd-MM-yyyy HH:mm:ss"
                          )
                        : "Not Valid"}
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
                // onChange={(e) => handlerecordPerPage(e)}
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
  );
}
