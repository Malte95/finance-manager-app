import { useState, useEffect } from 'react'
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
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [progress, setProgress] = useState(0);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
 
useEffect(() =>  {
async function load() {
  setErrorMessage("");
  setLoadingList(true);
  try {
  const res = await fetch("http://localhost:3000/contracts");
  

  if (!res.ok) throw new Error("Fehler beim Laden: " + res.status);


  const data = await res.json();
  setContracts(data);
  } catch (err) {
    setErrorMessage("Daten konnten nicht geladen werden. Läuft der json-server auf Port 3000?");

  } finally {setLoadingList(false)}
}
load();
  }, []); 

  async function handleAdd() {



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
  setErrorMessage("");
  setSaving(true);
  try {
  const patch = { title: title.trim(), amount: Number(amount), dueDate, category };
  const res = await fetch("http://localhost:3000/contracts/" + editingId, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(patch),
});
if(!res.ok){
  throw new Error("Update fehlgeschlagen: " + res.status);
}
const update = await res.json();

  setContracts(prev =>
    prev.map(c =>
      c.id === editingId
        ? update
        : c
    )
  );
setEditingId(null);
setTitle("");
  setAmount("");
  setDueDate("");
  setCategory("");
    } catch (err) {
      setErrorMessage("Speichern fehlgeschlagen. Bitte später erneut versuchen.");
      return;
    } finally {
      setSaving(false);
    }

  return;

}

const body = {title: t, amount: n, dueDate, category};



  setErrorMessage("");
  setSaving(true);
  try {
  const res = await fetch("http://localhost:3000/contracts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: t, amount: n, dueDate, category }),
  });
  if (!res.ok) throw new Error("Fehler beim Speichern: " + res.status);
  const saved = await res.json(); 

 
  setContracts(prev => [...prev, saved]);

  
  setTitle("");
  setAmount("");
  setDueDate("");
  setCategory("");
}
 catch (err) {
  setErrorMessage("Speichern fehlgeschlagen. Bitte später erneut versuchen.");
  return
} finally {
  setSaving(false)
}


  
    
  }

  async function handleDelete(contractId) {
    setErrorMessage("")
    setDeletingId(contractId);
    try {
    const res = await fetch("http://localhost:3000/contracts/" + contractId, {method: "DELETE"});
    if (!res.ok) throw new Error("Löschen fehlgeschlagen: " + res.status);
    setContracts(prev => prev.filter(c => c.id !== contractId));
  } catch (err) {setErrorMessage("Löschen fehlgeschlagen. Bitte später erneut versuchen.");}
    finally {
      setDeletingId(null);
    } }
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

  const sorted = [...filtered];

  const totalsByCategory = {};

  for (const c of filtered) {
    const key = c.category;
    const prev = totalsByCategory[key] ?? 0;
    totalsByCategory[key] = prev + c.amount; 
  }

  const totalsArray = Object.entries(totalsByCategory).map(([category, total]) => ({
category,
total
  }));
  
  
