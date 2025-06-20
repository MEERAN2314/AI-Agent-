import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

export const generateQuestions = async (data) => {
    return await axios.post(`${API_URL}/generate_questions`, data);
};

export const generatePPT = async (data) => {
    return await axios.post(`${API_URL}/generate_ppt`, data);
};