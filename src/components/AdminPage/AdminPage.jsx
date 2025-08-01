import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, changeUserRole, fetchLogs } from "../../services/authService";
import { AuthedUserContext } from "../../App";

const AdminPage = () => {
  const thisUser = useContext(AuthedUserContext);
  const navigate = useNavigate();
  
    // Redirect non-admin users
  useEffect(() => {
    if (thisUser.role !== 'admin') {
      // Redirect user to the Forbidden page if they are not an admin
      navigate('/forbidden'); 
    }
  }, [thisUser.role, navigate]);

  // USER ROLES STATE
  const [users, setUsers] = useState([]);
  const [roleUpdates, setRoleUpdates] = useState({});
  const [userError, setUserError] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);

  // For admin password modal
  const [showPwPrompt, setShowPwPrompt] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // LOGS STATE
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logError, setLogError] = useState("");
  const [searchLog, setSearchLog] = useState("");
  const [logStatus, setLogStatus] = useState("");
  const [logAction, setLogAction] = useState("");

  // Get all users (excluding self)
  useEffect(() => {
    const fetchUsers = async () => {
      setRoleLoading(true);
      setUserError("");
      try {
        const userList = await getAllUsers();
        setUsers(userList.filter(u => u._id !== thisUser._id));
      } catch (err) {
        setUserError("Failed to fetch users.");
      } finally {
        setRoleLoading(false);
      }
    };
    fetchUsers();
  }, [thisUser]);

  // Handler for changing role select
  const handleRoleChange = (userId, newRole) => {
    setRoleUpdates(prev => ({ ...prev, [userId]: newRole }));
  };

  // When clicking Update, show password modal
  const handleUpdateRoleClick = (userId) => {
    setPendingUserId(userId);
    setShowPwPrompt(true);
    setAdminPassword("");
    setPwError("");
  };

  // send the role update when password entered
  const handleConfirmRoleUpdate = async () => {
    setRoleLoading(true);
    setPwError("");
    try {
      console.log("PATCH user id:", pendingUserId, "newRole:", roleUpdates[pendingUserId]);
      await changeUserRole(pendingUserId, roleUpdates[pendingUserId], adminPassword);
      setUsers(users.map(u => u._id === pendingUserId ? { ...u, role: roleUpdates[pendingUserId] } : u));
      setShowPwPrompt(false);
      setPendingUserId(null);
      setAdminPassword("");
    } catch (err) {
      setPwError(err.message || "Failed to update role.");
    } finally {
      setRoleLoading(false);
    }
  };

  // LOGS: Fetch on status/action change
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoadingLogs(true);
      setLogError("");
      try {
        const result = await fetchLogs({
          status: logStatus || undefined,
          action: logAction || undefined,
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

  // Filter logs by search
  const displayedLogs = logs.filter(
    (l) =>
      l.user?.username?.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.action?.toLowerCase().includes(searchLog.toLowerCase()) ||
      (l.details || "").toLowerCase().includes(searchLog.toLowerCase()) ||
      (l.ip || "").toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div className="px-8 py-10 max-w-6xl mx-auto bg-white rounded-2xl shadow font-albert mt-44 mb-36">
      <h2 className="text-3xl font-bold mb-8 text-[#7AA58C]">Administrator Panel</h2>

      <div className="grid md:grid-row-2 gap-12">
        {/* USER ROLES MANAGEMENT */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Manage Users and Roles</h3>
          {userError && <div className="text-red-600 mb-2">{userError}</div>}
          <div className="overflow-x-auto">
            <table className="w-full mb-2 border text-sm rounded-xl">
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
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-[#f7faf9]">
                    <td className="px-4 py-2">{u.firstname} {u.lastname}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 font-semibold">{u.role}</td>
                    <td className="px-4 py-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={roleUpdates[u._id] || u.role}
                        onChange={e => handleRoleChange(u._id, e.target.value)}
                        disabled={roleLoading}
                      >
                        <option value="admin">Administrator</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">Regular User</option>
                      </select>
                      <button
                        className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        onClick={() => handleUpdateRoleClick(u._id)}
                        disabled={roleLoading || (roleUpdates[u._id] === u.role)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
              {/* Modal for admin password */}
          {showPwPrompt && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-80 flex flex-col items-center">
                <h4 className="text-lg font-bold mb-2">Admin Password Required</h4>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border rounded p-2 w-full mb-2 pr-10"
                    placeholder="Enter your password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                   {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {pwError && <div className="text-red-600 mb-2 text-sm">{pwError}</div>}
                <div className="flex gap-2 mt-1">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleConfirmRoleUpdate}
                    disabled={roleLoading || !adminPassword}
                  >
                    Confirm
                  </button>
                  <button
                    className="border px-4 py-2 rounded"
                    onClick={() => { setShowPwPrompt(false); setPendingUserId(null); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* AUDIT TRAIL LOGS */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Audit Trail (System Logs)</h3>
          <div className="mb-4 flex flex-wrap gap-4">
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
              <option value="success">Success</option>
              <option value="failure">Failed</option>
            </select>
            <select
              className="border rounded px-4 py-2"
              value={logAction}
              onChange={(e) => setLogAction(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="signup">Signup</option>
              <option value="login">Login</option>
              <option value="edit profile">Edit Profile</option>
              <option value="delete user">Delete User</option>
              <option value="change password">Change Password</option>
              <option value="forgot password">Forgot Password</option>
              <option value="change role">Change Role</option>
              <option value="recipe approval">Recipe Approval</option>
              <option value="recipe creation">Recipe Creation</option>
              <option value="edited recipe">Edited Recipe</option>
              <option value="deleted recipe">Deleted Recipe</option>
              <option value="unauthorized access">Unauthorized Access</option>
              

            </select>
          </div>
          {loadingLogs ? (
            <div className="py-8 text-center text-gray-500">Loading logs...</div>
          ) : logError ? (
            <div className="py-8 text-center text-red-500">{logError}</div>
          ) : (
            <div className="overflow-auto max-h-[500px] rounded-xl border">
              <table className="w-full border text-xs">
                <thead className="bg-[#fafbfa] sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-3 border-b">Date/Time</th>
                    <th className="py-2 px-3 border-b">User</th>
                    <th className="py-2 px-3 border-b">Action</th>
                    <th className="py-2 px-3 border-b">Status</th>
                    <th className="py-2 px-3 border-b">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-5 text-center text-gray-400">
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
                          {log.status === "success" ? "Success" : "Failed"}
                        </td>
                        <td className="px-3 py-2">{log.details || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
