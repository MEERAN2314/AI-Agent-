import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password,
            });
            console.log(response.data);
            
            navigate('/home');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Invalid email or password.'); 
        }
    };

    return (
        <div className="container"> 
            <div className="form-container">
                <p className="title">Login</p>
                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="form-btn" type="submit">Log in</button>
                </form>
                {error && <p className="error">{error}</p>} 
                <p className="sign-up-label">
                    Don't have an account?<span className="sign-up-link"><Link to="/signup"> Sign up</Link></span>
                </p>
            </div>
        </div>
    );
};

export default Login;