"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Mock Data ---

const stats = [
  {
    label: "Total Users",
    value: "1,234",
    change: "+5.2%",
    trend: "up",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-people"
        viewBox="0 0 16 16"
      >
        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
      </svg>
    ),
  },
  {
    label: "Active Listings",
    value: "876",
    change: "+3.1%",
    trend: "up",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-box-seam"
        viewBox="0 0 16 16"
      >
        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
      </svg>
    ),
  },
  {
    label: "Pending Disputes",
    value: "12",
    change: "+2",
    trend: "down", // indicating increase in bad thing
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-exclamation-triangle"
        viewBox="0 0 16 16"
      >
        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
      </svg>
    ),
  },
  {
    label: "Revenue Processed",
    value: "₱2,500.00",
    change: "+10.8%",
    trend: "up",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-currency-dollar"
        viewBox="0 0 16 16"
      >
        <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
      </svg>
    ),
  },
];

const recentActivity = [
  {
    text: "New user registered: Jane Doe",
    email: "jane.doe@cit.edu",
    time: "5 minutes ago",
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    text: "Listing posted: 'Calculus Textbook'",
    user: "John Smith",
    time: "30 minutes ago",
    iconColor: "bg-green-100 text-green-600",
  },
  {
    text: "Dispute reported: Listing #1005",
    desc: "'Item not as described'",
    time: "1 hour ago",
    iconColor: "bg-red-100 text-red-600",
  },
  {
    text: "User verified: Alex Rodriguez",
    email: "alex.r@cit.edu",
    time: "3 hours ago",
    iconColor: "bg-yellow-100 text-yellow-600",
  },
];

const users = [
  {
    id: "U001",
    name: "Alice Johnson",
    email: "alice.j@cit.edu",
    role: "Student",
    status: "Active",
    joined: "2023-01-15",
  },
  {
    id: "U002",
    name: "Bob Smith",
    email: "bob.s@cit.edu",
    role: "Student",
    status: "Active",
    joined: "2023-02-20",
  },
  {
    id: "U003",
    name: "Charlie Brown",
    email: "charlie.b@cit.edu",
    role: "Student",
    status: "Inactive",
    joined: "2023-03-10",
  },
  {
    id: "U004",
    name: "Diana Prince",
    email: "diana.p@cit.edu",
    role: "Admin",
    status: "Active",
    joined: "2022-11-01",
  },
  {
    id: "U005",
    name: "Eve Adams",
    email: "eve.a@cit.edu",
    role: "Student",
    status: "Pending",
    joined: "2024-01-05",
  },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "listings" | "disputes"
  >("dashboard");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* --- Navigation Tabs --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 inline-flex flex-wrap">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "users", label: "User Management" },
            { id: "listings", label: "Listing Management" },
            { id: "disputes", label: "Dispute Resolution" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#8B0000] text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT: DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Top Row: Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-40"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium">
                      {stat.label}
                    </span>
                    <div className="text-gray-400">{stat.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                    <p
                      className={`text-xs font-bold mt-2 ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                      <span className="text-gray-400 font-normal ml-1">
                        since last month
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-6">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}
                      >
                        {/* Generic dot icon */}
                        <div className="w-2.5 h-2.5 bg-current rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.email || activity.user || activity.desc}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Listing Category Distribution (Mock Chart) */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6 self-start">
                  Listing Distribution
                </h3>
                {/* CSS Conic Gradient to simulate Donut Chart */}
                <div
                  className="w-48 h-48 rounded-full relative"
                  style={{
                    background:
                      "conic-gradient(#8B0000 0% 35%, #F59E0B 35% 55%, #10B981 55% 75%, #3B82F6 75% 90%, #6B7280 90% 100%)",
                  }}
                >
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      Total
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-xs">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-[#8B0000]"></span>
                    Textbooks (35%)
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    Stationery (20%)
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Electronics (20%)
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Furniture (15%)
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth (Line Chart Simulation) */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  User Growth Over Time
                </h3>
                <div className="h-64 flex items-end justify-between gap-2 px-4 border-l border-b border-gray-100 relative">
                  {/* Simulated Line using polyline svg */}
                  <svg
                    className="absolute inset-0 w-full h-full text-red-900 pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      points="0,250 100,240 200,220 300,180 400,120 500,50"
                    />
                  </svg>
                  <span className="text-xs text-gray-400">Jan</span>
                  <span className="text-xs text-gray-400">Mar</span>
                  <span className="text-xs text-gray-400">Jun</span>
                  <span className="text-xs text-gray-400">Sep</span>
                  <span className="text-xs text-gray-400">Dec</span>
                </div>
              </div>

              {/* Transaction Volume (Bar Chart Simulation) */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Quarterly Transaction Volume
                </h3>
                <div className="h-64 flex items-end justify-around border-b border-gray-100 pb-2">
                  {[
                    { q: "Q1 2023", h: "h-24" },
                    { q: "Q2 2023", h: "h-32" },
                    { q: "Q3 2023", h: "h-40" },
                    { q: "Q4 2023", h: "h-48" },
                    { q: "Q1 2024", h: "h-56" },
                    { q: "Q2 2024", h: "h-64" },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 bg-yellow-400 rounded-t-md ${bar.h}`}
                      ></div>
                      <span className="text-xs text-gray-400">{bar.q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: USER MANAGEMENT --- */}
        {activeTab === "users" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Registered Users
                </h3>
                <p className="text-sm text-gray-500">
                  Manage student accounts and roles.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
                  <path
                    fillRule="evenodd"
                    d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
                  />
                </svg>
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold">User ID</th>
                    <th className="px-6 py-4 font-bold">Name</th>
                    <th className="px-6 py-4 font-bold">Email</th>
                    <th className="px-6 py-4 font-bold">Role</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Joined Date</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                            user.status === "Active"
                              ? "bg-[#8B0000]"
                              : user.status === "Inactive"
                              ? "bg-red-600"
                              : "bg-gray-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="font-bold text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                        <button className="font-bold text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- PLACEHOLDERS FOR OTHER TABS --- */}
        {activeTab === "listings" && (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-20 text-center animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-400">
              Listing Management Module
            </h2>
            <p className="text-gray-400 mt-2">
              Content for managing active listings would go here.
            </p>
          </div>
        )}

        {activeTab === "disputes" && (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-20 text-center animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-400">
              Dispute Resolution Center
            </h2>
            <p className="text-gray-400 mt-2">
              Interface for resolving user conflicts would go here.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
