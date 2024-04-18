import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import globalConfig from '../../config'
import axios from "axios";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { toast } from "react-toastify";
export default function Dashboard() {
  const appConfig = window.globalConfig || { siteName: process.env.REACT_APP_SITENAME} 
  const api =appConfig.APIHOST
  const [dataProduct, setdataProduct] = useState([]);
  const [tbldata, settbldata] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [dropdownVisible, setDropdownVisible] = useState(false);
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
      toast.error("Error fetching data:"+ error);
    }
  };


  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible); // Toggle state ketika tombol dropdown diklik
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false); // Menutup dropdown setelah opsi dipilih
  };
  // const config = globalConfig;
  // const api = config.APIHOST;
  // console.log(api)
  const handleSearch  = (event) => {
    event.preventDefault()
  
         fetchData(); // Panggil fungsi fetchData dengan parameter default
  };
  
  
  const handlePageClick = (data) => {
    const currentPage = data.selected + 1;
    fetchData(currentPage);
  };
  useEffect(() => {
    fetchData();
  }, []); 
  
  return (
    <div className="">
      <form className="max-w-lg mx-auto md:flex md:items-center md:flex-row-reverse "onSubmit={handleSearch}>
        <div className="relative flex-grow  sm:w-3/4 md:w-auto">
          <label htmlFor="search-dropdown" className="sr-only">
            Search
          </label>
          <input
            type="search"
            id="search-dropdown"
            className=" block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder="Search PSN, WO, Ref ..."
            required
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
              <table className="w-full">
                <thead>
                <tr className="text-md font-semibold tracking-wide text-left text-white bg-green-600 uppercase border-b border-gray-600">
                    <th className="px-4 py-3">PSN</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Work Order</th>
                    <th className="px-4 py-3">Station Name</th>
                    <th className="px-4 py-3">Line Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">User Name</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {dataProduct.map((data, index) => (
                    <tr className="text-gray-700" key={index}>
                      <td
                        data-name="PSN"
                        className="px-2 py-1 text-ms font-semibold border"
                      >
                        {data.TrackPSN ? data.TrackPSN : "-"}
                      </td>
                      <td
                        data-name="Reference"
                        className="px-2 py-1 text-xs border"
                      >
                        {data.TrackReference ? data.TrackReference : "-"}
                      </td>
                      <td data-name="WO" className="px-2 py-1 text-xs border">
                        {data.TrackingWO ? data.TrackingWO : "-"}
                      </td>
                      <td
                        data-name="LastStation"
                        className="px-2 py-1 text-xs border"
                      >
                        {data.LastStationID.StationID
                          ? data.LastStationID.StationID
                          : "-"}
                      </td>
                      <td
                        data-name="LineName"
                        className="px-2 py-1 text-xs border"
                      >
                        {/* {data.LastStationID.DataLine.LineName
                          ? data.LastStationID.DataLine.LineName
                          : "-"} */}
                      </td>
                      <td
                        data-name="Result"
                        className="px-2 py-1 text-xs border"
                      >
                        {data.TrackingResult ? data.TrackingResult : "-"}
                      </td>
                      <td
                        data-name="Result"
                        className="px-2 py-1 text-xs border"
                      >
                        {data.User.DisplayName ? data.User.DisplayName : "-"}
                      </td>
                      <td data-name="Date" className="px-2 py-1 text-xs border">
                        {format(
                          new Date(data.TrackingDateCreate),
                          "dd-MM-yyyy HH:mm:ss"
                        )}
                        {/* {data.trackingDateCreate} */}
                      </td>
                      <td data-name="Date" className="px-2 py-1 text-xs border text-center">
                        <button
                          type="button"
                          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          Detail
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
                    <span> : {data.TrackReference ? data.TrackReference : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Work Order </strong>
                    <span>
                      {" "}
                      : {data.TrackingWO ? data.TrackingWO : "-"}
                    </span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Station Name </strong>
                    <span> : {data.LastStationID.StationID ? data.LastStationID.StationID : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Line Name </strong>
                    {/* <span> : {data.LastStationID.DataLine.LineName ? data.LastStationID.DataLine.LineName : "-"}</span> */}
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Status </strong>
                    <span> : {data.TrackingResult ? data.TrackingResult : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>User </strong>
                    <span> : {data.User.DisplayName ? data.User.DisplayName : "-"}</span>
                  </div>
                  <div className="flex justify-normal w-full sm:w-auto sm:flex-1">
                    <strong>Date </strong>
                    <span>
                      {" "}
                      :{" "}
                      {data.TrackingDateCreate
                        ? format(new Date(data.TrackingDateCreate), "dd-MM-yyyy HH:mm:ss")
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
