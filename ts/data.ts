/* exported data */
// this is where you will be putting your data model and saving it to localStorage if necessary //

interface Favorites {
  date: string;
  name: string;
  city: string;
  venue: string;
  startTime: string;
  // favorites?: Events[];
}

// const favorites: Favorites[] = readFavorites();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function writeFavorites(): void {
  const favoritesJSON = JSON.stringify(renderEntry);
  localStorage.setItem('favorites-storage', favoritesJSON);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readFavorites(): Favorites[] {
  const favoritesStorage = localStorage.getItem('favorites-storage');
  if (favoritesStorage) {
    const json = JSON.parse(favoritesStorage);
    return json;
  } else {
    return favoritesStorage ? JSON.parse(favoritesStorage) : [];
  }
}
