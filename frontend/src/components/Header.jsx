import './Header.css';

function Header({ total }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">DeskFlow</h1>
        <p className="header-subtitle">Support Triage</p>
      </div>
      <span className="header-pill">{total} tickets</span>
    </header>
  );
}

export default Header;
