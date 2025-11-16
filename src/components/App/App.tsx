import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import styles from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = useCallback(async (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (!trimmed) {
      toast.error("Please enter your search query.");
      return;
    }

    setQuery(trimmed);
    setMovies([]);
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
    }
  }, [query]);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["movies", query],
    queryFn: () => fetchMovies(query),
    enabled: query !== "",
    placeholderData: keepPreviousData, // Щоб між запитами не було "блимань" екрану і для збереження попереднього запиту, поки не прийдуть нові дані
  });

  useEffect(() => {
    if (isSuccess && data) {
      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
      } else {
        setMovies(data.results);
      }
    }
  }, [isSuccess, data]);

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && <MovieGrid movies={movies} onSelect={handleSelect} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
