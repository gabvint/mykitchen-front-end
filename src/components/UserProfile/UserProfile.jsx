import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthedUserContext } from '../../App';
import * as authService from "../../services/authService";
import DeleteProfile from "../DeleteProfile/DeleteProfile";

const UserProfile = () => {
  const navigate = useNavigate();
  const thisuser = useContext(AuthedUserContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  useEffect(() => {
    const userProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const userData = await authService.getUserProfile();
        setUser(userData);
        setEditForm(userData);
      } catch (err) {
        setError(err.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    userProfile();
  }, []);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  setSaving(true);
  try {
    // Only send fields allowed by backend
    const updated = await authService.updateProfile({
      firstname: editForm.firstname,
      lastname: editForm.lastname,
    });
    setUser(updated);
    setEditMode(false);
    setEditForm(updated);
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-cream">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl p-10 max-w-sm w-full font-albert border border-green-100">
        {editMode ? (
          <>
            <div className="w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="firstname">
                  First Name
                </label>
                <input
                  className="border-2 border-[#4B7A5A]/30 focus:border-[#4B7A5A] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#4B7A5A] transition"
                  id="firstname"
                  name="firstname"
                  value={editForm.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="lastname">
                  Last Name
                </label>
                <input
                  className="border-2 border-[#4B7A5A]/30 focus:border-[#4B7A5A] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#4B7A5A] transition"
                  id="lastname"
                  name="lastname"
                  value={editForm.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="username">
                  Username
                </label>
                <input
                  className="border-2 border-[#4B7A5A]/30 focus:border-[#4B7A5A] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#4B7A5A] transition"
                  id="username"
                  name="username"
                  value={editForm.username}
                  onChange={handleChange}
                  placeholder="Username"
                  disabled // usually not editable
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className="border-2 border-[#4B7A5A]/30 focus:border-[#4B7A5A] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#4B7A5A] transition"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled // usually not editable
                />
              </div>
            </div>
            <div className="flex gap-3 w-full mt-6">
            <button
                className="border py-2 rounded-lg font-semibold bg-[#4B7A5A] text-white flex-1 shadow hover:bg-[#33593c] transition"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
            </button>
            <button
                className="border py-2 rounded-lg font-semibold bg-gray-200 flex-1 hover:bg-gray-300 transition"
                onClick={() => {
                  setEditMode(false);
                  setEditForm(user);
                }}
              >
                Cancel
            </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold mb-1 tracking-tight text-[#4B7A5A]">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-lg text-gray-700 mb-1 font-mono">@{user.username}</p>
            <p className="text-md text-gray-500 mb-3">{user.email}</p>
            <p className="text-sm text-green-700 font-semibold mb-6">
              Role: {user.role === 'admin' ? 'Administrator' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button className="border py-2 rounded-lg font-medium hover:bg-green-300 hover:text-white transition">
                <Link to={`/recipes/user/${thisuser._id}`}>My Recipes</Link>
              </button>
              <button className="border py-2 rounded-lg font-medium hover:bg-green-300 hover:text-white transition">
               <Link to={`/recipes/user/${user._id}/favorites`}>Saved Recipes</Link>
              </button>


                {/* Role-based dashboards */}
            {user.role === 'moderator' && (
              <button
                className="border py-2 rounded-lg font-medium hover:bg-green-300 hover:text-white  transition"
                onClick={() => navigate('/moderator/dashboard')}
              >
                Moderator Dashboard
              </button>
            )}
            {user.role === 'admin' && (
              <button
                className="border py-2 rounded-lg font-medium hover:bg-green-300 hover:text-white  transition"
                onClick={() => navigate('/admin/dashboard')}
              >
                Admin Dashboard
              </button>
            )}

              <button
                className="border py-2 rounded-lg font-medium hover:bg-green-300 hover:text-white transition"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                className="border py-2 rounded-lg font-medium hover:bg-yellow-300 hover:text-white transition"
                onClick={() => navigate(`/${user._id}/change-password`)}
              >
                Change Password
              </button>
                {!showDeleteForm ? (
                  <button
                    className="border py-2 rounded-lg font-medium text-red-600 border-red-300 hover:bg-red-50 transition"
                    onClick={() => setShowDeleteForm(true)}
                  >
                    Delete Profile
                  </button>
                ) : (
                  <DeleteProfile
                    email={user.email}
                    onCancel={() => setShowDeleteForm(false)}
                    onDeleted={() => {
                      authService.signout();
                      navigate('/signin');
                    }}
                  />
                )}

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
