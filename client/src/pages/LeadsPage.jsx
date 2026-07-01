import { useEffect, useState } from "react";
import API from "../config/api";
import AdminLayout from "../components/layout/AdminLayout";
import companyInfo from "../data/companyInfo";

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [activeVisitLead, setActiveVisitLead] = useState(null);
  const [activeNoteLead, setActiveNoteLead] = useState(null);
  const [activeFollowUpLead, setActiveFollowUpLead] = useState(null);

  const [noteText, setNoteText] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [visitData, setVisitData] = useState({
    date: "",
    time: "",
    remarks: "",
  });

  const [followUpData, setFollowUpData] = useState({
    date: "",
    time: "",
    remarks: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");

      const leadsData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setLeads(leadsData);
    } catch (error) {
      console.log("Leads fetch error:", error);
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await API.put(`/leads/${id}`, { status });
      fetchLeads();
    } catch (error) {
      console.log("Status update error:", error);
      alert("Status Update Failed ❌");
    }
  };

  const deleteLead = async (lead) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete lead: ${lead.name}?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(lead._id);

      await API.delete(`/leads/${lead._id}`);

      if (activeVisitLead === lead._id) setActiveVisitLead(null);
      if (activeNoteLead === lead._id) setActiveNoteLead(null);
      if (activeFollowUpLead === lead._id) setActiveFollowUpLead(null);

      setLeads((prevLeads) =>
        prevLeads.filter((item) => item._id !== lead._id)
      );

      alert("Lead Deleted Successfully ✅");
    } catch (error) {
      console.log("Lead delete error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Lead Delete Failed ❌");
    } finally {
      setDeletingId(null);
    }
  };

  const openVisitForm = (lead) => {
    setActiveVisitLead(lead._id);
    setActiveNoteLead(null);
    setActiveFollowUpLead(null);

    setVisitData({
      date: lead.siteVisit?.date || "",
      time: lead.siteVisit?.time || "",
      remarks: lead.siteVisit?.remarks || "",
    });
  };

  const handleVisitChange = (e) => {
    setVisitData({
      ...visitData,
      [e.target.name]: e.target.value,
    });
  };

  const saveSiteVisit = async (leadId) => {
    try {
      await API.put(`/leads/${leadId}`, {
        status: "Site Visit",
        siteVisit: visitData,
      });

      alert("Site Visit Scheduled ✅");
      setActiveVisitLead(null);
      setVisitData({ date: "", time: "", remarks: "" });
      fetchLeads();
    } catch (error) {
      console.log("Site visit error:", error);
      alert("Site Visit Schedule Failed ❌");
    }
  };

  const openNoteForm = (leadId) => {
    setActiveNoteLead(leadId);
    setActiveVisitLead(null);
    setActiveFollowUpLead(null);
    setNoteText("");
  };

  const saveNote = async (lead) => {
    if (!noteText.trim()) {
      alert("Please write a note");
      return;
    }

    const updatedNotes = [
      { text: noteText.trim(), createdAt: new Date() },
      ...(lead.notes || []),
    ];

    try {
      await API.put(`/leads/${lead._id}`, {
        notes: updatedNotes,
      });

      alert("Note Added ✅");
      setActiveNoteLead(null);
      setNoteText("");
      fetchLeads();
    } catch (error) {
      console.log("Note add error:", error);
      alert("Note Add Failed ❌");
    }
  };

  const openFollowUpForm = (lead) => {
    setActiveFollowUpLead(lead._id);
    setActiveVisitLead(null);
    setActiveNoteLead(null);

    setFollowUpData({
      date: lead.followUp?.date || "",
      time: lead.followUp?.time || "",
      remarks: lead.followUp?.remarks || "",
    });
  };

  const handleFollowUpChange = (e) => {
    setFollowUpData({
      ...followUpData,
      [e.target.name]: e.target.value,
    });
  };

  const saveFollowUp = async (leadId) => {
    if (!followUpData.date) {
      alert("Please select follow-up date");
      return;
    }

    if (!followUpData.time) {
      alert("Please select follow-up time");
      return;
    }

    try {
      await API.put(`/leads/${leadId}`, {
        followUp: {
          ...followUpData,
          completed: false,
          completedAt: null,
        },
      });

      alert("Follow-up Reminder Set ✅");
      setActiveFollowUpLead(null);
      setFollowUpData({ date: "", time: "", remarks: "" });
      fetchLeads();
    } catch (error) {
      console.log("Follow-up save error:", error.response?.data || error);
      alert(error.response?.data?.message || "Follow-up Save Failed ❌");
    }
  };

  const completeFollowUp = async (lead) => {
    const confirmComplete = window.confirm(
      `Mark follow-up as completed for ${lead.name}?`
    );

    if (!confirmComplete) return;

    try {
      await API.put(`/leads/${lead._id}`, {
        followUp: {
          date: lead.followUp?.date || "",
          time: lead.followUp?.time || "",
          remarks: lead.followUp?.remarks || "",
          completed: true,
          completedAt: new Date(),
        },
      });

      alert("Follow-up Completed ✅");
      fetchLeads();
    } catch (error) {
      console.log("Follow-up complete error:", error.response?.data || error);
      alert(error.response?.data?.message || "Follow-up Complete Failed ❌");
    }
  };

  const getLeadTimeline = (lead) => {
    const timeline = [];

    if (lead.createdAt) {
      timeline.push({
        icon: "🟢",
        title: "Lead Created",
        description: `Lead received for ${
          lead.projectName || "General Inquiry"
        }`,
        date: lead.createdAt,
      });
    }

    if (lead.siteVisit?.date) {
      timeline.push({
        icon: "📅",
        title: "Site Visit Scheduled",
        description: `${lead.siteVisit.date} ${
          lead.siteVisit.time ? `at ${lead.siteVisit.time}` : ""
        }`,
        date: lead.updatedAt || lead.createdAt,
      });
    }

    if (lead.followUp?.date) {
      timeline.push({
        icon: lead.followUp.completed ? "✅" : "⏰",
        title: lead.followUp.completed
          ? "Follow-up Completed"
          : "Follow-up Reminder Set",
        description: `${lead.followUp.date} ${
          lead.followUp.time ? `at ${lead.followUp.time}` : ""
        }${lead.followUp.remarks ? ` - ${lead.followUp.remarks}` : ""}`,
        date: lead.followUp.completedAt || lead.updatedAt || lead.createdAt,
      });
    }

    if (lead.notes?.length > 0) {
      lead.notes.forEach((note) => {
        timeline.push({
          icon: "📝",
          title: "Note Added",
          description: note.text,
          date: note.createdAt,
        });
      });
    }

    return timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredLeads = leads.filter((lead) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      lead.name?.toLowerCase().includes(searchText) ||
      lead.phone?.includes(search) ||
      lead.email?.toLowerCase().includes(searchText) ||
      lead.projectName?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const todayDateValue = new Date().toISOString().split("T")[0];

  const isFollowUpPending = (lead) => {
    return Boolean(lead.followUp?.date && !lead.followUp?.completed);
  };

  const isFollowUpToday = (lead) => {
    return isFollowUpPending(lead) && lead.followUp.date === todayDateValue;
  };

  const isFollowUpOverdue = (lead) => {
    return isFollowUpPending(lead) && lead.followUp.date < todayDateValue;
  };

  const isFollowUpUpcoming = (lead) => {
    return isFollowUpPending(lead) && lead.followUp.date > todayDateValue;
  };

  const pendingFollowUps = leads.filter(isFollowUpPending);
  const todayFollowUps = leads.filter(isFollowUpToday);
  const overdueFollowUps = leads.filter(isFollowUpOverdue);

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const csvSafe = (value) => {
    const text = String(value || "").replace(/\s+/g, " ").trim();

    return `"${text.replace(/"/g, '""')}"`;
  };

  const getLatestNote = (lead) => {
    if (!lead.notes || lead.notes.length === 0) return "";

    return lead.notes[0]?.text || "";
  };

  const exportLeadsCSV = () => {
    if (filteredLeads.length === 0) {
      alert("No leads available to export");
      return;
    }

    const headers = [
      "Name",
      "Phone",
      "Email",
      "Project Name",
      "Status",
      "Message",
      "Site Visit Date",
      "Site Visit Time",
      "Site Visit Remarks",
      "Follow-up Date",
      "Follow-up Time",
      "Follow-up Remarks",
      "Follow-up Completed",
      "Latest Note",
      "Created Date",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.name || "",
      lead.phone || "",
      lead.email || "",
      lead.projectName || "General Inquiry",
      lead.status || "New",
      lead.message || "",
      lead.siteVisit?.date || "",
      lead.siteVisit?.time || "",
      lead.siteVisit?.remarks || "",
      lead.followUp?.date || "",
      lead.followUp?.time || "",
      lead.followUp?.remarks || "",
      lead.followUp?.completed ? "Yes" : "No",
      getLatestNote(lead),
      formatDate(lead.createdAt),
    ]);

    const csvContent = [
      headers.map(csvSafe).join(","),
      ...rows.map((row) => row.map(csvSafe).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const fileDate = new Date().toISOString().split("T")[0];

    link.href = url;
    link.download = `aranyak-leads-${fileDate}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const escapeHtml = (value) => {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const printLeads = () => {
    if (filteredLeads.length === 0) {
      alert("No leads available to print");
      return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked. Please allow popups and try again.");
      return;
    }

    const rowsHtml = filteredLeads
      .map(
        (lead, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(lead.name)}</td>
            <td>${escapeHtml(lead.phone)}</td>
            <td>${escapeHtml(lead.email || "No email")}</td>
            <td>${escapeHtml(lead.projectName || "General Inquiry")}</td>
            <td>${escapeHtml(lead.status || "New")}</td>
            <td>${escapeHtml(lead.message || "-")}</td>
            <td>${escapeHtml(lead.siteVisit?.date || "-")}</td>
            <td>${escapeHtml(lead.siteVisit?.time || "-")}</td>
            <td>${escapeHtml(lead.followUp?.date || "-")}</td>
            <td>${escapeHtml(lead.followUp?.time || "-")}</td>
            <td>${escapeHtml(lead.followUp?.remarks || "-")}</td>
            <td>${lead.followUp?.completed ? "Yes" : "No"}</td>
            <td>${escapeHtml(getLatestNote(lead) || "-")}</td>
            <td>${escapeHtml(formatDate(lead.createdAt))}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Leads Report - ${escapeHtml(
            companyInfo.name || "Aranyak Ventures"
          )}</title>
          <style>
            * { box-sizing: border-box; }

            body {
              font-family: Arial, sans-serif;
              color: #263238;
              margin: 24px;
            }

            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #35434A;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }

            .brand h1 {
              margin: 0;
              font-size: 24px;
              color: #35434A;
            }

            .brand p {
              margin: 6px 0 0;
              color: #777;
              font-size: 13px;
            }

            .meta {
              text-align: right;
              font-size: 13px;
              color: #555;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }

            th {
              background: #35434A;
              color: white;
              padding: 8px;
              border: 1px solid #35434A;
              text-align: left;
            }

            td {
              padding: 8px;
              border: 1px solid #ddd;
              vertical-align: top;
              word-break: break-word;
            }

            tr:nth-child(even) { background: #F7F6EF; }

            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
            }

            @media print {
              body { margin: 10mm; }
              button { display: none; }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div class="brand">
              <h1>${escapeHtml(companyInfo.name || "Aranyak Ventures")}</h1>
              <p>Leads Report</p>
            </div>

            <div class="meta">
              <p><strong>Total Leads:</strong> ${filteredLeads.length}</p>
              <p><strong>Status Filter:</strong> ${escapeHtml(statusFilter)}</p>
              <p><strong>Search:</strong> ${escapeHtml(search || "None")}</p>
              <p><strong>Generated:</strong> ${escapeHtml(
                formatDate(new Date())
              )}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Project</th>
                <th>Status</th>
                <th>Message</th>
                <th>Visit Date</th>
                <th>Visit Time</th>
                <th>Follow-up Date</th>
                <th>Follow-up Time</th>
                <th>Follow-up Remarks</th>
                <th>Completed</th>
                <th>Latest Note</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>${rowsHtml}</tbody>
          </table>

          <div class="footer">
            Generated from ${escapeHtml(companyInfo.name || "Aranyak Ventures")} Admin CRM
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const today = new Date().toDateString();

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const siteVisitLeads = leads.filter(
    (lead) => lead.status === "Site Visit"
  ).length;

  const bookedLeads = leads.filter((lead) => lead.status === "Booked").length;
  const closedLeads = leads.filter((lead) => lead.status === "Closed").length;

  const notInterestedLeads = leads.filter(
    (lead) => lead.status === "Not Interested"
  ).length;

  const invalidLeads = leads.filter(
    (lead) => lead.status === "Invalid Lead"
  ).length;

  const todayLeads = leads.filter(
    (lead) => new Date(lead.createdAt).toDateString() === today
  ).length;

  const conversionRate =
    totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0;

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const statusClass = (status) => {
    if (status === "New") return "bg-blue-100 text-blue-700";
    if (status === "Contacted") return "bg-orange-100 text-orange-700";
    if (status === "Site Visit") return "bg-purple-100 text-purple-700";
    if (status === "Negotiation") return "bg-[#CDB52B]/20 text-[#7A6A0A]";
    if (status === "Booked") return "bg-green-100 text-green-700";
    if (status === "Closed") return "bg-slate-200 text-slate-700";
    if (status === "Not Interested") return "bg-red-100 text-red-700";
    if (status === "Invalid Lead") return "bg-zinc-200 text-zinc-700";

    return "bg-gray-100 text-gray-700";
  };

  const followUpClass = (lead) => {
    if (lead.followUp?.completed) return "bg-green-100 text-green-700";
    if (isFollowUpOverdue(lead)) return "bg-red-100 text-red-700";
    if (isFollowUpToday(lead)) return "bg-orange-100 text-orange-700";
    if (isFollowUpUpcoming(lead)) return "bg-blue-100 text-blue-700";

    return "bg-slate-100 text-slate-700";
  };

  const followUpLabel = (lead) => {
    if (lead.followUp?.completed) return "Completed";
    if (isFollowUpOverdue(lead)) return "Overdue";
    if (isFollowUpToday(lead)) return "Today";
    if (isFollowUpUpcoming(lead)) return "Upcoming";

    return "No Follow-up";
  };

  const cleanPhone = (phone) => {
    const digits = phone?.replace(/\D/g, "") || "";

    if (digits.length === 10) {
      return `91${digits}`;
    }

    return digits;
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I am contacting you regarding your inquiry with ${
      companyInfo.name || "Aranyak Ventures"
    }.`
  );

  const inputClass =
    "w-full border border-slate-200 bg-white p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition";

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative overflow-hidden bg-linear-to-r from-[#35434A] via-[#263238] to-[#35434A] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-[#CDB52B] font-extrabold mb-2 tracking-[0.22em] uppercase text-xs sm:text-sm">
                Leads CRM
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold">
                Leads Management Dashboard
              </h1>

              <p className="text-white/65 mt-3 max-w-3xl leading-relaxed">
                Track inquiries, schedule site visits, set follow-up reminders,
                add notes, and manage your complete sales pipeline.
              </p>
            </div>

            {companyInfo.logo && (
              <div className="bg-white rounded-2xl px-4 py-3 shadow-xl w-fit">
                <img
                  src={companyInfo.logo}
                  alt={companyInfo.name || "Aranyak Ventures"}
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4 sm:gap-5 mb-8">
          <StatCard title="Total Leads" value={totalLeads} icon="📊" />
          <StatCard title="Today" value={todayLeads} icon="📅" />
          <StatCard title="New" value={newLeads} icon="🆕" />
          <StatCard title="Contacted" value={contactedLeads} icon="☎️" />
          <StatCard title="Site Visits" value={siteVisitLeads} icon="🏠" />
          <StatCard title="Booked" value={bookedLeads} icon="✅" />
          <StatCard title="Closed" value={closedLeads} icon="🔒" />
          <StatCard title="Not Interested" value={notInterestedLeads} icon="❌" />
          <StatCard title="Invalid" value={invalidLeads} icon="⚠️" />
        </div>

        <div className="grid lg:grid-cols-4 gap-5 mb-8">
          <FollowUpSummaryCard
            title="Pending Follow-ups"
            value={pendingFollowUps.length}
            icon="⏰"
            color="text-[#263238]"
          />

          <FollowUpSummaryCard
            title="Today's Follow-ups"
            value={todayFollowUps.length}
            icon="📌"
            color="text-orange-600"
          />

          <FollowUpSummaryCard
            title="Overdue"
            value={overdueFollowUps.length}
            icon="🚨"
            color="text-red-600"
          />

          <FollowUpSummaryCard
            title="Upcoming"
            value={leads.filter(isFollowUpUpcoming).length}
            icon="📅"
            color="text-blue-600"
          />
        </div>

        {(todayFollowUps.length > 0 || overdueFollowUps.length > 0) && (
          <div className="bg-white rounded-3xl shadow border border-slate-100 p-5 sm:p-6 mb-8">
            <div className="mb-5">
              <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-2">
                Follow-up Alerts
              </p>

              <h2 className="text-2xl font-extrabold text-[#263238]">
                Today & Overdue Follow-ups
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[...overdueFollowUps, ...todayFollowUps]
                .slice(0, 6)
                .map((lead) => (
                  <div
                    key={lead._id}
                    className="border border-slate-100 rounded-2xl p-4 bg-[#F7F6EF]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-[#263238]">
                          {lead.name}
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                          {lead.projectName || "General Inquiry"}
                        </p>

                        <p className="text-slate-600 text-sm mt-2">
                          📞 {lead.phone}
                        </p>

                        <p className="text-slate-600 text-sm">
                          ⏰ {lead.followUp?.date}{" "}
                          {lead.followUp?.time
                            ? `at ${lead.followUp.time}`
                            : ""}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${followUpClass(
                          lead
                        )}`}
                      >
                        {followUpLabel(lead)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <a
                        href={`tel:${lead.phone}`}
                        className="bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-xl font-bold text-sm"
                      >
                        Call
                      </a>

                      <button
                        type="button"
                        onClick={() => completeFollowUp(lead)}
                        className="bg-[#35434A] hover:bg-[#263238] text-white px-4 py-2 rounded-xl font-bold text-sm"
                      >
                        Mark Done
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow border border-slate-100 p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-2">
                Pipeline
              </p>

              <h2 className="text-2xl font-extrabold text-[#263238]">
                Sales Pipeline Summary
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <SummaryCard
                title="Conversion Rate"
                value={`${conversionRate}%`}
                color="text-green-600"
                icon="📈"
              />

              <SummaryCard
                title="Pending Follow-ups"
                value={pendingFollowUps.length}
                color="text-orange-500"
                icon="⏳"
              />

              <SummaryCard
                title="Active Visits"
                value={siteVisitLeads}
                color="text-purple-600"
                icon="📅"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow border border-slate-100 p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-2">
                Latest
              </p>

              <h2 className="text-2xl font-extrabold text-[#263238]">
                Recent Leads
              </h2>
            </div>

            {recentLeads.length === 0 ? (
              <p className="text-slate-500">No recent leads</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="border border-slate-100 rounded-2xl p-3 hover:bg-[#F7F6EF] transition"
                  >
                    <p className="font-extrabold text-[#263238] wrap-break-word">
                      {lead.name}
                    </p>

                    <p className="text-sm text-slate-500 wrap-break-word">
                      {lead.projectName || "General Inquiry"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow border border-slate-100 p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search by name, phone, email, or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={inputClass}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Booked">Booked</option>
              <option value="Closed">Closed</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Invalid Lead">Invalid Lead</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={exportLeadsCSV}
                className="bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-4 py-3 rounded-xl font-extrabold transition"
              >
                Export CSV
              </button>

              <button
                type="button"
                onClick={printLeads}
                className="bg-[#35434A] hover:bg-[#263238] text-white px-4 py-3 rounded-xl font-extrabold transition"
              >
                Print
              </button>
            </div>
          </div>

          <p className="text-slate-500 text-sm mt-4">
            Export/Print will include current filtered leads only.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
            All Leads
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#35434A] text-white px-4 py-2 rounded-full text-sm w-fit">
              {filteredLeads.length} / {leads.length} Leads
            </span>

            <button
              type="button"
              onClick={exportLeadsCSV}
              className="bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-4 py-2 rounded-full text-sm font-bold transition"
            >
              Export
            </button>

            <button
              type="button"
              onClick={printLeads}
              className="bg-white border border-slate-200 hover:border-[#CDB52B] text-[#263238] px-4 py-2 rounded-full text-sm font-bold transition"
            >
              Print
            </button>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow text-center text-slate-500 border border-slate-100">
            No Leads Found
          </div>
        ) : (
          <div className="space-y-5">
            {filteredLeads.map((lead) => {
              const timeline = getLeadTimeline(lead);

              return (
                <div
                  key={lead._id}
                  className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-extrabold text-[#263238] wrap-break-word">
                          {lead.name}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(
                            lead.status
                          )}`}
                        >
                          {lead.status || "New"}
                        </span>

                        {lead.followUp?.date && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${followUpClass(
                              lead
                            )}`}
                          >
                            Follow-up: {followUpLabel(lead)}
                          </span>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mt-4 text-slate-600">
                        <p className="wrap-break-word">📞 {lead.phone}</p>
                        <p className="wrap-break-word">
                          ✉️ {lead.email || "No email"}
                        </p>
                        <p className="wrap-break-word">
                          🏠 {lead.projectName || "General Inquiry"}
                        </p>
                        <p>
                          🗓️{" "}
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>

                      {lead.message && (
                        <p className="mt-4 bg-[#F7F6EF] border border-[#CDB52B]/15 p-4 rounded-2xl text-slate-600 wrap-break-word">
                          {lead.message}
                        </p>
                      )}

                      {lead.siteVisit?.date && (
                        <InfoBox
                          title="📅 Site Visit Scheduled"
                          lines={[
                            `Date: ${lead.siteVisit.date}`,
                            `Time: ${lead.siteVisit.time || "Not specified"}`,
                            lead.siteVisit.remarks
                              ? `Remarks: ${lead.siteVisit.remarks}`
                              : "",
                          ]}
                        />
                      )}

                      {lead.followUp?.date && (
                        <div className="mt-4 bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-orange-700">
                                ⏰ Follow-up Reminder
                              </h4>

                              <p className="text-orange-700 mt-2">
                                Date: {lead.followUp.date}
                              </p>

                              <p className="text-orange-700">
                                Time: {lead.followUp.time || "Not specified"}
                              </p>

                              {lead.followUp.remarks && (
                                <p className="text-orange-700 wrap-break-word">
                                  Remarks: {lead.followUp.remarks}
                                </p>
                              )}

                              <p className="mt-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${followUpClass(
                                    lead
                                  )}`}
                                >
                                  {followUpLabel(lead)}
                                </span>
                              </p>
                            </div>

                            {!lead.followUp.completed && (
                              <button
                                type="button"
                                onClick={() => completeFollowUp(lead)}
                                className="bg-[#35434A] hover:bg-[#263238] text-white px-4 py-2 rounded-xl font-bold transition"
                              >
                                Mark Done
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {lead.notes?.length > 0 && (
                        <div className="mt-4 bg-[#CDB52B]/10 border border-[#CDB52B]/20 p-4 rounded-2xl">
                          <h4 className="font-extrabold text-[#7A6A0A] mb-3">
                            📝 Notes History
                          </h4>

                          <div className="space-y-3">
                            {lead.notes.map((note, index) => (
                              <div
                                key={index}
                                className="bg-white border border-[#CDB52B]/15 p-3 rounded-xl"
                              >
                                <p className="text-slate-700 wrap-break-word">
                                  {note.text}
                                </p>

                                <p className="text-xs text-slate-400 mt-2">
                                  {note.createdAt
                                    ? new Date(note.createdAt).toLocaleString()
                                    : "No date"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 bg-[#F7F6EF] border border-slate-100 p-4 rounded-2xl">
                        <h4 className="font-extrabold text-[#263238] mb-4">
                          🧾 Lead Activity Timeline
                        </h4>

                        <div className="space-y-4">
                          {timeline.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                  {item.icon}
                                </div>

                                {index !== timeline.length - 1 && (
                                  <div className="w-px flex-1 bg-slate-200 mt-2"></div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <h5 className="font-bold text-[#263238]">
                                  {item.title}
                                </h5>

                                <p className="text-slate-500 text-sm mt-1 wrap-break-word">
                                  {item.description}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  {item.date
                                    ? new Date(item.date).toLocaleString()
                                    : "No date"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {activeVisitLead === lead._id && (
                        <VisitForm
                          visitData={visitData}
                          handleVisitChange={handleVisitChange}
                          saveSiteVisit={() => saveSiteVisit(lead._id)}
                          cancel={() => setActiveVisitLead(null)}
                          inputClass={inputClass}
                        />
                      )}

                      {activeFollowUpLead === lead._id && (
                        <FollowUpForm
                          followUpData={followUpData}
                          handleFollowUpChange={handleFollowUpChange}
                          saveFollowUp={() => saveFollowUp(lead._id)}
                          cancel={() => setActiveFollowUpLead(null)}
                          inputClass={inputClass}
                        />
                      )}

                      {activeNoteLead === lead._id && (
                        <NoteForm
                          noteText={noteText}
                          setNoteText={setNoteText}
                          saveNote={() => saveNote(lead)}
                          cancel={() => setActiveNoteLead(null)}
                          inputClass={inputClass}
                        />
                      )}
                    </div>

                    <div className="lg:w-64 lg:shrink-0">
                      <label className="block mb-2 font-bold text-[#263238]">
                        Update Status
                      </label>

                      <select
                        value={lead.status || "New"}
                        onChange={(e) =>
                          updateLeadStatus(lead._id, e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Booked">Booked</option>
                        <option value="Closed">Closed</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Invalid Lead">Invalid Lead</option>
                      </select>

                      <a
                        href={`tel:${lead.phone}`}
                        className="block mt-3 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-bold transition"
                      >
                        Call Lead
                      </a>

                      <a
                        href={`https://wa.me/${cleanPhone(
                          lead.phone
                        )}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-3 bg-[#35434A] hover:bg-[#263238] text-white text-center py-3 rounded-xl font-bold transition"
                      >
                        WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={() => openVisitForm(lead)}
                        className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl font-bold transition"
                      >
                        Schedule Visit
                      </button>

                      <button
                        type="button"
                        onClick={() => openFollowUpForm(lead)}
                        className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-xl font-bold transition"
                      >
                        Set Follow-up
                      </button>

                      <button
                        type="button"
                        onClick={() => openNoteForm(lead._id)}
                        className="w-full mt-3 bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] text-center py-3 rounded-xl font-bold transition"
                      >
                        Add Note
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteLead(lead)}
                        disabled={deletingId === lead._id}
                        className="w-full mt-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-center py-3 rounded-xl font-bold transition"
                      >
                        {deletingId === lead._id
                          ? "Deleting..."
                          : "Delete Lead"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow border border-slate-100 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#CDB52B]/10 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="text-2xl mb-2">{icon}</div>

        <p className="text-slate-500 text-sm">{title}</p>

        <h2 className="text-3xl font-extrabold mt-2 text-[#263238]">
          {value}
        </h2>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color, icon }) {
  return (
    <div className="bg-[#F7F6EF] p-5 rounded-2xl border border-[#CDB52B]/15">
      <div className="text-2xl mb-2">{icon}</div>

      <p className="text-slate-500 text-sm">{title}</p>

      <h3 className={`text-3xl font-extrabold mt-2 ${color}`}>{value}</h3>
    </div>
  );
}

function FollowUpSummaryCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow border border-slate-100">
      <div className="text-3xl mb-3">{icon}</div>

      <p className="text-slate-500 text-sm">{title}</p>

      <h3 className={`text-3xl font-extrabold mt-2 ${color}`}>{value}</h3>
    </div>
  );
}

function InfoBox({ title, lines }) {
  return (
    <div className="mt-4 bg-purple-50 border border-purple-100 p-4 rounded-2xl">
      <h4 className="font-extrabold text-purple-700">{title}</h4>

      <div className="mt-2 space-y-1">
        {lines
          .filter((line) => Boolean(line))
          .map((line, index) => (
            <p key={index} className="text-purple-700 wrap-break-word">
              {line}
            </p>
          ))}
      </div>
    </div>
  );
}

function VisitForm({
  visitData,
  handleVisitChange,
  saveSiteVisit,
  cancel,
  inputClass,
}) {
  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="mt-5 bg-[#F7F6EF] border border-[#CDB52B]/15 p-4 sm:p-5 rounded-2xl">
      <h4 className="font-extrabold text-[#263238] mb-4">
        Schedule Site Visit
      </h4>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="date"
          name="date"
          value={visitData.date}
          onChange={handleVisitChange}
          min={todayDate}
          className={inputClass}
        />

        <input
          type="time"
          name="time"
          value={visitData.time}
          onChange={handleVisitChange}
          className={inputClass}
        />
      </div>

      <textarea
        name="remarks"
        placeholder="Remarks"
        value={visitData.remarks}
        onChange={handleVisitChange}
        rows="3"
        maxLength="500"
        className={`${inputClass} mt-4`}
      />

      <p className="text-right text-xs text-slate-400 mt-2">
        {visitData.remarks.length}/500 characters
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="button"
          onClick={saveSiteVisit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          Save Visit
        </button>

        <button
          type="button"
          onClick={cancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FollowUpForm({
  followUpData,
  handleFollowUpChange,
  saveFollowUp,
  cancel,
  inputClass,
}) {
  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="mt-5 bg-orange-50 border border-orange-100 p-4 sm:p-5 rounded-2xl">
      <h4 className="font-extrabold text-orange-700 mb-4">
        Set Follow-up Reminder
      </h4>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="date"
          name="date"
          value={followUpData.date}
          onChange={handleFollowUpChange}
          min={todayDate}
          className={inputClass}
        />

        <input
          type="time"
          name="time"
          value={followUpData.time}
          onChange={handleFollowUpChange}
          className={inputClass}
        />
      </div>

      <textarea
        name="remarks"
        placeholder="Follow-up remarks"
        value={followUpData.remarks}
        onChange={handleFollowUpChange}
        rows="3"
        maxLength="500"
        className={`${inputClass} mt-4`}
      />

      <p className="text-right text-xs text-slate-400 mt-2">
        {followUpData.remarks.length}/500 characters
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="button"
          onClick={saveFollowUp}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          Save Follow-up
        </button>

        <button
          type="button"
          onClick={cancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function NoteForm({ noteText, setNoteText, saveNote, cancel, inputClass }) {
  return (
    <div className="mt-5 bg-[#F7F6EF] border border-[#CDB52B]/15 p-4 sm:p-5 rounded-2xl">
      <h4 className="font-extrabold text-[#263238] mb-4">Add Lead Note</h4>

      <textarea
        placeholder="Write note here..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value.slice(0, 500))}
        rows="3"
        maxLength="500"
        className={inputClass}
      />

      <p className="text-right text-xs text-slate-400 mt-2">
        {noteText.length}/500 characters
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="button"
          onClick={saveNote}
          className="bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-6 py-3 rounded-xl font-bold transition"
        >
          Save Note
        </button>

        <button
          type="button"
          onClick={cancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LeadsPage;