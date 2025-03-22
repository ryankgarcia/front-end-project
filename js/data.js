'use strict';
/* exported data */
// this is where you will be putting your data model and saving it to localStorage if necessary //
const favorites = readFavorites();
function writeFavorites() {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favorites-storage', favoritesJSON);
}
function readFavorites() {
  const favoritesStorage = localStorage.getItem('favorites-storage');
  if (favoritesStorage) {
    const json = JSON.parse(favoritesStorage);
    return json;
  } else {
    return [];
  }
}
