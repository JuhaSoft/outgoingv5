import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';

const Table = ({ data, onEdit, onDelete,onImageClick  }) => {
    const appConfig = window.globalConfig || {
        siteName: process.env.REACT_APP_SITENAME,
      };
      const api = appConfig.APIHOST;
  const [expandedRows, setExpandedRows] = useState([]);
  const handleEdit = (item) => {
    onEdit(item);
  };

  const handleDelete = (id) => {
    onDelete(id);
  };
  const handleImageClick = (imageSrc) => {
    onImageClick(imageSrc);
  };
  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };
 
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Image</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
      {data.map((item) => {
   
  return (
            
          <React.Fragment key={item.Id}>
            <tr className="border-b">
              <td className="px-4 py-2">{item.Description}</td>
              <td className="px-4 py-2">
                {`${api}${item.ImageSampleUrl}`&& (
                  <img
                  src={`${api}${item.ImageSampleUrl}`}
                    alt="Sample"
                    className="w-32 h-16 cursor-pointer"
                    onClick={() => handleImageClick(`${api}${item.ImageSampleUrl}`)}
                  />
                )}
              </td>
              <td className="px-4 py-2 flex justify-end">
              <button
                className="text-blue-500 hover:text-blue-700 mr-2"
                onClick={() => handleEdit(item)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(item.Id)}
              >
                <FaTrash />
              </button>
              </td>
            </tr>
            {expandedRows.includes(item.Id) && (
              <tr>
                <td colSpan="3" className="px-4 py-2">
                  <table className="w-full">
                    <tbody>
                      {item.ParameterCheckErrorMessages.map((detail, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{detail.errorCode}</td>
                          <td className="px-4 py-2">{detail.errorDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </React.Fragment>
         );
        })}
      </tbody>
    </table>
  );
};

export default Table;