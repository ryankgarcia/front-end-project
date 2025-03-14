interface Events {
  date: string;
  name: string;
  city: string;
  venue: string;
  startTime: string;
}

// serialize the data to look like the interface above
// the function i want to use is the map function
// map function takes an array and returns a new array
// to get the city look within the venues array to track where it is so that
// you can get to it

// serialize using JSON.stringify method
// deserialize using JSON.parse

interface FormElements extends HTMLFormControlsCollection {
  location: HTMLInputElement;
  keyword: HTMLInputElement;
}

const $locationInput = document.getElementById('location');
const $keywordInput = document.getElementById('keyword');
const $form = document.querySelector('form');
const $mainPageView = document.getElementById('main-page');
const $itemsId = document.getElementById('items');
const $results = document.getElementById('results');

if (!$locationInput) throw new Error('$locationInput query failed');
if (!$keywordInput) throw new Error('$keywordInput query failed');
if (!$form) throw new Error('$form query failed');

if (!$mainPageView) throw new Error('$mainPageView query failed');
if (!$itemsId) throw new Error('$itemsId query failed');
if (!$results) throw new Error('$results query failed');

async function fetchEventData(city: string, keyword: string): Promise<void> {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&city=${city}&apikey=9tbiDGYZwnFcvD2p7AUJuB3lqwoWIfe4`,
    );

    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    const data = await response.json();
    // const events: Events[] = data?._embedded?.events;
    console.log('data:', data);
    // console.log('events', events);

    // the code below is me trying to serialize the data like mentioned in the
    // code near the top where the interface is
    // i will be getting an array of objects and i want to create a new object
    // with only the properties i want to show the user
    const fetchedData = JSON.parse(data);
    const newDataObj = fetchedData.map((obj: Events[]) => ({
      date: obj,
      name: obj,
      city: obj,
      venue: obj,
      startTime: obj,
    }));
    console.log('newDataObj:', newDataObj);
    // for (let i = 0; i < data.length; i++) {
    //   const $li = renderEntry(data[i]);
    //   $itemsId.appendChild($li);
    // }
    // call the viewSwap function here on to the results ID view.
    // call it conditionally only if the array.length is greater than 0
  } catch (error) {
    console.error('fetch failed!', error);
  }
}

$form.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $form.elements as FormElements;
  if (!$formElements) throw new Error('$formElements query failed');
  fetchEventData($formElements.location.value, $formElements.keyword.value);
  // $form.reset();
});

// for the renderEntry function below only keep what you need in order to do
// the function call correctly. ask yourself what elements you want to make into
// li elements and then append that to your DOM tree so that it updates for the user
// dynamically

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderEntry(entry: any): HTMLLIElement {
  const $liRow = document.createElement('li');
  $liRow.setAttribute('class', 'row');

  const $divColHalf = document.createElement('div');
  $divColHalf.setAttribute('class', 'column-half');

  const $image = document.createElement('img');
  $image.setAttribute('src', entry.photoUrl);

  const $textDiv = document.createElement('div');
  $textDiv.setAttribute('class', 'column-half');

  const $pStrong = document.createElement('p');
  $pStrong.textContent = entry.title;

  const $pDescription = document.createElement('p');
  $pDescription.textContent = entry.notes;

  $liRow.appendChild($divColHalf);
  $divColHalf.appendChild($image);
  $liRow.appendChild($textDiv);
  $textDiv.appendChild($pStrong);
  $textDiv.appendChild($pDescription);

  return $liRow;
}
