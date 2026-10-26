import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Calendar as CalIcon, Clock, Award, X } from 'lucide-react';
import { getDaysInMonth, startOfMonth, getDay, format } from 'date-fns';

export default function StudentDashboard() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Dummy Data for UI Presentation
  const today = new Date(2026, 8, 24); // Sept 2026
  const dummyAttendance = {
    '2026-09-02': { status: 'present', in: '09:55 AM', out: '11:05 AM', lecture: 'Computer Science 101' },
    '2026-09-05': { status: 'absent', in: '-', out: '-', lecture: 'Computer Science 101' },
    '2026-09-09': { status: 'present', in: '10:02 AM', out: '11:00 AM', lecture: 'Computer Science 101' },
    '2026-09-12': { status: 'present', in: '09:58 AM', out: '11:15 AM', lecture: 'Computer Science 101' },
    '2026-09-16': { status: 'present', in: '09:50 AM', out: '11:00 AM', lecture: 'Computer Science 101' },
    '2026-09-19': { status: 'absent', in: '-', out: '-', lecture: 'Computer Science 101' },
  };

  const getDayStatus = (day) => {
    const dateStr = `2026-09-${day.toString().padStart(2, '0')}`;
    return dummyAttendance[dateStr];
  };

  const openDetails = (day) => {
    const data = getDayStatus(day);
    if(data) {
      setSelectedDate({ day, ...data });
    }
  };

  const daysInMonth = getDaysInMonth(today);
  const firstDay = getDay(startOfMonth(today));

  return (
    <div>
      <div className="nav-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Welcome, {user.name}</h1>
          <p>Student Portal • {user.email}</p>
        </div>
        <button onClick={logout} className="btn-outline" style={{ border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="grid-cols-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
              <Award size={32} />
            </div>
            <div>
              <h2>Overall Attendance</h2>
              <p>Excellent standing this semester</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'var(--bg-color)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>85%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Present</div>
            </div>
            <div style={{ width: '2px', height: '80px', background: 'var(--border)' }}></div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--danger)' }}>15%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Absent</div>
            </div>
          </div>
          
          <button onClick={() => setShowCalendar(true)} className="btn" style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.125rem' }}>
            <CalIcon size={20} /> Detailed Calendar Review
          </button>
        </div>
        
        {/* Recent Activity Card */}
        <div className="card">
           <h2 style={{ marginBottom: '1.5rem' }}>Recent Records</h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {Object.entries(dummyAttendance).slice(0,4).map(([date, data]) => (
               <div key={date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)' }}>
                 <div>
                   <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{format(new Date(date), 'MMMM d, yyyy')}</div>
                   <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <Clock size={14} /> {data.in} - {data.out}
                   </div>
                 </div>
                 <span className={`badge badge-${data.status}`}>{data.status}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {showCalendar && (
        <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>September 2026</h2>
              <button onClick={() => setShowCalendar(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={28} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            
            <div className="calendar-grid">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="calendar-day empty" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const statusData = getDayStatus(day);
                return (
                  <div key={day} onClick={() => openDetails(day)} className={`calendar-day ${statusData ? statusData.status : ''}`} title={statusData ? 'Click for details' : ''}>
                    {day}
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Click on a colored date to view exact entry & exit times.</p>
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Sept {selectedDate.day}, 2026</h2>
              <button onClick={() => setSelectedDate(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={28} /></button>
            </div>
            
            <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <span className={`badge badge-${selectedDate.status}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                {selectedDate.status}
              </span>
              
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 600 }}>{selectedDate.lecture}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Entered</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>{selectedDate.in}</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }}></div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Left</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>{selectedDate.out}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
