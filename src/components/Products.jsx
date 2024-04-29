import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { FaEye, FaEdit } from 'react-icons/fa';
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import CarouselGallery from '../components/CarouselGallery';
import Slider from "react-slick";
import Webcam from "react-webcam";
export default function Products() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(
    JSON.parse(localStorage.getItem("selectedOrder"))
  );
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
  const [parameterGalleries, setParameterGalleries] = useState(
    apiData && apiData.ParameterChecks
      ? apiData.ParameterChecks.map(() => [])
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
 const [trackId, setTrackId] = useState('');
 const [trackPSN, setTrackPSN] = useState('');
 const fetchDataTracks = async () => {
  try {
    const response = await axios.get('https://localhost:5001/api/DataTracks');
    setDataTracks(response.data.DataTracks.$values);
  } catch (error) {
    console.error('Error fetching data tracks:', error);
  }
};

const fetchDetailData = async (id) => {
  try {
    const response = await axios.get(`https://localhost:5001/api/DataTrackChecks/${id}`);
    setDetailData(response.data.$values);
    setShowDetail(true);
    setTrackId(id);
   
  } catch (error) {
    console.error('Error fetching detail data:', error);
  }
};

const handleDetailClick = (id,psn) => {
  fetchDetailData(id);
  console.log('psn',psn)
  setTrackPSN(psn);
};
const handleEditClick = (id) => {
  console.log(`Edit clicked for track ID: ${id}`);
};
const closeModal = () => {
  setShowModal(false);

  setEditData(null);
};
const fetchDataParam = async () => {
  try {
    const response = await axios.get(
      `${api}/api/ParamChecks/ByReference/${refId}`
    );
    const transformedData = transformData(response.data);
    setApiData(transformedData);
    setDataTrackCheckings(
      transformedData.ParameterChecks.map((check) => ({
        PCId: check.Id,
        Result: "",
      }))
    );
  } catch (error) {
    toast.error(`Error fetching data: ${error.message}`, {});
  }
};
const InputField = ({ label, value }) => {
  return (
    <div className="mx-2 mb-2">
      <label className="block text-sm font-medium text-gray-700 ">
        {label}
      </label>
      <input
        type="text"
        className="m-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        value={value || ""}
        readOnly
      />
    </div>
  );
};
const handleKeyPressProduct = (e) => {
  if (e.key === "Enter") {
    handleSearchProduct();
  }
};
const handleChangeProduct = (e) => {
  setQuery(e.target.value);
};

const transformData = (data) => {
  // Access the relevant data structure
  const referenceData = data.$values[0].DataReference; // Assuming first item has DataReference
  const parameterChecks = data.$values.map((item) => ({
    Id: item.Id,
    Description: item.Description,
    Order: item.Order,
  }));

  // Create the desired transformed object
  const transformed = {
    ...referenceData, // Spread properties from referenceData
    ParameterChecks: parameterChecks, // Add the array of parameter checks
  };

  return transformed;
};
const handleSubmit = async () => {
  // Logika untuk menentukan TrackingResult dan TrackingStatus
  const allPassed = dataTrackCheckings.every(
    (item) => item.Result === "Pass" || item.Result === "PASS"
  );

  const updatedTrackingData = {
    ...trackingData,
    TrackingResult: allPassed ? "PASS" : "FAIL",
    TrackingStatus: allPassed ? "PASS" : "FAIL",
    DataTrackCheckings: dataTrackCheckings.map((item, index) => ({
      PCId: item.PCId,
      DTCValue: item.Result,
      DTCisDeleted: false,
      ImageDataChecks: parameterGalleries[index].map((imageUrl) => ({
        ImageUrl: imageUrl,
      })),
    })),
  };

  try {
    console.log(`${api}/api/DataTracks`, updatedTrackingData);
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
      console.log("Data berhasil dikirim ke server");
      // Lakukan tindakan lain yang diperlukan setelah berhasil
    } else {
      // Penanganan error
      console.error("Error saat mengirim data ke server");
      // Lakukan tindakan lain yang diperlukan saat terjadi error
    }
  } catch (error) {
    console.error("Error saat mengirim data ke server:", error);
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
  if (parameterGalleries[index].length < 5) {
    setParameterGalleries((prevGalleries) => {
      const newGalleries = [...prevGalleries];
      newGalleries[index] = [...newGalleries[index], imageUrl];
      return newGalleries;
    });
  } else {
    toast.error("Maximum 5 images allowed in the gallery");
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
    ? webcamRef.current.getScreenshot()
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
            apiData && apiData.ParameterChecks
              ? apiData.ParameterChecks.map(() => [])
              : []
          );
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
    setParameterGalleries(
      apiData && apiData.ParameterChecks
        ? apiData.ParameterChecks.map(() => [])
        : []
    );
  }, [apiData]);
  useEffect(() => {
    fetchDataTracks();
  }, []);
 
  return (
    <div className="z-0 ">
      {isLoading && <div className="loading-animation">Loading...</div>}
      {selectedData && (
        <div className="mb-4">
          <div className="w-full m-2 overflow-hidden rounded-lg shadow-lg bg-gray-100 ">
            <h2 className="font-bold text-lg mx-2 ">Order Running:</h2>
            <div className="grid grid-cols-5 gap-4 mb-4">
              <InputField label="WO Number" value={selectedData.WoNumber} />
              <InputField label="SO Number" value={selectedData.SONumber} />
              <InputField
                label="Reference"
                value={selectedData.WoReferenceID}
              />
              <InputField label="WO QTY" value={selectedData.WoQTY} />
              <div>
                <button
                  className={`mt-2 py-2 px-4 rounded font-semibold ${
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
      <div className="w-full mx-1 mb-2 overflow-hidden rounded-lg shadow-lg bg-gray-100">
        <div className="flex items-center p-2">
          <input
            name="inputPSN"
            className="flex-grow px-4 py-2 border rounded-l"
            type="text"
            placeholder="PSN..."
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-md overflow-auto max-h-full w-3/4">
            <h2 className="text-lg font-bold mb-4">Cek Produk</h2>
            {error && <p className="text-red-500">{error}</p>}
            {apiData &&
              apiData.ParameterChecks.map((check, index) => (
                <div key={check.Id} className="flex items-center mb-4">
                  <label className="w-64 font-semibold">
                    {check.Description}
                  </label>
                  <div className="flex items-center">
                    <select
                      className="border border-gray-300 rounded p-2"
                      value={
                        dataTrackCheckings.find((item) => item.PCId === check.Id)
                          ?.Result || ""
                      }
                      onChange={(e) => {
                        const newDataTrackCheckings = dataTrackCheckings.map(
                          (item) =>
                            item.PCId === check.Id
                              ? { ...item, Result: e.target.value }
                              : item
                        );
                        setDataTrackCheckings(newDataTrackCheckings);
                      }}
                    >
                      <option value="">Pilih Hasil</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    {parameterGalleries[index] &&
                      parameterGalleries[index].length > 0 && (
                        <div className="mt-4 w-full">
                          <div className="relative overflow-hidden rounded-md">
                            <div className="flex transition-transform duration-300 ease-in-out">
                              {parameterGalleries[index].map(
                                (imageUrl, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="flex-shrink-0 w-32 h-32 relative"
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`Gallery Image ${imgIndex}`}
                                      className="w-full h-full rounded-md object-cover border border-gray-200"
                                    />
                                    <button
                                    name="buttonDelete"
                                      className="absolute top-0 right-0 mt-1 mr-1 p-1 bg-red-500 text-white rounded-full text-sm focus:outline-none"
                                      onClick={() =>
                                        removeImageFromGallery(index, imgIndex)
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
                    {/* <CarouselGallery images={parameterGalleries[index]} /> */}

                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, index)}
                      />
                      <button onClick={() => handleCameraCapture(index)}>
                        Capture from Webcam
                      </button>
                    </div>
                    <div className="mt-4">
                    <Webcam
    audio={false}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    className="w-44 h-28" // Atur ukuran preview webcam di sini
  />
                    </div>
                  </div>
                </div>
              ))}
            <div className="flex justify-between">
              <button
                type="submit"
                onClick={handleSubmit}
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
          </div>
        </div>
      )}
      <div className="container mx-auto">
     <h1 className="text-2xl font-bold mb-4">Data Tracks</h1>
     <table className="table-auto w-full">
       <thead>
         <tr>
           <th className="px-4 py-2">PSS</th>
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
           <tr key={track.Id} className="border-b">
             <td className="px-4 py-2">{track.TrackPSN}</td>
             <td className="px-4 py-2">{track.TrackingWO}</td>
             <td className="px-4 py-2">{track.TrackReference}</td>
             <td className="px-4 py-2">{track.LastStationID.StationName}</td>
             <td className="px-4 py-2">{track.LastStationID.DataLine.LineName}</td>
             <td className="px-4 py-2">{new Date(track.TrackingDateCreate).toLocaleString()}</td>
             <td className="px-4 py-2">{track.User.DisplayName}</td>
             <td className="px-4 py-2 flex">
               <button
                 className="mr-2 hover:text-blue-500"
                 onClick={() => handleDetailClick(track.Id,track.TrackPSN)}
               >
                 <FaEye size={20} title="Detail" />
               </button>
               <button
                 className="hover:text-green-500"
                 onClick={() => handleEditClick(track.Id)}
               >
                 <FaEdit size={20} title="Edit" />
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>

     {showDetail && (
       <div className="mt-2 px-9">
         <h2 className="text-xl font-bold">Detail Data for Track ID: {trackPSN}</h2>
         {detailData.map((detail, index) => (
           <div key={index} className="mb-1">
             <div className="bg-gray-200 p-1 rounded">
               <div className="flex items-center justify-start gap-6 mb-1">
                 <h3 className="text-lg font-bold">
                   {detail.ParameterCheck.Description}
                 </h3>
                 <span className="text-sm font-medium">{detail.DTCValue}</span>
                 <div className="grid grid-cols-5 gap-4">
                 {detail.ImageDataChecks.$values.map((image, imageIndex) => (
                   <img
                     key={imageIndex}
                     src={`https://localhost:5001${image.ImageUrl}`}
                     alt={`Image ${imageIndex + 1}`}
                     className="w-12 h-12 object-cover rounded"
                   />
                 ))}
               </div>
               </div>
              
             </div>
           </div>
         ))}
       </div>
     )}
   </div>

    </div>
  );
}