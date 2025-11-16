import axios from "axios";
import type { Movie } from "../types/movie";

const BASE = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  page = 1
): Promise<TMDBResponse> {
  const config = {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
    },
  };

  const { data } = await axios.get<TMDBResponse>(BASE, config);
  return data;
}
