// Import Fuse library
const Fuse = window.Fuse;

// Define array of URLs to fetch CSV data from
let urls = ['https://docs.google.com/spreadsheets/d/e/2PACX-1vTEiypFo3twnAjk5CR3prJ5-AQa7A1gulD5zqgiuJSC0EYrRB0d0ydzv2OVKrS21td-AWDgFqpzpqdL/pub?output=csv', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRkW1NC88GztPKq6LTud_IQTt6fvUHkbQvB7rIiw5ZfJ8OvNMquHr_Sc7R_iPjG4Jc2isnccBP21hgy/pub?gid=0&single=true&output=csv'];

// Empty array to store combined data
let combinedData = [];

// Use Promise.all to fetch and parse all CSV files concurrently
Promise.all(urls.map(url =>
 fetch(url)
  .then(response => response.text())
  .then(data => Papa.parse(data, {header: true}).data)
)).then(dataArrays => {
 // Combine all parsed CSV data into one array
 combinedData = [].concat(...dataArrays);

 // Create table and tbody elements
 let table = document.createElement('table');
 let tbody = document.createElement('tbody');
 table.appendChild(tbody);

 // Create div for image container
 let imgContainer = document.createElement('div');
 imgContainer.id = 'imgContainer';
 document.getElementById('tableContainer').appendChild(imgContainer);

 // Loop over combinedData to create table rows
 combinedData.forEach(row => {
  let tr = document.createElement('tr');
  // Make row clickable
  tr.onclick = function() { window.location = row['Link']; };
  // Loop over values in row to create table cells
  Object.values(row).forEach((value, index) => {
    if (index !== 5 && index !== 6) { // Skip the link and image columns
        let td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
    }
 });


  // Show image when mouse hovers over row
  tr.addEventListener('mouseover', function(e) {
    let imgUrl = this.dataset.imgUrl;
  let img = document.createElement('img');
  img.src = imgUrl ? imgUrl : 'missingface.png';
  img.style.position = 'fixed';
  img.className = 'hoverImage';
  let rect = tr.getBoundingClientRect();
  img.style.top = (rect.bottom + window.scrollY) + 'px';
  img.style.left = (rect.left + window.scrollX) + 'px';
  imgContainer.appendChild(img);
  });
 
  // Hide image when mouse leaves row
  tr.addEventListener('mouseout', function() {
  while (imgContainer.firstChild) {
  imgContainer.removeChild(imgContainer.firstChild);
  }
  });
 
  // Append row to tbody
  tbody.appendChild(tr);
 });



 // Append table to table container
 document.getElementById('tableContainer').appendChild(table);

// Initialize Fuse.js with combinedData
const fuse = new Fuse(combinedData, {
  keys: ['Name', 'Width', 'Length','Height','Category'],
  includeScore: true
 });

 
// Loop over combinedData to create table rows
combinedData.forEach(item => {
 let row = document.createElement('tr');
 row.onclick = function() { window.location = item['Link']; };

 // Store the imgUrl in a data attribute of each row
 row.dataset.imgUrl = item['Image']; // Assuming the image URL is in the 'Image' property

 // Show image when mouse hovers over row
 row.addEventListener('mouseover', function(e) {
   let imgUrl = row.dataset.imgUrl;
   let img = document.createElement('img');
   img.src = imgUrl ? imgUrl : 'missingface.png';
   img.style.position = 'fixed';
   img.className = 'hoverImage';
   let rect = row.getBoundingClientRect();
   img.style.top = (rect.bottom + window.scrollY) + 'px';
   img.style.left = (rect.left + window.scrollX) + 'px';
   imgContainer.appendChild(img);
 });

 // Hide image when mouse leaves row
 row.addEventListener('mouseout', function() {
   while (imgContainer.firstChild) {
     imgContainer.removeChild(imgContainer.firstChild);
   }
 });


 Object.values(item).forEach((value, index) => {
   if (index !== 5 && index !== 6) { // Skip the 5th and 6th columns
     let td = document.createElement('td');
     td.textContent = value;
     row.appendChild(td);
   }
 });

 tbody.appendChild(row);
});

/**
 * Perform a search based on the provided filter.
 *
 * @param {string} filter - The filter to apply to the search.
 * @return {undefined} This function does not return anything.
 */
function performSearch(filter) {
  let tbody = document.querySelector('#tableContainer table tbody');
  tbody.innerHTML = ''; // Clear the existing table body
  let imgContainer = document.getElementById('imgContainer');
 
  if (filter !== '') {
   // Perform the search with Fuse.js
   let result = fuse.search(filter);
 
   // Loop over the result to create table rows
   result.forEach(res => {
     let item = res.item;
     createTableRow(item, tbody, imgContainer);
   });
  } else {
   // If there's no filter, loop over combinedData to create table rows
   combinedData.forEach(item => {
     createTableRow(item, tbody, imgContainer);
   });
  }
 }

/**
 * Creates a table row for a given item and appends it to the tbody element.
 *
 * @param {object} item - The item object containing the data for the table row.
 * @param {HTMLElement} tbody - The tbody element to which the table row will be appended.
 * @param {HTMLElement} imgContainer - The container element for the image.
 */
function createTableRow(item, tbody, imgContainer) {
  let row = document.createElement('tr');
  row.onclick = function() { window.location = item['Link']; };
 
  // Store the imgUrl in a data attribute of each row
  row.dataset.imgUrl = item['Image']; // Assuming the image URL is in the 'Image' property
 
  // Show image when mouse hovers over row
  row.addEventListener('mouseover', function(e) {
   showImage(row, imgContainer);
  });
 
  // Hide image when mouse leaves row
  row.addEventListener('mouseout', function() {
   hideImage(imgContainer);
  });
 
  // Loop over values in item to create table cells
  Object.values(item).forEach((value, index) => {
   if (index !== 5 && index !== 6) { // Skip the 5th and 6th columns
     let td = document.createElement('td');
     td.textContent = value;
     row.appendChild(td);
   }
  });a
 
  tbody.appendChild(row);
 }

 
/**
 * Shows an image in a specified container based on the data attributes of a given row element.
 *
 * @param {Element} row - The row element containing the data attributes.
 * @param {HTMLElement} imgContainer - The container element where the image will be displayed.
 */
function showImage(row, imgContainer) {
  let imgUrl = row.dataset.imgUrl;
  let img = document.createElement('img');
  img.src = imgUrl ? imgUrl : 'missingface.png';
  img.style.position = 'fixed';
  img.className = 'hoverImage';
  let rect = row.getBoundingClientRect();
  img.style.top = (rect.bottom + window.scrollY) + 'px';
  img.style.left = (rect.left + window.scrollX) + 'px';
  imgContainer.appendChild(img);
 }
 
 /**
  * Hides all child elements within the specified image container.
  *
  * @param {HTMLElement} imgContainer - The container element containing the images.
  */
 function hideImage(imgContainer) {
  while (imgContainer.firstChild) {
   imgContainer.removeChild(imgContainer.firstChild);
  }
 }

let searchInput = document.getElementById('searchBar');
searchInput.addEventListener('input', function() {
 performSearch(this.value);
});


});
