import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import loginImg from "../Assets/login_img.svg"
export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      navigate('/')
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <>
      <div style={{ background: 'linear-gradient(90deg, #0C6EFD, #4FACFF)'}}>
        <div className="container" >
          <div className="row vh-100 align-items-center justify-content-around">
            <div className="col-md-6">
              {/* Your image goes here */}
              <img
                src={loginImg}
                alt="Login Image"
                style={{ width: '100%'}}
              />
            </div>
            <div className="col-md-4">
              <Card className="p-3">
                  <h2 className="text-center mb-4">Log In</h2>
                  <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                      <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                      </Form.Group>
                      <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                      </Form.Group>
                      <Button disabled={loading} className="w-100 mt-3 py-2" type="submit">
                        Log In
                      </Button>
                    </Form>
                  </Card.Body>
                  <div className="w-100 text-center mt-2" style={{ marginBottom: '5px' }}>
                    Need an account? <Link to="/signup">Sign Up</Link>
                  </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}