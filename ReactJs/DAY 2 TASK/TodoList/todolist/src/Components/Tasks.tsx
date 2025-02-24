import { useState } from "react";
import { Check } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
}

interface TaskProps {
  task: Task;
  deleteTask: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, deleteTask }) => {

  const [isCompleted,setIsCompleted] = useState(false);

  return (
    <div className='bg-white p-4 rounded-lg border border-gray-300'>
      <div className="flex gap-4">
      <h4 className='text-lg font-semibold text-gray-800'>{task.title}</h4>
      {isCompleted ? (<Check/>) : (null)}

      </div>
      
      <p className='text-gray-600'>{task.description}</p>
      
      <div className="flex align-middle gap-4 ">
        

      
      <button 
        className='mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer'
        onClick={() => deleteTask(task.id)}
      >
        Delete Task
      </button>
      <button 
        className='mt-2 px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition cursor-pointer'
        onClick={() => setIsCompleted(prev => !prev)}
      >
        Complete
      </button>
      </div>
    </div>
  );
};

export default Task;
