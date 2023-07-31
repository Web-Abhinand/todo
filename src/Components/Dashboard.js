import React, { useEffect, useState } from 'react'
import { Button, Card, Alert, Form,Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc,addDoc } from "firebase/firestore";
import deleteIcon from '../Assets/delete_black_24dp.svg';
import accountCircle from '../Assets/account_circle_black_24dp.svg';
import editIcon from '../Assets/edit_black_24dp.svg';
function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [todo, setTodo] = useState([]);
  const [display, setDisplay] = useState(true);
  const [count, setCount] = useState(0);

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
      <header style={{ width: '100%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between'}}>
        <div style={{ width: '20%', marginLeft: '1rem' }}>
          <h1>ToDo</h1>
        </div>
        <div style={{ width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ marginRight: '1rem' }}>
            <Link href='/login' onClick={handleLogout}><Button>LogOut</Button></Link>
          </div>
        </div>
      </header>
      <Container fluid className="d-flex justify-content-center" style={{ backgroundColor: '#f0f0f0',padding: '5rem'}}>
        <Card style={{ width: '50%' }} >
          <Card.Body className="text-center">
            <img src={accountCircle} style={{ width: '10%', mx: 'auto' }} className="mx-auto"/>
            <h2 className='text-center mb-4'>Profile</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <p className='text-center mb-4'><strong>Email:</strong> {currentUser.email}</p>
          </Card.Body>
        </Card>
      </Container>
      <Container fluid className="d-flex justify-content-center" style={{padding: '5rem'}}>
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
      <div className='hello'>
        {todo.map((item) => {
          return (
            <>
            <Container style={{ width: '50%' }}>
              <Card style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem' }}>
                  <p>Task Name: {item.name}</p>
                  <p style={{ marginBottom: '5px' }}>Task: {item.todoo}</p>
                  <button onClick={handleDelete}><img src={deleteIcon} alt='delete_icon'/></button>
                  <button><img src={editIcon} alt='edit_icon'/></button>
                </div>
              </Card>
            </Container>
            </>
          )
        })}
      </div>
    </>
  )
}

export default Dashboard