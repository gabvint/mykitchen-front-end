import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModerateRecipe from '../ModerateRecipe/ModerateRecipe';

const defaultModerator = {
  _id: "64e18db3e1a59d0012c899a2",
  firstname: "Michael",
  lastname: "Brown",
  username: "modmike",
  email: "moderator@example.com",
  profileImg: "https://ui-avatars.com/api/?name=Michael+Brown&background=random",
};

const ModeratorProfile = () => {
  const navigate = useNavigate();
  const [moderator, setModerator] = useState(defaultModerator);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(moderator);
  const [previewImg, setPreviewImg] = useState(moderator.profileImg);
  const [showModeration, setShowModeration] = useState(false);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImg(reader.result);
      setEditForm((prev) => ({ ...prev, profileImg: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setModerator(editForm);
    setEditMode(false);
  };

  // 💻 MODERATION SCREEN
  if (showModeration) {
    return (
      <div className="bg-cream min-h-screen flex flex-col justify-center items-center px-4 py-10">
        <button
          className="mb-6 px-4 py-2 bg-[#4B7A5A] text-white rounded hover:bg-[#3e634b] transition"
          onClick={() => setShowModeration(false)}
        >
          ← Back to Profile
        </button>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl w-full h-[600px] overflow-y-auto border border-gray-200">
          <ModerateRecipe />
        </div>
      </div>
    );
  }

  // 👤 PROFILE VIEW
  return (
    <div className="bg-cream min-h-screen py-10 font-sans flex items-center justify-center">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl p-10 max-w-sm w-full border border-green-100">
        {editMode ? (
          <>
            {/* Editable Profile */}
            <div className="relative mb-6">
              <img
                src={previewImg}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-300 shadow"
              />
              <input
                type="file"
                accept="image/*"
                className="absolute left-0 top-0 w-32 h-32 opacity-0 cursor-pointer"
                onChange={handlePhotoChange}
              />
              <div className="absolute left-0 bottom-2 w-32 text-center pointer-events-none bg-[#4B7A5A]/80 text-white text-xs py-1 rounded-b-full">
                Change Photo
              </div>
            </div>

            <div className="w-full space-y-3">
              {["firstname", "lastname", "username", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 capitalize" htmlFor={field}>
                    {field}
                  </label>
                  <input
                    id={field}
                    name={field}
                    value={editForm[field]}
                    onChange={handleChange}
                    placeholder={field}
                    className="border-2 border-[#4B7A5A]/30 focus:border-[#4B7A5A] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#4B7A5A] transition"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 w-full mt-6">
              <button
                className="border py-2 rounded-lg font-semibold bg-[#4B7A5A] text-white flex-1 shadow hover:bg-[#33593c] transition"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="border py-2 rounded-lg font-semibold bg-gray-200 flex-1 hover:bg-gray-300 transition"
                onClick={() => {
                  setEditMode(false);
                  setEditForm(moderator);
                  setPreviewImg(moderator.profileImg);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Static Profile */}
            <img
              src={moderator.profileImg}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-green-300 shadow"
            />
            <h2 className="text-3xl font-extrabold mb-1 tracking-tight text-[#4B7A5A]">
              {moderator.firstname} {moderator.lastname}
            </h2>
            <p className="text-lg text-gray-700 mb-1 font-mono">@{moderator.username}</p>
            <p className="text-md text-gray-500 mb-3">{moderator.email}</p>
            <p className="text-sm text-green-700 font-semibold mb-6">Role: Moderator</p>

            <div className="flex flex-col gap-3 w-full">
              <button
                className="border py-2 rounded-lg font-medium hover:bg-green-300 hover:text-white transition"
                onClick={() => setShowModeration(true)}
              >
                Moderate Recipes
              </button>
              <button
                className="border py-2 rounded-lg font-medium hover:bg-green-300 hover:text-white transition"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                className="border py-2 rounded-lg font-medium hover:bg-yellow-300 hover:text-white transition"
                onClick={() => navigate(`/${moderator._id}/change-password`)}
              >
                Change Password
              </button>
              <button className="border py-2 rounded-lg font-medium text-red-600 border-red-300 hover:bg-red-50 transition">
                Delete Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModeratorProfile;
