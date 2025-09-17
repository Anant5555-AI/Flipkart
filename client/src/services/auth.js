import API from '../api/axios';

// Helper function to get token from localStorage
const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    const { user, token } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
    }
    
    return {
      data: {
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          role: user?.role
        },
        token: token
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const { data } = await API.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const { data } = await API.get('/auth/me');
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear it
      localStorage.removeItem('token');
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    await API.get('/auth/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear the token on logout
    localStorage.removeItem('token');
    return true;
  }
};