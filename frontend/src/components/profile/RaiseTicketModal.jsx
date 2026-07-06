import React, { useState } from "react";
import toast from "react-hot-toast";

const RaiseTicketModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject,
        message,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Support ticket submitted!");

      setSubject("");
      setMessage("");

      onClose();
    } else {
      toast.error(data.message || "Failed to submit ticket");
    }
  } catch (err) {
    console.error(err);
    toast.error("Server Error");
  }
};

  return (
    <div className="fixed inset-0 bg-[#18140f]/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif text-brand-dark">Raise Support Ticket</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg p-2"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Inquiry regarding order ARI-15EF56C8"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message Details</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your issue or inquiry here in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium uppercase tracking-widest px-5 py-2.5 rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-[#9e7435] text-white text-xs tracking-widest uppercase font-medium px-5 py-2.5 rounded transition-all cursor-pointer"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicketModal;