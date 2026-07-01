import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function LeadsChart({ leads = [], projects = [] }) {
  const leadStatuses = [
    "New",
    "Contacted",
    "Site Visit",
    "Negotiation",
    "Booked",
    "Closed",
    "Not Interested",
    "Invalid Lead",
  ];

  const leadStatusCounts = leadStatuses.map(
    (status) => leads.filter((lead) => lead.status === status).length
  );

  const leadStatusData = {
    labels: leadStatuses,
    datasets: [
      {
        data: leadStatusCounts,
        backgroundColor: [
          "#2563EB", // New
          "#F97316", // Contacted
          "#9333EA", // Site Visit
          "#CDB52B", // Negotiation
          "#9CA83A", // Booked
          "#64748B", // Closed
          "#DC2626", // Not Interested
          "#71717A", // Invalid Lead
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const projectStatuses = ["Available", "Upcoming", "Sold"];

  const projectStatusCounts = projectStatuses.map(
    (status) => projects.filter((project) => project.status === status).length
  );

  const projectStatusData = {
    labels: projectStatuses,
    datasets: [
      {
        data: projectStatusCounts,
        backgroundColor: ["#9CA83A", "#CDB52B", "#DC2626"],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const monthlyCounts = leads.reduce((acc, lead) => {
    if (!lead.createdAt) return acc;

    const date = new Date(lead.createdAt);

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    const label = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!acc[key]) {
      acc[key] = {
        label,
        count: 0,
      };
    }

    acc[key].count += 1;

    return acc;
  }, {});

  const sortedMonthlyData = Object.entries(monthlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  const monthlyData = {
    labels: sortedMonthlyData.map((item) => item.label),
    datasets: [
      {
        label: "Leads",
        data: sortedMonthlyData.map((item) => item.count),
        backgroundColor: "#CDB52B",
        borderColor: "#9CA83A",
        borderWidth: 1,
        borderRadius: 12,
        maxBarThickness: 42,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#263238",
          font: {
            weight: "600",
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#263238",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 12,
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#263238",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            weight: "600",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#E2E8F0",
        },
        ticks: {
          precision: 0,
          color: "#64748B",
          font: {
            weight: "600",
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6">
      <ChartCard
        title="Leads by Status"
        subtitle="Current lead pipeline distribution"
        empty={leads.length === 0}
        emptyText="No leads data available"
      >
        <Pie data={leadStatusData} options={pieOptions} />
      </ChartCard>

      <ChartCard
        title="Projects by Status"
        subtitle="Available, upcoming, and sold project overview"
        empty={projects.length === 0}
        emptyText="No project data available"
      >
        <Pie data={projectStatusData} options={pieOptions} />
      </ChartCard>

      <ChartCard
        title="Monthly Leads"
        subtitle="Lead generation performance by month"
        empty={leads.length === 0}
        emptyText="No monthly data available"
        type="bar"
      >
        <Bar data={monthlyData} options={barOptions} />
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, subtitle, empty, emptyText, children, type }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="mb-5">
          <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-2">
            Analytics
          </p>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
            {title}
          </h2>

          <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        </div>

        {empty ? (
          <div className="min-h-55 flex flex-col items-center justify-center text-center bg-[#F7F6EF] rounded-2xl border border-[#CDB52B]/15 px-4">
            <div className="text-4xl mb-3">📊</div>

            <p className="text-slate-500 font-semibold">{emptyText}</p>
          </div>
        ) : (
          <div
            className={`relative ${
              type === "bar" ? "h-65 sm:h-75" : "h-65"
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadsChart;