import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import 'react-calendar/dist/Calendar.css';
import './PlannerPage.css';

const PlannerPage = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [routineInput, setRoutineInput] = useState('');
  const [routineTasks, setRoutineTasks] = useState([]);
  const [dailyCompletions, setDailyCompletions] = useState({});
  
  // --- THIS IS THE MISSING LINE ---
  const [isRoutineManagerOpen, setIsRoutineManagerOpen] = useState(false);

  // Fetch all planner data from the backend on load
  useEffect(() => {
    const fetchPlannerData = async () => {
      if (user) {
        try {
          const res = await api.get('/planner');
          setRoutineTasks(res.data.routineTasks || []);
          setDailyCompletions(res.data.dailyCompletions || {});
        } catch (err) {
          console.error("Failed to fetch planner data", err);
        }
      }
    };
    fetchPlannerData();
  }, [user]);

  // Send the new task to the backend
  const addRoutineTask = async (e) => {
    e.preventDefault();
    if (!routineInput.trim()) return;
    try {
      const res = await api.post('/planner/routine', { text: routineInput });
      setRoutineTasks(res.data);
      setRoutineInput('');
    } catch (err) {
      console.error("Failed to add routine task", err);
    }
  };

  // Tell the backend to delete this task
  const deleteRoutineTask = async (taskId) => {
    try {
      const res = await api.delete(`/planner/routine/${taskId}`);
      setRoutineTasks(res.data);
    } catch (err) {
      console.error("Failed to delete routine task", err);
    }
  };

  // Send the updated completion list for this day to the backend
  const toggleDailyTask = async (taskId) => {
    const dateKey = date.toISOString().split('T')[0];
    const completionsForDay = dailyCompletions[dateKey] || [];
    let updatedCompletions;

    if (completionsForDay.includes(taskId)) {
      updatedCompletions = completionsForDay.filter(id => id !== taskId);
    } else {
      updatedCompletions = [...completionsForDay, taskId];
    }
    
    try {
      const res = await api.put('/planner/completions', {
        dateKey,
        completedIds: updatedCompletions,
      });
      setDailyCompletions(res.data);
    } catch (err) {
      console.error("Failed to update completions", err);
    }
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month' || routineTasks.length === 0) return null;
    const dateKey = date.toISOString().split('T')[0];
    const todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);
    const completionsForDay = dailyCompletions[dateKey] || [];
    if (completionsForDay.length === routineTasks.length) return 'day-all-complete';
    if (date < todaysDate && completionsForDay.length < routineTasks.length) return 'day-missed';
    return null;
  };

  const completedTasksForSelectedDay = dailyCompletions[date.toISOString().split('T')[0]] || [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isPastDate = date < today;

  return (
    <div className="planner-container">
      <button className="manage-routine-btn" onClick={() => setIsRoutineManagerOpen(true)}>Manage Daily Routine</button>
      <div className={`routine-manager-wrapper ${isRoutineManagerOpen ? 'active' : ''}`}>
        <button className="close-routine-btn" onClick={() => setIsRoutineManagerOpen(false)}>✕</button>
        <h2>My Daily Routine</h2>
        <p>Add the tasks you want to do every day.</p>
        <form onSubmit={addRoutineTask} className="add-routine-form">
          <input type="text" value={routineInput} onChange={e => setRoutineInput(e.target.value)} placeholder="e.g., Revise Chemistry notes" />
          <button type="submit">Add</button>
        </form>
        <ul className="routine-list">
          {routineTasks.map(task => ( <li key={task.id}> <span>{task.text}</span> <button onClick={() => deleteRoutineTask(task.id)} className="delete-btn">✕</button> </li> ))}
        </ul>
      </div>
      <div className="daily-tracker-wrapper">
        <div className="calendar-wrapper">
          <Calendar onChange={setDate} value={date} tileClassName={getTileClassName} />
        </div>
        <div className="tasks-wrapper">
          <h2>Checklist for {date.toLocaleDateString()}</h2>
          {isPastDate ? (
            <div className="past-day-summary"><p>On this day, you completed {completedTasksForSelectedDay.length} of your currently set {routineTasks.length} tasks.</p></div>
          ) : (
            <ul className="daily-task-list">
              {routineTasks.length > 0 ? ( routineTasks.map(task => ( <li key={task.id}> <label className={completedTasksForSelectedDay.includes(task.id) ? 'completed' : ''}> <input type="checkbox" checked={completedTasksForSelectedDay.includes(task.id)} onChange={() => toggleDailyTask(task.id)} /> {task.text} </label> </li> )) ) : ( <p className="no-tasks">Add tasks to your daily routine to get started.</p> )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;