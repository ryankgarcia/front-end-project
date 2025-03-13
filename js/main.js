'use strict';
async function fetchEventData() {
  try {
    const response = await fetch(
      'https://app.ticketmaster.com/discovery/v2/events.json?city=los+angeles&city=phoenix&apikey=9tbiDGYZwnFcvD2p7AUJuB3lqwoWIfe4',
    );
    // const response = await fetch(
    //   'https://app.ticketmaster.com/discovery/v2/events.json?keyword=concert&city=los+angeles&apikey=9tbiDGYZwnFcvD2p7AUJuB3lqwoWIfe4',
    // );
    // const response = await fetch(
    //   'https://app.ticketmaster.com/discovery/v2/events.json?includeSpellcheck=yes&keyword=concerta&page=2&city=los+angeles&apikey=9tbiDGYZwnFcvD2p7AUJuB3lqwoWIfe4',
    // );
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    const data = await response.json();
    console.log('Event Data:', data);
  } catch (error) {
    console.error('fetch failed!', error);
  }
}
fetchEventData();
