import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';

const QuestionBuilder = () => {
    const [topicName, setTopicName] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('Easy');
    const [questionType, setQuestionType] = useState('MCQs');
    const [numQuestions, setNumQuestions] = useState(1);
    const [generatedQuestions, setGeneratedQuestions] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const questionsRef = useRef();

   
    useEffect(() => {
        const handleShowAnswer = (e) => {
            
            const button = e.target.closest('.show-answer-btn, .bg-blue-500');
            
            if (button) {
                
                const answerDiv = button.nextElementSibling || 
                                button.parentNode.querySelector('.answer, .font-bold.text-green-600, .hidden');
                
                if (answerDiv) {
                    
                    answerDiv.classList.toggle('hidden');
                    answerDiv.style.display = answerDiv.classList.contains('hidden') ? 
                        'none' : 'block';
                    
                    
                    button.textContent = answerDiv.classList.contains('hidden') ? 
                        'Show Answer' : 'Hide Answer';
                }
            }
        };

        document.addEventListener('click', handleShowAnswer);
        return () => document.removeEventListener('click', handleShowAnswer);
    }, [generatedQuestions]);

    const handleGenerateQuestions = async () => {
        setLoading(true);
        setGeneratedQuestions('');
        try {
            const response = await axios.post('http://localhost:5000/generate_questions', {
                topic: topicName,
                difficulty: difficultyLevel,
                question_type: questionType,
                num_questions: parseInt(numQuestions),
            });

            if (response.data?.questions) {
                setGeneratedQuestions(response.data.questions);
            } else {
                setGeneratedQuestions('No questions were generated. Please try again.');
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            setGeneratedQuestions('Error generating questions. Please check the console or try again later.');
        } finally {
            setLoading(false);
        }
    };

    
    const downloadAsPDF = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${topicName || 'Questions'}</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    .question { margin-bottom: 30px; }
                    .answer { color: green; margin-top: 10px; }
                    @page { size: A4; margin: 10mm; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <h1>${topicName || 'Generated Questions'}</h1>
                <p>Difficulty: ${difficultyLevel} | Type: ${questionType}</p>
                ${questionsRef.current.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    const copyQuestions = () => {
        const textToCopy = questionsRef.current.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Copy failed:', err));
    };


    return (
        <div className="form-container">
            <h2 className="title">Question Builder</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleGenerateQuestions();
            }} className="form">
                <input
                    type="text"
                    className="input"
                    placeholder="Topic Name"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    required
                />
                <select
                    className="input"
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <select
                    className="input"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                >
                    <option value="MCQs">MCQs</option>
                    <option value="Assessment Type">Assessment Type</option>
                    <option value="Case Study">Case Study</option>
                </select>
                <input
    type="number"
    className="input"
    placeholder="Number of Questions"
    min="1"
    max="50"  // Added maximum limit
    value={numQuestions}
    onChange={(e) => {
        const value = Math.min(Math.max(1, e.target.value), 50); // Ensure between 1-50
        setNumQuestions(value);
    }}
    required
/>
                <button type="submit" className="form-btn" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Questions'}
                </button>
            </form>

            {generatedQuestions && (
                <div className="generated-questions">
                    <div className="question-actions">
                        <button onClick={downloadAsPDF} className="action-btn pdf-btn">
                            Download as PDF
                        </button>
                        <button onClick={copyQuestions} className="action-btn copy-btn">
                            {copied ? 'Copied!' : 'Copy Questions'}
                        </button>
                    </div>
                    <div
                        className="question-output"
                        dangerouslySetInnerHTML={{ __html: generatedQuestions }}
                        ref={questionsRef}
                    />
                </div>
            )}
        </div>
    );
};

export default QuestionBuilder;