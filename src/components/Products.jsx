import React, { useEffect, useState } from "react";
import Select from "react-select";
// import globalConfig from '../../config'
import axios from "axios";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Shared/Modal";
export default function Products() {
  const appConfig = window.globalConfig || {
    siteName: process.env.REACT_APP_SITENAME,
  };
  const api = appConfig.APIHOST;
  const [openDlg, setOpenDlg] = useState(false);
  const [error, setError] = useState("");
  const [saveData, setSaveData] = useState(Boolean);
  const [dataProduct, setdataProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalItems, setTotalItems] = useState(10);
  const [totalPages, SetTotalPages] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [pageSize, SetPageSize] = useState(10);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [comboNames, setComboNames] = useState([]);
  const [dataCollected,setDataCollected] =useState(false);
  const [selectedData, setSelectedData] = useState(
    JSON.parse(localStorage.getItem("selectedOrder"))
  );
  const [selectedStation, setSelectedStation] = useState(null);
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
  let woStart = localStorage.getItem("woStartRun");
  let token = localStorage.getItem("token");
  let UserId = localStorage.getItem("UserId");
  let ReferenceData = JSON.parse(localStorage.getItem("DetailRef"));
  const [isLoading, setIsLoading] = useState(false);
  const [isWoRunning, setIsWoRunning] = useState(
    localStorage.getItem("woStartRun") === "true"
  );

  const handleRunStop = () => {
    if (isWoRunning) {
      // Jika sedang berjalan, set local storage menjadi false dan hentikan
      localStorage.setItem("woStartRun", "false");
      setIsWoRunning(false);
    } else {
      // Jika tidak berjalan, set local storage menjadi true dan jalankan
      localStorage.setItem("woStartRun", "true");
      setIsWoRunning(true);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    WoNumber: "",
    SONumber: "",
    WoReferenceID: "",
    WoQTY: "",
    PassQTY: "0",
    FailQTY: "0",
    WoStatus: "Open",
    // WoCreate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    UserIdCreate: UserId,
    WOisDeleted: false,
  });

  const openModal = () => {
    setError("");
    setShowModal(true);
  };

  const handleEdit = async (data) => {
    setError("");
    setEditData(data);
    setShowModal(true);
    try {
      const response = await axios.get(`${api}/api/Wo/${data.Id}`);
      setFormData({
        ...response.data,
        WoReferenceID: response.data.WoReferenceID,
      });
      setSelectedStation({
        value: response.data.WoReferenceID,
        label: response.data.WoReferenceID,
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const handleUpdate = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${api}/api/Wo/${editData.Id}`,
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

  const closeModal = () => {
    setShowModal(false);
    // Reset nilai input ke nilai awal
    setFormData({
      WoNumber: "",
      SONumber: "",
      WoReferenceID: "",
      WoQTY: "",
      PassQTY: "0",
      FailQTY: "0",
      WoStatus: "Open",
      // WoCreate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      UserIdCreate: UserId,
      WOisDeleted: false,
    });
    // Reset nilai editData untuk menandakan tidak ada data yang sedang diedit
    setEditData(null);
    // Reset nilai editDataFromApi untuk menghapus data yang diambil dari API
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const regex = /^[0-9]*$/;
    if (name === "PassQTY" || name === "FailQTY" || name === "WoQTY") {
      if (!regex.test(value)) {
        // Jika tidak cocok dengan regex, tidak perbarui state
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handlerecordPerPage = (event) => {
    event.preventDefault();
    const page = event.target.value;
    SetPageSize(page);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editData) {
      handleUpdate();
    } else {
      try {
        const response = await axios.post(`${api}/api/WO`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Menampilkan notifikasi sukses
        toast.success("Data berhasil disimpan");
        setFormData({
          WoNumber: "",
          SONumber: "",
          WoReferenceID: "",
          WoQTY: "",
          PassQTY: "0",
          FailQTY: "0",
          WoStatus: "Open",
          UserIdCreate: UserId,
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
    }
  };
  useEffect(() => {
    if (!error && !showModal) {
      setError("");
    }
  }, [showModal, error]);


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
      setRandomNumber(Math.floor(Math.random() * 100) + 1)
    }
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
  
  const handleSearchProduct = async () => {
    // CollectData(query);

   // Set isLoading menjadi false setelah selesai fetching
     await CollectData(query);
    
    
  };
  useEffect(() => {
    if (psnBarcode !== "") {
      processPSN();
    }
  }, [randomNumber]);
  const processPSN = async () => {
    setIsLoading(true); 
    if (await verifyData()) {

      try {
        console.log(`${api}/api/TraceProducts?paramSn=${psnBarcode}&paramStationNumber=${lastStatioCheck}`)
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
          setErrorProduct("");
        setIsLoading(false); // Set isLoading menjadi false setelah selesai fetching

          setShowModal(true);
        } else {
          setErrorProduct(data.Description);
        }
      } catch (error) {
        toast.error("There was a problem with the fetch operation:", error);

        setResult("");
        setErrorProduct("Error fetching data");
        setPsnBarcode("")
        setIsLoading(false); 
      } finally {

        setIsLoading(false); // Set isLoading menjadi false setelah selesai fetching
      }
    }else{

    }
    setProcessedPsn("Last Barcode : " + query)
    setQuery("")
  };
  const fetchDataParam = async () => {
    try {
      const response = await axios.get(
        `${api}/api/ParamChecks/ByReference/${refId}`
      );
      const transformedData = transformData(response.data);
      console.log('transformedData',transformedData)
    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`, {});
    }
  };
 
  useEffect(() => {
    const fetchComboNames = async () => {
      try {
        const response = await axios.get(`${api}/api/DataReference`);
        // Format data dari API sesuai dengan kebutuhan react-select
        const formattedData = response.data.Items.$values.map((item) => ({
          value: item.RefereceName,
          label: item.RefereceName,
        }));
        setComboNames(formattedData);
        // Mengisi formData.WoReferenceID dengan data pertama dari formattedData
        if (formattedData.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            WoReferenceID: formattedData[0].value,
          }));
        }
      } catch (error) {
        toast.error("Error fetching Station names:", error);
      }
    };
    fetchComboNames();
  }, []);
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
          <div className="bg-white p-8 rounded-lg shadow-md w-96 overflow-auto max-h-[100vh]">
            <h2 className="text-lg font-bold mb-4">
              {editData ? "Edit Order" : "Add Order"}
            </h2>
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
                Reference Name
              </label>
              
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
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Pass Quantity
              </label>
              <input
                type="text"
                name="PassQTY"
                value={formData.PassQTY}
                onChange={handleChange}
                placeholder="Pass"
                className="mb-4 p-2 border rounded"
                tabIndex={4}
                readOnly={!editData}
              />
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Fail Quantity
              </label>
              <input
                type="text"
                name="FailQTY"
                value={formData.FailQTY}
                onChange={handleChange}
                placeholder="Fail"
                className="mb-4 p-2 border rounded"
                tabIndex={5}
                readOnly={!editData}
              />
              <label
                htmlFor="input1"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <select
                id="WoStatus"
                name="WoStatus"
                value={formData.WoStatus}
                onChange={handleChange}
                className="mb-2 p-2 border rounded"
                tabIndex={6}
              >
                <option value="Open">Open</option>
                <option value="Close">Close</option>
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
    </div>
  );
}
