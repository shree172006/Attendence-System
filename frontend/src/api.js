const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
async function request(path, options = {}) { const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options }); if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.message || `Request failed (${response.status})`); } return response.status === 204 ? null : response.json(); }
export const api = {
  batches: () => request('/api/batches'),
  addBatch: (batch) => request('/api/batches', { method: 'POST', body: JSON.stringify(batch) }),
  deleteBatch: (id) => request(`/api/batches/${id}`, { method: 'DELETE' }),
  students: () => request('/api/students'),
  addStudent: (student) => request('/api/students', { method: 'POST', body: JSON.stringify(student) }),
  updateStudent: (id, student) => request(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(student) }),
  deleteStudent: (id) => request(`/api/students/${id}`, { method: 'DELETE' }),
  attendance: (payload) => request('/api/attendance', { method: 'POST', body: JSON.stringify(payload) })
};
