import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
    return (
        <div className="container">
        <div className="form-container">
            <p className="title">Welcome to Questify!</p>
            <p className="home-description">Select an option:</p><br/>
            <Link to="/question-builder" className="form-btn">Go to Question Builder</Link><br/>
            <Link to="/ppt-maker" className="form-btn">Go to PPT Maker</Link>
        </div>
        </div>
    );
};

export default Home;