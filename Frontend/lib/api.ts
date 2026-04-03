const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  register: async (name: string, email: string, password: string, role: string, department: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, department })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return await response.json();
  }
};

// Courses API
export const coursesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/courses`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to fetch courses');
    }

    return await response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }

    return await response.json();
  },

  create: async (courseData: any) => {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create course');
    }

    return await response.json();
  },

  update: async (id: string, courseData: any) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });

    if (!response.ok) {
      throw new Error('Failed to update course');
    }

    return await response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete course');
    }

    return await response.json();
  },

  enroll: async (id: string, password: string) => {
    const response = await fetch(`${API_URL}/courses/${id}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Enrollment failed');
    }

    return data;
  },

  unenroll: async (id: string) => {
    const response = await fetch(`${API_URL}/courses/${id}/unenroll`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to unenroll from course');
    }

    return await response.json();
  },

  getByTeacher: async (teacherId: string) => {
    const response = await fetch(`${API_URL}/courses/teacher/${teacherId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teacher courses');
    }

    return await response.json();
  }
};

// Timetable API
export const timetableAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/timetable`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch timetable');
    }

    return await response.json();
  },

  getByCourse: async (courseId: string) => {
    const response = await fetch(`${API_URL}/timetable/course/${courseId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course timetable');
    }

    return await response.json();
  },

  getByTeacher: async (teacherId: string) => {
    const response = await fetch(`${API_URL}/timetable/teacher/${teacherId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teacher timetable');
    }

    return await response.json();
  },

  create: async (timetableData: any) => {
    const response = await fetch(`${API_URL}/timetable`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(timetableData)
    });

    if (!response.ok) {
      throw new Error('Failed to create timetable entry');
    }

    return await response.json();
  },

  update: async (id: string, timetableData: any) => {
    const response = await fetch(`${API_URL}/timetable/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(timetableData)
    });

    if (!response.ok) {
      throw new Error('Failed to update timetable entry');
    }

    return await response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/timetable/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete timetable entry');
    }

    return await response.json();
  }
};

// Notices API
export const noticesAPI = {
  getAll: async (department?: string) => {
    const url = department
      ? `${API_URL}/notices?department=${department}`
      : `${API_URL}/notices`;

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to fetch notices');
    }

    return await response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/notices/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notice');
    }

    return await response.json();
  },

  create: async (noticeData: any) => {
    const response = await fetch(`${API_URL}/notices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noticeData)
    });

    if (!response.ok) {
      throw new Error('Failed to create notice');
    }

    return await response.json();
  },

  update: async (id: string, noticeData: any) => {
    const response = await fetch(`${API_URL}/notices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(noticeData)
    });

    if (!response.ok) {
      throw new Error('Failed to update notice');
    }

    return await response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/notices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete notice');
    }

    return await response.json();
  },

  getByDepartment: async (department: string) => {
    const response = await fetch(`${API_URL}/notices/department/${department}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch department notices');
    }

    return await response.json();
  }
};
