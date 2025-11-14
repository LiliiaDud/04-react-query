import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

type Status = "idle" | "loading" | "success" | "error";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = useCallback(async (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (!trimmed) {
      toast.error("Please enter your search query.");
      return;
    }

    setQuery(trimmed);
    setMovies([]);
    setStatus("loading");

    try {
      const { results } = await fetchMovies(trimmed);

      if (results.length === 0) {
        toast("No movies found for your request.");
        setStatus("success");
        return;
      }
      console.log("Results:", results);
      setMovies(results);
      setStatus("success");
    } catch (e) {
      console.error("Error:", e);
      setStatus("error");
    }
  }, []);

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (query === "") {
      setMovies([]);
      setStatus("idle");
    }
  }, [query]);

  const showGrid = status === "success" && movies.length > 0;

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSubmit} />
      {status === "loading" && <Loader />}
      {status === "error" && <ErrorMessage />}
      {showGrid && <MovieGrid movies={movies} onSelect={handleSelect} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
