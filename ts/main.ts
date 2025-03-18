interface Events {
  date: string;
  name: string;
  city: string;
  venue: string;
  startTime: string;
}

interface FormElements extends HTMLFormControlsCollection {
  location: HTMLInputElement;
  keyword: HTMLInputElement;
}

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

if (!$locationInput) throw new Error('$locationInput query failed');
if (!$keywordInput) throw new Error('$keywordInput query failed');
if (!$form) throw new Error('$form query failed');
if (!$mainPageView) throw new Error('$mainPageView query failed');
if (!$itemsId) throw new Error('$itemsId query failed');
if (!$results) throw new Error('$results query failed');
if (!$homeButton) throw new Error('$homeButton query failed');
if (!$details) throw new Error('$details query failed');

// the purpose of this async function is to call the API and get the necessary
// data to show the user the events in their city based on a keyword search

async function fetchEventData(city: string, keyword: string): Promise<void> {
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
    const events: any[] = data?._embedded?.events;

    const serializedEvents: Events[] = events.map((e) => ({
      name: e.name,
      date: formatDate(e.dates.start.localDate),
      venue: e._embedded.venues[0].name,
      city: e._embedded.venues[0].city.name,
      startTime: formatStartTime(
        e.dates.start.localDate,
        e.dates.start.localTime,
      ),
    }));

    // the for loop is iterating through all the available events and using the
    // renderEntry function to show a list of available events

    for (let i = 0; i < serializedEvents.length; i++) {
      const $li = renderEntry(serializedEvents[i]);
      $itemsId.appendChild($li);
    }

    viewSwap('results');
  } catch (error) {
    console.error('fetch failed!', error);
  }
}

$form.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $form.elements as FormElements;
  if (!$formElements) throw new Error('$formElements query failed');
  fetchEventData($formElements.location.value, $formElements.keyword.value);
});

// made a home-button event listener to link the user back to the home page view

$homeButton.addEventListener('click', () => {
  const $formElements = $form.elements as FormElements;
  if (!$formElements) throw new Error('$formElements query failed');
  viewSwap('main-page');
  $form.reset();
});

// the purpose of this function is to change the user's view from
// the main-page view to the results view that will populate the events in their area
// this is the original function so keep it if the other messes up

function viewSwap(viewName: 'main-page' | 'results' | 'details'): void {
  if (!$results || !$mainPageView || !$details)
    throw new Error('$results or $mainPageView is null');
  if (viewName === 'main-page') {
    $mainPageView.classList.remove('hidden');
    $results.classList.add('hidden');
    $details.classList.add('hidden');
  } else if (viewName === 'results') {
    $mainPageView.classList.add('hidden');
    $results.classList.remove('hidden');
    $details.classList.add('hidden');
  } else if (viewName === 'details') {
    $mainPageView.classList.add('hidden');
    $results.classList.add('hidden');
    $details.classList.remove('hidden');
  }
}

// the purpose of the renderEntry function is to dynamically create table row elements
// and add those to the DOM tree

function renderEntry(event: Events): HTMLTableRowElement {
  const $tr = document.createElement('tr');

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
  $button.setAttribute('class', 'view-button details');

  $button.addEventListener('click', () => {
    showEventDetails(event);
    viewSwap('details');
  });

  $tr.appendChild($td1);
  $tr.appendChild($td2);
  $tr.appendChild($td3);
  $tr.appendChild($button);

  return $tr;
}

// this function was created to show the details of each event when the user
// presses the 'view' button created in the renderEntry function

function showEventDetails(event: Events): void {
  const $details = document.querySelector('.details');
  if (!$details) throw new Error('$details query failed');
  $details.innerHTML = ' ';

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

  const $closeButton = document.createElement('button');
  $closeButton.textContent = 'Close';
  $closeButton.setAttribute('class', 'button');

  $closeButton.addEventListener('click', () => {
    viewSwap('results');
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
  $details.appendChild($closeButton);
}

// created this function to have the date data display as a string with the
// format 'Month Day, Year'

function formatDate(date: string): string {
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

function formatStartTime(dateStr: string, timeStr: string): string {
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
