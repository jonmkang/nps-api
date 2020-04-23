'use strict'

const api_key = '6Qqqt2XofSdycYXSKD1o6gKaaJahQPIL5tsqcI3i';

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchState = $('#js-search-state').val();
      const maxResults = $('#js-max-results').val();
      getParks(searchState, maxResults);
    });
}

function getParks(query, maxResults=10){
    const url = `https://developer.nps.gov/api/v1/parks?`;
    const params = {
        api_key: api_key,
        q: query,
        limit: maxResults};
    
    const queryString = formatQueryParams(params);
    const fetchUrl = url + queryString;

    fetch(fetchUrl)
        .then(response => response.json())
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => console.log('Something went wrong'))
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    console.log(queryItems);
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults){
    console.log(responseJson.data);
    let data = responseJson.data;
    $('#results-list').empty();
    for(let i = 0; i < data.length & i < maxResults; i++){
        console.log(data[i].fullName);
        let address = getAddress(data[i]);
        $('#results-list').append(
            `<li><h3>${data[i].fullName}</h3><p>${data[i].description}</p><a href="${data[i].url}">${data[i].url}</a>${address}</li>`
        )
    }
    $('#results').removeClass('hidden');
};

function getAddress(park){
    return `<p>${park.addresses[0].line1}, ${park.addresses[0].city}, ${park.addresses[0].stateCode} ${park.addresses[0].postalCode}</p>`
};
  
$(watchForm);