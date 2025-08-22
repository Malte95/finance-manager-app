import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() { 
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [contracts, setContracts] = useState([]);
  const [category, setCategory] = useState("");
  const summe = contracts.reduce((acc, c) => acc + c.amount, 0);


  function handleAdd() {
    if (!title || !amount || !dueDate) return;
  
    const newContract = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: Number(amount),
      dueDate: dueDate,
      category: category || "-"
    };

  
    setContracts(prev => [...prev, newContract]);
  
    setTitle("");
    setAmount("");
    setDueDate("");
    setCategory("");
  }

  function handleDelete(contractId) {
    setContracts(prev => prev.filter(c => c.id !== contractId));
  }
  

 

  
 

  return (
    <>
      
      <h1>Mein Finanzmanager</h1>

      <table border="1" cellPadding="5" style={{ marginTop: "20px" }}>
  <thead>
    <tr>
      <th>Titel</th>
      <th>Kategorie</th>
      <th>Betrag</th>
      <th>Datum</th>
    </tr>
  </thead>
  <tbody>
  {contracts.map((c) => (
    <tr key={c.id}>
      <td>{c.title}</td>
      <td>{c.category}</td>
      <td>{c.amount} €</td>
      <td>{c.dueDate}</td>
      <td>
      <button type="button" onClick={() => handleDelete(c.id)}>Löschen</button>

      </td>
    </tr>
  ))}
</tbody>


</table>

<p>Gesamtsumme: {summe} €</p>


<h2>Neuer Vertrag</h2>

<input
  type="text"
  placeholder="Titel"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  style={{ display: "block", marginBottom: "10px" }}
/>

<input 
type="number"
placeholder='Betrag in €'
value= {amount}
onChange={(e) => setAmount(e.target.value)}
style={{display: "block", marginBottom: "10px"}}>
</input>

<input
type="Date"
value={dueDate}
onChange={(e) => setDueDate(e.target.value)}
style={{display: "block", marginBottom: "10px"}}>
</input>

<select
value={category}
onChange={(e) => setCategory(e.target.value)}
style={{display: "block", marginBottom: "10px"}}>
  <option value="">Kategorie wählen</option>
  <option value="Versicherung">Versicherung</option>
  <option value="Telefon">Telefon</option>
  <option value="Strom">Strom</option>
</select>

<p>Vorschau Titel: {title}</p>
<p>Vorschau Betrag: {amount}</p>
<p>Vorschau Datum: {dueDate}</p>
<button type="button" onClick={handleAdd} style={{display: "block", marginBottom: "10px"}}>Hinzufügen</button>



      
    </>
  )
}

export default App
