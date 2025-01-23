import { useSelector } from 'react-redux';
import Task from './Task';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

const Column = ({ title, tasks, columnId }) => {
    const searchQuery = useSelector((state) => state.kanban.searchQuery);
    const priorityFilter = useSelector((state) => state.kanban.priorityFilter);

    const filteredTasks = tasks.filter((task) => {
        const matchesSearchQuery = searchQuery ? task.content.toLowerCase().includes(searchQuery) : true;
        const matchesPriorityFilter = priorityFilter ? task.priority === priorityFilter : true;
        return matchesSearchQuery && matchesPriorityFilter;
    });

    return (
        <Droppable droppableId={columnId}>
            {(provided) => (
                <div
                    className='bg-white rounded-md shadow-md p-4 w-full sm:w-1/2 md:w-1/3 flex flex-col h-[500px] max-h-screen'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    <h2 className='text-lg font-semibold text-gray-700'>{title}</h2>
                    <div className='mt-4 flex-1 overflow-y-auto space-y-4'>
                        {filteredTasks.map((task, index) => (
                            <Task key={task.id} columnId={columnId} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

Column.propTypes = {
    title: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            description: PropTypes.string,
            dueDate: PropTypes.string,
            priority: PropTypes.oneOf(['High', 'Medium', 'Low']).isRequired,
        })
    ).isRequired,
    columnId: PropTypes.string.isRequired,
};

export default Column;