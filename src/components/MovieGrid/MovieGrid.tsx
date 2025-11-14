// src/components/MovieGrid/MovieGrid.tsx
import type { MouseEvent } from "react";
import type { Movie } from "../../types/movie";
import css from "./MovieGrid.module.css";
import { placeholderPath } from "../../lib/helpers";

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;

  const handleClick = (e: MouseEvent<HTMLDivElement>, movie: Movie) => {
    e.preventDefault();
    onSelect(movie);
  };

  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div className={css.card} onClick={(e) => handleClick(e, movie)}>
            <img
              className={css.image}
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : placeholderPath("500x750")
              }
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
