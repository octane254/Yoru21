import { useEffect, useState } from "react"

function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.body.classList.add("light-mode");
    } else {
      setIsDarkMode(true);
      document.body.classList.remove("light-mode");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setIsLoading(true);
        
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        // Helper function to fetch with retry and delay
        const fetchWithDelay = async (url, delayMs = 0) => {
          if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
          return fetch(url, { signal: controller.signal });
        };

        // Fetch trending manga - with 1 second delay to avoid rate limiting
        const trendingRes = await fetchWithDelay(
          "https://api.jikan.moe/v4/top/manga?type=manga&limit=25",
          0
        );

        // Fetch popular manga - with 2 second delay to avoid rate limiting
        const popularRes = await fetchWithDelay(
          "https://api.jikan.moe/v4/top/manga?filter=bypopularity&limit=25",
          2000
        );

        clearTimeout(timeout);

        if (!trendingRes.ok) {
          throw new Error(`Trending API Error: ${trendingRes.status} ${trendingRes.statusText}`);
        }

        if (!popularRes.ok) {
          throw new Error(`Popular API Error: ${popularRes.status} ${popularRes.statusText}`);
        }

        const trendingData = await trendingRes.json();
        const popularData = await popularRes.json();

        // Check if data exists
        if (!trendingData.data || trendingData.data.length === 0) {
          throw new Error("No trending manga data received");
        }

        if (!popularData.data || popularData.data.length === 0) {
          throw new Error("No popular manga data received");
        }

        setTrending(trendingData.data);
        setPopular(popularData.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching mangas:", err);
        
        // Set user-friendly error message
        if (err.name === 'AbortError') {
          setError("Request timed out. The API took too long to respond. Try refreshing the page.");
        } else if (err.message.includes("429")) {
          setError("API rate limit reached. Please wait a moment and refresh the page.");
        } else {
          setError(err.message || "Failed to load manga. Please check your internet connection and try again.");
        }
        
        setTrending([]);
        setPopular([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMangas();
  }, []);

  
  if (isLoading) {
    return (
      <div className="loading">
        <div></div>
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
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
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

      {/* Popular Section */}
      <section>
        <h2>Popular Manga</h2>
        {popular.length > 0 ? (
          <div className="grid">
            {popular.slice(0, 12).map(manga => (
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