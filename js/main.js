'use strict';
const $locationInput = document.getElementById('location');
const $keywordInput = document.getElementById('keyword');
const $form = document.querySelector('form');
if (!$locationInput) throw new Error('$locationInput query failed');
if (!$keywordInput) throw new Error('$keywordInput query failed');
if (!$form) throw new Error('$form query failed');
async function fetchEventData(city, keyword) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&city=${city}&apikey=9tbiDGYZwnFcvD2p7AUJuB3lqwoWIfe4`,
    );
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    // use the data variable to complete the second feature
    const data = await response.json();
    return data;
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
