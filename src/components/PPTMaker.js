import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const PPTMaker = () => {
    const [pptTopic, setPptTopic] = useState('');
    const [numSlides, setNumSlides] = useState(1);
    const [generatedPPT, setGeneratedPPT] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGeneratePPT = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/generate_ppt', {
                topic: pptTopic,
                num_slides: numSlides,
            });
            setGeneratedPPT(response.data.ppt_content);
        } catch (error) {
            console.error('Error generating PPT:', error);
            setGeneratedPPT('Error generating PPT. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadPPT = () => {
        const element = document.createElement('a');
        const file = new Blob([generatedPPT], {type: 'text/html'});
        element.href = URL.createObjectURL(file);
        element.download = `${pptTopic || 'presentation'}_slides.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const downloadAsPDF = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${pptTopic || 'Presentation'}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .slide { 
                        page-break-after: always; 
                        padding: 20px;
                        margin-bottom: 20px;
                        border: 1px solid #ddd;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                ${generatedPPT.replace(/<div class="border-2/g, '<div class="slide"')}
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(stripHtml(generatedPPT))
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Failed to copy:', err));
    };

    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="form-container">
            <h2 className="title">PPT Maker</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleGeneratePPT(); }} className="form">
                <input
                    type="text"
                    className="input"
                    placeholder="PPT Topic"
                    value={pptTopic}
                    onChange={(e) => setPptTopic(e.target.value)}
                    required
                />
                <input
                    type="number"
                    className="input"
                    placeholder="Number of Slides"
                    min="1"
                    value={numSlides}
                    onChange={(e) => setNumSlides(e.target.value)}
                    required
                />
                <button type="submit" className="form-btn" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate PPT'}
                </button>
            </form>

            {loading && <p>Loading...</p>}

            {generatedPPT && !loading && (
                <div className="generated-ppt">
                    <h3 className="title">Generated PPT Content:</h3>
                    <div className="ppt-actions">
                    <button onClick={downloadAsPDF} className="action-btn pdf-btn">
                            Download as PDF
                        </button>
                        <button onClick={downloadPPT} className="action-btn download-btn">
                            Download PPT
                        </button>
                        <button onClick={copyToClipboard} className="action-btn copy-btn">
                            {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                    </div>
                    <div 
                        className="ppt-content"
                        dangerouslySetInnerHTML={{ __html: generatedPPT }} 
                    />
                </div>
            )}
        </div>
    );
};

export default PPTMaker;