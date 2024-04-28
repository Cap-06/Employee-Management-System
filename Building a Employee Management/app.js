const apiBaseUrl = 'https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees';

// Constants for pagination
let itemsPerPage = 10; 
let currentPage = 1; 
let totalPages = 1; 

// Function to fetch employee data from the API with the provided query parameters
async function fetchEmployeeData() {
    try {
        // Build the query parameters for the API request
        const department = document.getElementById('departmentFilter').value;
        const gender = document.getElementById('genderFilter').value;
        const salarySort = document.getElementById('salarySort').value;

        let queryParams = `page=${currentPage}&limit=${itemsPerPage}`;
        if (department) {
            queryParams += `&filterBy=department&filterValue=${department}`;
        }
        if (gender) {
            queryParams += `&filterBy=gender&filterValue=${gender}`;
        }
        if (salarySort) {
            queryParams += `&sort=salary&order=${salarySort}`;
        }

        // Fetch data from the API
        const response = await fetch(`${apiBaseUrl}?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        
        // Determine total number of pages based on the fetched data and items per page
        totalPages = Math.ceil(data.count / itemsPerPage);

        // Display the fetched data in the table
        displayEmployees(data.data);
        
        // Update the state of pagination buttons
        updatePaginationControls();

    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
}

// Function to display employees in a table
function displayEmployees(employees) {
    const employeeTable = document.getElementById('employeeTable');
    employeeTable.innerHTML = ''; // Clear previous table content

    employees.forEach((emp, index) => {
        const row = `<tr>
                        <td>${(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>${emp.name}</td>
                        <td>${emp.gender}</td>
                        <td>${emp.department}</td>
                        <td>$${emp.salary.toLocaleString()}</td>
                    </tr>`;
        employeeTable.insertAdjacentHTML('beforeend', row);
    });
}

// Function to update pagination controls
function updatePaginationControls() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    // Disable "Previous" button if on the first page
    prevButton.disabled = currentPage <= 1;

    // Disable "Next" button if on the last page
    nextButton.disabled = currentPage >= totalPages;
}

// Event listeners for pagination
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--; // Go to the previous page
        fetchEmployeeData(); // Fetch data for the new page
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++; 
        fetchEmployeeData(); 
    }
});

// Event listeners for filters and sorting
document.getElementById('departmentFilter').addEventListener('change', () => {
    currentPage = 1; 
    fetchEmployeeData(); 
});

document.getElementById('genderFilter').addEventListener('change', () => {
    currentPage = 1;
    fetchEmployeeData(); 
});

document.getElementById('salarySort').addEventListener('change', () => {
    currentPage = 1; 
    fetchEmployeeData(); 
});


fetchEmployeeData(); 