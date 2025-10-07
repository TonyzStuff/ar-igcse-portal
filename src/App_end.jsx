            {subjects.length===0 && <li className='opacity-60'>No subjects yet.</li>}
          </ul>

          <hr className='my-3' />
          <h3 className='font-semibold'>Flashcards</h3>
          {fcSubject ? <FlashcardEditor subjectId={fcSubject} flashcards={flashcards[fcSubject]||[]} addFlashcard={addFlashcard} removeFlashcard={removeFlashcard} /> : <div className='opacity-70 text-sm'>Choose a subject to edit flashcards.</div>}
        </section>

        <section className='col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow'>
          <h2 className='font-bold mb-2'>Timers & Pomodoro</h2>
          <div className='text-center mb-3'>
            <div className='text-4xl font-mono'>{formatTime(timer)}</div>
            <div className='text-sm opacity-80'>{label || 'No active timer'}</div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <button className='px-2 py-2 bg-indigo-600 text-white rounded' onClick={()=>startTimerSeconds(30*60,'30-min Exam')}>30 min</button>
            <button className='px-2 py-2 bg-indigo-600 text-white rounded' onClick={()=>startTimerSeconds(60*60,'60-min Exam')}>60 min</button>
            <button className='px-2 py-2 bg-indigo-600 text-white rounded' onClick={()=>startTimerSeconds(90*60,'90-min Exam')}>90 min</button>
            <button className='px-2 py-2 bg-indigo-600 text-white rounded' onClick={()=>startTimerSeconds(120*60,'120-min Exam')}>120 min</button>
            <button className='col-span-2 px-2 py-2 bg-amber-400 rounded' onClick={()=>{ const mins = prompt('Enter minutes'); const m = parseInt(mins); if(m>0) startTimerSeconds(m*60, `${m}-min`); }}>Custom</button>
          </div>
          <div className='flex gap-2 mt-3'>
            {!isRunning ? <button className='px-3 py-1 bg-green-600 text-white rounded' onClick={resumeTimer}>Start</button> : <button className='px-3 py-1 bg-yellow-400 rounded' onClick={pauseTimer}>Pause</button>}
            <button className='px-3 py-1 bg-gray-200 rounded' onClick={resetTimer}>Reset</button>
          </div>

          <hr className='my-3' />
          <h3 className='font-semibold'>Pomodoro</h3>
          <div className='flex gap-2 mt-2'>
            <button className='px-3 py-1 bg-violet-600 text-white rounded' onClick={()=>startTimerSeconds(POMODORO.work,'Work')}>Work</button>
            <button className='px-3 py-1 bg-gray-200 rounded' onClick={()=>startTimerSeconds(POMODORO.short,'Short')}>Short</button>
            <button className='px-3 py-1 bg-gray-200 rounded' onClick={()=>startTimerSeconds(POMODORO.long,'Long')}>Long</button>
          </div>

          <hr className='my-3' />
          <h3 className='font-semibold'>Stopwatch</h3>
          <div className='text-2xl font-mono mb-2'>{formatTime(stopwatch)}</div>
          <div className='flex gap-2'>
            {!isStopwatchRunning ? <button className='px-3 py-1 bg-green-600 text-white rounded' onClick={()=>setIsStopwatchRunning(true)}>Start</button> : <button className='px-3 py-1 bg-yellow-400 rounded' onClick={()=>setIsStopwatchRunning(false)}>Pause</button>}
            <button className='px-3 py-1 bg-gray-200 rounded' onClick={()=>{ setIsStopwatchRunning(false); setStopwatch(0); }}>Reset</button>
          </div>
        </section>

        <section className='col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow'>
          <h2 className='font-bold mb-2'>Notes & Exam Planner</h2>
          <textarea className='w-full h-40 p-2 rounded border bg-transparent' value={notes} onChange={e=>setNotes(e.target.value)} placeholder='Write notes, formulas...'></textarea>
          <div className='flex gap-2 mt-2'>
            <button className='px-3 py-1 bg-blue-600 text-white rounded' onClick={()=>{ navigator.clipboard.writeText(notes); alert('Copied'); }}>Copy</button>
            <button className='px-3 py-1 bg-green-600 text-white rounded' onClick={()=>{ const blob=new Blob([notes],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='notes.txt'; a.click(); URL.revokeObjectURL(url); }}>Download</button>
          </div>

          <hr className='my-3' />
          <h3 className='font-semibold'>Add Exam</h3>
          <form onSubmit={addExam} className='flex flex-col gap-2'>
            <input name='subj' placeholder='Subject' className='p-2 rounded border bg-transparent' />
            <input name='date' type='date' className='p-2 rounded border bg-transparent' />
            <input name='dur' placeholder='Duration (minutes)' className='p-2 rounded border bg-transparent' defaultValue='60' />
            <button className='px-3 py-1 bg-indigo-600 text-white rounded'>Add Exam</button>
          </form>

          <div className='mt-3'>
            <h4 className='font-semibold'>Upcoming Exams</h4>
            <ul className='space-y-2 mt-2'>
              {exams.length===0 && <li className='opacity-60'>No exams scheduled.</li>}
              {exams.map(e=> (
                <li key={e.id} className='flex items-center justify-between'>
                  <div>
                    <div className='font-semibold'>{e.subj}</div>
                    <div className='text-sm opacity-80'>{e.date} • {e.dur} min</div>
                  </div>
                  <div className='flex gap-2'>
                    <button className='text-green-500' onClick={()=> setExams(x=> x.map(z=> z.id===e.id? {...z, done: !z.done}: z))}>{e.done? 'Undone':'Done'}</button>
                    <button className='text-red-500' onClick={()=> setExams(x=> x.filter(z=> z.id!==e.id))}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className='col-span-3 bg-white dark:bg-gray-800 p-4 rounded shadow'>
          <h2 className='font-bold'>Flashcard Study Mode</h2>
          <div className='flex gap-2 mb-3'>
            <select className='p-2 rounded bg-transparent' value={fcSubject||''} onChange={e=> setFcSubject(e.target.value? Number(e.target.value): null)}>
              <option value=''>Select subject</option>
              {subjects.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className='px-3 py-1 bg-indigo-600 text-white rounded' onClick={()=>{ setFcIndex(0); setFcShowAnswer(false); }}>Reset</button>
          </div>
          {fcSubject ? (
            (flashcards[fcSubject]||[]).length===0 ? <div className='opacity-70'>No flashcards yet.</div> : (
              <FlashcardViewer arr={flashcards[fcSubject]} idx={fcIndex} show={fcShowAnswer} onNext={()=> setFcIndex(i=> (i+1) % flashcards[fcSubject].length)} onPrev={()=> setFcIndex(i=> (i-1 + flashcards[fcSubject].length) % flashcards[fcSubject].length)} toggleShow={()=> setFcShowAnswer(s=>!s)} />
            )
          ) : <div className='opacity-70'>Pick a subject to start studying.</div>}
        </section>

      </main>

      <footer className='text-center p-4 text-sm opacity-80'>Made with ❤️ • AR Branding — Anthony Remon</footer>
    </div>
  );
}

// Flashcard editor component
function FlashcardEditor({ subjectId, flashcards, addFlashcard, removeFlashcard }){
  const [q, setQ] = useState(''); const [a, setA] = useState('');
  return (
    <div>
      <div className='flex gap-2'>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Question' className='flex-1 p-2 rounded border bg-transparent' />
        <input value={a} onChange={e=>setA(e.target.value)} placeholder='Answer' className='flex-1 p-2 rounded border bg-transparent' />
        <button className='px-3 py-1 bg-green-600 text-white rounded' onClick={()=>{ addFlashcard(subjectId, q, a); setQ(''); setA(''); }}>Add</button>
      </div>
      <div className='mt-3 space-y-2'>
        {(flashcards||[]).map(fc=> (
          <div key={fc.id} className='flex items-center justify-between p-2 border rounded'>
            <div><div className='font-semibold text-sm'>{fc.q}</div><div className='text-sm opacity-80'>{fc.a}</div></div>
            <button className='text-red-500' onClick={()=> removeFlashcard(subjectId, fc.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashcardViewer({ arr, idx, show, onNext, onPrev, toggleShow }){
  return (
    <div className='p-4 border rounded'>
      <div className='text-lg font-semibold'>Q: {arr[idx].q}</div>
      {show && <div className='mt-2 text-green-400'>A: {arr[idx].a}</div>}
      <div className='flex gap-2 mt-4'>
        <button className='px-3 py-1 bg-yellow-400 rounded' onClick={toggleShow}>{show? 'Hide':'Show'} Answer</button>
        <button className='px-3 py-1 bg-gray-200 rounded' onClick={onPrev}>Prev</button>
        <button className='px-3 py-1 bg-gray-200 rounded' onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
