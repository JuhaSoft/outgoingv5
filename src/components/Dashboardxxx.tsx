
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import globalConfig from '../../config'
import axios from "axios";
import ReactPaginate from 'react-paginate'
export default function Dashboard() {
  const [dataProduct, setdataProduct] = useState([]);
  const [tbldata, settbldata] = useState('');
  const [pageCount, setpageCount] = useState(0)
  const [totalRecord, setTotalRecord] = useState(0)
  const [recordPerPage, setRecordPerPage] = useState(10)
  // const config = globalConfig;
  // const api = config.APIHOST;
// console.log(api)


  useEffect(() => {
    axios
    .get(`https://localhost:5001/api/DataTracks?PageNumber=1,PageSize=15`)
    .then((response) => {
    //    console.log('datatrack',response.data)
    setdataProduct(response.data.$values)
    setTotalRecord(response.data.$values.count)

    console.log(response.data.$values.count)
    })
    .catch((e) => {
    //   alert(e);
    });
 


// console.log('tbl data',tb_data)
}, []);

  return (
    // <div>
    //             <h1>Data Table</h1>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>PSN</th>
    //                         <th>Reference</th>
    //                         <th>Work Order</th>
    //                         <th>Tracking Date Create</th>
    //                         <th>Tracking Result</th>
    //                         <th>Tracking Status</th>
    //                         <th>User Name</th>
    //                         <th>Actions</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {dataProduct.map(item => (
    //                         <tr key={item.id}>
    //                             <td>{item.trackPSN}</td>
    //                             <td>{item.trackReference}</td>
    //                             <td>{item.trackingWO}</td>
    //                             <td>{item.trackingDateCreate}</td>
    //                             <td>{item.trackingResult}</td>
    //                             <td>{item.trackingStatus}</td>
    //                             <td>{item.user.userName}</td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         </div>
    <div className='z-0 '>
      <div className='overflow-x-auto   shadow-md sm:rounded-lg'>
        <div>
          <table role='table' className='lg:table-auto '>
            <thead role='rowgroup'>
              <tr role='row'>
                <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                 
                   
                  PSN
                </th>
                <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                 Reference
                </th>
                <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                  WOrk Order
                </th>
                <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                 
                 Station ID
                </th>
				
                <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                 
                 Line Name
                </th>
				 <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                 
                 Result
                </th>
                <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                 
                  USER NAME
                </th>
                <th className='text-xs text-white uppercas text-center   bg-green-700 md:text-xs lg:text-sm'>
                 ACTION
                </th>
                
              </tr>
            </thead>
            <tbody role='rowgroup' className='bg-white'>
              {dataProduct.map((data,index) => (
                <tr role='row' key={index}>
                  <td
                    data-name='PSN'
                    className='  text-left text-sm border-solid md:text-xs lg:text-sm  sm:text-[8px]'
                  >
                    {data.trackPSN ? data.trackPSN : '-'}
                  </td>
                  <td
                    data-name='Reference'
                    className='  text-left text-sm border-solid md:text-xs lg:text-sm '
                  >
                    {data.trackReference ? data.trackReference : '-'}
                  </td>
                  <td
                    data-name='WO'
                    className='  text-left text-sm border-solid md:text-xs lg:text-sm '
                  >
                    {data.trackingWO ? data.trackingWO : '-'}
                  </td>
                  <td
                    data-name='LastStation'
                    className='  text-left text-sm border-solid md:text-xs lg:text-sm '
                  >
                    {data.lastStationID.stationID ? data.lastStationID.stationID : '-'}
                  </td>
				  <td
                    data-name='LineName'
                    className='  text-left text-sm border-solid md:text-xs lg:text-sm '
                  >
                    {data.lastStationID.dataReference.dataLine.lineName ? data.lastStationID.dataReference.dataLine.lineName : '-'}
                  </td>
                  <td
                    data-name='Result'
                    className='  text-left text-sm border-solid md:text-xs lg:text-sm '
                  >
                    {data.trackingResult ? data.trackingResult : '-'}
                  </td>
                  
                  <td
                    data-name='UserChecked'
                    className='  text-left text-sm border-solid md:text-xs lg:text-sm '
                  >
                    {data.user.userName ? data.user.userName : '-'}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
           
        </div>
        
      </div>
      <div className=" mt-1 w-full">
        <div className="flex flex-wrap ">
          <div className="w-full  mb-10 lg:w-1/2">
          <div className='sm:flex-none sm:object-center '>
              <select
                name='item'
                className='  w-16   text-base   bg-white text-gray-800 border border-green-700 rounded items-center   align-middle  justify-start'
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
          <div className="w-full   lg:w-1/2 ">
            <div className="flex align-middle  justify-end overflow-auto">
          <ReactPaginate
              previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              // onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-center'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
              
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
