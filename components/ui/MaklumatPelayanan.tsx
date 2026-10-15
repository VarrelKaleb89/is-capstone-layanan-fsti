'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

const MaklumatPelayanan = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Cek kapan terakhir kali pop-up ditampilkan
    const lastShown = localStorage.getItem('last_shown_maklumat');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // dalam milidetik (1 hari)
    
    // Tampilkan jika belum pernah ditampilkan atau sudah lebih dari sehari
    if (!lastShown || now - parseInt(lastShown) > oneDay) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const closeModal = () => {
    setIsOpen(false);
    // Simpan waktu terakhir ditampilkan
    localStorage.setItem('last_shown_maklumat', new Date().getTime().toString());
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative bg-white rounded-lg p-3 mx-4 max-w-5xl w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button 
              onClick={closeModal}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 bg-white rounded-full z-10 p-1"
            >
              <X size={24} />
            </button>
            
            {/* Hanya menampilkan gambar tanpa teks */}
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src="/images/maklumat-pelayanan.png" 
                alt="Maklumat Pelayanan" 
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MaklumatPelayanan;