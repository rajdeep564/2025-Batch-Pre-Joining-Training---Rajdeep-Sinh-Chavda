import { useState } from "react";
import "./App.css";
import TaskList from "./Components/TaskList.tsx";
import AddTask from "./Components/AddTask.tsx";

interface Task {
  id: string;
  title: string;
  description: string;
}

const App : React.FC = () => {
  const initialTasks: Task[] = [
    {
      id: crypto.randomUUID(),
      title: "Doctors Appointment",
      description: "Visit Dr. Sharma at 2:30 PM",
    },
    {
      id: crypto.randomUUID(),
      title: "Meeting at School",
      description: "Discuss annual function preparations",
    },
    {
      id: crypto.randomUUID(),
      title: "Grocery Shopping",
      description: "Buy vegetables, fruits, and dairy",
    },
    {
      id: crypto.randomUUID(),
      title: "Gym Workout",
      description: "Leg day workout at 6:00 AM",
    },
    {
      id: crypto.randomUUID(),
      title: "Project Submission",
      description: "Submit React project by 5:00 PM",
    },
    {
      id: crypto.randomUUID(),
      title: "Dinner with Family",
      description: "Go to a restaurant at 8:00 PM",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title,
      description: description,
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <AddTask addTask={addTask} state = {setTasks} />
      <TaskList tasks={tasks} deleteTask={deleteTask} />
    </div>
  );
};

export default App;
