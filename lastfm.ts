const BASE_URL = "http://ws.audioscrobbler.com";
const VERSION = "2.0";
const API_KEY = process.env.LASTFM_API_KEY;

export async function getTopAlbums(username: string, period: string, limit: number): Promise<GetTopAlbumsResponse> {
  const endpoint = "user.gettopalbums"
  const url = `${BASE_URL}/${VERSION}/?method=${endpoint}&user=${username}&format=json&limit=${limit}&period=${period}&api_key=${API_KEY}`;
  const response = await fetch(url);

  return await response.json();
}