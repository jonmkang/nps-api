'use strict'

const api_key = '6Qqqt2XofSdycYXSKD1o6gKaaJahQPIL5tsqcI3i';

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();

      let searchBy = document.getElementById('search-by');
      const search = searchBy.options[searchBy.selectedIndex].value;
      const searchState = $('#js-search-state').val();
      const maxResults = $('#js-max-results').val();
      if(search === 'q'){
        getParksByQuery(searchState, maxResults);
      }else {
        getParksByStateCode(searchState, maxResults);
      }
    });
}

function getParksByQuery(query, maxResults=10){
    const url = `https://developer.nps.gov/api/v1/parks?`;
    let params = {
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

function getParksByStateCode(query, maxResults=10){
    const url = `https://developer.nps.gov/api/v1/parks?`;
    let stateCodes = query.split(/\W+/).join(',');
    console.log(stateCodes)

    let params = {
        api_key: api_key,
        limit: maxResults};
    
    let queryString = formatQueryParams(params);
    const fetchUrl = url + queryString + '&stateCode=' + stateCodes;

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

function giveExample () {
    let searchBy = document.getElementById('search-by');
    if(searchBy.options[searchBy.selectedIndex].value != "stateCode"){
        $('p').remove('.example');
        $('form').append(`<p class="example">Example of key words: camping, forest, lake</p>`);
    } else {
        console.log('this works')
        $('p').remove('.example');
        $('form').append(`<p class="example">Example of state code: NY, MI, MA</p>`);
    }
};

$(watchForm);