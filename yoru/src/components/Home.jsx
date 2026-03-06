import { useEffect, useState } from "react"

function Home() {
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setIsLoading(true);
        
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); 

        const response = await fetch("https://api.jikan.moe/v4/top/manga", {
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Check if data exists
        if (!data.data || data.data.length === 0) {
          throw new Error("No manga data received");
        }

        setTrending(data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching mangas:", err);
        
        // Set user-friendly error message
        if (err.name === 'AbortError') {
          setError("Request timed out. Try refreshing the page.");
        } else {
          setError(err.message || "Failed to load manga. Check your internet connection.");
        }
        
        setTrending([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMangas();
  }, []);

  
  if (isLoading) {
    return (
      <div className="loading">
        <div>Loading trending manga...</div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header>
        <h1>YORU</h1>
        <nav>
          <a href="/home">Home</a>
          <a href="/library">Library</a>
          <a href="/explore">Explore</a>
          <a href="/updates">Updates</a>
        </nav>
      </header>

      {/* Trending Section */}
      <section>
        <h2>Trending Manga</h2>
        {trending.length > 0 ? (
          <div className="grid">
            {trending.slice(0, 12).map(manga => (
              <div key={manga.mal_id} className="card">
                {manga.images?.jpg?.image_url ? (
                  <img 
                    src={manga.images.jpg.image_url} 
                    alt={manga.title || "Manga"}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <h3>{manga.title || "Unknown Title"}</h3>
                <p>⭐ {manga.score ? manga.score.toFixed(1) : "N/A"}/10</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No manga found</p>
        )}
      </section>
    </div>
  );
}

export default Home;