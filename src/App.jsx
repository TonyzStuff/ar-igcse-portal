import React, { useState, useEffect, useRef } from 'react';

const BRAND = { name: 'AR Study Hub', owner: 'Anthony Remon', primaryHex: '#6C63FF', logoText: 'AR' };
const POMODORO = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('ar_dark') === '1');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('ar_dark', dark ? '1' : '0');
  }, [dark]);

  const [subjects, setSubjects] = useState(() => JSON.parse(localStorage.getItem('ar_subjects') || '[]'));
  const [subjectName, setSubjectName] = useState('');
  const [flashcards, setFlashcards] = useState(() => JSON.parse(localStorage.getItem('ar_flashcards') || '{}'));
  const [notes, setNotes] = useState(() => localStorage.getItem('ar_notes') || '');
  const [exams, setExams] = useState(() => JSON.parse(localStorage.getItem('ar_exams') || '[]'));

  useEffect(() => localStorage.setItem('ar_subjects', JSON.stringify(subjects)), [subjects]);
  useEffect(() => localStorage.setItem('ar_flashcards', JSON.stringify(flashcards)), [flashcards]);
  useEffect(() => localStorage.setItem('ar_notes', notes), [notes]);
  useEffect(() => localStorage.setItem('ar_exams', JSON.stringify(exams)), [exams]);

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [label, setLabel] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            alert("Time's up!");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  function startTimer(sec, lbl) {
    setTimer(sec);
    setLabel(lbl);
    setIsRunning(true);
  }

  function addSubject() {
    if (!subjectName.trim()) return;
    setSubjects((s) => [...s, { id: Date.now(), name: subjectName.trim(), done: false }]);
    setSubjectName('');
  }
  function toggleSubject(id) {
    setSubjects((s) => s.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }
  function removeSubject(id) {
    setSubjects((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 shadow" style={{ background: `linear-gradient(90deg, ${BRAND.primaryHex}, #3b82f6)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-violet-700 flex items-center justify-center font-bold">
              {BRAND.logoText}
            </div>
            <div>
              <h1 className="font-bold text-lg">{BRAND.name}</h1>
              <div className="text-sm opacity-80">{BRAND.owner} • IGCSE Portal</div>
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark
          </label>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subjects */}
        <section className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Subjects</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="flex-1 border rounded px-2 py-1 bg-transparent"
              placeholder="Add subject (e.g., Maths)"
            />
            <button className="px-3 py-1 bg-violet-600 text-white rounded" onClick={addSubject}>
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {subjects.map((s) => (
              <li key={s.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => toggleSubject(s.id)}
                    className="mr-2"
                  />
                  {s.name}
                </div>
                <button className="text-red-500" onClick={() => removeSubject(s.id)}>
                  Delete
                </button>
              </li>
            ))}
            {subjects.length === 0 && <li className="opacity-60">No subjects yet.</li>}
          </ul>
        </section>

        {/* Timers */}
        <section className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Timer</h2>
          <div className="text-center mb-3">
            <div className="text-4xl font-mono">{formatTime(timer)}</div>
            <div className="text-sm opacity-80">{label || 'No active timer'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="px-2 py-2 bg-indigo-600 text-white rounded"
              onClick={() => startTimer(30 * 60, '30-min Exam')}
            >
              30 min
            </button>
            <button
              className="px-2 py-2 bg-indigo-600 text-white rounded"
              onClick={() => startTimer(60 * 60, '60-min Exam')}
            >
              60 min
            </button>
          </div>
        </section>

        {/* Notes */}
        <section className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Notes</h2>
          <textarea
            className="w-full h-40 p-2 rounded border bg-transparent"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write notes, formulas..."
          ></textarea>
        </section>
      </main>

      <footer className="text-center p-4 text-sm opacity-80">
        Made with ❤️ • AR Branding — Anthony Remon
      </footer>
    </div>
  );
}
