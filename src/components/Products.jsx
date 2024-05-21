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
  const [topError, setTopError] = useState([]);
  const [optionEdit, setOptionEdit] = useState([]);
  const [totalItems, setTotalItems] = useState(10);
  const [totalPages, SetTotalPages] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [pageSize, SetPageSize] = useState(10);
  // image
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [isToastDisplayed, setIsToastDisplayed] = useState(false);
  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPoint({ x: e.clientX - translate.x, y: e.clientY - translate.y });
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

  // <==================>
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
    SetCurrentPage(currentPage);
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
      const response = await axios.get(
        `https://localhost:5001/api/DataTracks/${id}`
      );
      const trackData = response.data;
      setPsnEdit(response.data.TrackPSN);
      const detailDataResponse = await axios.get(
        `https://localhost:5001/api/DataTrackChecks/${id}`
      );
      const detailData = detailDataResponse.data.$values;
      const parameterCheck = detailData.map((item) => {
        return {
          Id: item.ParameterCheck.Id,
          Description: item.ParameterCheck.Description,
          Order: item.ParameterCheck.Order,
          Result: item.DTCValue,
          ImageDataChecks: item.ImageDataChecks.$values.map(
            (image) => `${api}${image.ImageUrl}`
          ),
          ParameterCheckErrorMessages: item.ErrorTracks,
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
        detailDataResponse.data.$values.map((check, index) => {
          // Fungsi untuk normalisasi GUID
          const normalizeGuid = (guid) => {
            return guid === "00000000-0000-0000-0000-000000000000" ? "" : guid;
          };

          return {
            PCID: normalizeGuid(check.Id),
            Result: check.Result,
            ErrorId: normalizeGuid(check.ErrorId),
            Approve: check.Approve,
            ApprovalId: normalizeGuid(check.ApprovalId),
            ApprRemaks: check.ApprRemaks,
          };
        })
      );
      const newDataTrackCheckings = detailDataResponse.data.$values.map(
        ({ PCID, DTCValue, ErrorId, Approve, ApprovalId, ApprRemaks }) => ({
          PCID: PCID,
          Result: DTCValue,
          ErrorId: ErrorId,
          Approve: Approve,
          ApprovalId: ApprovalId,
          ApprRemaks: ApprRemaks,
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
      setTopError(response.data.TopErrors.$values);
      // Menambahkan ParameterCheck ke dalam newData.ParameterCheck
      parameterChecks.forEach((item) => {
        if (item.ParameterCheck) {
          newData.ParameterCheck.push(item.ParameterCheck);
        }
      });

      // Memperbarui state apiData dengan newData
      setApiData(newData);

      setDataTrackCheckings(
        response.data.DataReferenceParameterChecks.$values.map((check) => {
          return {
            PCID: check.ParameterCheck.Id,
            Result: "",
            ErrorId: null,
            Approve: false,
            ApprovalId: null,
            ApprRemaks: "",
          };
        })
      );
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
        Approve: item.Approve,
        ApprovalId: item.ApprovalId,
        ApprRemaks: item.ApprRemaks,
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
        PCID: item.PCID,
        DTCValue: item.Result,
        ErrorId: item.ErrorId,
        Approve: item.Approve,
        ApprovalId: item.ApprovalId,
        ApprRemaks: item.ApprRemaks,
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
  const handlerecordPerPage = (event) => {
    event.preventDefault();
    const page = event.target.value;
    SetPageSize(page);
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
    if (!showModal) {
      setIsToastDisplayed(false);
      toast.dismiss();
    }
    if (topError.length > 0 && showModal && !isToastDisplayed) {
      toast.info(
        <div>
          <p>Perhatikan:</p>
          {topError.map((item, index) => (
            <div key={index}>
              {index + 1}. {item.ErrorCode} - {item.ErrorDescription}
            </div>
          ))}
        </div>,
        {
          position: "top-center", // Atur posisi ke atas tengah
          autoClose: 60000,
          onClose: () => setIsToastDisplayed(false), // Set isToastDisplayed to false when toast is closed
        }
      );
      setIsToastDisplayed(true);
    }

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
    if(selectedData){
      fetchDataWoParam(selectedData.Id);
    }
  }, []);
  useEffect(() => {
    fetchDataTracks(currentPage, pageSize);
  }, [pageSize, currentPage, showModal]);
  // useEffect(() => {
  //   fetchDataTracks(currentPage,pageCount );
  //   fetchDataWoParam(selectedData.Id);
  // }, []);
  return (
    <div className="z-0 ">
      <div className="flex items-center gap-3 mb-2 bg-green-500 text-white  pl-2 rounded-2xl">
        <span className="text-2xl py-2">Product Check</span>
      </div>
      {isLoading && <div className="loading-animation">Loading...</div>}
      {selectedData && (
        <div className="mb-4">
          <div className="mx-auto">
            <label className="block text-black  font-bold mb-2 bg-green-300 shadow-md rounded text-center text-lg py-1">
              Order Running
            </label>

            <div className="bg-slate-200 shadow-md rounded px-2 pt-2  flex flex-wrap items-center justify-between">
              <div className="flex  w-full md:w-auto md:flex-1">
                <div className="mr-2  md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="woNumber"
                  >
                    WO Number : {selectedData.WoNumber}
                  </label>
                </div>

                <div className="mr-2  md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="soNumber"
                  >
                    SO Number : {selectedData.SONumber}
                  </label>
                </div>
                <div className="mr-2  md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="reference"
                  >
                    Reference : {selectedData.WoReferenceID}
                  </label>
                </div>
                <div className="mr-2  md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="woQty"
                  >
                    WO Qty : {selectedData.WoQTY}
                  </label>
                </div>
                <div className="mr-2  md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="qtyPass"
                  >
                    Qty Pass :{selectedData.PassQTY}
                  </label>
                </div>
                <div className="mr-2  md:mb-0 md:w-1/6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="qtyFail"
                  >
                    Qty Fail : {selectedData.FailQTY}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div
        className={`w-full mx-1 mb-1 overflow-hidden rounded-lg shadow-lg bg-green-300 ${
          isWoRunning ? "" : "hidden"
        }`}
      >
        
        <div className={`flex items-center p-2 ${selectedData?"":"hidden"}`}>
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
                        value={(() => {
                          const errorId = dataTrackCheckings.find(
                            (item) => item.PCID == check.Id
                          )?.ErrorId;
                          return errorId || "";
                        })()}
                        onChange={(e) => {
                          const newDataTrackCheckings = dataTrackCheckings.map(
                            (item) => {
                              const isMatchingId = item.PCID == check.Id;

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

                        {check.ParameterCheckErrorMessages.$values.map(
                          (errorMessage, index) => {
                            // Tambahkan console.log(check) di sini

                            if (editingData) {
                              // Logika dari kode pertama
                              return (
                                errorMessage && (
                                  <option
                                    key={index}
                                    value={errorMessage.ErrorId}
                                  >
                                    {errorMessage.ErrorCode +
                                      "=>" +
                                      errorMessage.ErrorDescription}
                                  </option>
                                )
                              );
                            } else {
                              // Logika dari kode kedua untuk kasus ketika editingData bernilai false
                              return (
                                <option
                                  key={index}
                                  value={errorMessage.ErrorMessage.Id}
                                >
                                  {errorMessage.ErrorMessage.ErrorCode +
                                    " => " +
                                    errorMessage.ErrorMessage.ErrorDescription}
                                </option>
                              );
                            }
                            return null;
                          }
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
                            const newDataTrackCheckings =
                              dataTrackCheckings.map((item) => {
                                if (item.PCID === check.Id) {
                                  return { ...item, Approve: e.target.checked };
                                }
                                return item;
                              });

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

                            const dataItem = dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            );
                            const approvalStatus = dataItem?.Approve;

                            const userRole = localStorage.getItem("Role");
                            return approvalStatus === true &&
                              ["Admin", "staf", "Inspektor"].includes(userRole)
                              ? "visible"
                              : "hidden";
                          })(),
                          opacity: (() => {
                            const dataItem = dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            );
                            const approvalStatus = dataItem?.Approve;
                            const userRole = localStorage.getItem("Role");
                            return approvalStatus === true &&
                              ["Admin", "staf", "Inspektor"].includes(userRole)
                              ? 1
                              : 0;
                          })(),
                        }}
                      >
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded"
                          value={
                            dataTrackCheckings.find(
                              (item) => item.PCID === check.Id
                            )?.ApprRemaks || ""
                          }
                          onChange={(e) => {
                            const newDataTrackCheckings =
                              dataTrackCheckings.map((item) => {
                                if (item.PCID === check.Id) {
                                  return {
                                    ...item,
                                    ApprRemaks: e.target.value,
                                  };
                                }
                                return item;
                              });

                            setDataTrackCheckings(newDataTrackCheckings);
                          }}
                          placeholder="Masukkan keterangan di sini"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            {showEnlargedModal && (
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
                    src={enlargedImage}
                    alt="Enlarged Image"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <button
                  className="absolute top-0 right-0 m-2 text-white hover:text-gray-300 bg-red-700 rounded-full p-2 z-51"
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

      <div className="container mx-auto bg-blue-400 rounded-lg p-2">
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
    </div>
  );
}
