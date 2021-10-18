/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
    useHistory,
  } from 'react-router-dom';
import { Table } from 'reactstrap';
import { get } from 'lodash';
import api from "../api";

const BucketList = () => {
    const [ buckets, setBuckets ] = useState([]); 

    const getAllTasks = async () => {
        const response = await api.get('/buckets', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response.data.data;
    }


    const deleteTask = async (id) => {
        const response = await api.delete(`/buckets/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        return response;
    }

    const onDeleteTask = async (id) => {
            const { status } = await deleteTask(id);
            if(status === 200) {
                // history.push('/buckets')
                window.location.href = '/buckets';
            }
        
    }

    useEffect(() =>{
        const tasksData = async() => {
            
            const allTasks = await getAllTasks();
            if(allTasks) setBuckets(allTasks);
        }
        tasksData();
      },[]);
    const history = useHistory();

        return (
            <div>
                <h3>buckets</h3>
                <button onClick={() => {history.push({
                pathname: '/buckets/new',
            })}}>Create Task</button>
                <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        {buckets.map(task => (<tr key={task.id}>
          <th scope="row">{get(task, 'id', '')}</th>
          <td onClick={() => {
              history.push({
                pathname: `/buckets/${get(task, 'id', '')}/tasks`,
            })}}>{get(task, 'name', '')}</td>
          <td>
              <button onClick={() => onDeleteTask(get(task, 'id', ''))}>Delete</button>
              <button onClick={() => {
              history.push({
                pathname: `/buckets/${get(task, 'id', '')}`,
            })}}>Edit</button>
        </td>
        </tr>))}
      </tbody>
      </Table>
            </div>
        );
};

export default BucketList;