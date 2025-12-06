import { useState } from "react";
import api from "../api";
import styles from "./Register.module.css";

function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/api/auth/register", form);
      setMsg("✅ Registration successful!");

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      setMsg(
        err.response?.data?.message ??
        err.message ??
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.heading}>Create Your Account</h2>

      <div className={styles.double}>
        <div className={styles.field}>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            placeholder="John"
          />
        </div>
        <div className={styles.field}>
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            placeholder="Doe"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="john@example.com"
        />
      </div>

      <div className={styles.field}>
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="10-digit mobile"
        />
      </div>

      <div className={styles.field}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Strong password"
        />
      </div>

      <button type="submit" className={styles.btn}>
        Create Account
      </button>

      {msg && <p className={styles.msg}>{msg}</p>}
    </form>
  );
}

export default Register;
