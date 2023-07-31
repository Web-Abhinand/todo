import React, { useEffect, useState } from 'react'
import { Button, Card, Alert, Form, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import deleteIcon from '../Assets/delete_black_24dp.svg';
import accountCircle from '../Assets/account_circle_black_24dp.svg';
import editIcon from '../Assets/edit_black_24dp.svg';
import { hover } from '@testing-library/user-event/dist/hover'
function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [todo, setTodo] = useState([]);
  const [display, setDisplay] = useState(true);
  const [count, setCount] = useState(0);
  const [editedName, setEditedName] = useState('');
const [editedTodo, setEditedTodo] = useState('');
const [editIndex, setEditIndex] = useState(-1); // -1 indicates no editing is currently happening

  useEffect(() => {
    handleDisplayData();
  }, [count]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      setError("Failed to log out")
    }
  }
  // code to enter data from form to firebase database



  async function handleSubmit(event) {
    setCount(count => count + 1);

    event.preventDefault();
    const name = event.target.elements.name.value;
    const todo = event.target.elements.todo.value;

    try {
      console.log(event.target.elements);

      // Get the reference to the existing document
      const todoRef = doc(collection(db, currentUser.email), "ToDoDetails");
      const todoDoc = await getDoc(todoRef);

      // Check if the document exists
      if (todoDoc.exists()) {
        // If the document exists, update it by adding the new task to the tasks array
        const existingData = todoDoc.data();
        const existingTasks = existingData.tasks || [];

        // Add the new task to the tasks array
        existingTasks.push({ name, todo });

        // Update the document with the new tasks array
        await updateDoc(todoRef, {
          tasks: existingTasks,
        });
      } else {
        // If the document doesn't exist, create it with the first task in the tasks array
        await setDoc(todoRef, {
          tasks: [{ name, todo }],
        });
      }

      alert('Task added successfully!');
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDisplayData() {
    console.log('Displaying data...  fn called');
    try {
      const docRef = doc(db, currentUser.email, "ToDoDetails");
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const todoDetails = docSnapshot.data();
        const tasks = todoDetails.tasks || []; // Access the "tasks" array from the document data

        // Clear the existing tasks before adding the new ones
        setTodo([]);

        // Iterate over each task and add it to the state
        tasks.forEach((task) => {
          const { name, todo } = task;
          setTodo((prevTodo) => [...prevTodo, { name, todo }]);
        });

        console.log('Tasks:', tasks);
      } else {
        setTodo([]);
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
    //code for reloading the page

  }


  async function handleDelete(index) {
    try {
      const updatedTodo = [...todo]; // Create a copy of the todo array
      updatedTodo.splice(index, 1); // Remove the task at the specified index
      setTodo(updatedTodo); // Update the state with the updated array

      // You may choose to delete the task from Firebase Firestore here if needed

      window.alert('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);

      // Display error alert
      window.alert('An error occurred while deleting task');
    }
  }

  function handleEdit(index) {
    // Set the edited task name and task to the current values of the task at the specified index
    setEditedName(todo[index].name);
    setEditedTodo(todo[index].todoo);
    setEditIndex(index); // Set the index of the task we are editing
  }
  
  function handleSave(index) {
    // Create a copy of the todo array
    const updatedTodo = [...todo];
  
    // Update the task name and task at the specified index with the edited values
    updatedTodo[index].name = editedName;
    updatedTodo[index].todoo = editedTodo;
  
    // Update the state with the updated array
    setTodo(updatedTodo);
  
    // Reset the edit state
    setEditedName('');
    setEditedTodo('');
    setEditIndex(-1);
  }
  
  function handleCancel() {
    // Reset the edit state
    setEditedName('');
    setEditedTodo('');
    setEditIndex(-1);
  }

  return (
    <>
      <header style={{ width: '100%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '20%', marginLeft: '1rem' }}>
          <h1>ToDo</h1>
        </div>
        <div style={{ width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ marginRight: '1rem' }}>
            <Link href='/login' onClick={handleLogout}><Button>LogOut</Button></Link>
          </div>
        </div>
      </header>
      <Container fluid className="d-flex justify-content-center" style={{ backgroundColor: '#f0f0f0', padding: '5rem' }}>
        <Card style={{ width: '50%' }} >
          <Card.Body className="text-center">
            <img src={accountCircle} style={{ width: '10%', mx: 'auto' }} className="mx-auto" />
            <h2 className='text-center mb-4'>Profile</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <p className='text-center mb-4'><strong>Email:</strong> {currentUser.email}</p>
          </Card.Body>
        </Card>
      </Container>
      <Container fluid className="d-flex justify-content-center" style={{ padding: '5rem' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group id='name'>
            <Form.Label>Task Name</Form.Label>
            <Form.Control type='text' required name="name" placeholder='Task Name'></Form.Control>
          </Form.Group>
          <Form.Group id='todo'>
            <Form.Label>Todo Task</Form.Label>
            <Form.Control type='text' required name="todo" placeholder='Enter Task'></Form.Control>
          </Form.Group>
          <Button type='submit' className='w-100 mt-4'>Submit</Button>
        </Form>
      </Container>
      {/* <div className='text-center mt-2'>
        <Button onClick={handleDisplayData}>Display Task</Button>
      </div> */}
      <div className='hello' style={{ backgroundColor: '#f0f0f0', padding: '5rem' }}>
      <Container style={{ width: '50%' }}>
        {todo.map((item, index) => (
          <div key={index} className='card' style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            {editIndex === index ? (
              // Check if we are editing this task
              <div style={{ padding: '1rem' }}>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="text"
                  value={editedTodo}
                  onChange={(e) => setEditedTodo(e.target.value)}
                />
                <button onClick={() => handleSave(index)}>Save</button>
                <button onClick={() => handleCancel()}>Cancel</button>
              </div>
            ) : (
              // Display task details
              <div style={{ padding: '1rem' }}>
                <p>Task Name: {item.name}</p>
                <p style={{ marginBottom: '5px' }}>Task: {item.todo}</p>
                <button
                  onClick={() => handleEdit(index)}
                  style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <img src={editIcon} alt="edit_icon" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                >
                  <img src={deleteIcon} alt="delete_icon" />
                </button>
              </div>
            )}
          </div>
        ))}
      </Container>
      </div>
    </>
  )
}

export default Dashboard