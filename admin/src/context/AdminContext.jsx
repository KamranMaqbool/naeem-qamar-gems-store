import { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user] = useState({
    name: 'Admin User',
    email: 'admin@virtuoso-gems.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEpoImCMH7iVlLl42f7T86T11YaUjU5RC1FNRYUDA3ChWQ6JtgIt8VakJelhjeqpx7-h9fYnVAMC_S3l0Gml2EzUo0Yihr_eeXrc-oz2wdp-3HnYeE1R4h7mLW0m9NDhR_BZn2shRd_haqp7yWUvxTb2Mcl0q6sTX_OxqdAZsz9XmnhMabcc040Zk4F1qbhwKUXvZkRcJwwIG7-Rozmgh3xQ4GiHKPJIN40obYPJEnoV-3RciRPMz8eQ',
  });

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    closeSidebar();
  }, [closeSidebar]);

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        closeSidebar,
        currentPage,
        navigate,
        user,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}