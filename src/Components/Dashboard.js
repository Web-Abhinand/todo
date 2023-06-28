import React, { useEffect, useState } from 'react'
import { Button, Card, Alert, Form } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, doc, setDoc,getDoc,getDocs, query, where,deleteDoc} from "firebase/firestore";
function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [todo, setTodo] = useState([]);
  const [display, setDisplay] = useState(true);


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
    event.preventDefault();
    const name = event.target.elements.name.value;
    const todo = event.target.elements.todo.value;

    try {
      console.log(event.target.elements);
      const todoRef = doc(collection(db, currentUser.email), "ToDoDetails");
      await setDoc(todoRef, {
        name: name,
        todo: todo,
      });
      alert('Task added successfully!');
    } catch (error) {
      alert(error.message);
    }
  }



  async function handleDisplayData() {
    try {
      const docRef = doc(db, currentUser.email, "ToDoDetails");
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        const todoDetails = docSnapshot.data();
        const name = todoDetails.name;
        const todoo = todoDetails.todo;
        setTodo([...todo, { name, todoo }]);
        console.log('Name:', name);
        console.log('Todo:', todoo);
        console.log(todo, 'todo');
      } else {
        setTodo([]);
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  }


  async function handleDelete() {
    try { 
      const docRef = doc(db, currentUser.email, "ToDoDetails");
  
      await deleteDoc(docRef);
  
      window.alert('ToDoDetails deleted successfully');
      // setDisplay(false);
      handleDisplayData();
    } catch (error) {
      console.error('Error deleting ToDoDetails:', error);
  
      // Display error alert
      window.alert('An error occurred while deleting ToDoDetails');
    }
  }


  return (
    <>
      <header style={{ width: '100%', border: '1px solid red', display: 'flex', justifyContent: 'space-between', position: 'fixed', top: "0", left: '0' }}>
        <div style={{ width: '20%' }}>
          <h1>LOGO</h1>
        </div>
        <div style={{ with: '60%', display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
          <Link href='/login' onClick={handleLogout}>LogOut</Link>
        </div>
      </header>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <strong>Email:</strong>{currentUser.email}
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Form onSubmit={handleSubmit}>
          <Form.Group id='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control type='text' required name="name" placeholder='Enter Name'></Form.Control>
          </Form.Group>
          <Form.Group id='todo'>
            <Form.Label>Todo Task</Form.Label>
            <Form.Control type='text' required name="todo" placeholder='Enter Task'></Form.Control>
          </Form.Group>
          <Button type='submit' className='w-100 mt-4'>Submit</Button>
        </Form>
      </div>
      <div className='w-100 text-center mt-2'>
        <Button onClick={handleDisplayData}>Display Data</Button>
      </div>
      <div className='hello'>
        {todo.map((item) => {
          return (
            <>
            <div className='card' style={{marginTop:'1rem',marginBottom:'1rem'}}>
              <div style={{padding:'1rem'}}>
                <p>Name: {item.name}</p>
                <p style={{marginBottom:'5px'}}>Task: {item.todoo}</p>
              </div>
            </div>
            <Button onClick={handleDelete}>Delete Task</Button>
            </>
            )
        })}
      </div>
    </>
  )
}

export default Dashboard