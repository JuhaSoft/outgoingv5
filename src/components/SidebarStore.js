import create from 'zustand';

const useSidebarStore = create((set) => ({
  isOpen: localStorage.getItem('sidebarIsOpen') === 'true',
  toggleSidebar: () => set((state) => {
    const isOpen = !state.isOpen;
    localStorage.setItem('sidebarIsOpen', isOpen);
    return { isOpen };
  }),
}));

export default useSidebarStore;
