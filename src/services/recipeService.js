const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/recipes`;

// get all recipes
const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

// show specific recipe
const show = async (recipeId) => {
    try {
        const res = await fetch(`${BASE_URL}/${recipeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
      } catch (error) {
        console.log(error);
      }
}

// show user's recipes 

const showUserRecipes = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error)
    }
}

const create = async (formData) => {
    try {
        const res = await fetch(BASE_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        return res.json();
      } catch (error) {
        console.log(error);
      }
}

const deleteRecipe = async (recipeId) => {
    try {
        const res = await fetch(`${BASE_URL}/${recipeId}`, {
            method: 'DELETE', 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return res.json();
    
    } catch (error) {
        console.log(error)
    }
}

async function updateRecipe(recipeId, formData) {
    try {
        const res = await fetch(`${BASE_URL}/${recipeId}`, {
            method: 'PUT', 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(formData),
        });
        return res.json();
    } catch (error) {
        console.log(error)
    }
}

const createComment = async (recipeId, commentFormData) => {
    try {
      const res = await fetch(`${BASE_URL}/${recipeId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentFormData),
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
}

const deleteComment = async (recipeId, commentId) => {
    try {
        const res = await fetch(`${BASE_URL}/${recipeId}/comments/${commentId}`, {
            method: 'DELETE', 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return res.json();
    
    } catch (error) {
        console.log(error)
    }
}

const updateComment = async (recipeId, commentId, formData) => {
    try {
        const res = await fetch(`${BASE_URL}/${recipeId}/comments/${commentId}`, {
            method: 'PUT', 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(formData),
        });

        return res.json();
    } catch (error) {
        console.log(error)
    }
}

const saveRecipe = async (userId, recipeId) => {
    try {
        const res = await fetch(`${BASE_URL}/user/${userId}/favorites/${recipeId}`, {
            method: 'POST', 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
        });
        return res.json();
    } catch (error) {
        console.log(error)
    }
}


const savedRecipes = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/user/${userId}/favorites`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

const pendingRecipes = async () => {
  try {
    const res = await fetch(`${BASE_URL}/pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch recipes");
    }
    return await res.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch recipes");
  }
};

const approveRecipe = async (recipeId, approve) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/${recipeId}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approve }),
    });

    return await res.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update recipe approval.");
  }
};


export {
    index,
    show,
    create,
    deleteRecipe,
    updateRecipe,
    createComment,
    deleteComment,
    updateComment,
    showUserRecipes,
    saveRecipe,
    savedRecipes,
    pendingRecipes, 
    approveRecipe, 
}