'use strict';
/* exported data */
// this is where you will be putting your data model and saving it to localStorage if necessary //
// const favorites: Favorites[] = readFavorites();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function writeFavorites() {
  const favoritesJSON = JSON.stringify(renderEntry);
  localStorage.setItem('favorites-storage', favoritesJSON);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readFavorites() {
  const favoritesStorage = localStorage.getItem('favorites-storage');
  if (favoritesStorage) {
    const json = JSON.parse(favoritesStorage);
    return json;
  } else {
    return favoritesStorage ? JSON.parse(favoritesStorage) : [];
  }
}
