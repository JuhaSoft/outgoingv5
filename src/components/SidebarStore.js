import create from 'zustand';

const useSidebarStore = create((set, get) => ({
  isOpen: localStorage.getItem('sidebarIsOpen') === 'true',
  activeMenu: null,
  activeSubMenu: null,
  externalActiveMenu: null, // Variabel untuk menu aktif dari luar
  setExternalActiveMenu: (menuName) => set({ externalActiveMenu: menuName }), // Fungsi untuk mengatur menu aktif dari luar
  toggleSidebar: () => set((state) => {
    const isOpen = !state.isOpen;
    localStorage.setItem('sidebarIsOpen', isOpen);
    return { isOpen };
  }),
  setActiveMenu: (menuId) => set({ activeMenu: menuId }),
  setActiveSubMenu: (subMenuId) => set({ activeSubMenu: subMenuId }),
}));

export default useSidebarStore;