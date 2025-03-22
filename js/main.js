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
const $details = document.querySelector('.details');
const $favorites = document.querySelector('.favorites-view'); // viewSwap
const $favoritesButton = document.getElementById('favorites-button'); // add to favorites
const $noFavorites = document.querySelector('.no-favorites'); // this shows or hides 'no favorites exist text'
const $favoritesHome = document.querySelector('.favorites-home-button');
const $header = document.querySelector('h1');
const $ul = document.getElementById('favorites-list'); // the ul that swaps the favorites when there is at least one
if (!$locationInput) throw new Error('$locationInput query failed');
if (!$keywordInput) throw new Error('$keywordInput query failed');
if (!$form) throw new Error('$form query failed');
if (!$mainPageView) throw new Error('$mainPageView query failed');
if (!$itemsId) throw new Error('$itemsId query failed');
if (!$results) throw new Error('$results query failed');
if (!$homeButton) throw new Error('$homeButton query failed');
if (!$details) throw new Error('$details query failed');
if (!$favorites) throw new Error('$favorites query failed');
if (!$favoritesButton) throw new Error('$favoritesButton query failed');
if (!$favoritesHome) throw new Error('$favoritesHome query failed');
if (!$header) throw new Error('$header query failed');
if (!$ul) throw new Error('$ul query failed');
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
      startTime: formatStartTime(
        e.dates.start.localDate,
        e.dates.start.localTime,
      ),
      id: e.id,
    }));
    // the for loop is iterating through all the available events and using the
    // renderEntry function to show a list of available events from the API call
    for (let i = 0; i < serializedEvents.length; i++) {
      const $li = renderEntry(serializedEvents[i], false);
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
});
// made a home-button event listener to link the user back to the home page view
$homeButton.addEventListener('click', () => {
  const $formElements = $form.elements;
  if (!$formElements) throw new Error('$formElements query failed');
  viewSwap('main-page');
  $form.reset();
});
// the purpose of this function is to change the user's view from
// the main-page view to the results view that will populate the events in
// their area
function viewSwap(viewName) {
  if (!$results || !$mainPageView || !$details || !$favorites)
    throw new Error('$results, $mainPageView, $details, or $favorites is null');
  if (viewName === 'main-page') {
    $mainPageView.classList.remove('hidden');
    $results.classList.add('hidden');
    $details.classList.add('hidden');
    $favorites.classList.add('hidden');
  } else if (viewName === 'results') {
    $mainPageView.classList.add('hidden');
    $results.classList.remove('hidden');
    $details.classList.add('hidden');
    $favorites.classList.add('hidden');
  } else if (viewName === 'details') {
    $mainPageView.classList.add('hidden');
    $results.classList.add('hidden');
    $details.classList.remove('hidden');
    $favorites.classList.add('hidden');
  } else if (viewName === 'favorites-view') {
    $mainPageView.classList.add('hidden');
    $results.classList.add('hidden');
    $details.classList.add('hidden');
    $favorites.classList.remove('hidden');
  }
}
// the purpose of the renderEntry function is to dynamically create table row elements
// and add those to the DOM tree
function renderEntry(event, isFavoritePage) {
  const $tr = document.createElement('tr');
  const $td1 = document.createElement('td');
  $td1.textContent = event.name;
  const $td2 = document.createElement('td');
  $td2.textContent = event.date;
  $td2.setAttribute('class', 'mobileHidden');
  const $td3 = document.createElement('td');
  $td3.textContent = event.venue;
  $td3.setAttribute('class', 'mobileHidden');
  const $td4 = document.createElement('td');
  const $viewButton = document.createElement('button');
  $viewButton.textContent = 'View';
  $viewButton.setAttribute('class', 'view-button details');
  $viewButton.addEventListener('click', () => {
    showEventDetails(event);
    viewSwap('details');
  });
  $td4.appendChild($viewButton);
  $tr.appendChild($td1);
  $tr.appendChild($td2);
  $tr.appendChild($td3);
  $tr.appendChild($td4);
  if (isFavoritePage) {
    const $deleteButton = document.createElement('button');
    $deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    $deleteButton.setAttribute('class', 'delete-button details');
    $td4.appendChild($deleteButton);
  }
  return $tr;
}
// the favoritesButton event listener is going to be used to swap the view for the
// user to their favorites list. that is the only purpose it will serve
$favoritesButton.addEventListener('click', () => {
  viewSwap('favorites-view');
  toggleNoFavorites();
  $ul.innerHTML = '';
  for (const event of favorites) {
    const $li = renderEntry(event, true);
    $ul.appendChild($li);
  }
});
// this function will show the text 'there are no favorites' when there are no
// user favorites in the favorites window
function toggleNoFavorites() {
  if (!$noFavorites) throw new Error('$noFavorites query failed');
  if (readFavorites().length) {
    $noFavorites.classList.add('hidden');
  } else {
    $noFavorites.classList.remove('hidden');
  }
}
// this function was created to show the details of each event when the user
// presses the 'view' button created in the renderEntry function
function showEventDetails(event) {
  const $details = document.querySelector('.details');
  if (!$details) throw new Error('$details query failed');
  $details.innerHTML = '';
  const $eventName = document.createElement('h2');
  $eventName.textContent = event.name;
  $eventName.setAttribute('class', 'upcoming-events');
  const $dateDiv = document.createElement('div');
  $dateDiv.setAttribute('class', 'row-span');
  const $eventDate = document.createElement('span');
  const $spanDate = document.createElement('span');
  $eventDate.textContent = `Date:`;
  $spanDate.setAttribute('class', 'float-right');
  $spanDate.textContent = `${event.date}`;
  const $venueDiv = document.createElement('div');
  $venueDiv.setAttribute('class', 'row-span');
  const $eventVenue = document.createElement('span');
  const $spanVenue = document.createElement('span');
  $eventVenue.textContent = `Venue:`;
  $spanVenue.setAttribute('class', 'float-right');
  $spanVenue.textContent = `${event.venue}`;
  const $cityDiv = document.createElement('div');
  $cityDiv.setAttribute('class', 'row-span');
  const $eventCity = document.createElement('span');
  const $spanCity = document.createElement('span');
  $eventCity.textContent = `City:`;
  $spanCity.setAttribute('class', 'float-right');
  $spanCity.textContent = `${event.city}`;
  const $timeDiv = document.createElement('div');
  $timeDiv.setAttribute('class', 'row-span');
  const $eventTime = document.createElement('span');
  const $spanTime = document.createElement('span');
  $eventTime.textContent = `Start Time:`;
  $spanTime.setAttribute('class', 'float-right');
  $spanTime.textContent = `${event.startTime}`;
  const $closeDiv = document.createElement('div');
  $closeDiv.setAttribute('class', 'button-container');
  const $closeButton = document.createElement('button');
  $closeButton.textContent = 'Close';
  $closeButton.setAttribute('class', 'button button-span');
  // the closeButton event listener was added here in order to monitor the click
  // of the user and send them back to the results page if they want to look
  // at other events
  $closeButton.addEventListener('click', () => {
    viewSwap('results');
  });
  const $addFavoritesButton = document.createElement('button');
  $addFavoritesButton.textContent = 'Add to Favorites';
  $addFavoritesButton.setAttribute('class', 'favorites-button button-span');
  // the addFavorites event listener will be needed to listen for click events
  // and push the current entry into local storage data and the user's favorites page.
  // it should utilize a write favorites function to write that entry to the local storage
  $addFavoritesButton.addEventListener('click', () => {
    // the check4Duplicates variable checks the favorites array for any duplicates
    // if there are no duplicates it will unshift to the favorites array
    // if there are duplicates
    // the 'value' callback is referring to the object that represents favorites
    // this is checking the favorites.id with the event.id
    const check4Duplicates = favorites.find((value) => value.id === event.id);
    if (!check4Duplicates) {
      favorites.unshift(event);
      writeFavorites();
    }
  });
  $details.appendChild($eventName);
  $dateDiv.appendChild($eventDate);
  $dateDiv.appendChild($spanDate);
  $venueDiv.appendChild($eventVenue);
  $venueDiv.appendChild($spanVenue);
  $cityDiv.appendChild($eventCity);
  $cityDiv.appendChild($spanCity);
  $timeDiv.appendChild($eventTime);
  $timeDiv.appendChild($spanTime);
  $details.appendChild($dateDiv);
  $details.appendChild($venueDiv);
  $details.appendChild($cityDiv);
  $details.appendChild($timeDiv);
  $details.appendChild($closeDiv);
  $closeDiv.appendChild($closeButton);
  $closeDiv.appendChild($addFavoritesButton);
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
// created this function to have the start time data display as a string with
// the format 'Day @Time ampm'
function formatStartTime(dateStr, timeStr) {
  const date = new Date(`${dateStr} ${timeStr}`);
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayName = days[date.getDay()];
  // Extract hours and AM/PM format
  let hours = date.getHours();
  const minutes = date.getMinutes() === 0 ? '' : `:${date.getMinutes()}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  return `${dayName} @${hours}${minutes}${ampm}`;
}
// the $header event listener serves to redirect me back to the main-page view
// when while i build out the functionality of my favorites view
$header.addEventListener('click', () => {
  const $formElements = $form.elements;
  if (!$formElements) throw new Error('$formElements query failed');
  viewSwap('main-page');
  $form.reset();
});
// the $favoritesHome event listener serves to redirect the user to the home-page
// view when they are in the favorites view and want to go back to the main-page
$favoritesHome.addEventListener('click', () => {
  const $formElements = $form.elements;
  if (!$formElements) throw new Error('$formElements query failed');
  viewSwap('main-page');
  $form.reset();
});
