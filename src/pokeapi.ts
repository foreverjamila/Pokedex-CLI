import { Cache } from "./pokecache.js";


export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  #cache: Cache;

  constructor(cacheInterval: number) {
    this.#cache = new Cache(cacheInterval);
  }

  closeCache() {
    this.#cache.stopReapLoop();
  }


  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const fullURL = pageURL ?? `${PokeAPI.baseURL}/location-area`;
    
    const cached = this.#cache.get<ShallowLocations>(fullURL);
    if (cached) {
      return cached;
    }

    const response = await fetch(fullURL);
    if (!response.ok) {
      throw new Error(`Error fetching location: ${response.status} ${response.statusText}`);

    }

    const data: ShallowLocations = await response.json();
    this.#cache.add(fullURL, data);
    return data;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const fullURL = `${PokeAPI.baseURL}/location-area/${locationName}`;
    
    const cached = this.#cache.get<Location>(fullURL);
    if (cached) {
      return cached;
    }

    const response = await fetch(fullURL);
    if (!response.ok) {
      throw new Error(`Error fetching location '${locationName}': ${response.status} ${response.statusText}`);
    }
    const data: Location = await response.json();
    this.#cache.add(fullURL, data);
    return data;
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const fullURL = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;

    const cached = this.#cache.get<Pokemon>(fullURL);
    if (cached) {
      return cached;
    }

    const response = await fetch(fullURL);
    if (!response.ok) {
      throw new Error(`Error fetching pokemon '${pokemonName}': ${response.status} ${response.statusText}`);
    }
    const data: Pokemon = await response.json();
    this.#cache.add(fullURL, data);
    return data;
  }
}

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type Location = {
  id: number;
  name: string;
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
};