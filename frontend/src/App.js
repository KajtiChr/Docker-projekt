import React from 'react';
import './App.css';
import axios from 'axios';

function App() {

   var ClickIT = async () => {

     var l1 = document.getElementById('c1_l').value;
     var l2 = document.getElementById('c2_l').value;
     var m1 = document.getElementById('c1_m').value;
     var m2 = document.getElementById('c2_m').value;

    
     
     if (!(l1 === "" || l2 === "" || m1 === "" || m2 === ""))
     {
         var request = "/api/" + l1 + '/' + l2 + '/' + m1 + '/' + m2;
         var result = await axios.get(request);

         document.getElementById("wynik").innerHTML = "Wynik to: " +result.data;
     }
     else
         {
             alert("Niepoprawny ułamek");
         }

   };

  return (
    <div className="App">
      <header className="App-header">
          <h1>Sumowanie ułamków </h1>
        <p id={"info"}>
          Wpisz ułamki, które chciałbyś zsumować
        </p>

             <input id="c1_l" type="text" name="lic1"/>
             <input id="c1_m" type="text" name="mian2"/>
             <br/> <p>+</p>
             <input id="c2_l" type="text" name="licz1"/>
             <input id="c2_m" type="text" name="mian2"/>
          <button onClick={ClickIT}>Oblicz</button>
          <div id={"wynik"}>Wynik to:  </div>
        </header>
    </div>
  );
}

export default App;
