import { useState } from 'react'
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
  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;  
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const euro = Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"});

  function handleAdd() {


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

if(editingId !== null) {
  setContracts(prev =>
    prev.map(c =>
      c.id === editingId
        ? { ...c, title: title.trim(), amount: Number(amount), dueDate, category }
        : c
    )
  );
setEditingId(null);
setTitle("");
  setAmount("");
  setDueDate("");
  setCategory("");

  return;

}

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

  function handleEdit(id) {
    setEditingId(id);
    const item = contracts.find(c => c.id === id)
    setTitle(item.title);
    setAmount(String(item.amount));
    setDueDate(item.dueDate);
    setCategory(item.category);
  }

  
  function handleCancel() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setDueDate("");
    setCategory("");
  
    
    setTitleError("");
    setAmountError("");
    setDateError("");
    setCategoryError("");
  }
  
  const filtered = contracts
  .filter(c => {
   
    if (filterCategory && c.category !== filterCategory) return false;
    return true;
  })
  .filter(c => {
    if(searchTitle && !c.title.toLowerCase().includes(searchTitle.toLowerCase()) ) return false; 
    return true;
  })

  const filteredSum = filtered.reduce((acc, c) => acc + c.amount, 0);
  

  function resetFilters() {
    setFilterCategory("");
    setSearchTitle("");
  }

  function formatDate(isoYmd) {
    return new Date(isoYmd + "T00:00:00").toLocaleDateString("de-DE");
  }
 

  

  return (
    <>
      
      <h1>Mein Finanzmanager</h1>

      <select value={filterCategory} onChange = {(e) => {setFilterCategory(e.target.value)}}>
        <option value="">Alle</option>
        <option value="Versicherung">Versicherung</option>
        <option value="Telefon">Telefon</option>
        <option value="Strom">Strom</option>
      </select>
      <input type="text" value={searchTitle} onChange = {(e) => {setSearchTitle(e.target.value)}}></input>
      <button type="button" onClick={resetFilters} disabled={!filterCategory && !searchTitle}>Filter zurücksetzten</button>
      


      <table border="1" cellPadding="5" style={{ marginTop: "20px" }}>
  <thead>
    <tr>
      <th>Titel</th>
      <th>Kategorie</th>
      <th>Betrag</th>
      <th>Datum</th>
      <th>Aktionen</th>
    </tr>
  </thead>
  <tbody>
  {filtered.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ color: "gray", textAlign: "center" }}>
        Kein Treffer
      </td>
    </tr>
  ) : (
    filtered.map((c) => (
      <tr key={c.id}>
        <td>{c.title}</td>
        <td>{c.category}</td>
        <td>{euro.format(c.amount)}</td>
        <td>{formatDate(c.dueDate)}</td>
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

          <button 
          type="button"
          onClick={() => {
            handleEdit(c.id);
          }}>Edit</button>

      </td>
    </tr>
  ))
  )}
</tbody>


</table>

<p>Gesamtsumme: {euro.format(summe)} </p>
<p>Summe: {euro.format(filteredSum)}</p>


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
min={new Date().toISOString().split("T")[0]}
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
<button type="button" onClick={handleAdd} style={{display: "block", marginBottom: "10px", backgroundColor: isEditing? "green" : "blue", color: "white"}}>{editingId ? "Speichern" : "Hinzufügen"}</button>
{isEditing && (
  <button
    type="button"
    onClick={handleCancel}
    style={{ display: "block", marginBottom: "10px", backgroundColor: "red", color: "white" }}
  >
    Abbrechen
  </button>
)}



      
    </>
  )
}

export default App
