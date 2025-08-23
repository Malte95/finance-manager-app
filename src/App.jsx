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
  const [amountError, setAmountError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const [categoryError, setCategoryError] = useState("");


  function handleAdd() {
    //if (!title || !amount || !dueDate) return;


    const t = title.trim();
    if(t.length < 2) {
      setTitleError("Title must be at least 2 characters");
      return;
    }
    setTitleError("")

    const n = Number(amount);
    if(Number.isNaN(n) || n <= 0) {
     setAmountError("Please enter a number greater than 0");
     return;
    }
  setAmountError("");

  
  if (!dueDate) {
    setDateError("Please select a date");
    return;
  }
  const [y, m, d] = dueDate.split("-");
const selected = new Date(Number(y), Number(m) - 1, Number(d));

selected.setHours(0, 0, 0, 0);

const today = new Date();
today.setHours(0, 0, 0, 0);

if (selected < today) {
  setDateError("Date cannot be in the past");
  return;
}
setDateError("");

if(!category){
  setCategoryError("Please select a category");
  return
}
setCategoryError("");

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
      <button
       type="button"
        onClick={() => {
        const ok = window.confirm(`Eintrag "${c.title}" wirklich löschen?`);
        if (ok)  handleDelete(c.id);
      }}
        >
          Löschen
          </button>

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
  onChange={(e) => {
    setTitle(e.target.value);
    setTitleError("");
  }}
  style={{ display: "block", marginBottom: "10px" }}
/>
{titleError && <p style={{color: "red"}}>{titleError}</p>}

<input 
type="number"
placeholder='Betrag in €'
value= {amount}
onChange={(e) => {
  setAmount(e.target.value);
  setAmountError(""); 
}}
style={{display: "block", marginBottom: "10px"}}>
  
</input>
{amountError && (
  <p style={{ color: "red", margin: 0 }}>{amountError}</p>
)}

<input
type="date"
value={dueDate}
onChange={(e) => {
  setDueDate(e.target.value);
  setDateError("");
}}
style={{display: "block", marginBottom: "10px"}}/>

{dateError && <p style={{color: "red"}}>{dateError}</p>}

<select
value={category}
onChange={(e) => {
  setCategory(e.target.value);setCategoryError("");}}
style={{display: "block", marginBottom: "10px"}}>
  <option value="">Kategorie wählen</option>
  <option value="Versicherung">Versicherung</option>
  <option value="Telefon">Telefon</option>
  <option value="Strom">Strom</option>
</select>

{categoryError && <p style={{color: "red"}}>{categoryError}</p>}

<p>Vorschau Titel: {title}</p>
<p>Vorschau Betrag: {amount}</p>
<p>Vorschau Datum: {dueDate}</p>
<button type="button" onClick={handleAdd} style={{display: "block", marginBottom: "10px"}}>Hinzufügen</button>



      
    </>
  )
}

export default App
