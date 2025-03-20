/* exported data */
// this is where you will be putting your data model and saving it to localStorage if necessary //

interface Favorites {
  date: string;
  name: string;
  city: string;
  venue: string;
  startTime: string;
}
// DO NOT ERASE THIS CODE
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
// DO NOT ERASE FROM HERE UP TO THE OTHER 'DO NOT ERASE' MESSAGE

// testing this code out but it does not stop another entry from showing
// up in the favorites view. it does do well of not adding duplicates to localStorage
// let favorites: Favorites[] = [];

// function writeFavorites(): void {
//   favorites = removeDuplicates(favorites);
//   localStorage.setItem('local-storage', JSON.stringify(favorites));
// }

// function removeDuplicates(favorites: Favorites[]): Favorites[] {
//   return favorites.filter(
//     (event, index, self) =>
//       index === self.findIndex((e) => event.name === e.name),
//   );
// }

// function readFavorites(): Favorites[] {
//   const favoritesStorage = localStorage.getItem('favorites-storage');
//   if (favoritesStorage) {
//     const json = JSON.parse(favoritesStorage);
//     return json;
//   } else {
//     return [];
//   }
// }

// the code above this is good at not storing duplicates to localStorage
