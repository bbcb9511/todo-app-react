import React from 'react';
import './App.css';

function App() {

  let resString: any = '未設定';

  fetch('http://localhost:8080/')
    .then(response => {
      resString = response;
    } )
    .catch(error => {
      alert(error)
    });


  return (
    <div className="App">
      {resString}
    </div>
  );
}

export default App;
