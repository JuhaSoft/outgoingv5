import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "tailwindcss/tailwind.css";
import { toast } from "react-toastify";

const WebConfig = () => {
  const quillRefRegister = useRef(null);
  const quillRefInfo = useRef(null);
  const quillInstanceRegister = useRef(null);
  const quillInstanceInfo = useRef(null);
  const [data, setData] = useState(null);
  const [updatedData, setUpdatedData] = useState(data);
  const handleChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  useEffect(() => {
    axios
      .get("https://localhost:5001/api/WebConfigData/")
      .then((response) => {
        console.log("API response:", response.data);

        const apiData = response.data;

        if (apiData) {
          setData(apiData);

          // Initialize Quill editors only once
          if (quillRefRegister.current && !quillInstanceRegister.current) {
            quillInstanceRegister.current = new Quill(
              quillRefRegister.current,
              {
                theme: "snow",
              }
            );
            quillInstanceRegister.current.clipboard.dangerouslyPasteHTML(
              apiData.EmailRegisterBody || ""
            );
          }

          if (quillRefInfo.current && !quillInstanceInfo.current) {
            quillInstanceInfo.current = new Quill(quillRefInfo.current, {
              theme: "snow",
            });
            quillInstanceInfo.current.clipboard.dangerouslyPasteHTML(
              apiData.EmailInfoBody || ""
            );
          }
        } else {
          console.error("Invalid data format from API");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  
  const handleSave = () => {
    const quillRegisterContent = quillInstanceRegister.current.root.innerHTML;
    const quillInfoContent = quillInstanceInfo.current.root.innerHTML;

    // Get the id from the data object
    const id = data.Id;

    const updatedData = {
      Id: id, // Use the existing Id
      WebTitle: data.WebTitle,
      WebDescription: data.WebDescription,
      EmailRegisterTitle: data.EmailRegisterTitle,
      EmailRegisterBody: quillRegisterContent,
      EmailInfoTitle: data.EmailInfoTitle,
      EmailInfoBody: quillInfoContent,
    };

    axios
      .put(`https://localhost:5001/api/WebConfigData/${id}`, updatedData)
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        toast.success("Update config succes")
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  return (
  <div className="container mx-auto p-4 bg-white">
    <h1 className="text-2xl font-bold mb-4 text-center">Web Configuration</h1>
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="webTitle">
          Web Title
        </label>
        <input
          type="text"
          id="webTitle"
          value={data ? data.WebTitle : ""}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => handleChange("WebTitle", e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="WebDescription">
          Web Description
        </label>
        <input
          type="text"
          id="WebDescription"
          value={data ? data.WebDescription : ""}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => handleChange("WebDescription", e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="EmailRegisterTitle">
          Email Register Title
        </label>
        <input
          type="text"
          id="EmailRegisterTitle"
          value={data ? data.EmailRegisterTitle : ""}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => handleChange("EmailRegisterTitle", e.target.value)}

        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email Register Body</label>
        <div ref={quillRefRegister} className="border rounded" style={{ height: "200px" }} ></div>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="EmailInfoTitle">
          Email Info Title
        </label>
        <input
          type="text"
          id="EmailInfoTitle"
          value={data ? data.EmailInfoTitle : ""}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => handleChange("EmailInfoTitle", e.target.value)}

        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email Info Body</label>
        <div ref={quillRefInfo} className="border rounded" style={{ height: "200px" }}></div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
};

export default WebConfig;
