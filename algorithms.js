// Global variables
let array = [];
let iterationCount = 0;

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const generateButton = document.getElementById('generate-array');
    const resetButton = document.getElementById('reset');
    const arrayContainer = document.getElementById('array-container');
    const arrayInput = document.getElementById('array-elements');
    const searchInput = document.getElementById('search-element');
    const searchStatus = document.getElementById('search-status');
    const searchComplexity = document.getElementById('search-complexity');
    const iterationStatus = document.getElementById('iteration-status');

    // Function to reset all inputs and visualizations
    function resetAll() {
        arrayInput.value = ''; // Clear input field for array elements
        searchInput.value = ''; // Clear input field for search element
        searchStatus.textContent = ''; // Clear search status
        searchComplexity.textContent = ''; // Clear search complexity
        iterationStatus.innerHTML = ''; // Clear iteration status
        arrayContainer.innerHTML = ''; // Clear the array visualization
    }

    // Event listener for the reset button
    resetButton.addEventListener('click', () => {
        resetAll(); // Call the reset function when the button is clicked
    });

    // Event listeners for buttons
    generateButton.addEventListener("click", generateArray);
    document.getElementById("linear-search").addEventListener("click", linearSearch);
    document.getElementById("binary-search").addEventListener("click", binarySearch);
});

// Function to generate a new array for searching
function generateArray() {
    const arrayElements = document.getElementById("array-elements").value.split(",").map(Number);
    if (arrayElements.length === 0 || arrayElements.some(isNaN)) {
        alert("Please enter valid numbers separated by commas.");
        return;
    }

    array = arrayElements;
    const arrayContainer = document.getElementById("array-container");
    arrayContainer.innerHTML = ""; // Clear existing bars

    const maxElement = Math.max(...array);
    const scale = 300 / maxElement; // Adjust scale for bar height

    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * scale}px`; // Apply scaling factor
        bar.style.width = `${Math.max(40, 1000 / array.length - 10)}px`; // Dynamic width
        const barLabel = document.createElement("span");
        barLabel.textContent = value;
        bar.appendChild(barLabel);
        arrayContainer.appendChild(bar);
    }
}

// Delay function for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to update iteration status with detailed steps
function updateIterationStatus(iteration, index, value) {
    document.getElementById("iteration-status").innerHTML += `Iteration ${iteration}: Checking index ${index}, value ${value}<br>`;
}

// Linear Search Algorithm
async function linearSearch() {
    const searchElement = parseInt(document.getElementById("search-element").value);
    const bars = document.getElementsByClassName("bar");
    let found = false;
    iterationCount = 0;

    // Reset all bars before starting the search
    Array.from(bars).forEach(bar => bar.classList.remove("active", "found", "sorted"));

    for (let i = 0; i < array.length; i++) {
        // Mark current bar as active
        bars[i].classList.add("active");
        await sleep(500); // Slow down visualization

        if (array[i] === searchElement) {
            // Mark bar as found if it matches the search element
            bars[i].classList.add("found");
            found = true;
            break; // Exit loop if element is found
        } else {
            // If not found, mark the bar as sorted after checking
            bars[i].classList.remove("active");
            bars[i].classList.add("sorted");
        }

        iterationCount++;
        updateIterationStatus(iterationCount, i, array[i]);
    }

    // Ensure bars that were not found are marked as sorted
    for (let i = 0; i < array.length; i++) {
        if (!bars[i].classList.contains("found") && !bars[i].classList.contains("sorted") && bars[i].classList.contains("active")) {
            bars[i].classList.add("sorted");
        }
    }

    document.getElementById("search-status").textContent = found ? `Element ${searchElement} found!` : `Element ${searchElement} not found.`;
    document.getElementById("search-complexity").textContent = `Time Complexity: O(n), Space Complexity: O(1)`;
}

// Function to check if the array is sorted (ascending or descending)
function isSorted(array) {
    let isAscending = true;
    let isDescending = true;

    // Check for ascending order
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            isAscending = false;
            break;
        }
    }

    // Check for descending order
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] < array[i + 1]) {
            isDescending = false;
            break;
        }
    }

    return isAscending || isDescending; // True if either ascending or descending
}

// Binary Search Algorithm
async function binarySearch() {
    const searchElement = parseInt(document.getElementById("search-element").value);
    const bars = document.getElementsByClassName("bar");

    // Check if the array is sorted before proceeding
    if (!isSorted(array)) {
        document.getElementById("search-status").textContent = "Please enter a sorted array to perform binary search.";
        return;
    }

    // Determine if the array is ascending or descending
    const isAscendingOrder = array[0] <= array[array.length - 1];

    let left = 0;
    let right = array.length - 1;
    let found = false;
    iterationCount = 0;

    // Clear previous iteration status
    document.getElementById("iteration-status").innerHTML = '';

    // Visualize the initial state
    Array.from(bars).forEach(bar => bar.classList.remove("active", "found", "sorted"));

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        // Reset the active class for all bars
        Array.from(bars).forEach(bar => bar.classList.remove("active"));
        // Highlight the mid bar
        bars[mid].classList.add("active");

        // Update iteration status
        updateIterationStatus(++iterationCount, mid, array[mid]);
        await sleep(500); // Slow down visualization

        if (array[mid] === searchElement) {
            bars[mid].classList.add("found");
            found = true;
            break;
        } else if ((isAscendingOrder && array[mid] < searchElement) || (!isAscendingOrder && array[mid] > searchElement)) {
            // For ascending order: search in the right half
            // For descending order: search in the left half
            // Mark the left half as sorted
            for (let i = left; i <= mid - 1; i++) {
                bars[i].classList.add("sorted");
            }
            left = mid + 1;
        } else {
            // For ascending order: search in the left half
            // For descending order: search in the right half
            // Mark the right half as sorted
            for (let i = mid + 1; i <= right; i++) {
                bars[i].classList.add("sorted");
            }
            right = mid - 1;
        }
    }

    // Mark the remaining elements outside the final search range as sorted
    for (let i = 0; i < array.length; i++) {
        if (i < left || i > right) {
            bars[i].classList.add("sorted");
        }
    }

    document.getElementById("search-status").textContent = found ? `Element ${searchElement} found!` : `Element ${searchElement} not found.`;
    document.getElementById("search-complexity").textContent = `Time Complexity: O(log n), Space Complexity: O(1)`;
}
