import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findQuizById } from '../../client'; // Adjust the path as necessary
import { Quiz } from '../../quizTypes';

function QuizPreview() {
    
    return (
        <div>
            <h1>Quiz Preview</h1>
        </div>
    )
}

export default QuizPreview;