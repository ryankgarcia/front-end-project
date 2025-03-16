'use strict';
// each of these variables query the DOM for specific elements and will be used
// to control what the user see's, dynamically changing the DOM tree
const $locationInput = document.getElementById('location');
const $keywordInput = document.getElementById('keyword');
const $form = document.querySelector('form');
const $mainPageView = document.getElementById('main-page');
const $results = document.getElementById('results');
const $itemsId = document.getElementById('items');
const $homeButton = document.querySelector('.home-button');
if (!$locationInput) throw new Error('$locationInput query failed');
if (!$keywordInput) throw new Error('$keywordInput query failed');
if (!$form) throw new Error('$form query failed');
if (!$mainPageView) throw new Error('$mainPageView query failed');
if (!$itemsId) throw new Error('$itemsId query failed');
if (!$results) throw new Error('$results query failed');
if (!$homeButton) throw new Error('$homeButton query failed');
// making 'space' for these DOM elements but i may need to delete them
// if they don't have the correct functionality
// const $viewButton = document.querySelector('.view-details');
// if (!$viewButton) throw new Error('$viewButton query failed');
// const $favorites = document.getElementById('#favorites');
// if (!$favorites) throw new Error('$favorites query failed');
// the purpose of this async function is to call the API and get the necessary
// data to show the user the events in their city based on a keyword search
async function fetchEventData(city, keyword) {
  if (!$itemsId) throw new Error('$itemsId query failed');
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&city=${city}&apikey=9tbiDGYZwnFcvD2p7AUJuB3lqwoWIfe4`,
    );
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    const data = await response.json();
    console.log('data', data);
    if (!data._embedded) {
      alert('You typed in an invalid keyword');
      return;
    }
    const events = data?._embedded?.events;
    const serializedEvents = events.map((e) => ({
      name: e.name,
      date: formatDate(e.dates.start.localDate),
      venue: e._embedded.venues[0].name,
      city: e._embedded.venues[0].city.name,
      startTime: e.dates.start.localTime,
    }));
    console.log('serialized events', serializedEvents);
    // the for loop is iterating through all the available events and using the
    // renderEntry function to show a list of available events
    for (let i = 0; i < serializedEvents.length; i++) {
      const $li = renderEntry(serializedEvents[i]);
      // console.log('li', $li);
      $itemsId.appendChild($li);
    }
    viewSwap('results');
  } catch (error) {
    console.error('fetch failed!', error);
  }
}
$form.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $form.elements;
  if (!$formElements) throw new Error('$formElements query failed');
  fetchEventData($formElements.location.value, $formElements.keyword.value);
  // $form.reset();
  // if ()
  // viewSwap('results');
});
// made a home-button event listener to link the user back to the home page view
$homeButton.addEventListener('click', () => {
  const $formElements = $form.elements;
  if (!$formElements) throw new Error('$formElements query failed');
  viewSwap('main-page');
  $form.reset();
});
// created a modal so when the user presses the View button
// a modal will pop up with the details of the event that matches the Events interface
// might need to create a pageSwap function to get to the favorites and view details pages
// $viewButton.addEventListener('click', () => {
//   const $formElements = $form.elements as FormElements;
//   if (!$formElements) throw new Error('$formElements query failed');
//   // viewSwap('view-details');
// });
// the purpose of this function is to change the user's view from
// the main-page view to the results view that will populate the events in their area
// this is the original function so keep it if the other messes up
function viewSwap(viewName) {
  if (!$results || !$mainPageView)
    throw new Error('$results or $mainPageView is null');
  if (viewName === 'main-page') {
    $mainPageView.classList.remove('hidden');
    $results.classList.add('hidden');
  } else if (viewName === 'results') {
    $mainPageView.classList.add('hidden');
    $results.classList.remove('hidden');
  }
}
// testing this one out to see if it will do what i want it to..
// function viewSwap(
//   viewName: 'main-page' | 'results' | 'favorites' | 'view-details',
// ): void {
//   const views = {
//     'main-page': $mainPageView,
//     results: $results,
//     favorites: $favorites,
//     'view-details': $viewButton,
//   };
//   if (
//     !views['main-page'] ||
//     !views.results ||
//     !views.favorites ||
//     !views['view-details']
//   ) {
//     throw new Error('One or more views is null');
//   }
//   Object.values(views).forEach((view) => view.classList.add('hidden'));
//   views[viewName].classList.remove('hidden');
//   console.log('switching to view:', `${viewName}`);
// }
// the purpose of the renderEntry function is to dynamically create table row elements
// and add those to the DOM tree
function renderEntry(event) {
  const $tr = document.createElement('tr');
  // $tr.setAttribute('class', 'row');
  const $td1 = document.createElement('td');
  $td1.textContent = event.name;
  const $td2 = document.createElement('td');
  $td2.textContent = event.date;
  $td2.setAttribute('class', 'mobileHidden');
  const $td3 = document.createElement('td');
  $td3.textContent = event.venue;
  $td3.setAttribute('class', 'mobileHidden');
  const $button = document.createElement('button');
  $button.textContent = 'View';
  $button.setAttribute('class', 'view-button');
  // this i might not keep
  $button.setAttribute('class', 'view-button view-details');
  // this i might not keep
  // $button.setAttribute('class', 'modal-actions');
  $tr.appendChild($td1);
  $tr.appendChild($td2);
  $tr.appendChild($td3);
  $tr.appendChild($button);
  return $tr;
}
// created this function to have the date data display as a string with the
// format 'Month Day, Year'
function formatDate(date) {
  const dateData = new Date(date);
  const monthName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthName[dateData.getMonth()];
  const day = dateData.getDate();
  const year = dateData.getFullYear();
  return `${month} ${day}, ${year}`;
}
