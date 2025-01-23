import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    columns: {
        todo: { columnId: 'todo', title: 'TO DO', tasks: [] },
        inProgress: { columnId: 'inProgress', title: 'IN PROGRESS', tasks: [] },
        done: { columnId: 'done', title: 'DONE', tasks: [] },
    },
    searchQuery: '',
    priorityFilter: '',
    columnOrder: ['todo', 'inProgress', 'done'],
};

const kanbanSlice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        addTask: (state, action) => {
            const { columnId, task } = action.payload;
            if (state.columns[columnId]) {
                state.columns[columnId].tasks.push(task);
            } else {
                console.error(`Column with id ${columnId} does not exist`);
            }
        },
        deleteTask: (state, action) => {
            const { columnId, taskId } = action.payload;
            if (state.columns[columnId]) {
                state.columns[columnId].tasks = state.columns[columnId].tasks.filter(task => task.id !== taskId);
            } else {
                console.error(`Column with id ${columnId} does not exist`);
            }
        },
        editTask: (state, action) => {
            const { columnId, taskId, newContent, newDescription, newDueDate, newPriority } = action.payload;
            if (state.columns[columnId]) {
                const task = state.columns[columnId].tasks.find(task => task.id === taskId);
                if (task) {
                    task.content = newContent;
                    task.description = newDescription;
                    task.dueDate = newDueDate;
                    task.priority = newPriority;
                } else {
                    console.error(`Task with id ${taskId} does not exist in column ${columnId}`);
                }
            } else {
                console.error(`Column with id ${columnId} does not exist`);
            }
        },
        reorderTasks: (state, action) => {
            const { columnId, taskIds } = action.payload;
            state.columns[columnId].tasks = taskIds.map(taskId => state.columns[columnId].tasks.find(task => task.id === taskId));
        },
        updateColumns: (state, action) => {
            state.columns = action.payload;
        },
        setPriorityFilter: (state, action) => {
            state.priorityFilter = action.payload;    
        }
    },
});

export const { addTask, deleteTask, editTask, reorderTasks, updateColumns, setSearchQuery, setPriorityFilter } = kanbanSlice.actions;
export default kanbanSlice.reducer;