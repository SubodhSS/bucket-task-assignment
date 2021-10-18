/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { get } from 'lodash';
import api from "../api";

const TasksList = () => {
    const { bucketId } = useParams();
    const [ tasks, setTasks ] = useState([]); 

    const getStatusTitle = (status) => {
        switch (status) {
            case 'Incomplete':
                return 'Incomplete';
            case 'Complete':
                return 'Complete';
            case 'New':
                return 'New';
            default:
                return 'New';
        }
    };

    const getPriorityTitle = (priorityId) => {
        switch (priorityId) {
            case 3:
                return 'High';
            case 2:
                return 'Medium';
            case 1:
                return 'Low';
            default:
                return 'Low';
        }
    };

    const getAllTasks = async () => {
        const url = bucketId ? `buckets/${bucketId}/tasks`: '/tasks';
        const response = await api.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response.data.data;
    }


    const deleteTask = async (id) => {
        const response = await api.delete(`/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response;
    }

    const onDeleteTask = async (id) => {
            const { status } = await deleteTask(id);
            if(status === 200) {
                // history.push('/tasks')
                window.location.href = '/tasks';
            }
        
    }

    useEffect(() =>{
        const tasksData = async() => {
            
            const allTasks = await getAllTasks();
            if(allTasks) setTasks(allTasks);
        }
        tasksData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);
    const history = useHistory();

        return (
            <div>
                <h3>Tasks</h3>
                <button onClick={() => {history.push({
                pathname: '/tasks/new',
            })}}>Create Task</button>
                <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Status</th>
          <th>Created Date</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Bucket</th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (<tr key={task.id}>
          <th scope="row">{get(task, 'id', '')}</th>
          <td>{get(task, 'title', '')}</td>
          <td>{getStatusTitle(get(task, 'status', ''))}</td>
          <td>{get(task, 'createdAt', '')}</td>
          <td>{get(task, 'dueDate', 'NA') || '-'}</td>
          <td>{getPriorityTitle(get(task, 'priority', ''))}</td>
          <td>{get(task, 'bucketId', '')}</td>
          <td>
              <button onClick={() => onDeleteTask(get(task, 'id', ''))}>Delete</button>
              <button onClick={() => {
              history.push({
                pathname: `/tasks/${get(task, 'id', '')}`,
                state: {
                    bucketId
                  }
            })}}>Edit</button>
        </td>
        </tr>))}
      </tbody>
      </Table>
            </div>
        );
};

export default TasksList;