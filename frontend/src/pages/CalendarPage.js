import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/events/approved');
      setEvents(data);
    } catch { toast.error('Failed to load events'); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeMonth = (dir) => {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setMonth(m); setYear(y);
  };

  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const monthEvents = events.filter(e => {
    const d = new Date(e.dateTime);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const getEventsForDay = (d) =>
    events.filter(e => {
      const dt = new Date(e.dateTime);
      return dt.getFullYear() === year && dt.getMonth() === month && dt.getDate() === d;
    });

  const label = new Date(year, month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Event Calendar</div>
          <div className="page-sub">Browse approved events by date</div>
        </div>
      </div>
      <div className="page-content">
        <div className="calendar-wrap">
          <div className="cal-header">
            <button className="btn btn-sm" onClick={() => changeMonth(-1)}>‹ Prev</button>
            <div className="cal-month">{label}</div>
            <button className="btn btn-sm" onClick={() => changeMonth(1)}>Next ›</button>
          </div>
          <div className="cal-grid">
            {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
            {Array.from({ length: first }, (_, i) => (
              <div key={`p${i}`} className="cal-day other-month">{daysInPrev - first + 1 + i}</div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1;
              const dayEvts = getEventsForDay(d);
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
              return (
                <div key={d} className={`cal-day${dayEvts.length ? ' has-event' : ''}${isToday ? ' today' : ''}`}
                  onClick={() => dayEvts.length && setSelected(dayEvts[0])}>
                  {d}
                  {dayEvts.slice(0, 2).map(e => (
                    <div key={e._id} className="cal-event-label">{e.name}</div>
                  ))}
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, 42 - first - daysInMonth) }, (_, i) => (
              <div key={`n${i}`} className="cal-day other-month">{i + 1}</div>
            ))}
          </div>
        </div>

        <div className="section-header">
          <div className="section-title">Events in {label} ({monthEvents.length})</div>
        </div>
        {monthEvents.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-text">No events this month</div></div>
        ) : (
          <div className="events-grid">
            {monthEvents.map(e => <EventCard key={e._id} event={e} onCardClick={setSelected} />)}
          </div>
        )}
      </div>
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
