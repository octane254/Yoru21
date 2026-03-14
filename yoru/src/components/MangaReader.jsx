import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"


function MangaReader({ mangaId, mangaTitle, onClose }) {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mangaDexId, setMangaDexId] = useState(null);

  //Get MangaDex ID from MAL ID
  useEffect(() => {
    const fetchMangaDexId = async () => {
      try {
        setIsLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        // Query MangaDex API to find manga by MAL ID
        const response = await fetch(
          `https://api.mangadex.org/manga?limit=1&ids[]=${mangaId}`,
          { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error("Manga not found on MangaDex");
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setMangaDexId(data.data[0].id);
        } else {
          setError("This manga is not available on MangaDex");
        }
      } catch (err) {
        console.error("Error fetching MangaDex ID:", err);
        setError("Could not find manga on MangaDex API");
      } finally {
        setIsLoading(false);
      }
    };

    if (mangaId) {
      fetchMangaDexId();
    }
  }, [mangaId]);

  //Fetch chapters when MangaDex ID is available
  useEffect(() => {
    const fetchChapters = async () => {
      if (!mangaDexId) return;

      try {
        setIsLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        // Fetch chapters for this manga
        const response = await fetch(
          `https://api.mangadex.org/manga/${mangaDexId}/feed?limit=100&order[chapter]=desc&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`,
          { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setChapters(data.data);
          setError(null);
        } else {
          setError("No chapters found for this manga");
        }
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError("Could not load chapters from MangaDex");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, [mangaDexId]);

  //Fetch pages when chapter is selected
  useEffect(() => {
    const fetchPages = async () => {
      if (selectedChapter === null) {
        setPages([]);
        return;
      }

      try {
        setIsLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const chapterId = chapters[selectedChapter].id;

        // Get chapter pages
        const response = await fetch(
          `https://api.mangadex.org/at-home/server/${chapterId}`,
          { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error("Failed to fetch pages");
        }

        const data = await response.json();
        if (data.chapter && data.chapter.data) {
          const baseUrl = data.baseUrl;
          const chapterHash = data.chapter.hash;
          const pageUrls = data.chapter.data.map(
            (filename) => `${baseUrl}/data/${chapterHash}/${filename}`
          );
          setPages(pageUrls);
          setCurrentPage(0);
        }
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError("Could not load chapter pages");
        setPages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [selectedChapter, chapters]);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error && !chapters.length) {
    return (
      <div className="manga-reader-modal">
        <div className="modal-overlay" onClick={onClose} />
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="error-message">
            <p>{error}</p>
            <p className="info-text">
              Try searching for this manga on MangaDex directly
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !chapters.length) {
    return (
      <div className="manga-reader-modal">
        <div className="modal-overlay" onClick={onClose} />
        <div className="modal-content loading">
          <div className="spinner" />
          <p></p>
        </div>
      </div>
    );
  }

  return (
    <div className="manga-reader-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content reader">
        <div className="reader-header">
          <h2>{mangaTitle}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="no-chapters">
            <p>No chapters available</p>
            <p className="info-text">
              This manga may not be available on MangaDex
            </p>
          </div>
        ) : (
          <div className="reader-container">
            <div className="chapters-sidebar">
              <h3>Chapters</h3>
              <div className="chapters-list">
                {chapters.map((chapter, idx) => {
                  const chapterNum = chapter.attributes.chapter || "N/A";
                  const title = chapter.attributes.title || `Chapter ${chapterNum}`;
                  return (
                    <button
                      key={chapter.id}
                      className={`chapter-btn ${selectedChapter === idx ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedChapter(idx);
                      }}
                    >
                      Ch. {chapterNum}: {title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="reader-main">
              {selectedChapter !== null ? (
                <>
                  {isLoading ? (
                    <div className="page-viewer">
                      <div className="spinner" />
                      <p></p>
                    </div>
                  ) : pages.length > 0 ? (
                    <>
                      <div className="page-viewer">
                        <img 
                          src={pages[currentPage]} 
                          alt={`Page ${currentPage + 1}`}
                          className="manga-page"
                        />
                      </div>

                      <div className="page-controls">
                        <button 
                          onClick={goToPreviousPage}
                          disabled={currentPage === 0}
                          className="nav-btn"
                        >
                          <ChevronLeft size={20} /> Previous
                        </button>
                        <span className="page-counter">
                          Page {currentPage + 1} of {pages.length}
                        </span>
                        <button 
                          onClick={goToNextPage}
                          disabled={currentPage === pages.length - 1}
                          className="nav-btn"
                        >
                          Next <ChevronRight size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="no-chapters">
                      <p>No pages available for this chapter</p>
                      <p className="info-text">
                        The chapter may be unavailable on MangaDex
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="select-chapter">
                  <p>Select a chapter to start reading</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MangaReader;