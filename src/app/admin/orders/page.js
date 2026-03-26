"use client";

import { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";

export default function OrderManager() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const showModal = (type, title, message, onConfirm = null) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setList(data);
      } else {
        setList([]); 
      }
    } catch (error) {
      setList([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmDelete = (id) => {
    showModal(
      "confirm",
      "Hapus Data Order?",
      "Tindakan ini tidak bisa dibatalkan. Data transaksi akan hilang permanen.",
      () => handleDeleteProcess(id)
    );
  };

  const handleDeleteProcess = async (id) => {
    // 1. TAMPILKAN LOADING STATE SAAT MENGHAPUS
    showModal("loading", "Menghapus Data...", "Mohon tunggu sebentar, data sedang dihapus.");

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchOrders();
        // 2. UBAH JADI SUKSES
        showModal("success", "Berhasil Dihapus", "Data pesanan telah dihapus dari sistem.");
      } else {
        // 3. UBAH JADI ERROR
        showModal("error", "Gagal Menghapus", "Terjadi kesalahan saat menghapus data.");
      }
    } catch (error) {
      showModal("error", "Error Koneksi", "Gagal menghubungi server.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // TAMPILKAN LOADING STATE SAAT UPDATE STATUS
    showModal("loading", "Memperbarui Status...", "Mohon tunggu, status pesanan sedang diubah.");

    // Update UI secara optimis agar terasa cepat
    setList(list.map(item => item.id === id ? { ...item, status: newStatus } : item));

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error("Gagal update");
      }
      
      // Jika berhasil, tampilkan pesan sukses (atau bisa juga langsung closeModal() jika tidak ingin mengganggu)
      showModal("success", "Status Diperbarui", `Status pesanan berhasil diubah menjadi ${newStatus}.`);
      
    } catch (error) {
      // Jika gagal, kembalikan data dan tampilkan error
      showModal("error", "Gagal", "Tidak dapat memperbarui status pesanan.");
      fetchOrders(); 
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Dikirim': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
      case 'Dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200'; 
    }
  };

  const handleExportCSV = () => {
    if (list.length === 0) {
      showModal("error", "Gagal Ekspor", "Belum ada data transaksi untuk diekspor.");
      return;
    }

    const headers = [
      "Tanggal Order", "Nama Pembeli", "WhatsApp", "Kota/Kecamatan", 
      "Alamat Lengkap", "Produk", "Jumlah", "Total Bayar (Rp)", "Metode Pembayaran", "Status"
    ];

    const csvData = list.map((item) => {
      return [
        `"${formatDate(item.created_at)}"`,
        `"${item.customer_name}"`,
        `"${item.whatsapp}"`,
        `"${item.city}"`,
        `"${item.address.replace(/\n/g, ' ')}"`,
        `"${item.product_name}"`,
        item.qty,
        item.total_price,
        `"${item.payment_method}"`,
        `"${item.status}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const dateToday = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Order_Alburdat_${dateToday}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 min-h-screen">
      <AdminModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Data Transaksi (Meta Ads)
        </h2>
        
        <div className="flex gap-3 items-center w-full md:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow flex items-center justify-center"
          >
            <i className="fas fa-file-excel mr-2"></i> Ekspor Excel
          </button>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">
            Total: {list.length} Order
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white uppercase font-bold text-xs">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Pembeli</th>
              <th className="p-4">Alamat & Kontak</th>
              <th className="p-4">Pesanan</th>
              <th className="p-4">Status & Total</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">
                  <i className="fas fa-spinner fa-spin text-2xl mb-2 block"></i> 
                  Memuat data transaksi...
                </td>
              </tr>
            ) : (!list || list.length === 0) ? (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <i className="fas fa-box-open text-5xl mb-3"></i>
                    <p className="font-bold text-lg text-gray-600 dark:text-gray-300">Data transaksi belum ada</p>
                    <p className="text-sm mt-1">Pesanan dari pengunjung website (Meta Ads) akan muncul di sini.</p>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((item) => {
                const currentStatus = item.status || 'Menunggu';
                return (
                  <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-600/50 transition">
                    <td className="p-4 text-xs">
                      {formatDate(item.created_at)}
                    </td>
                    
                    <td className="p-4">
                      <p className="font-bold text-gray-800 dark:text-gray-100">{item.customer_name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${
                          item.payment_method === 'COD' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                          {item.payment_method}
                      </span>
                    </td>
                    
                    <td className="p-4 max-w-xs truncate">
                      <p className="font-semibold">{item.city}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={item.address}>{item.address}</p>
                      <a 
                          href={`https://wa.me/${item.whatsapp}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-green-600 hover:text-green-700 text-xs font-bold inline-flex items-center mt-1"
                      >
                          <i className="fab fa-whatsapp mr-1"></i> {item.whatsapp}
                      </a>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-primary truncate max-w-[200px]" title={item.product_name}>
                          {item.product_name}
                      </p>
                      <p className="text-xs text-gray-500">Jumlah: {item.qty} Pcs</p>
                    </td>

                    <td className="p-4">
                      <p className="font-black text-gray-900 dark:text-white mb-2">
                        Rp {item.total_price?.toLocaleString('id-ID')}
                      </p>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded border outline-none cursor-pointer appearance-none ${getStatusColor(currentStatus)}`}
                      >
                        <option value="Diproses">Diproses</option>
                        <option value="Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded transition"
                        title="Hapus Data"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}