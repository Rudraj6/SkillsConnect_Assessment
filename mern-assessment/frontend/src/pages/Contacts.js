import { useState } from "react";
import api from "../api";
import "./Contacts.css";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // CONTACT FORM STATES
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [note, setNote] = useState("");

  // TASK STATES
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);

  // ADDRESS STATES
  const [addresses, setAddresses] = useState([]);
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const loadContacts = async () => {
    try {
      const res = await api.get("/api/contacts");
      setContacts(res.data);
    } catch {
      alert("Failed to load contacts");
    }
  };

  const loadDetails = async (id) => {
    try {
      const res = await api.get(`/api/contacts/${id}`);
      setSelected(res.data);
      setContactName(res.data.contact_name);
      setContactEmail(res.data.contact_email || "");
      setContactNumber(res.data.contact_number);
      setNote(res.data.note || "");

      const taskRes = await api.get(`/api/tasks/contact/${id}`);
      setTasks(taskRes.data);

      const addrRes = await api.get(`/api/addresses/${id}`);
      setAddresses(addrRes.data);

      setIsEditing(false);
    } catch {
      alert("Failed to fetch details");
    }
  };

  const createContact = async () => {
    if (!contactName || !contactNumber) return alert("Name & Phone are required");
    try {
      await api.post("/api/contacts", { contact_name: contactName, contact_email: contactEmail, contact_number: contactNumber, note });
      setContactName(""); setContactEmail(""); setContactNumber(""); setNote("");
      loadContacts();
      alert("Contact created!");
    } catch {
      alert("Failed to create contact");
    }
  };

  const updateContact = async () => {
    try {
      await api.put(`/api/contacts/${selected.id}`, { contact_name: contactName, contact_email: contactEmail, contact_number: contactNumber, note });
      loadDetails(selected.id);
      loadContacts();
      setIsEditing(false);
      alert("Updated successfully!");
    } catch {
      alert("Update failed");
    }
  };

  const deleteContact = async () => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await api.delete(`/api/contacts/${selected.id}`);
      setSelected(null);
      loadContacts();
      alert("Deleted!");
    } catch {
      alert("Delete failed");
    }
  };

  const goBack = () => setSelected(null);

  const createTask = async () => {
    if (!taskTitle) return alert("Task title required");
    try {
      await api.post("/api/tasks", { contact_id: selected.id, title: taskTitle, description: taskDesc, due_date: taskDue });
      setTaskTitle(""); setTaskDesc(""); setTaskDue("");
      const res = await api.get(`/api/tasks/contact/${selected.id}`);
      setTasks(res.data);
      setShowTaskForm(false);
    } catch {
      alert("Failed to add task");
    }
  };

  const updateTaskStatus = async (taskId) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { status: "completed" });
      const updated = await api.get(`/api/tasks/contact/${selected.id}`);
      setTasks(updated.data);
    } catch {
      alert("Failed to update status. Check backend logs.");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      const res = await api.get(`/api/tasks/contact/${selected.id}`);
      setTasks(res.data);
    } catch {
      alert("Failed to delete task");
    }
  };

  const createAddress = async () => {
    if (!addr1 || !city || !stateName || !pincode || !country) return alert("Fill required fields");
    try {
      await api.post(`/api/addresses/${selected.id}`, { address_line1: addr1, address_line2: addr2, city, state: stateName, pincode, country });
      setAddr1(""); setAddr2(""); setCity(""); setStateName(""); setPincode(""); setCountry("");
      const res = await api.get(`/api/addresses/${selected.id}`);
      setAddresses(res.data);
      setShowAddressForm(false);
    } catch {
      alert("Failed to add address");
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/api/addresses/${id}`);
      const res = await api.get(`/api/addresses/${selected.id}`);
      setAddresses(res.data);
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="contacts-container">
      {selected ? (
        <div className="contact-details-card">
          <h2>{selected.contact_name}</h2>
          <p><strong>Email:</strong> {selected.contact_email || "N/A"}</p>
          <p><strong>Phone:</strong> {selected.contact_number}</p>
          <p><strong>Note:</strong> {selected.note || "No notes"}</p>

          {!isEditing && (
            <>
              <button className="create-btn" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="back-btn" style={{ background: "#dc2626", marginLeft: "10px" }} onClick={deleteContact}>Delete</button>
              <button className="back-btn" onClick={goBack} style={{ marginLeft: "10px" }}>Back</button>
            </>
          )}

          {isEditing && (
            <div style={{ marginTop: "20px" }}>
              <input className="form-input" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              <input className="form-input" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              <input className="form-input" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              <textarea className="form-input" value={note} onChange={(e) => setNote(e.target.value)} />
              <button className="create-btn" onClick={updateContact}>Save</button>
              <button className="back-btn" style={{ marginLeft: "10px" }} onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}

          <div style={{ marginTop: "30px" }}>
            <h3>Tasks</h3>
            {!showTaskForm ? (
              <button className="toggle-btn" onClick={() => setShowTaskForm(true)}>Add Task</button>
            ) : (
              <div className="modal">
                <div className="modal-content">
                  <h4>Create Task</h4>
                  <input className="form-input" placeholder="Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                  <textarea className="form-input" placeholder="Description" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
                  <input className="form-input" type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} />
                  <button className="create-btn" onClick={createTask}>Save Task</button>
                  <button className="back-btn" onClick={() => setShowTaskForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {tasks.map((t) => (
              <div key={t.id} className="task-item">
                <strong>{t.title}</strong>
                <p>{t.description}</p>
                <p>Status: {t.status}</p>
                <button className="create-btn" onClick={() => updateTaskStatus(t.id)} disabled={t.status === "completed"}>Mark Complete</button>
                <button className="back-btn" style={{ background: "#dc2626", marginLeft: "10px" }} onClick={() => deleteTask(t.id)}>Delete</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "30px" }}>
            <h3>Addresses</h3>
            {!showAddressForm ? (
              <button className="toggle-btn" onClick={() => setShowAddressForm(true)}>Add Address</button>
            ) : (
              <div className="modal">
                <div className="modal-content">
                  <h4>Add Address</h4>
                  <input className="form-input" placeholder="Address Line 1" value={addr1} onChange={(e) => setAddr1(e.target.value)} />
                  <input className="form-input" placeholder="Address Line 2" value={addr2} onChange={(e) => setAddr2(e.target.value)} />
                  <input className="form-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className="form-input" placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                  <input className="form-input" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                  <input className="form-input" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  <button className="create-btn" onClick={createAddress}>Save Address</button>
                  <button className="back-btn" onClick={() => setShowAddressForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {addresses.map((a) => (
              <div key={a.id} className="task-item">
                <strong>{a.address_line1}</strong>
                <p>{a.address_line2}</p>
                <p>{a.city}, {a.state}, {a.pincode}</p>
                <p>{a.country}</p>
                <button className="back-btn" style={{ background: "#dc2626" }} onClick={() => deleteAddress(a.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button className="load-btn" onClick={loadContacts}>Load Contacts</button>
          <ul className="contact-list">
            {contacts.length === 0 && <p>No contacts found</p>}
            {contacts.map((c) => (
              <li key={c.id} className="contact-item" onClick={() => loadDetails(c.id)}>{c.contact_name}</li>
            ))}
          </ul>

          <div className="create-section">
            <h3>Create New Contact</h3>
            <input className="form-input" placeholder="Full Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            <input className="form-input" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            <input className="form-input" placeholder="Phone Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            <textarea className="form-input" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="create-btn" onClick={createContact}>Create Contact</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;