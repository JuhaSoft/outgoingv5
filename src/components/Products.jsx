import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import CarouselGallery from '../components/CarouselGallery';
import ImageModal from "./ImageModal";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import _ from "lodash";
export default function Products() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [error, setError] = useState("");
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  const [psnEdit, setPsnEdit] = useState("");
  const [showModalGalery, setShowModalGalery] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [query, setQuery] = useState("");
  const [errorProduct, setErrorProduct] = useState("");
  const [lastStatioCheck, setLastStatioCheck] = useState("Packaging");
  const [result, setResult] = useState("");
  const [psnBarcode, setPsnBarcode] = useState("");
  const [refBarcode, setRefBarcode] = useState("");
  const [refId, setRefId] = useState("");
  const [refBarcodeCompare, setRefBarcodeCompare] = useState("");
  const [randomNumber, setRandomNumber] = useState(0);
  const [processedPsn, setProcessedPsn] = useState("");
  const webcamRef = React.useRef(null);
  let ReferenceData = JSON.parse(localStorage.getItem("DetailRef"));
  const [apiData, setApiData] = useState(null);
  const [dataTrackCheckings, setDataTrackCheckings] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageModalImages, setCurrentImageModalImages] = useState([]);
  const [detailDataMap, setDetailDataMap] = useState({});
  const [woData, setsetWoData] = useState({});
  const [showEnlargedModal, setShowEnlargedModal] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState([]);
  const [inputValues, setInputValues] = useState([]);

  const handleCheckboxChange = (index, checked) => {
    setCheckboxStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = checked;
      return newStates;
    });
  };

  const handleInputChange = (index, value) => {
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };
  // const inputPSN = useRef(null);
  const [selectedData, setSelectedData] = useState(
    JSON.parse(localStorage.getItem("selectedOrder"))
  );
  const [openCollapse, setOpenCollapse] = useState({});
  const [parameterGalleries, setParameterGalleries] = useState(
    apiData && apiData.ParameterCheck
      ? apiData.ParameterCheck.map(() => [])
      : []
  );
  const [trackingData, setTrackingData] = useState({
    TrackPSN: "",
    TrackReference: "",
    TrackingWO: "",
    TrackingLastStationId: "",
    TrackingResult: "",
    TrackingStatus: "",
    DataTrackCheckings: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isWoRunning, setIsWoRunning] = useState(
    localStorage.getItem("woStartRun") === "true"
  );
  const handleRunStop = () => {
    if (isWoRunning) {
      localStorage.setItem("woStartRun", "false");
      setIsWoRunning(false);
    } else {
      localStorage.setItem("woStartRun", "true");
      setIsWoRunning(true);
      // focusInput
    }
  };
  let token = localStorage.getItem("token");
  const [editData, setEditData] = useState(null);
  const openModal = () => {
    setError("");
    setShowModal(true);
  };
  const [dataTracks, setDataTracks] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [trackId, setTrackId] = useState("");
  const [trackPSN, setTrackPSN] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fetchDataTracks = async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        `${api}/api/DataTracks/order/${selectedData.WoNumber}`,
        {
          params: {
            searchQuery: searchQuery,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );
      setDataTracks(response.data.DataTracks.$values);
      setTotalRecord(response.data.TotalItems);
      setpageCount(response.data.TotalPages);
    } catch (error) {}
  };
  const handlePageClick = (data) => {
    const currentPage = data.selected + 1;
    fetchDataTracks(currentPage);
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
  const handleDetailClick = (id, psn) => {
    setOpenCollapse((prevOpenCollapse) => ({
      ...prevOpenCollapse,
      [id]: !prevOpenCollapse[id],
    }));
    fetchDetailData(id);
  };
  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`${api}/api/DataTracks/${id}`);
      const trackData = response.data;

      setPsnEdit(response.data.TrackPSN);

      const detailDataResponse = await axios.get(
        `${api}/api/DataTrackChecks/${id}`
      );
      const detailData = detailDataResponse.data.$values;

      // Mengisi data detail ke apiData.ParameterChecks
      const parameterCheck = detailData.map((item) => {
        return {
          Id: item.ParameterCheck.Id,
          Description: item.ParameterCheck.Description,
          Order: item.ParameterCheck.Order,
          Result: item.DTCValue,
          ImageDataChecks: item.ImageDataChecks.$values.map(
            (image) => `${api}${image.ImageUrl}`
          ),
          ParameterCheckErrorMessages: item.ErrorMessage,
          selectErrorMessage:
            item.ParameterCheck.ParameterCheckErrorMessages.$values,
        };
      });

      if (apiData) {
        setApiData((prevData) => ({
          ...prevData,
          ParameterCheck: parameterCheck,
        }));
      } else {
        setApiData({ ParameterCheck: parameterCheck });
      }
      setDataTrackCheckings(
        parameterCheck.map((check) => ({
          PCID: check.Id,
          Result: check.Result,
          ErrorId: check.ErrorId,
          Appove:check.Appove,
            ApprovalId:check.ApprovalId,
            ApprRemaks:check.ApprRemaks,
        }))
      );

      // Mengisi data detail ke dataTrackCheckings
      const newDataTrackCheckings = parameterCheck.map(
        ({ Id, Result, ErrorId }) => ({
          PCID: Id,
          Result,
          ErrorId,
          Appove:false,
          ApprovalId:null,
          ApprRemaks:"",
        })
      );
      setDataTrackCheckings(newDataTrackCheckings);
      fetchDataWoParam(selectedData.Id);
      setEditingData(trackData);
      setShowModal(true);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };
  const closeModal = () => {
    setShowModal(false);

    setEditData(null);
  };
  const fetchDataParam = async () => {
    try {
      const response = await axios.get(`${api}/api/Datareference/${refId}`);

      const parameterChecks =
        response.data.DataReferenceParameterChecks.$values;

      // Membuat objek baru untuk menyimpan ParameterCheck
      const newData = { ParameterCheck: [] };

      // Menambahkan ParameterCheck ke dalam newData.ParameterCheck
      parameterChecks.forEach((item) => {
        if (item.ParameterCheck) {
          newData.ParameterCheck.push(item.ParameterCheck);
        }
      });

      // Memperbarui state apiData dengan newData
      setApiData(newData);
console.log("coba set",parameterChecks)
      setDataTrackCheckings(
        response.data.DataReferenceParameterChecks.$values.map((check) => {
          return {
            PCID: check.ParameterCheck.Id,
            Result: "",
            ErrorId: null,
            Appove:false,
            ApprovalId:null,
            ApprRemaks:"",
          };
        })
      );
console.log("Selesai set")

    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`, {});
    }
  };

  const fetchDataWoParam = async (id) => {
    try {
      const response = await axios.get(`${api}/api/Wo/${id}`);

      setSelectedData(response.data);
    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`, {});
    }
  };
  const handleKeyPressProduct = (e) => {
    if (e.key === "Enter") {
      handleSearchProduct();
    }
  };
  const handleChangeProduct = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async () => {
    // Logika untuk menentukan TrackingResult dan TrackingStatus
    if (dataTrackCheckings.some((item) => item.Result === "")) {
      toast.error("Harap pilih hasil untuk setiap parameter");
      return; // Menghentikan proses submit jika ada nilai kosong
    }
    const allPassed = dataTrackCheckings.every(
      (item) => item.Result === "Pass" || item.Result === "PASS"
    );

    const updatedTrackingData = {
      ...trackingData,
      TrackingResult: allPassed ? "PASS" : "FAIL",
      TrackingStatus: allPassed ? "PASS" : "FAIL",
      DataTrackCheckings: dataTrackCheckings.map((item, index) => ({
        PCID: item.PCID,
        DTCValue: item.Result,
        ErrorId: item.ErrorId,
        Appove:item.Appove,
        ApprovalId:item.ApprovalId,
        ApprRemaks:item.ApprRemaks,
        DTCisDeleted: false,
        ImageDataChecks: parameterGalleries[index]
          ? parameterGalleries[index].map((imageUrl) => ({
              ImageUrl: imageUrl,
            }))
          : [],
      })),
    };

    try {
      const response = await axios.post(
        `${api}/api/DataTracks`,
        updatedTrackingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Penanganan sukses
        toast.success("Data berhasil dikirim ke server");
        fetchDataWoParam(selectedData.Id);
        setShowModal(false);
        fetchDataTracks();
        setOpenCollapse({});
        // Lakukan tindakan lain yang diperlukan setelah berhasil
      } else {
        // Penanganan error
        toast.error("Error saat mengirim data ke server 1");
        // Lakukan tindakan lain yang diperlukan saat terjadi error
      }
    } catch (error) {
      toast.error("Error saat mengirim data ke server:", error.message);
      // Lakukan tindakan lain yang diperlukan saat terjadi error
    }
  };

  const removeImageFromGallery = (galleryIndex, imageIndex) => {
    setParameterGalleries((prevGalleries) => {
      const newGalleries = [...prevGalleries];
      newGalleries[galleryIndex] = newGalleries[galleryIndex].filter(
        (_, idx) => idx !== imageIndex
      );
      return newGalleries;
    });
  };

  const addImageToGallery = (imageUrl, index) => {
    setParameterGalleries((prevGalleries) => {
      const newGalleries = [...prevGalleries];

      if (!newGalleries[index]) {
        newGalleries[index] = [];
      }

      if (newGalleries[index].length < 5) {
        newGalleries[index] = [...newGalleries[index], imageUrl];
      } else {
        toast.error("Maximum 5 images allowed in the gallery");
      }

      return newGalleries;
    });
  };
  const handleUpdateData = async () => {
    const id = editingData.Id;
    const allPassed = dataTrackCheckings.every(
      (item) => item.Result === "Pass" || item.Result === "PASS"
    );
    const updatedData = {
      ...editingData,
      TrackingResult: allPassed ? "PASS" : "FAIL",
      TrackingStatus: allPassed ? "PASS" : "FAIL",
      DataTrackCheckings: dataTrackCheckings.map((item, index) => ({
        PCId: item.PCID,
        DTCValue: item.Result,
        DTCisDeleted: false,
        ImageDataChecks: parameterGalleries[index].map((imageUrl) => ({
          ImageUrl: imageUrl,
        })),
      })),
    };

    try {
      const response = await axios.put(
        `${api}/api/DataTracks/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Data berhasil diupdate");
        closeModal();
        setEditingData(null);
        setOpenCollapse({});
        fetchDataTracks(); // Refresh data setelah update
      } else {
        toast.error("Gagal mengupdate data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengupdate data");
    }
  };
  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      addImageToGallery(reader.result, index);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (index) => {
    const imageSrc = webcamRef.current
      ? webcamRef.current.getScreenshot({ width: 800, height: 600 }) // Atur lebar dan tinggi yang diinginkan di sini
      : null;
    if (imageSrc) {
      addImageToGallery(imageSrc, index);
    } else {
      toast.error("Failed to capture image from webcam");
    }
  };
  const handleSearchProduct = async () => {
    await CollectData(query);
  };
  const CollectData = async (data) => {
    if (ReferenceData) {
      const { PsnPos, RefPos, Id, LastStationID, RefCompare } = ReferenceData;
      if (RefPos) {
        const [refStartIndex, refLength] = RefPos.split(/[:,;]/).map(Number);
        setRefId(Id);
        setRefBarcode(data.substring(refStartIndex, refStartIndex + refLength));
      } else {
        setRefBarcode(localStorage.getItem("ReferceRun"));
      }

      setLastStatioCheck(LastStationID?.StationName);
      setRefBarcodeCompare(RefCompare);
      if (PsnPos) {
        const [psnStartIndex, psnLength] = PsnPos.split(/[:,;]/).map(Number);
        setPsnBarcode(data.substring(psnStartIndex, psnStartIndex + psnLength));
      } else {
        setPsnBarcode(data);
      }
      setRandomNumber(Math.floor(Math.random() * 100) + 1);
    }
  };
  const processPSN = async () => {
    setApiData(null);
    setIsLoading(true);
    if (await verifyData()) {
      try {
        const response = await fetch(
          `${api}/api/TraceProducts?paramSn=${psnBarcode}&paramStationNumber=${lastStatioCheck}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // setResult(data2);
        setResult(data.Status);
        if (data.Status === "Pass") {
          await fetchDataParam();

          setTrackingData((prevState) => ({
            ...prevState,
            TrackPSN: psnBarcode,
            TrackReference: refBarcode,
            TrackingWO: selectedData.WoNumber,
            TrackingLastStationId: ReferenceData.LastStationID.Id,
          }));
          setErrorProduct("");
          setIsLoading(false); // Set isLoading menjadi false setelah selesai fetching
          setParameterGalleries(
            apiData && apiData.ParameterCheck
              ? apiData.ParameterCheck.map(() => [])
              : []
          );
          setEditingData(null);
          setShowModal(true);
        } else {
          setErrorProduct(data.Description);
        }
      } catch (error) {
        toast.error("There was a problem with the fetch operation:", error);

        setResult("");
        setErrorProduct("Error fetching data");
        setPsnBarcode("");
        setIsLoading(false);
      } finally {
        setIsLoading(false); // Set isLoading menjadi false setelah selesai fetching
      }
    } else {
    }
    setProcessedPsn("Last Barcode : " + query);
    setQuery("");
  };

  function verifyData() {
    if (!refBarcodeCompare) {
      if (refBarcode === localStorage.getItem("ReferceRun")) {
        return true;
      } else {
        toast.error("Diference Reference run");
        return false;
      }
    } else {
      if (refBarcode === refBarcodeCompare) {
        return true;
      } else {
        toast.error(
          "Diference Reference run with compare psn " +
            refBarcode +
            " <> " +
            refBarcodeCompare
        );
        return false;
      }
    }
  }
  const handleImageGaleyClick = (images, index) => {
    setSelectedImages(images);
    setShowModalGalery(true);
  };
  const handleSearch = (event) => {
    event.preventDefault();

    fetchDataTracks();
  };
  const handleCloseModalGalery = () => {
    setShowModalGalery(false);
    setSelectedImages([]);
  };
  useEffect(() => {
    if (!error && !showModal) {
      setError("");
    }
  }, [showModal, error]);

  useEffect(() => {
    if (psnBarcode !== "") {
      processPSN();
    }
  }, [randomNumber]);

  useEffect(() => {
    if (apiData && Array.isArray(apiData.ParameterCheck)) {
      setParameterGalleries(
        apiData.ParameterCheck.map((parameter) => parameter.ImageDataChecks)
      );
    } else {
      setParameterGalleries([]);
    }
  }, [apiData]);
  useEffect(() => {
    fetchDataTracks();
    fetchDataWoParam(selectedData.Id);
  }, []);
  // const focusInput = () => {
  //   inputPSN.current.focus();
  // };

  return (
    <div className="z-0 ">
      <div className="flex items-center gap-3 mb-2 bg-green-500 text-white  pl-2 rounded-2xl">
        <span className="text-2xl py-2">Product Check</span>
      </div>
      {isLoading && <div className="loading-animation">Loading...</div>}
      {selectedData && (
        <div className="mb-4">
          <div className="mx-auto">
            <div className="bg-slate-200 shadow-md rounded px-2 pt-2 pb-1 mb-2 flex flex-wrap items-center justify-between">
              <div className="flex mb-2 w-full md:w-auto md:flex-1">
                <div className="mr-2 mb-2 md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="woNumber"
                  >
                    WO Number
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="woNumber"
                    type="text"
                    label="WO Number"
                    value={selectedData.WoNumber}
                    placeholder="WO Number"
                    readOnly
                  />
                </div>
                <div className="mr-2 mb-2 md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="soNumber"
                  >
                    SO Number
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="soNumber"
                    type="text"
                    label="SO Number"
                    value={selectedData.SONumber}
                    placeholder="SO Number"
                    readOnly
                  />
                </div>
                <div className="mr-2 mb-2 md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="reference"
                  >
                    Reference
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="reference"
                    type="text"
                    label="Reference"
                    value={selectedData.WoReferenceID}
                    placeholder="Reference"
                    readOnly
                  />
                </div>
                <div className="mr-2 mb-2 md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="woQty"
                  >
                    WO Qty
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="woQty"
                    type="text"
                    label="WO QTY"
                    value={selectedData.WoQTY}
                    placeholder="WO Qty"
                    readOnly
                  />
                </div>
                <div className="mr-2 mb-2 md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="qtyPass"
                  >
                    Qty Pass
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="qtyPass"
                    type="text"
                    label="WO QTY"
                    value={selectedData.PassQTY}
                    placeholder="Qty Pass"
                    readOnly
                  />
                </div>
                <div className="mr-2 mb-2 md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="qtyFail"
                  >
                    Qty Fail
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="qtyFail"
                    type="text"
                    label="WO QTY"
                    value={selectedData.FailQTY}
                    placeholder="Qty Fail"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <button
                  // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 md:mt-0 md:ml-2 "
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 md:mt-0 md:ml-2 ${
                    isWoRunning ? "bg-red-500" : "bg-green-500"
                  } text-white w-auto `}
                  onClick={handleRunStop}
                >
                  {isWoRunning ? "Stop" : "Run"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`w-full mx-1 mb-2 overflow-hidden rounded-lg shadow-lg bg-gray-100 ${
          isWoRunning ? "" : "hidden"
        }`}
      >
        <div className="flex items-center p-2">
          <input
            name="inputPSN"
            className="flex-grow px-4 py-2 border rounded-l"
            type="text"
            placeholder="PSN for process ..."
            value={query}
            onChange={handleChangeProduct}
            onKeyPress={handleKeyPressProduct}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r ml-1"
            onClick={handleSearchProduct}
          >
            Process
          </button>
          {result && (
            <div className="ml-2">
              <label className="block">{result}</label>
              {errorProduct && (
                <div className="text-red-500">Error: {errorProduct}</div>
              )}
            </div>
          )}
        </div>
        <>
          {processedPsn && (
            <div className="ml-2">
              <label className="block">{processedPsn}</label>
            </div>
          )}
        </>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 ">
          <div className="bg-white p-6  shadow-lg w-full relative rounded-xl m-4">
            <h2 className="text-lg font-bold mb-4">
              {editingData
                ? "Edit Data PSN : " + psnEdit
                : "Cek PSN : " + psnBarcode}
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            {apiData &&
              apiData.ParameterCheck &&
              Array.isArray(apiData.ParameterCheck) &&
              apiData.ParameterCheck.map((check, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-center mb-4 space-y-2 md:space-y-0 md:space-x-4"
                  >
                    <label className="w-1/9 font-medium">
                      {check.Description}
                    </label>
                    <select
                      className="w-1/9 p-2 border border-gray-300 rounded"
                      value={
                        dataTrackCheckings.find(
                          (item) => item.PCID === check.Id
                        )?.Result || ""
                      }
                      onChange={(e) => {
                        const newDataTrackCheckings = dataTrackCheckings.map(
                          (item) => {
                            const isMatchingId = _.isEqual(item.PCID, check.Id);
                            return isMatchingId
                              ? { ...item, Result: e.target.value }
                              : item;
                          }
                        );
                        setDataTrackCheckings(newDataTrackCheckings);
                      }}
                    >
                      <option value="">Pilih Hasil</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    {/* Hidden select element */}
                    <div className="w-1/9">
                      <select
                        className="w-1/9 p-2 border border-gray-300 rounded"
                        value={
                          dataTrackCheckings.find(
                            (item) => item.PCID === check.Id
                          )?.ErrorId || ""
                        }
                        onChange={(e) => {
                          const newDataTrackCheckings = dataTrackCheckings.map(
                            (item) => {
                              const isMatchingId = _.isEqual(
                                item.PCID,
                                check.Id
                              );
                              return isMatchingId
                                ? { ...item, ErrorId: e.target.value }
                                : item;
                            }
                          );
                          setDataTrackCheckings(newDataTrackCheckings);
                        }}
                        style={{
                          visibility:
                            dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result === "Pass" ||
                            !dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result
                              ? "hidden"
                              : "visible",
                          opacity:
                            dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result === "Pass" ||
                            !dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result
                              ? 0
                              : 1,
                        }}
                      >
                        <option value="">Pilih Error Message</option>
                        {editingData
                          ? check.selectErrorMessage.map(
                              (errorMessage, index) =>
                                // Periksa apakah errorMessage.ErrorMessage tidak null atau undefined
                                errorMessage.ErrorMessage && (
                                  <option
                                    key={index}
                                    value={errorMessage.ErrorMessage.Id}
                                  >
                                    {errorMessage.ErrorMessage.ErrorCode +
                                      "=>" +
                                      errorMessage.ErrorMessage
                                        .ErrorDescription}
                                  </option>
                                )
                            )
                          : // Logika baru untuk kasus ketika editingData bernilai false
                            check.ParameterCheckErrorMessages.$values.map(
                              (errorMessage, index) => (
                                <option
                                  key={index}
                                  value={errorMessage.ErrorMessage.Id}
                                >
                                  {errorMessage.ErrorMessage.ErrorCode +
                                    "=>" +
                                    errorMessage.ErrorMessage.ErrorDescription}
                                </option>
                              )
                            )}
                      </select>
                    </div>
                    <div className="w-1/9">
                      {check.ImageSampleUrl && (
                        <img
                          src={`${api}${check.ImageSampleUrl}`}
                          alt="Sample Image"
                          className="w-32 h-16"
                          onClick={() => {
                            setEnlargedImage(`${api}${check.ImageSampleUrl}`);
                            setShowEnlargedModal(true);
                          }}
                        />
                      )}
                    </div>
                    
                   

                    <div className="w-3/9">
                      <div className="flex items-center">
                        <div className="mt-1 flex items-center">
                          <button
                            htmlFor="fileInput"
                            className="w-12 h-12 bg-blue-500 text-white rounded-md  items-cente"
                            onClick={() =>
                              document
                                .getElementById(`fileInput-${index}`)
                                .click()
                            }
                          >
                            <GrGallery className="mx-auto" />
                          </button>
                          <input
                            id={`fileInput-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileUpload(e, index)}
                          />
                          <button
                            onClick={() => handleCameraCapture(index)}
                            className="w-12 h-12 bg-green-500 text-white rounded-md  items-center"
                          >
                            <FaCamera className="mx-auto" />
                          </button>
                        </div>
                        <div className="mt-4">
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-44 h-28 " // Atur ukuran preview webcam di sini
                          />
                        </div>
                        <div className="mx-2">
                          {parameterGalleries[index] &&
                            parameterGalleries[index].length > 0 && (
                              <div className="mt-4 w-full">
                                <div className="relative overflow-hidden rounded-md">
                                  <div className="flex transition-transform duration-300 ease-in-out">
                                    {parameterGalleries[index].map(
                                      (imageUrl, imgIndex) => (
                                        <div
                                          key={imgIndex}
                                          className="flex-shrink-0 w-24 h-24 relative"
                                        >
                                          <img
                                            src={imageUrl}
                                            alt={`Gallery Image ${imgIndex}`}
                                            className="w-full h-full rounded-md object-cover border border-gray-200"
                                            onClick={() =>
                                              handleImageGaleyClick(
                                                parameterGalleries[index].map(
                                                  (url, idx) => ({
                                                    url,
                                                    alt: `Gallery Image ${idx}`,
                                                  })
                                                ),
                                                imgIndex
                                              )
                                            }
                                          />
                                          <button
                                            name="buttonDelete"
                                            className="absolute top-0 right-0 mt-1 mr-1 p-1 bg-red-500 text-white rounded-full text-sm focus:outline-none"
                                            onClick={() =>
                                              removeImageFromGallery(
                                                index,
                                                imgIndex
                                              )
                                            }
                                          >
                                            X
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                        {showModalGalery && selectedImages.length > 0 && (
                          <ImageModal
                            images={selectedImages}
                            onClose={handleCloseModalGalery}
                          />
                        )}
                      </div>
                      
                    </div>
                    <div className="w-1/9">
                      {/* Checkbox */}
                      <div
                        className={`flex items-center `}
                        style={{
                          visibility:
                            dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result === "Pass" ||
                            (!dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result &&
                              ["Admin", "staf", "Inspektor"].includes(
                                localStorage.getItem("Role")
                              ))
                              ? "hidden"
                              : "visible",
                          opacity:
                            dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result === "Pass" ||
                            (!dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Result &&
                              ["Admin", "staf", "Inspektor"].includes(
                                localStorage.getItem("Role")
                              ))
                              ? 0
                              : 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`checkbox-${index}`}
                          checked={
                            dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.Approve || false
                          }
                           
                          onChange={(e) => {
                            const newDataTrackCheckings = dataTrackCheckings.map((item) => {
                              if (item.PCID === check.Id) {
                                console.log("Updating Approve for", check.Id, "to", e.target.checked);
                                return { ...item, Approve: e.target.checked };
                              }
                              return item;
                            });
                            console.log("New DataTrackCheckings:", newDataTrackCheckings);
                            setDataTrackCheckings(newDataTrackCheckings);
                          }}
                          
                          className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                        />
                        <label
                          htmlFor={`checkbox-${index}`}
                          className="ml-2 block text-sm leading-5 text-gray-900"
                        >
                          Approve
                        </label>
                      </div>
                    </div>
                    <div className="w-1/9">
  {/* Input Area */}
  <div
    className="transition duration-300"
    style={{
      visibility: (() => {
        // Log seluruh dataTrackCheckings
        console.log("dataTrackCheckings:", dataTrackCheckings);

        // Log nilai check.Id
        console.log("check.Id:", check.Id);

        // Cari item yang sesuai
        const dataItem = dataTrackCheckings.find((item) => item.PCID === check.Id);

        // Log item yang ditemukan
        console.log("dataItem:", dataItem);

        // Ambil nilai Approve
        const approvalStatus = dataItem?.Approve;

        // Log nilai Approve
        console.log("Approve:", approvalStatus);

        // Ambil dan log Role
        const userRole = localStorage.getItem("Role");
        console.log("Role:", userRole);

        // Kembalikan nilai visibility
        return approvalStatus === true && ["Admin", "staf", "Inspektor"].includes(userRole)
          ? "visible"
          : "hidden";
      })(),
      opacity: (() => {
        // Log seluruh dataTrackCheckings
        console.log("dataTrackCheckings:", dataTrackCheckings);

        // Log nilai check.Id
        console.log("check.Id:", check.Id);

        // Cari item yang sesuai
        const dataItem = dataTrackCheckings.find((item) => item.PCID === check.Id);

        // Log item yang ditemukan
        console.log("dataItem:", dataItem);

        // Ambil nilai Approve
        const approvalStatus = dataItem?.Approve;

        // Log nilai Approve
        console.log("Approve:", approvalStatus);

        // Ambil dan log Role
        const userRole = localStorage.getItem("Role");
        console.log("Role:", userRole);

        // Kembalikan nilai opacity
        return approvalStatus === true && ["Admin", "staf", "Inspektor"].includes(userRole)
          ? 1
          : 0;
      })(),
    }}
  >
    <textarea
      className="w-full p-2 border border-gray-300 rounded"
      value={inputValues[index] || ""}
      onChange={(e) => handleInputChange(index, e.target.value)}
      placeholder="Masukkan keterangan di sini"
    />
  </div>
</div>


                    
                  </div>
                  
                );
              })}
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
            <div className="flex justify-between items-end mt-5">
              <button
                type="submit"
                onClick={editingData ? handleUpdateData : handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {editingData ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto bg-gray-200 rounded-lg p-2">
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
                            Detail Data for Track ID: {track.TrackPSN}
                          </h2>
                          <table className="w-full ">
                            <tbody className="bg-slate-100">
                              {detailDataMap[track.Id].map((detail, index) => {
                                return (
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
                                      {detail.ParameterCheck
                                        .ParameterCheckErrorMessages &&
                                      detail.ParameterCheck
                                        .ParameterCheckErrorMessages.$values
                                        .length > 0
                                        ? detail.ParameterCheck.ParameterCheckErrorMessages.$values
                                            .map((error) => {
                                              const errorMessage =
                                                error.ErrorMessage;
                                              if (
                                                errorMessage &&
                                                errorMessage.ErrorCode &&
                                                errorMessage.ErrorDescription
                                              ) {
                                                return `${errorMessage.ErrorCode} => ${errorMessage.ErrorDescription}`;
                                              }
                                              return null; // Mengembalikan null jika kondisi tidak terpenuhi
                                            })
                                            .filter((value) => value !== null) // Menyaring nilai null
                                            .join(", ")
                                        : "-"}
                                    </td>
                                    <td className="">
                                      <div className="flex gap-2">
                                        {detail.ImageDataChecks.$values.map(
                                          (image, imageIndex) => (
                                            <img
                                              key={imageIndex}
                                              src={`${api}${image.ImageUrl}`}
                                              alt={`Image ${imageIndex + 1}`}
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
