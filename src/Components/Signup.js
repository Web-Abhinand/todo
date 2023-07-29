import React, { useRef, useState } from 'react'
import { Button, Form, Card, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'
import { auth } from '../firebase';
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import sugnupImg from "../Assets/signup_img.svg"

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(emailRef.current.value);
        console.log(passwordRef.current.value);

        //code to check if passowrd has atleast 6 characters
        if (passwordRef.current.value.length > 6) {
            const userDocRef = doc(db, emailRef.current.value, 'UserDetails');
            await setDoc(userDocRef, {
                userName: emailRef.current.value,
            });

            console.log(passwordConfirmRef.current.value);
            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
                console.log('Passwords do not match');
                return setError('Passwords do not match')
            }
            try {
                setError('');
                setLoading(true);
                await signup(emailRef.current.value, passwordRef.current.value);
                navigate('/');
                console.log('Account created')

            }
            catch {
                setError('Failed to create an account')
                console.log('account not created')
            }
        } else {
            setError('Password should be atleast 6 characters')
        }
    }
    return (
        <>
            <div style={{ background: 'linear-gradient(90deg, #0C6EFD, #4FACFF)' }}>
                <div className="container" >
                    <div className="row vh-100 align-items-center justify-content-around">
                        <div className="col-md-6">
                            {/* Your image goes here */}
                            <img
                                src={sugnupImg}
                                alt="Login Image"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="col-md-4">
                            <Card className="p-3">
                                <Card.Body>
                                    <h2 className='text-center mb-4'>Sign Up</h2>
                                    {error && <Alert className='alert alert-danger'>{error}</Alert>}
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group id='email'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type='email' ref={emailRef} required></Form.Control>
                                        </Form.Group>
                                        <Form.Group id='password'>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type='password' ref={passwordRef} required></Form.Control>
                                        </Form.Group>
                                        <Form.Group id='passwordConfirm'>
                                            <Form.Label>Password Confirm</Form.Label>
                                            <Form.Control type='password' ref={passwordConfirmRef} required></Form.Control>
                                        </Form.Group>
                                        <Button type='submit' disabled={loading} className='w-100 mt-4'>Sign Up</Button>
                                    </Form>
                                </Card.Body>
                                <div className="w-100 text-center mt-2" style={{ marginBottom: '5px' }}>
                                    Need an account? <Link to="/login">Login</Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup