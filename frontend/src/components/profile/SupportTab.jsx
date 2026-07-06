import React, { useEffect, useState } from "react";
import RaiseTicketModal from "./RaiseTicketModal";

const SupportTab = () => {
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/support/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-brand-dark">
          Support & Help
        </h2>

        <button
          onClick={() => setShowRaiseModal(true)}
          className="bg-primary hover:bg-[#9e7435] text-white text-xs tracking-widest uppercase font-semibold px-4 py-2.5 rounded transition-all cursor-pointer shadow-sm"
        >
          Raise New Ticket
        </button>
      </div>

      <p className="text-gray-600 mb-8 text-sm">
        Need assistance with your order, return, or anything else? Our luxury
        customer service team is here to help.
      </p>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading your support tickets...</p>
        </div>
      ) : tickets.length > 0 ? (
        <div className="space-y-5">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-brand-dark">
                  {ticket.subject}
                </h3>

                <span className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#E5E0D8] rounded-2xl bg-[#FCF9F5]/30 max-w-lg mx-auto mb-6">
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 stroke-current text-[#b88a44] fill-none stroke-[1.2] mb-6"
          >
            <circle cx="50" cy="50" r="40" />
            <path d="M45,45 C45,35 55,35 55,45 C55,50 50,52 50,57" />
            <circle cx="50" cy="67" r="2" fill="currentColor" />
          </svg>

          <h3 className="font-serif text-xl sm:text-2xl text-[#2E241C] mb-2 font-light">
            No Support Tickets
          </h3>

          <p className="text-sm text-gray-500 font-light max-w-sm mb-8 leading-relaxed">
            You haven't raised any support tickets yet.
          </p>

          <button
            onClick={() => setShowRaiseModal(true)}
            className="px-6 py-3 bg-[#b88a44] hover:bg-[#9e7435] text-white text-xs tracking-widest uppercase font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            Create A Ticket
          </button>
        </div>
      )}

      <RaiseTicketModal
        isOpen={showRaiseModal}
        onClose={() => {
          setShowRaiseModal(false);
          fetchTickets();
        }}
      />
    </div>
  );
};

export default SupportTab;