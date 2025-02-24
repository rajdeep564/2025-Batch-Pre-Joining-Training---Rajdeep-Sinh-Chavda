import { useState } from 'react';

interface AddTaskProps {
  addTask: (title: string, description: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ addTask }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTask(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form className='bg-white shadow-md p-6 rounded-lg w-full max-w-md mb-6' onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a New Task</h2>
      <input 
        type="text" 
        placeholder="Task Title"
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="w-full px-4 py-2 mb-3 border rounded focus:ring focus:ring-blue-200"
        required
      />
      <input 
        type="text" 
        placeholder="Task Description"
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="w-full px-4 py-2 mb-3 border rounded focus:ring focus:ring-blue-200"
        required
      />
      <button type="submit" className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>Add Task</button>
    </form>
  );
};

export default AddTask;
