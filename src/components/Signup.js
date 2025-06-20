import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/signup', {
                name,
                email,
                password,
            });
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.error('Error during signup:', error);
            setError(error.response.data.error || 'Signup failed.');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <p className="title">Create an account</p>
                <form className="form" onSubmit={handleSignup}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <button className="form-btn" type="submit">Sign up</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p className="sign-up-label">
                    Already have an account?<span className="sign-up-link"><Link to="/"> Login</Link></span>
                </p>
            </div>
        </div>
    );
};

export default Signup;