const globalTotal = contracts.reduce((s, c) => s + c.amount, 0);

  const totalSum = totalsArray.reduce((s, x) => s + x.total, 0);


  const filteredSum = filtered.reduce((acc, c) => acc + c.amount, 0);

  if(sortBy) {
    const dir = sortDir === "asc" ? 1 : -1

    sorted.sort((a,b) => {
      if (sortBy === "title") {
        const ta = (a.title || "").toLowerCase();
        const tb = (b.title || "").toLowerCase();
        if (ta < tb) return -1 * dir;
        if (ta > tb) return  1 * dir;
        return 0;
      }


      if (sortBy === "amount") {
        return dir * (a.amount - b.amount);
      }

      if (sortBy === "dueDate") {
        const da = Date.parse(a.dueDate);
        const db = Date.parse(b.dueDate);
        return dir * (da - db);
      }

      return 0;

    })
  }
  

  function resetFilters() {
    setFilterCategory("");
    setSearchTitle("");
  }

  function formatDate(isoYmd) {
    return new Date(isoYmd + "T00:00:00").toLocaleDateString("de-DE");
  }

  function handleSort(column) { 
   if (sortBy !== column) {
    setSortBy(column)
    setSortDir("asc");
   } else {
    setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
   }
   }

   function arrowFor(column) {
    if (sortBy !== column) return "⬆️⬇️";
    return sortDir === "asc" ? "⬆️" : "⬇️";
   }

   useEffect(() => {
    let rafId;
    const start = performance.now();
    const duration = 700; 
  
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
  
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [filtered.length, totalSum]); 
  
  
const CATEGORY_COLORS = {
  Versicherung: "#3b82f6", 
  Telefon: "#10b981",      
  Strom: "#f59e0b"         
};


const FALLBACK_COLORS = ["#ef4444", "#8b5cf6", "#14b8a6", "#eab308", "#6366f1"];

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function colorFor(category) {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLORS[hashString(category) % FALLBACK_COLORS.length];
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
      
      {errorMessage && (
  <div
    role="alert"
    style={{
      background: "#fee2e2",
      color: "#991b1b",
      padding: "8px 12px",
      border: "1px solid #fecaca",
      borderRadius: 6,
      marginTop: 12
    }}
  >
    {errorMessage}
  </div>
)}

{loadingList &&  (
  <p role="status" aria-live="polite" style={{ color: "#555", marginTop: 12 }}>
    Lädt Daten …
    <span className="spinner" aria-hidden="true"></span>
  </p>
)}



      <table border="1" cellPadding="5" style={{ marginTop: "20px" }}>
  <thead>
    <tr>

      <th><button 
      type="button" 
      onClick={() => handleSort("title")} 
      style= {{background: "transparent", border: "none", cursor: "pointer"}}
      >
        <span>Titel</span>
        <span>{arrowFor("title")}</span>
        </button>
        </th>

      <th>Kategorie</th>
      <th><button
       type="button"
        onClick={() => handleSort("amount")}
         style= {{background: "transparent", border: "none", cursor: "pointer"}}
         >
          <span>Betrag</span>
          <span>{arrowFor("amount")}</span>
          </button>
          </th>

      <th><button
       type="button"
        onClick={() => handleSort("dueDate")}
         style= {{background: "transparent", border: "none", cursor: "pointer"}}
         >
          <span>Datum</span>
          <span>{arrowFor("dueDate")}</span>
          </button>
          </th>
          
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
    sorted.map((c) => (
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
      if (ok) handleDelete(c.id);
    }}
    disabled={deletingId === c.id || saving}
  >
     {deletingId === c.id ? <>
     
     Löscht… <span className="spinner" /></> : "Löschen"}
</button>

  <button
    type="button"
    onClick={() => handleEdit(c.id)}
    disabled={saving || deletingId === c.id}
  >
    Edit
  </button>
</td>

      
    </tr>
  ))
  )}
</tbody>


</table>

<p>Gesamtsumme: {euro.format(summe)} </p>
<p>Summe: {euro.format(filteredSum)}</p>


<svg width="200" height="200">
  <circle
    cx="100"
    cy="100"
    r="80"
    stroke="lightgray"
    strokeWidth="40"
    fill="none"
  />

<ul>
  {totalsArray.map((x, i) => (
    <li key={x.category} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        width: 12, height: 12,
        background: ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6"][i % 5],
        display: "inline-block", borderRadius: 2
      }} />
      <span>{x.category}: {euro.format(x.total)}</span>
    </li>
  ))}
</ul>

{(() => {
  const r = 80;                          
  const c = 2 * Math.PI * r;           
  let offset = 0;                         
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return totalsArray.map((item, i) => {
    const frac = globalTotal > 0 ? item.total / globalTotal : 0;  
    const dash = frac * c * progress;                                  
    const el = (
      <circle
        key={item.category}
        cx="100" cy="100" r={r}
        fill="none"
        stroke={colorFor(item.category)}
        strokeWidth="40"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={-offset}
        transform="rotate(-90 100 100)"   
        strokeLinecap="round"              
      />
    );
    offset += dash;   
    return el;
  });
})()}
</svg>


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
<button type="button" onClick={handleAdd} disabled={saving} style={{display: "block", marginBottom: "10px", backgroundColor: isEditing? "green" : "blue", color: "white"}}> {saving ? <>Speichert… <span className="spinner" /></> : (editingId ? "Speichern" : "Hinzufügen")}
</button>
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
