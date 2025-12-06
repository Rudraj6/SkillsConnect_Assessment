import "./Home.css";

export default function Home({ onSelect }) {
  return (
    <div className="home-container">
      <div className="home-card">

        <h1 className="home-title">Welcome to SkillsConnect CRM</h1>
        <p className="home-subtitle">
          A simple CRM system to manage contacts, tasks, and communication.
        </p>

        <div className="button-group">
          <button className="primary-btn" onClick={() => onSelect("login")}>
            Login
          </button>

          <button className="secondary-btn" onClick={() => onSelect("register")}>
            Register
          </button>
        </div>

        <footer className="home-footer">
          Developed by <strong>Rudra Jha</strong>
        </footer>

      </div>
    </div>
  );
}
