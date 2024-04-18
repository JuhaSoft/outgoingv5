import {create} from 'zustand';

const OrdersInfo = create((set) => ({
  currentPage: 1,
  pageSize: 15,
  totalPage:100,
  totalRecord:30,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  setTopalPage:(tot) => set({totalPage: tot}),
  setTotalRecord:(totREc) => set({tottotalRecordalRecord: totREc})
}));

export default OrdersInfo;