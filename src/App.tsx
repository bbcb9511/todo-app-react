import React, { useState } from 'react';
import './App.css';

function App() {

  const [resStr, setResStr] = useState('未設定です');

  fetch('http://localhost:8080/')
    .then(response => {
      return response.text();
    })
    .then(data => {
      setResStr(data);
    })
    .catch(error => {
      alert('エラー：' + error)
    });


  return (
    <div className="App">
      {resStr}
    </div>
  );
}

export default App;
