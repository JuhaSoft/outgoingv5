import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('UserId');
      localStorage.removeItem('username');
      localStorage.removeItem('DisplayName');
      localStorage.removeItem('DisplayName');
      localStorage.removeItem('Role');
      
      navigate('/'); // Navigasi ke halaman utama setelah logout
      window.location.reload();
    };

    // Simulasi penundaan untuk animasi loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
      handleLogout(); // Panggil fungsi handleLogout setelah selesai loading
    }, 200); // Penundaan 2 detik (Anda dapat mengubah nilainya)

    // Membersihkan timeout jika komponen di-unmount sebelum selesai loading
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {isLoading ? (
        // Tampilan animasi loading
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-lg font-semibold">Loading...</p>
        </motion.div>
      ) : (
        // Tampilan setelah selesai loading
        <motion.div
          className="bg-green-200 p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-lg font-semibold">Logged out successfully!</p>
        </motion.div>
      )}
    </div>
  );
}

export default LoadingPage;
