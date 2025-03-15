'use strict';
// serialize the data to look like the interface above
// the function i want to use is the map function
// map function takes an array and returns a new array
// to get the city look within the venues array to track where it is so that
// you can get to it
const $locationInput = document.getElementById('location');
const $keywordInput = document.getElementById('keyword');
const $form = document.querySelector('form');
const $mainPageView = document.getElementById('main-page');
const $results = document.getElementById('results');
const $itemsId = document.getElementById('items');
if (!$locationInput) throw new Error('$locationInput query failed');
if (!$keywordInput) throw new Error('$keywordInput query failed');
if (!$form) throw new Error('$form query failed');
if (!$mainPageView) throw new Error('$mainPageView query failed');
if (!$itemsId) throw new Error('$itemsId query failed');
if (!$results) throw new Error('$results query failed');
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
      date: e.dates.start.localDate,
      venue: e._embedded.venues[0].name,
      city: e._embedded.venues[0].city.name,
      startTime: e.dates.start.localTime,
    }));
    console.log('serialized events', serializedEvents);
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
  // if ()
  // viewSwap('results');
});
// this information below should be to create the viewSwap functionality
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
// for the renderEntry function below only keep what you need in order to do
// the function call correctly. ask yourself what elements you want to make into
// li elements and then append that to your DOM tree so that it updates for the user
// dynamically
function renderEntry(event) {
  const $tr = document.createElement('tr');
  // $tr.setAttribute('class', 'row');
  // const $div = document.createElement('div');
  // $div.setAttribute('class', 'column-full');
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
  // $tr.appendChild($div);
  $tr.appendChild($td1);
  $tr.appendChild($td2);
  $tr.appendChild($td3);
  $tr.appendChild($button);
  return $tr;
}
// function renderEntry(fetchEventData: any): HTMLLIElement {
//   const $liRow = document.createElement('li');
//   $liRow.setAttribute('class', 'row');
//   const $divColFull = document.createElement('div');
//   $divColFull.setAttribute('class', 'column-full');
//   const $button = document.createElement('button');
//   $button.setAttribute('type', 'submit');
//   $liRow.appendChild($divColFull);
//   $divColFull.appendChild($button);
//   return $liRow;
// }
