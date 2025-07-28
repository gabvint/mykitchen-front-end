const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const user = JSON.parse(atob(token.split('.')[1]));
  return user;
};

const signup = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    localStorage.setItem('token', json.token);
    return json;
  } catch (err) {
    throw new Error(err);
  }
};

const signin = async (user) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    if (json.token) {
      localStorage.setItem('token', json.token);
      const user = JSON.parse(atob(json.token.split('.')[1]));
      return user;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const changepassword = async (formData, userId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/${userId}/change-password`, {
      method: 'POST',
       headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    localStorage.removeItem('token');
    return json;
  } catch (err) {
    throw new Error(err);
  }
};


const forgotPasswordRequest = async (email) => {
  try {

    const res = await fetch(`${BACKEND_URL}/users/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json; 
  } catch (error) {
    throw new Error(error);
  }
};

const forgotPasswordValidate = async (email, securityAnswer1, securityAnswer2) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/forgot-password/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, securityAnswer1, securityAnswer2 }),
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }

  } catch (error) {
    throw new Error(error);
  }
};

const forgotPasswordChange = async (email, newPassword, confirmPassword) => {
  try {
    const res = await fetch (`${BACKEND_URL}/users/forgot-password/change-pw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword, confirmPassword }),
    });
    const json = await res.json();

    if (json.error) {
      throw new Error(json.error);  
    }
  } catch (error) {
    throw new Error(error);
  }
}; 

 
const getUserProfile = async () => {
  try {
    const token =  localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${BACKEND_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch user info');
  }
  return json;
  } catch (error) {
    throw new Error(error); 
  }
}

const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${BACKEND_URL}/users/edit-profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to update profile');
    }
    return json;
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

const deleteAccount = async (password, securityAnswer1, securityAnswer2) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BACKEND_URL}/users/delete-account`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ password, securityAnswer1, securityAnswer2 }),
  });
   const json = await res.json();
   return json;
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile');
  }
}

// used for delete account
const getSecurityQuestionsByEmail = async (email) => {
  try {
    // will reuse a route for this 
    const res = await fetch(`${BACKEND_URL}/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(error.message || 'Error fetching questions');
  }
  
};

export const fetchLogs = async ({ userId = "", action = "", status = "", limit = 100, skip = 0 }) => {
  try {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ userId, action, status, limit, skip });
    const res = await fetch(`${BACKEND_URL}/users/logs?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    const json = await res.json();
    return json;
  } catch (error) {
     throw new Error(error.error || "Error fetching logs");
  }
};


// admin usage
const getAllUsers = async() => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BACKEND_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json; 
  } catch (error) {
    throw new Error(error.error || "Failed to fetch users.");
  }
}

 const changeUserRole = async (userId, newRole, adminPassword) => {

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BACKEND_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole, adminPassword }),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(error.error || "Failed to update role.");
  }

};
const signout = () => {
  localStorage.removeItem('token');
};

export { 
  signup, 
  signin, 
  getUser, 
  signout, 
  changepassword,
  forgotPasswordRequest,
  forgotPasswordValidate, 
  forgotPasswordChange, 
  getUserProfile,
  updateProfile,
  deleteAccount,
  getSecurityQuestionsByEmail,
  getAllUsers,
  changeUserRole,
};
