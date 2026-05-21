import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav style={{
      backgroundColor: "var(--bg-card)",
      borderBottom: "1px solid var(--border)",
      boxShadow: "var(--shadow)"
    }} className="flex items-center justify-between px-8 py-4">
      
      <a href="/" style={{ color: "var(--text-primary)" }} className="text-xl font-bold">
        Kurullo
      </a>

      <div className="flex items-center gap-6">
        <a href="/login" style={{ color: "var(--text-secondary)" }} className="hover:opacity-80 transition">
          Login
        </a>
        <a href="/register" style={{ color: "var(--accent-text)", backgroundColor: "var(--accent)" }} className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition">
          Register
        </a>
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)"
          }}
          className="px-3 py-2 rounded-lg text-sm transition hover:opacity-80"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;