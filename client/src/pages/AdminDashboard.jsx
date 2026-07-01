import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/api";
import AdminLayout from "../components/layout/AdminLayout";
import LeadsChart from "../components/admin/LeadsChart";
import companyInfo from "../data/companyInfo";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchLeads();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");

      const projectsData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setProjects(projectsData);
    } catch (error) {
      console.log("Dashboard projects error:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");

      const leadsData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setLeads(leadsData);
    } catch (error) {
      console.log("Dashboard leads error:", error);
    }
  };

  const getLocalDateValue = (date = new Date()) => {
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - timezoneOffset)
      .toISOString()
      .split("T")[0];
  };

  const todayDateValue = getLocalDateValue();

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

  const getFollowUpTimeValue = (lead) => {
    const date = lead.followUp?.date || "9999-12-31";
    const time = lead.followUp?.time || "23:59";

    return new Date(`${date}T${time}`).getTime();
  };

  const pendingFollowUps = leads
    .filter(isFollowUpPending)
    .sort((a, b) => getFollowUpTimeValue(a) - getFollowUpTimeValue(b));

  const todayFollowUps = leads
    .filter(isFollowUpToday)
    .sort((a, b) => getFollowUpTimeValue(a) - getFollowUpTimeValue(b));

  const overdueFollowUps = leads
    .filter(isFollowUpOverdue)
    .sort((a, b) => getFollowUpTimeValue(a) - getFollowUpTimeValue(b));

  const upcomingFollowUps = leads
    .filter(isFollowUpUpcoming)
    .sort((a, b) => getFollowUpTimeValue(a) - getFollowUpTimeValue(b));

  const followUpAlerts = [...overdueFollowUps, ...todayFollowUps].slice(0, 6);

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

  const totalProjects = projects.length;
  const totalLeads = leads.length;

  const newLeads = leads.filter((lead) => lead.status === "New").length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const bookedLeads = leads.filter((lead) => lead.status === "Booked").length;

  const notInterestedLeads = leads.filter(
    (lead) => lead.status === "Not Interested"
  ).length;

  const invalidLeads = leads.filter(
    (lead) => lead.status === "Invalid Lead"
  ).length;

  const getProjectByLead = (lead) => {
    return projects.find((project) => project.name === lead.projectName);
  };

  const totalRevenue = leads.reduce((total, lead) => {
    const project = getProjectByLead(lead);
    const price = Number(project?.price || 0);

    if (!project) return total;

    if (lead.status === "Booked") return total + price;
    if (lead.status === "Negotiation") return total + price * 0.5;
    if (lead.status === "Site Visit") return total + price * 0.25;

    return total;
  }, 0);

  const bookedRevenue = leads.reduce((total, lead) => {
    const project = getProjectByLead(lead);
    const price = Number(project?.price || 0);

    if (!project || lead.status !== "Booked") return total;

    return total + price;
  }, 0);

  const negotiationRevenue = leads.reduce((total, lead) => {
    const project = getProjectByLead(lead);
    const price = Number(project?.price || 0);

    if (!project || lead.status !== "Negotiation") return total;

    return total + price * 0.5;
  }, 0);

  const siteVisitRevenue = leads.reduce((total, lead) => {
    const project = getProjectByLead(lead);
    const price = Number(project?.price || 0);

    if (!project || lead.status !== "Site Visit") return total;

    return total + price * 0.25;
  }, 0);

  const formatMoney = (amount) => {
    const value = Number(amount || 0);

    if (value >= 10000000) {
      return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    }

    if (value >= 100000) {
      return `₹ ${(value / 100000).toFixed(2)} Lakh`;
    }

    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  const formatFollowUpDate = (lead) => {
    if (!lead.followUp?.date) return "No date";

    const date = new Date(`${lead.followUp.date}T00:00:00`);

    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `${formattedDate}${
      lead.followUp.time ? ` at ${lead.followUp.time}` : ""
    }`;
  };

  const getLeadStatusClass = (status) => {
    if (status === "New") return "bg-blue-100 text-blue-700";
    if (status === "Contacted") return "bg-orange-100 text-orange-700";
    if (status === "Site Visit") return "bg-purple-100 text-purple-700";
    if (status === "Negotiation") return "bg-yellow-100 text-yellow-700";
    if (status === "Booked") return "bg-green-100 text-green-700";
    if (status === "Closed") return "bg-slate-200 text-slate-700";
    if (status === "Not Interested") return "bg-red-100 text-red-700";
    if (status === "Invalid Lead") return "bg-zinc-200 text-zinc-700";

    return "bg-slate-100 text-slate-700";
  };

  const getProjectStatusClass = (status) => {
    if (status === "Available") return "bg-green-100 text-green-700";
    if (status === "Upcoming") return "bg-yellow-100 text-yellow-700";
    if (status === "Sold") return "bg-red-100 text-red-700";

    return "bg-slate-100 text-slate-700";
  };

  const activities = [
    ...leads.slice(0, 5).map((lead) => ({
      id: lead._id,
      type: "lead",
      title: `New lead from ${lead.name}`,
      subtitle: lead.projectName || "General Inquiry",
      status: lead.status,
      date: lead.createdAt,
      icon: "📞",
    })),

    ...projects.slice(0, 5).map((project) => ({
      id: project._id,
      type: "project",
      title: `Project listed: ${project.name}`,
      subtitle: project.location,
      status: project.status,
      date: project.createdAt,
      icon: "🏠",
    })),
  ]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 8);

  const quickActions = [
    {
      title: "Add Project",
      desc: "Create or manage property listings.",
      icon: "➕",
      path: "/admin/projects",
    },
    {
      title: "View Leads",
      desc: "Track inquiries and update lead status.",
      icon: "📞",
      path: "/admin/leads",
    },
    {
      title: "Open Website",
      desc: "Preview the public real estate website.",
      icon: "🌐",
      path: "/",
    },
  ];

  const statsCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: "🏗️",
      className: "from-[#35434A] to-[#263238]",
    },
    {
      title: "Total Leads",
      value: totalLeads,
      icon: "📊",
      className: "from-[#9CA83A] to-[#6f7a26]",
    },
    {
      title: "New Leads",
      value: newLeads,
      icon: "🆕",
      className: "from-blue-600 to-blue-800",
    },
    {
      title: "Contacted",
      value: contactedLeads,
      icon: "☎️",
      className: "from-orange-500 to-orange-700",
    },
    {
      title: "Booked",
      value: bookedLeads,
      icon: "✅",
      className: "from-green-600 to-green-800",
    },
    {
      title: "Not Interested",
      value: notInterestedLeads,
      icon: "❌",
      className: "from-red-500 to-red-700",
    },
    {
      title: "Invalid Leads",
      value: invalidLeads,
      icon: "⚠️",
      className: "from-zinc-600 to-zinc-800",
    },
  ];

  const revenueCards = [
    {
      title: "Potential Revenue",
      value: formatMoney(totalRevenue),
      icon: "💰",
      className: "from-[#35434A] to-[#263238]",
    },
    {
      title: "Booked Revenue",
      value: formatMoney(bookedRevenue),
      icon: "🏆",
      className: "from-green-600 to-green-800",
    },
    {
      title: "Negotiation Value",
      value: formatMoney(negotiationRevenue),
      icon: "🤝",
      className: "from-[#CDB52B] to-[#9CA83A]",
    },
    {
      title: "Site Visit Value",
      value: formatMoney(siteVisitRevenue),
      icon: "📅",
      className: "from-purple-600 to-purple-800",
    },
  ];

  const followUpCards = [
    {
      title: "Pending Follow-ups",
      value: pendingFollowUps.length,
      icon: "⏰",
      className: "from-[#35434A] to-[#263238]",
    },
    {
      title: "Today's Follow-ups",
      value: todayFollowUps.length,
      icon: "📌",
      className: "from-orange-500 to-orange-700",
    },
    {
      title: "Overdue",
      value: overdueFollowUps.length,
      icon: "🚨",
      className: "from-red-600 to-red-800",
    },
    {
      title: "Upcoming",
      value: upcomingFollowUps.length,
      icon: "📅",
      className: "from-blue-600 to-blue-800",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#35434A] via-[#263238] to-[#35434A] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-[#CDB52B] font-extrabold mb-2 tracking-[0.22em] uppercase text-xs sm:text-sm">
                Real Estate CRM
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold">
                Welcome back, Admin 👋
              </h1>

              <p className="text-white/65 mt-3 max-w-2xl leading-relaxed">
                Track projects, leads, follow-ups, revenue pipeline, and recent
                activity from one clean dashboard.
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 sm:mb-10">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="group bg-white p-5 sm:p-6 rounded-3xl shadow border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-[#CDB52B]/10 to-[#9CA83A]/10"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#F7F6EF] border border-[#CDB52B]/20 flex items-center justify-center text-3xl mb-4">
                  {action.icon}
                </div>

                <h3 className="text-xl font-extrabold text-[#263238]">
                  {action.title}
                </h3>

                <p className="text-slate-500 mt-2">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-5 mb-8 sm:mb-10">
          {statsCards.map((card) => (
            <div
              key={card.title}
              className={`bg-linear-to-r ${card.className} text-white p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden`}
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="text-3xl mb-3">{card.icon}</div>

                <p className="text-sm text-white/75">{card.title}</p>

                <h2 className="text-4xl font-extrabold mt-2">
                  {card.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Follow-up Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 sm:mb-10">
          {followUpCards.map((card) => (
            <div
              key={card.title}
              className={`bg-linear-to-r ${card.className} text-white p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden`}
            >
              <div className="absolute -bottom-12 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="text-3xl mb-3">{card.icon}</div>

                <p className="text-sm text-white/75">{card.title}</p>

                <h2 className="text-4xl font-extrabold mt-2">
                  {card.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Follow-up Alerts */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-5 sm:p-8 mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
            <div>
              <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-2">
                Sales Reminders
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
                Today & Overdue Follow-ups
              </h2>

              <p className="text-slate-500 mt-2">
                Important customer follow-ups that need attention.
              </p>
            </div>

            <Link
              to="/admin/leads"
              className="bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] text-white px-5 py-3 rounded-xl font-extrabold transition text-center"
            >
              Open Leads
            </Link>
          </div>

          {followUpAlerts.length === 0 ? (
            <div className="bg-[#F7F6EF] border border-[#CDB52B]/15 rounded-2xl p-6 text-center">
              <div className="text-4xl">✅</div>

              <h3 className="text-xl font-extrabold text-[#263238] mt-3">
                No urgent follow-ups
              </h3>

              <p className="text-slate-500 mt-2">
                Today and overdue follow-ups will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {followUpAlerts.map((lead) => (
                <div
                  key={lead._id}
                  className="border border-slate-100 rounded-3xl p-5 bg-[#F7F6EF] hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-[#263238] wrap-break-word">
                        {lead.name}
                      </h3>

                      <p className="text-slate-500 mt-1 wrap-break-word">
                        {lead.projectName || "General Inquiry"}
                      </p>

                      <p className="text-slate-600 mt-3">📞 {lead.phone}</p>

                      <p className="text-slate-600 mt-1">
                        ⏰ {formatFollowUpDate(lead)}
                      </p>

                      {lead.followUp?.remarks && (
                        <p className="text-slate-500 mt-2 wrap-break-word">
                          {lead.followUp.remarks}
                        </p>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${followUpClass(
                        lead
                      )}`}
                    >
                      {followUpLabel(lead)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <a
                      href={`tel:${lead.phone}`}
                      className="bg-green-600 hover:bg-green-700 text-white text-center px-5 py-2.5 rounded-xl font-bold transition"
                    >
                      Call
                    </a>

                    <Link
                      to="/admin/leads"
                      className="bg-[#35434A] hover:bg-[#263238] text-white text-center px-5 py-2.5 rounded-xl font-bold transition"
                    >
                      Open Lead
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 sm:mb-10">
          {revenueCards.map((card) => (
            <div
              key={card.title}
              className={`bg-linear-to-r ${card.className} text-white p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden`}
            >
              <div className="absolute -bottom-12 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="text-3xl mb-3">{card.icon}</div>

                <p className="text-sm text-white/75">{card.title}</p>

                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 wrap-break-word">
                  {card.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <LeadsChart leads={leads} projects={projects} />
          </div>

          <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-2xl font-extrabold text-[#263238]">
                Recent Activity
              </h2>

              <span className="bg-[#35434A] text-white px-4 py-2 rounded-full text-sm w-fit">
                Latest 8
              </span>
            </div>

            {activities.length === 0 ? (
              <p className="text-slate-500">No recent activity found.</p>
            ) : (
              <div className="space-y-5">
                {activities.map((activity, index) => (
                  <div
                    key={`${activity.type}-${activity.id || index}`}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-[#35434A] text-white flex items-center justify-center text-lg">
                        {activity.icon}
                      </div>

                      {index !== activities.length - 1 && (
                        <div className="w-px flex-1 bg-slate-200 mt-2"></div>
                      )}
                    </div>

                    <div className="pb-5 min-w-0">
                      <h3 className="font-extrabold text-[#263238] wrap-break-word">
                        {activity.title}
                      </h3>

                      <p className="text-slate-500 text-sm mt-1 wrap-break-word">
                        {activity.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getLeadStatusClass(
                            activity.status
                          )}`}
                        >
                          {activity.status || "New"}
                        </span>

                        <span className="text-xs text-slate-400">
                          {activity.date
                            ? new Date(activity.date).toLocaleDateString()
                            : "No date"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        <div className="mt-10 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
              Upcoming Follow-ups
            </h2>

            <Link
              to="/admin/leads"
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-extrabold w-fit"
            >
              View Leads
            </Link>
          </div>

          {upcomingFollowUps.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow border border-slate-100 text-slate-500">
              No upcoming follow-ups found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingFollowUps.slice(0, 4).map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-extrabold text-[#263238] wrap-break-word">
                        {lead.name}
                      </h3>

                      <p className="text-slate-500 wrap-break-word">
                        {lead.phone}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${followUpClass(
                        lead
                      )}`}
                    >
                      {followUpLabel(lead)}
                    </span>
                  </div>

                  <p className="text-sm mt-3 text-slate-600 wrap-break-word">
                    Project: {lead.projectName || "General Inquiry"}
                  </p>

                  <p className="text-sm mt-2 text-orange-600 font-bold">
                    ⏰ {formatFollowUpDate(lead)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="mt-10 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
              Recent Leads
            </h2>

            <Link
              to="/admin/leads"
              className="bg-[#CDB52B] text-[#263238] px-4 py-2 rounded-full text-sm font-extrabold w-fit"
            >
              View All Leads
            </Link>
          </div>

          {leads.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow border border-slate-100 text-slate-500">
              No leads found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-extrabold text-[#263238] wrap-break-word">
                        {lead.name}
                      </h3>

                      <p className="text-slate-500 wrap-break-word">
                        {lead.phone}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${getLeadStatusClass(
                        lead.status
                      )}`}
                    >
                      {lead.status || "New"}
                    </span>
                  </div>

                  <p className="text-sm mt-3 text-slate-600 wrap-break-word">
                    Project: {lead.projectName || "General Inquiry"}
                  </p>

                  {lead.followUp?.date && !lead.followUp?.completed && (
                    <p className="text-sm mt-2 text-orange-600 font-bold">
                      ⏰ Follow-up: {formatFollowUpDate(lead)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="mt-10 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
              Recent Projects
            </h2>

            <Link
              to="/admin/projects"
              className="bg-[#35434A] text-white px-4 py-2 rounded-full text-sm font-extrabold w-fit"
            >
              Manage Projects
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow border border-slate-100 text-slate-500">
              No projects found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-slate-100"
                >
                  <img
                    src={
                      project.image ||
                      "https://placehold.co/400x250?text=Property"
                    }
                    alt={project.name}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-extrabold text-lg text-[#263238] line-clamp-2">
                      {project.name}
                    </h3>

                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                      {project.location}
                    </p>

                    <p className="text-[#9CA83A] font-extrabold mt-3">
                      {formatMoney(project.price)}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${getProjectStatusClass(
                        project.status
                      )}`}
                    >
                      {project.status || "Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;