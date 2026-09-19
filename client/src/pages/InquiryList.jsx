import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import DataTable from '../components/DataTable';

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inquiries');
      if (res.data?.status) {
        setInquiries(res.data.result || []);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
      toast.error('Failed to load patient inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleRead = async (row) => {
    const newStatus = row.isRead === 1 ? 0 : 1;
    try {
      await api.put(`/inquiries/${row.id}/read`, { isRead: newStatus });
      setInquiries((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, isRead: newStatus } : item))
      );
      if (selectedInquiry?.id === row.id) {
        setSelectedInquiry((prev) => ({ ...prev, isRead: newStatus }));
      }
      toast.success(newStatus === 1 ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  
  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;
    
    try {
      await api.delete(`/inquiries/${id}`);
      toast.success('Inquiry deleted successfully');
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Failed to delete inquiry', err);
      toast.error('Failed to delete inquiry');
    }
  };


  const handleOpenDetail = (row) => {
    setSelectedInquiry(row);
    if (row.isRead === 0) {
      handleToggleRead(row);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date & Time',
      sortable: true,
      render: (date) => (
        <span className="text-xs font-mono text-gray-600 whitespace-nowrap">{formatDate(date)}</span>
      ),
    },
    {
      key: 'name',
      label: 'Patient Name',
      sortable: true,
      render: (name, row) => (
        <div className="flex items-center gap-2">
          {row.isRead === 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="New Inquiry"></span>
          )}
          <span className="font-semibold text-gray-900 text-sm">{name}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone Number',
      sortable: true,
      render: (phone) => (
        <a
          href={`tel:${phone}`}
          className="text-xs font-medium text-[#2c7a94] hover:underline flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Icons.Phone size={12} className="shrink-0" />
          {phone}
        </a>
      ),
    },
    {
      key: 'email',
      label: 'Email Address',
      render: (email) =>
        email ? (
          <a
            href={`mailto:${email}`}
            className="text-xs text-gray-600 hover:text-[#cc3b38] hover:underline flex items-center gap-1 truncate max-w-[150px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.Mail size={12} className="shrink-0" />
            <span className="truncate">{email}</span>
          </a>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      key: 'subject',
      label: 'Subject / Department',
      sortable: true,
      render: (sub) => (
        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-[#cc3b38] border border-red-100/80">
          {sub || 'General Inquiry'}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (msg) => (
        <span className="text-xs text-gray-600 line-clamp-1 max-w-xs">{msg}</span>
      ),
    },
    {
      key: 'isRead',
      label: 'Status',
      sortable: true,
      render: (isRead) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isRead === 1
              ? 'bg-gray-100 text-gray-600'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isRead === 1 ? 'bg-gray-400' : 'bg-emerald-500 animate-pulse'}`}
          ></span>
          {isRead === 1 ? 'Read' : 'New'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenDetail(row)}
            className="p-1.5 text-gray-500 hover:text-[#2c7a94] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <Icons.Eye size={16} />
          </button>
          <button
            onClick={() => handleToggleRead(row)}
            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title={row.isRead === 1 ? 'Mark as Unread' : 'Mark as Read'}
          >
            {row.isRead === 1 ? <Icons.Mail size={16} /> : <Icons.MailOpen size={16} />}
          </button>
          <button
            onClick={() => handleDeleteClick(row.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Inquiry"
          >
            <Icons.Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const unreadCount = inquiries.filter((i) => i.isRead === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Inquiries</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Review and respond to messages, questions, and appointment requests submitted from the website.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer shrink-0"
        >
          <Icons.RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={inquiries}
        loading={loading}
        exportFileName="patient_inquiries_export"
      />

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-[#cc3b38] mb-1.5">
                  {selectedInquiry.subject}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{selectedInquiry.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                  Received on {formatDate(selectedInquiry.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <Icons.X size={20} />
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/70 text-xs">
              <div>
                <span className="text-gray-400 uppercase tracking-wider font-semibold block mb-0.5">
                  Phone
                </span>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="font-bold text-[#2c7a94] text-sm hover:underline flex items-center gap-1.5"
                >
                  <Icons.Phone size={14} /> {selectedInquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-gray-400 uppercase tracking-wider font-semibold block mb-0.5">
                  Email
                </span>
                {selectedInquiry.email ? (
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-bold text-gray-800 text-sm hover:text-[#cc3b38] hover:underline flex items-center gap-1.5 truncate"
                  >
                    <Icons.Mail size={14} className="shrink-0" /> {selectedInquiry.email}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Patient Message:
              </span>
              <div className="bg-[#faf7f5] p-4 rounded-2xl border border-gray-200 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-body-md">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2c7a94] hover:bg-[#236378] text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <Icons.PhoneCall size={14} /> Call Patient
                </a>
                {selectedInquiry.email && (
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Regarding your inquiry at Sharnam Clinic`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Icons.Send size={14} /> Email Patient
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(selectedInquiry)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  {selectedInquiry.isRead === 1 ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-[#cc3b38] hover:bg-[#b52f2c] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={confirmDelete}
        title="Delete Patient Inquiry"
        message="Are you sure you want to permanently delete this inquiry? This action cannot be undone."
      />
    </div>
  );
};

export default InquiryList;

