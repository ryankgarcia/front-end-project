/* exported data */
// this is where you will be putting your data model and saving it to localStorage if necessary //

interface Favorites {
  date: string;
  name: string;
  city: string;
  venue: string;
  startTime: string;
}

const favorites: Favorites[] = [];

function writeFavorites(): void {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favorites-storage', favoritesJSON);
}

function readFavorites(): Favorites[] {
  const favoritesStorage = localStorage.getItem('favorites-storage');
  if (favoritesStorage) {
    const json = JSON.parse(favoritesStorage);
    return json;
  } else {
    return [];
  }
}
