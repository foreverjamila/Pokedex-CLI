export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";

  constructor() {}

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const fullURL = pageURL ?? `${PokeAPI.baseURL}/location-area`;
    const response = await fetch(fullURL);
    if (!response.ok) {
      throw new Error(`Error fetching location: ${response.status} ${response.statusText}`);

    }
    return response.json();
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const fullURL = `${PokeAPI.baseURL}/location-area/${locationName}`;
    const response = await fetch(fullURL);
    if (!response.ok) {
      throw new Error(`Error fetching location '${locationName}': ${response.status} ${response.statusText}`);
    }
    return response.json();
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