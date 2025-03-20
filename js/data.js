'use strict';
/* exported data */
// this is where you will be putting your data model and saving it to localStorage if necessary //
// DO NOT ERASE THIS CODE
const favorites = [];
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
// DO NOT ERASE THIS CODE UPWARD. IT WORKS!
// testing this code downward
// interface User {
//   id: number;
//   name: string;
// }
// interface Product {
//   id: number;
//   name: string;
//   price: number;
// }
// const users: User[] = [
//   { id: 1, name: 'John' },
//   { id: 2, name: 'Jane' },
//   { id: 3, name: 'Bob' },
// ];
// const duplicates = favorites.find((e) => e.date === e.name);
// console.log('duplicates:', duplicates);
// testing this code up ward
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
