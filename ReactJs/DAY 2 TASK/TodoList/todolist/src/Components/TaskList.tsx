import Task from './Tasks';

interface Task {
  id: string;
  title: string;
  description: string;
}

interface TaskListProps {
  tasks: Task[];
  deleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, deleteTask }) => {
  return (
    <div className="w-full max-w-lg">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks available</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Task key={task.id} task={task} deleteTask={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
