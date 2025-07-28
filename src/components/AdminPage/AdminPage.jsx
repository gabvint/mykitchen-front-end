import React, { useEffect, useState } from "react";
import { fetchLogs } from "../../services/authService"

const users = [
  { id: 1, name: "Jane Admin", username: "janeadmin", role: "admin", email: "jane@site.com" },
  { id: 2, name: "John Mod", username: "johnmod", role: "moderator", email: "john@site.com" },
  { id: 3, name: "Alice User", username: "alice", role: "user", email: "alice@site.com" },
];

const AdminPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [searchLog, setSearchLog] = useState("");
  const [logStatus, setLogStatus] = useState("");
  const [logAction, setLogAction] = useState("");
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logError, setLogError] = useState("");

  // Fetch logs from backend whenever filters change
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoadingLogs(true);
      setLogError("");
      try {
        const result = await fetchLogs({
          status: logStatus || undefined,
          action: logAction || undefined,
          // You can add more filters like userId, limit, etc.
        });
        setLogs(result);
      } catch (err) {
        setLogError(err.message);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchAuditLogs();
  }, [logStatus, logAction]);

  // Filter logs on search (frontend filtering for now)
  const displayedLogs = logs.filter(
    (l) =>
      l.user?.username?.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.action?.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto bg-white rounded-2xl shadow font-albert mt-44 mb-36">
      <h2 className="text-3xl font-bold mb-8 text-[#7AA58C]">Administrator Panel</h2>

      {/* Assign/Change User Roles */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Manage Users and Roles</h3>
        <table className="w-full mb-2 border text-sm">
          <thead className="bg-[#eef6f3]">
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Current Role</th>
              <th className="py-2 px-4 border-b">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#f7faf9]">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 font-semibold">{u.role}</td>
                <td className="px-4 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Change...</option>
                    <option value="admin">Administrator</option>
                    <option value="moderator">Role A</option>
                    <option value="user">Regular User</option>
                  </select>
                  <button className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Audit Trails */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Audit Trail (System Logs)</h3>
        <div className="mb-4 flex gap-4">
          <input
            className="border rounded px-4 py-2"
            placeholder="Search logs..."
            value={searchLog}
            onChange={(e) => setSearchLog(e.target.value)}
          />
          <select
            className="border rounded px-4 py-2"
            value={logStatus}
            onChange={(e) => setLogStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            className="border rounded px-4 py-2"
            value={logAction}
            onChange={(e) => setLogAction(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="Created">Created</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Deleted">Deleted</option>
            <option value="Unauthorized">Unauthorized</option>
          </select>
        </div>
        {loadingLogs ? (
          <div className="py-8 text-center text-gray-500">Loading logs...</div>
        ) : logError ? (
          <div className="py-8 text-center text-red-500">{logError}</div>
        ) : (
          <table className="w-full border text-xs">
            <thead className="bg-[#fafbfa]">
              <tr>
                <th className="py-2 px-3 border-b">Date/Time</th>
                <th className="py-2 px-3 border-b">User</th>
                <th className="py-2 px-3 border-b">Action</th>
                <th className="py-2 px-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-gray-400">
                    No logs found.
                  </td>
                </tr>
              ) : (
                displayedLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-3 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2">{log.user?.username || "System"}</td>
                    <td className="px-3 py-2">{log.action}</td>
                    <td className={`px-3 py-2 font-semibold ${log.status === "failure" ? "text-red-600" : "text-green-600"}`}>
                      {log.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
