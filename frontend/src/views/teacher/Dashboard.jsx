import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Users, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBatchStore } from '../../store/batchStore';
import { uniqueClasses, uniqueLectureTypes, studentData } from '../../data/students';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const batches = useBatchStore((state) => state.batches);
  const addBatch = useBatchStore((state) => state.addBatch);
  const deleteBatch = useBatchStore((state) => state.deleteBatch);
  const loadBatches = useBatchStore((state) => state.loadBatches);
  useEffect(() => { loadBatches().catch((error) => console.error(error)); }, [loadBatches]);

  const [showCreate, setShowCreate] = useState(false);
  const [newBatch, setNewBatch] = useState({ 
    name: '', 
    className: uniqueClasses[0] || '11th class', 
    lectureType: uniqueLectureTypes[0] || 'Maths/IT', 
    startTime: '', 
    endTime: '' 
  });

  const handleCreate = (e) => {
    e.preventDefault();
    // calculate enrolled based on selections
    const enrolledCount = studentData.filter(s => s.class === newBatch.className && s.subjects === newBatch.lectureType).length;
    addBatch({ ...newBatch, enrolled: enrolledCount }).catch((error) => alert(error.message));
    setShowCreate(false);
    setNewBatch({ 
      name: '', 
      className: uniqueClasses[0] || '11th class', 
      lectureType: uniqueLectureTypes[0] || 'Maths/IT', 
      startTime: '', 
      endTime: '' 
    });
  };

  return (
    <div>
      <div className="nav-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Instructor Dashboard</h1>
          <p>Teacher Portal</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Your Batches</h2>
        <button onClick={() => navigate("/teacher/students")} className="btn-outline" style={{marginRight:".5rem"}}>Manage students</button><button onClick={() => setShowCreate(true)} className="btn">
          <Plus size={20} /> Create New Batch
        </button>
      </div>

      <div className="grid-cols-2">
        {batches.map(batch => (
          <div key={batch.id} className="card" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn-outline" style={{ padding: '0.5rem', border: 'none' }} title="Edit"><Edit2 size={16} /></button>
              <button onClick={() => deleteBatch(batch.id)} className="btn-danger" style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', color: 'white', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', paddingRight: '4rem' }}>{batch.name}</h3>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {batch.startTime} - {batch.endTime}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} /> {batch.enrolled} Enrolled</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>{batch.className} ({batch.lectureType})</div>
            </div>

            <button onClick={() => navigate(`/teacher/class/${batch.id}`)} className="btn-outline" style={{ width: '100%', padding: '1rem', cursor: 'pointer', marginTop: '1rem' }}>
              Manage Attendance
            </button>
          </div>
        ))}
        {batches.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No batches created yet.</p>}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Batch</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Batch Name</label>
                <input type="text" value={newBatch.name} onChange={e => setNewBatch({...newBatch, name: e.target.value})} className="input-field" placeholder="e.g. Morning IT Batch" required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Class</label>
                  <select value={newBatch.className} onChange={e => setNewBatch({...newBatch, className: e.target.value})} className="input-field" required>
                    {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Lecture Type</label>
                  <select value={newBatch.lectureType} onChange={e => setNewBatch({...newBatch, lectureType: e.target.value})} className="input-field" required>
                    {uniqueLectureTypes.map(lt => <option key={lt} value={lt}>{lt}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Start Time</label>
                  <input type="time" value={newBatch.startTime} onChange={e => setNewBatch({...newBatch, startTime: e.target.value})} className="input-field" required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>End Time</label>
                  <input type="time" value={newBatch.endTime} onChange={e => setNewBatch({...newBatch, endTime: e.target.value})} className="input-field" required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreate(false)} className="btn-outline" style={{ padding: '0.875rem 1.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn">Create Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


