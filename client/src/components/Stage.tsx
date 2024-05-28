// src/Stage.js
import { useDrop } from 'react-dnd';
import Task from './TaskList';

const Stage = ({ status, tasks, onDropTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`w-[400px] min-h-[250px] m-2 p-4 rounded-lg shadow-md ${isOver ? 'bg-purple-200' : 'bg-purple-100'}`}>
      <div className="text-lg font-semibold mb-2">
        {status}
      </div>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default Stage;
