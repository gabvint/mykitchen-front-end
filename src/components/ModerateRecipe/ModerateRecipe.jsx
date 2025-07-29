import React, { useEffect, useState } from 'react';
import { pendingRecipes, approveRecipe } from '../../services/recipeService'; 

const ModerateRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(null); // recipe id if approving
  const [error, setError] = useState('');

  // Fetch all pending recipes on mount
  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await pendingRecipes();
        setRecipes(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  // Approve/Unapprove handler
  const handleToggleApproval = async (recipeId, currentStatus) => {
    setApproveLoading(recipeId);
    setError('');
    try {
      await approveRecipe(recipeId, !currentStatus);
      setRecipes((prev) =>
        prev.map((r) =>
          r._id === recipeId ? { ...r, isApproved: !currentStatus } : r
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update approval status');
    } finally {
      setApproveLoading(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 mt-32">
      <h2 className="text-3xl font-bold mb-2 text-green-800">Manage Recipes</h2>
      <p className="text-gray-600 mb-6">Manage and approve pending recipe submissions</p>
      {error && <div className="mb-4 text-red-600">{error}</div>}

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
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Loading...</td>
                </tr>
              ) : recipes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">No pending recipes.</td>
                </tr>
              ) : (
                recipes.map((recipe, idx) => (
                  <tr
                    key={recipe._id}
                    className={`hover:bg-green-50 transition duration-150 ${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{recipe.name}</td>
                    <td className="px-6 py-4 text-gray-600">{recipe.author?.username || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(recipe.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleApproval(recipe._id, recipe.isApproved)}
                        className={`px-4 py-1.5 rounded-md font-medium shadow text-sm transition duration-150 ${
                          recipe.isApproved
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        disabled={approveLoading === recipe._id}
                      >
                        {approveLoading === recipe._id
                          ? 'Processing...'
                          : recipe.isApproved
                          ? 'Unapprove'
                          : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModerateRecipe;
