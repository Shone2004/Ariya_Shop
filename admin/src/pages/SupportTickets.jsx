import { useEffect, useState } from "react";

function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/support");
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

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Loading Support Tickets...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Support Tickets</h2>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Subject</th>
              <th className="border p-3 text-left">Message</th>
              <th className="border p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td className="border p-3">{ticket.name}</td>
                  <td className="border p-3">{ticket.email}</td>
                  <td className="border p-3">{ticket.subject}</td>
                  <td className="border p-3">{ticket.message}</td>
                  <td className="border p-3">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border p-6 text-center text-gray-500"
                >
                  No Support Tickets Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupportTickets;