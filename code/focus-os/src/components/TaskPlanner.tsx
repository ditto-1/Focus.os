import React, { useState } from 'react';
import { Plus, Trash2, Check, Sparkles, Clock, AlertCircle, Play, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { TaskItem, Subtask } from '../types';
import { playMechanicalClick, playQuestComplete, playChiptuneBeep } from '../utils/audio';

interface TaskPlannerProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddTask: (
    title: string,
    priority: 'urgent' | 'high' | 'normal' | 'low',
    deadline: string,
    estimatedMinutes: number,
    staminaPoints: 1 | 2 | 3,
    category: 'academic' | 'project' | 'life' | 'wellness'
  ) => void;
  onDeleteTask: (id: string) => void;
  onBreakdownTask: (taskId: string) => Promise<void>;
  onStartFocusOnTask: (task: TaskItem) => void;
  soundEnabled: boolean;
  isBreakingDownId: string | null;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({
  tasks,
  onToggleTask,
  onToggleSubtask,
  onAddTask,
  onDeleteTask,
  onBreakdownTask,
  onStartFocusOnTask,
  soundEnabled,
  isBreakingDownId,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'normal' | 'low'>('high');
  const [newDeadline, setNewDeadline] = useState('Tomorrow');
  const [newMinutes, setNewMinutes] = useState<number>(30);
  const [newSP, setNewSP] = useState<1 | 2 | 3>(2);
  const [newCategory, setNewCategory] = useState<'academic' | 'project' | 'life' | 'wellness'>('academic');

  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (taskId: string) => {
    playMechanicalClick(soundEnabled);
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    playMechanicalClick(soundEnabled);
    onAddTask(newTitle.trim(), newPriority, newDeadline, newMinutes, newSP, newCategory);
    setNewTitle('');
    playChiptuneBeep(659, soundEnabled);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Quick Task Capture Form (Proposal Section 4.1 & 10) */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 sm:p-5 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
          <span className="font-mono text-xs sm:text-sm font-bold uppercase text-[#2D3142]">
            CAPTURE NEW RESPONSIBILITY
          </span>
          <span className="font-mono text-[10px] text-[#2D3142]/70">
            MINIMAL INPUT FRICTION
          </span>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="planner-new-task-input"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Complete Software Engineering project or Read DBMS chapter"
              className="flex-1 px-3 py-2 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-sm text-[#2D3142] pixel-inset focus:outline-none"
            />
            <button
              type="submit"
              id="planner-add-task-btn"
              className="pixel-btn flex items-center justify-center gap-1.5 px-4 py-2 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>LOG TASK</span>
            </button>
          </div>

          {/* Details Row: Priority, Deadline, Estimated Duration, Category */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {/* Priority */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#2D3142] mb-1">
                PRIORITY:
              </label>
              <select
                id="task-priority-select"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-2 py-1 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-inset-soft"
              >
                <option value="urgent">URGENT</option>
                <option value="high">HIGH</option>
                <option value="normal">NORMAL</option>
                <option value="low">LOW</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#2D3142] mb-1">
                DEADLINE:
              </label>
              <input
                id="task-deadline-input"
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                placeholder="e.g. Tomorrow 5 PM"
                className="w-full px-2 py-1 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-xs text-[#2D3142] pixel-inset-soft"
              >
              </input>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#2D3142] mb-1">
                EST. MINUTES:
              </label>
              <select
                id="task-duration-select"
                value={newMinutes}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setNewMinutes(m);
                  setNewSP(m <= 15 ? 1 : m <= 40 ? 2 : 3);
                }}
                className="w-full px-2 py-1 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-inset-soft"
              >
                <option value={10}>10 mins (1 SP)</option>
                <option value={20}>20 mins (1 SP)</option>
                <option value={30}>30 mins (2 SP)</option>
                <option value={45}>45 mins (2 SP)</option>
                <option value={60}>60 mins (3 SP)</option>
                <option value={90}>90 mins (3 SP)</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#2D3142] mb-1">
                CATEGORY:
              </label>
              <select
                id="task-category-select"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-2 py-1 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-inset-soft uppercase"
              >
                <option value="academic">ACADEMIC</option>
                <option value="project">PROJECT</option>
                <option value="life">LIFE / ADMIN</option>
                <option value="wellness">WELLNESS</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Task List Matrix */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 sm:p-5 pixel-shadow">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2D3142] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-bold uppercase text-[#2D3142]">
              ADAPTIVE TASK MATRIX ({filteredTasks.length})
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 select-none">
            {(['active', 'completed', 'all'] as const).map((f) => (
              <button
                key={f}
                id={`task-filter-pill-${f}`}
                onClick={() => {
                  playMechanicalClick(soundEnabled);
                  setFilter(f);
                }}
                className={`pixel-btn px-2.5 py-0.5 border-2 border-[#2D3142] font-mono text-[11px] font-bold uppercase ${
                  filter === f
                    ? 'bg-[#7FB685] text-[#2D3142] pixel-shadow-sm'
                    : 'bg-[#F2EFE9] text-[#2D3142]/70'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Task Items */}
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-[#F2EFE9] border-2 border-dashed border-[#2D3142]">
            <p className="font-mono text-xs font-bold text-[#2D3142]">
              NO TASKS MATCH THIS FILTER.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isExpanded = expandedTasks[task.id] ?? task.subtasks.length > 0;
              const isDecomposing = isBreakingDownId === task.id;
              const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  className={`border-2 border-[#2D3142] transition-colors ${
                    task.completed
                      ? 'bg-[#E4DFD5]/60 opacity-80'
                      : 'bg-[#F2EFE9] pixel-shadow-sm hover:bg-[#FAF8FF]'
                  }`}
                >
                  {/* Task Card Header Row */}
                  <div className="p-3 sm:p-4 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        id={`task-check-${task.id}`}
                        onClick={() => {
                          if (!task.completed) {
                            playQuestComplete(soundEnabled);
                          } else {
                            playMechanicalClick(soundEnabled);
                          }
                          onToggleTask(task.id);
                        }}
                        className="pixel-btn w-6 h-6 mt-0.5 border-2 border-[#2D3142] bg-[#FAF8F5] flex items-center justify-center shrink-0 pixel-shadow-sm"
                      >
                        {task.completed && <Check className="w-4 h-4 text-[#35693F] stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {/* Priority Badge */}
                          <span
                            className={`font-mono text-[9px] font-bold px-1.5 py-0.2 border border-[#2D3142] uppercase ${
                              task.priority === 'urgent'
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : task.priority === 'high'
                                ? 'bg-[#F4A261] text-[#2D3142]'
                                : 'bg-[#CADBFB] text-[#2D3142]'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Category */}
                          <span className="font-mono text-[9px] px-1 py-0.2 border border-[#2D3142] bg-[#FAF8F5] text-[#2D3142] uppercase">
                            {task.category}
                          </span>

                          {/* Deadline */}
                          <span className="font-mono text-[10px] text-[#2D3142]/80 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.deadline}</span>
                          </span>

                          <span className="font-mono text-[10px] text-[#2D3142]/70">
                            • ~{task.estimatedMinutes}m • +{task.staminaPoints} SP
                          </span>
                        </div>

                        <h3
                          className={`font-mono text-sm sm:text-base font-bold text-[#2D3142] break-words ${
                            task.completed ? 'line-through text-[#2D3142]/60' : ''
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.notes && (
                          <p className="font-sans text-xs text-[#2D3142]/80 mt-1">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Launch into Focus Mode */}
                      {!task.completed && (
                        <button
                          id={`start-focus-task-${task.id}`}
                          onClick={() => {
                            playMechanicalClick(soundEnabled);
                            onStartFocusOnTask(task);
                          }}
                          title="Start focus timer on this task"
                          className="pixel-btn px-2.5 py-1 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span className="hidden sm:inline">FOCUS</span>
                        </button>
                      )}

                      {/* AI Task Decomposition Button */}
                      {!task.completed && (
                        <button
                          id={`breakdown-task-${task.id}`}
                          onClick={() => {
                            playMechanicalClick(soundEnabled);
                            onBreakdownTask(task.id);
                          }}
                          disabled={isDecomposing}
                          title="Decompose into small actionable micro-steps"
                          className="pixel-btn px-2 py-1 bg-[#FAF8F5] hover:bg-[#CADBFB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] flex items-center gap-1"
                        >
                          {isDecomposing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7FB685]" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
                          )}
                          <span className="hidden md:inline">
                            {task.subtasks.length > 0 ? 'RE-BREAK' : 'BREAK DOWN'}
                          </span>
                        </button>
                      )}

                      {/* Expand / Collapse Subtasks */}
                      {task.subtasks.length > 0 && (
                        <button
                          id={`expand-subtasks-${task.id}`}
                          onClick={() => toggleExpand(task.id)}
                          className="pixel-btn p-1 bg-[#FAF8F5] border border-[#2D3142] text-[#2D3142]"
                          title="Toggle subtasks"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        id={`delete-task-${task.id}`}
                        onClick={() => {
                          playMechanicalClick(soundEnabled);
                          onDeleteTask(task.id);
                        }}
                        title="Delete task"
                        className="pixel-btn p-1 text-[#2D3142]/60 hover:text-[#BA1A1A] hover:bg-[#FAF8F5] border border-transparent hover:border-[#2D3142]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtasks Accordion Panel */}
                  {isExpanded && task.subtasks.length > 0 && (
                    <div className="border-t-2 border-[#2D3142] bg-[#FAF8F5] p-3 space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold text-[#2D3142]/80 uppercase mb-1">
                        <span>ACTIONABLE MICRO-STEPS ({completedSubtasks}/{task.subtasks.length} COMPLETE):</span>
                        <span>REDUCES INITIATION PARALYSIS</span>
                      </div>

                      {task.subtasks.map((sub) => (
                        <div
                          key={sub.id}
                          className={`flex items-center justify-between p-2 border border-[#2D3142] ${
                            sub.completed ? 'bg-[#E4DFD5]/40 opacity-75' : 'bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              id={`subtask-check-${sub.id}`}
                              onClick={() => {
                                if (!sub.completed) playQuestComplete(soundEnabled);
                                else playMechanicalClick(soundEnabled);
                                onToggleSubtask(task.id, sub.id);
                              }}
                              className="pixel-btn w-4 h-4 border border-[#2D3142] bg-[#FAF8F5] flex items-center justify-center shrink-0"
                            >
                              {sub.completed && <Check className="w-3 h-3 text-[#35693F]" />}
                            </button>
                            <span
                              className={`font-sans text-xs text-[#2D3142] ${
                                sub.completed ? 'line-through text-[#2D3142]/60' : ''
                              }`}
                            >
                              {sub.title}
                            </span>
                          </div>

                          <span className="font-mono text-[10px] text-[#2D3142]/70 shrink-0">
                            ~{sub.estimatedMinutes}m • {sub.staminaPoints} SP
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
