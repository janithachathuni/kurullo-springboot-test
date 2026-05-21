import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        {/* <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Welcome to Kurullo
        </h1> */}
        <p className="text-lg max-w-md mb-8" style={{ color: "var(--text-secondary)" }}>
          Track birds, explore sightings, and connect with fellow birders.
        </p>
        <div className="flex gap-4">
          <a href="/register" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }} className="px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
            Get Started
          </a>
          <a href="/login" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }} className="px-6 py-3 rounded-lg font-medium hover:opacity-80 transition">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;