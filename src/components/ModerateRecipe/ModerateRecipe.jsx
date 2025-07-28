import React, { useState } from 'react';

const ModerateRecipe = () => {
  // === TEMPORARY MOCK DATA ===
  // This is just placeholder data for testing UI layout.
  // It will be replaced with actual recipe data from the backend later.
  const [recipes, setRecipes] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      _id: i + 1,
      title: `Recipe ${i + 1}`,
      submittedBy: `user${i + 1}`,
      date: `Jul ${15 - (i % 5)}, 2025`,
      approved: false,
    }))
  );

  const toggleApproval = (id) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-2 text-green-800">Moderation Panel</h2>
      <p className="text-gray-600 mb-6">Manage and approve pending recipe submissions</p>

      <div>
        <div className="overflow-y-auto max-h-[480px] rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-semibold text-green-900">Recipe Title</th>
                <th className="px-6 py-3 font-semibold text-green-900">Submitted By</th>
                <th className="px-6 py-3 font-semibold text-green-900">Date</th>
                <th className="px-6 py-3 font-semibold text-green-900 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {recipes.map((recipe, idx) => (
                <tr
                  key={recipe._id}
                  className={`hover:bg-green-50 transition duration-150 ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{recipe.title}</td>
                  <td className="px-6 py-4 text-gray-600">{recipe.submittedBy}</td>
                  <td className="px-6 py-4 text-gray-600">{recipe.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleApproval(recipe._id)}
                      className={`px-4 py-1.5 rounded-md font-medium shadow text-sm transition duration-150 ${
                        recipe.approved
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {recipe.approved ? 'Unapprove' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModerateRecipe;
