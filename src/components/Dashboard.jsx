import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { FaFileDownload, FaChevronDown,FaEye } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import _ from "lodash";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
export default function Dashboard() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const today = new Date();

  // Membuat objek Date baru berdasarkan hari ini
  // const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  const api = appConfig.APIHOST;
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  const sixMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 6,
    today.getDate(),
    today.getHours(),
    today.getMinutes()
  );
  const [connection, setConnection] = useState(null);
  const [startDate, setStartDate] = useState(sixMonthsAgo);
  const [endDate, setEndDate] = useState(today);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageModalImages, setCurrentImageModalImages] = useState([]);
  const [detailDataMap, setDetailDataMap] = useState({});
  const [pageSize, SetPageSize] = useState(10);
  const [currentPage, SetCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  // image
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPoint({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };
  const handleSetDates = () => {
    fetchDataTracks(
      currentPage,
      pageSize,
      startDate,
      endDate,
      "handleSetDates"
    );
  };
  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setTranslate({
      x: e.clientX - startPoint.x,
      y: e.clientY - startPoint.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => {
    const newZoom = zoom * 1.2;
    setZoom(newZoom);
    setTranslate((prev) => ({
      x: prev.x * 1.2,
      y: prev.y * 1.2,
    }));
  };

  const handleZoomOut = () => {
    const newZoom = zoom / 1.2;
    setZoom(newZoom);
    setTranslate((prev) => ({
      x: prev.x / 1.2,
      y: prev.y / 1.2,
    }));
  };

  const [openCollapse, setOpenCollapse] = useState({});
  const [dataTracks, setDataTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchDataTracks = async (
    pageNumber = 1,
    pageSize = 10,
    start,
    end,
    dari = ""
  ) => {
   
    const startDateString = start.toISOString().split("T")[0];
    const endDateString = end.toISOString().split("T")[0];
     
    try {
      const response = await axios.get(`${api}/api/DataTracks`, {
        params: {
          searchQuery: searchQuery,
          pageNumber: pageNumber,
          pageSize: pageSize,
          Start: startDateString,
          EndDate: endDateString,
        },
      });
      setDataTracks(response.data.DataTracks.$values);
      setTotalRecord(response.data.TotalItems);
      setpageCount(response.data.TotalPages);
    } catch (error) {}
  };
   

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    fetchDataTracks(
      currentPage,
      pageSize,
      startDate,
      endDate,
      "HandlePageClick"
    );
    SetCurrentPage(currentPage);
  };
  const fetchDetailData = async (id) => {
    try {
      const response = await axios.get(`${api}/api/DataTrackChecks/${id}`);
      setDetailDataMap((prevMap) => ({
        ...prevMap,
        [id]: response.data.$values,
      }));
    } catch (error) {
      toast.error("Error fetching detail data:", error);
    }
  };
  const handleImageClick = (images, index) => {
    setCurrentImageModalImages(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };
  const handleDetailClick = (id, psn) => {
    setOpenCollapse((prevOpenCollapse) => ({
      ...prevOpenCollapse,
      [id]: !prevOpenCollapse[id],
    }));
    fetchDetailData(id);
  };

  const handlerecordPerPage = (event) => {
    event.preventDefault();
    const page = event.target.value;
    SetPageSize(page);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    fetchDataTracks(currentPage, pageSize, startDate, endDate, "handlesearch");
  };

  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  // Tambahkan fungsi untuk mengunduh CSV
  // const downloadCSV = (filename, data) => {
  //   const csvData = convertToCSV(data);
  //   const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", url);
  //   link.setAttribute("download", filename);
  //   link.style.visibility = "hidden";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  useEffect(() => {
    setStartDate(sixMonthsAgo);
    fetchDataTracks(1, pageSize, sixMonthsAgo, endDate, "useEffect[]");
    document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, []);
  const customMapping = {
    PSN: "TrackPSN",
    reference: "TrackReference",
    Order: "TrackingWO",
    "Last Station": {
      StationName: ["LastStationID", "StationName"],
      Line: ["LastStationID", "DataLine", "LineName"]
    },
    "Date Create": "TrackingDateCreate",
    Status: "TrackingStatus",
    User: {
      DisplayName: ["User", "DisplayName"]
    }
  };
  
  const getNestedValue = (obj, path) => {
    if (typeof path === "string") {
      return obj[path];
    } else if (Array.isArray(path)) {
      return path.reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
    } else if (typeof path === "object") {
      const keys = Object.keys(path);
      const values = keys.map((key) => getNestedValue(obj, path[key]));
      return values.join(" ");
    }
  };
  
  const convertToCSV = (data) => {
    const csvRows = [];
    const headers = Object.keys(customMapping).map(header =>
      header.replace(/ /g, "_")
    );
    csvRows.push(headers.join(","));
  
    for (const row of data) {
      const values = headers.map((header) => {
        const originalHeader = header.replace(/_/g, " ");
        let value = getNestedValue(row, customMapping[originalHeader]);
  
        if (originalHeader == "Date Create" && value) {
          value = format(new Date(value), 'PPpp', { locale: id });
        }
  
        // Escaping double quotes by doubling them
        const escaped = value ? value.toString().replace(/"/g, '""') : "";
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
  
    return csvRows.join("\n");
  };
  
  const downloadCSV = (filename, data) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const handleDownloadCSV = async (option) => {
    let dataToDownload;
    if (option === "currentPage") {
      dataToDownload = dataTracks;
    } else if (option === "allPages") {
      const startDateString = startDate.toISOString().split("T")[0];
      const endDateString = endDate.toISOString().split("T")[0];
      dataToDownload = await getAllData(searchQuery, startDateString, endDateString);
    }
    downloadCSV(`data_tracks_${option}.csv`, dataToDownload);
    setShowDropdown(false);
  };
  
  const getAllData = async (searchQuery, startDateString, endDateString) => {
    try {
      const response = await axios.get(`${api}/api/DataTracks`, {
        params: {
          searchQuery: searchQuery,
          Start: startDateString,
          EndDate: endDateString,
        },
      });
      return response.data.DataTracks.$values;
    } catch (error) {
      toast.error("Error fetching data for CSV");
      return [];
    }
  };
  return (
    <div className="z-0 ">
      <div className="flex items-center gap-3 mb-2 bg-green-500 text-white  pl-2 rounded-2xl">
        <span className="text-2xl py-2">Data</span>
      </div>

      <div className="container mx-auto bg-blue-400 rounded-lg p-2">
        <div className="flex items-center gap-3 mb-2 bg-green-500 text-white py-3 pl-2 rounded-2xl">
          <div className="flex items-center">
            <label className="mr-2">Start:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-md px-2 py-1 text-black"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">End:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-md px-2 py-1 text-black"
            />
          </div>
          <button
            onClick={handleSetDates}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Set
          </button>
        </div>
        <div className="relative flex-grow  sm:w-3/4 md:w-auto mb-2">
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
                placeholder="Search PSN ..."
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
          </form>
        </div>
        <div className="overflow-x-auto">
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
              {dataTracks.map((track) => (
                <React.Fragment key={track.Id}>
                  <tr
                    className={`border-b ${
                      track.TrackingStatus === "PASS"
                        ? "bg-green-300"
                        : track.ApprovalId
                        ? "bg-yellow-200"
                        : "bg-red-300"
                    }`}
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
                      {track.TrackReference ? track.TrackReference : "N/A"}
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell">
                      {track.LastStationID.StationName
                        ? track.LastStationID.StationName
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell">
                      {track.LastStationID.DataLine.LineName
                        ? track.LastStationID.DataLine.LineName
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell">
                      {new Date(track.TrackingDateCreate).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell">
                      {track.User ? track.User.DisplayName : "N/A"}
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
                        <div className="bg-blue-100 rounded-lg p-4 ml-6 shadow-md">
                          <h2 className="text-lg font-semibold text-gray-700">
                            Detail Data for Track ID: {track.TrackPSN}
                          </h2>
                          <table className="w-full ">
                            <tbody className="">
                              {detailDataMap[track.Id].map((detail, index) => {
                                return (
                                  <tr key={index} className={`border-b `}>
                                    <td colSpan="6" className="px-2 ">
                                      <div
                                        className={`p-2 rounded-lg shadow ${
                                          detail.DTCValue === "Pass" ||
                                          detail.DTCValue === "PASS"
                                            ? "bg-white"
                                            : "bg-red-50"
                                        }`}
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                          <div className="flex-1 text-gray-600">
                                            {detail.ParameterCheck.Description}
                                          </div>
                                          <div className="flex-1 text-gray-600">
                                            {detail.DTCValue}
                                          </div>
                                          <div className="flex-1 text-gray-600">
                                            {detail.ErrorMessage &&
                                            detail.ErrorMessage.ErrorCode &&
                                            detail.ErrorMessage.ErrorDescription
                                              ? `${detail.ErrorMessage.ErrorCode} => ${detail.ErrorMessage.ErrorDescription}`
                                              : "-"}
                                          </div>

                                          <div className="flex-1 flex gap-2">
                                            {detail.ImageDataChecks.$values.map(
                                              (image, imageIndex) => (
                                                <img
                                                  key={imageIndex}
                                                  src={`${api}${image.ImageUrl}`}
                                                  alt={`Image ${
                                                    imageIndex + 1
                                                  }`}
                                                  className="w-12 h-12 object-cover rounded border border-gray-300 cursor-pointer"
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
                                          {detail.Approve === true ? (
                                            <>
                                              <div className="flex-1 text-gray-600">
                                                Approve by:{" "}
                                                {detail.Approver.DisplayName}
                                              </div>
                                              <div className="flex-1 p-2">
                                                <textarea
                                                  readOnly
                                                  value={detail.ApprRemaks}
                                                  className="w-full h-12 p-2 border rounded"
                                                />
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div className="flex-1"></div>
                                              <div className="flex-1"></div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
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
          <div className="relative w-full h-full max-w-4xl max-h-4xl overflow-hidden flex items-center justify-center">
            <div
              className="relative flex items-center justify-center overflow-hidden w-full h-full"
              style={{
                cursor: "grab",
                transform: `scale(${zoom}) translate(${translate.x}px, ${translate.y}px)`,
                transformOrigin: "center center",
              }}
              onMouseDown={(e) => handleMouseDown(e)}
              onMouseMove={(e) => handleMouseMove(e)}
              onMouseUp={() => handleMouseUp()}
              onMouseLeave={() => handleMouseLeave()}
            >
              <img
                src={`${api}${currentImageModalImages[currentImageIndex].ImageUrl}`}
                alt="Enlarged Image"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              className="absolute top-0 right-0 m-2 text-white hover:text-gray-300 bg-red-700 rounded-full p-2 z-51"
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
              className="absolute top-1/2 left-0 m-2 text-white hover:text-gray-300 bg-green-500 rounded-full p-2 z-51"
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
              className="absolute top-1/2 right-0 m-2 text-white hover:text-gray-300 bg-green-500 rounded-full p-2 z-51"
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
            <div className="absolute bottom-0 left-0 m-2 flex space-x-2 z-51">
              <button
                className="text-white hover:text-gray-300 bg-blue-500 rounded-full p-2"
                onClick={handleZoomIn}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                className="text-white hover:text-gray-300 bg-blue-500 rounded-full p-2"
                onClick={handleZoomOut}
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
                    d="M20 12H4m16 0H4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

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
      <div className="mt-3">
      <div className="relative" ref={dropdownRef}>
    <button
      className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center ml-1"
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <FaFileDownload className="mr-2" />
      Download CSV
      <FaChevronDown className="ml-2" />
    </button>
    {showDropdown && (
      <div className="absolute left-11 w-48 bg-white rounded-md shadow-lg z-10">
        <div
          className="py-1 cursor-pointer hover:bg-gray-100 px-2"
          onClick={() => handleDownloadCSV("currentPage")}
        >
          Current Page
        </div>
        <div
          className="py-1 cursor-pointer hover:bg-gray-100 px-2"
          onClick={() => handleDownloadCSV("allPages")}
        >
          All Pages
        </div>
      </div>
    )}
  </div>
      </div>
      
    </div>
  );
}
