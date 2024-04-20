import {create} from 'zustand';


const useStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
}));

export default useStore;
