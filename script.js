document.addEventListener('DOMContentLoaded', function () {
    let editingIndex = null; // Variable to store the index of the scholarship being edited

    const addBottomBtn = document.getElementById('addBottomBtn');
    const scholarshipEditor = document.getElementById('scholarshipEditor');
    const saveScholarshipBtn = document.getElementById('saveScholarshipBtn');
    const cancelScholarshipBtn = document.getElementById('cancelScholarshipBtn');

    addBottomBtn.addEventListener('click', function () {
        editingIndex = null; // Set to null when adding a new scholarship
        scholarshipEditor.style.display = 'block';
        clearEditorFields(); // Clear the input fields when adding a new scholarship
    });

    saveScholarshipBtn.addEventListener('click', function () {
        // Get values from input fields
        const scholarshipName = document.getElementById('scholarshipName').value;
        const scholarshipNotes = document.getElementById('scholarshipNotes').value;
        const dueDate = document.getElementById('dueDate').value;
        const fundingAmount = document.getElementById('fundingAmount').value;

        // Use the editingIndex variable as the index to edit or null for adding a new scholarship
        const indexToEdit = editingIndex;

        // Perform actions with the entered data (e.g., save to storage)
        const scholarshipData = {
            name: scholarshipName,
            notes: scholarshipNotes,
            dueDate: dueDate,
            fundingAmount: fundingAmount,
        };

        // Assuming you have a function to update the scholarship entry in the storage
        updateScholarship(indexToEdit, scholarshipData);

        // Hide the scholarship editor
        scholarshipEditor.style.display = 'none';

        // Load and display scholarships instantly after saving
        loadScholarships();
    });

    function loadScholarships() {
        chrome.storage.sync.get('scholarships', function (result) {
            const scholarships = result.scholarships || [];
            const scholarshipContainer = document.getElementById('scholarshipContainer');
            scholarshipContainer.innerHTML = '';

            scholarships.forEach((scholarship, index) => {
                const scholarshipElement = createScholarshipElement(scholarship, index);
                scholarshipContainer.appendChild(scholarshipElement);
            });

            console.log('Scholarships loaded:', scholarships);
        });
    }

    function createScholarshipElement(scholarship, index) {
        const scholarshipElement = document.createElement('div');
        scholarshipElement.classList.add('scholarshipEntry');
    
        if (scholarship) {
            scholarshipElement.innerHTML = `
                <div class="scholarshipContent">
                    <p><strong>Name:</strong> ${scholarship.name}</p>
                    <p><strong>Notes:</strong> ${scholarship.notes}</p>
                    <p><strong>Due Date:</strong> ${scholarship.dueDate}</p>
                    <p><strong>Funding Amount:</strong> ${scholarship.fundingAmount}</p>
                </div>
                <div class="scholarshipActions">
                    <button class="editBtn" data-index="${index}">
                        <img src="icons/edit.png" alt="Edit" style="width: 20px; height: 20px;"> 
                    </button>
                    <button class="deleteBtn" data-index="${index}">
                        <img src="icons/del.png" alt="Delete" style="width: 20px; height: 20px;"> 
                    </button>
                </div>
            `;
    
            // Add event listeners to the buttons if the buttons are present
            const editBtn = scholarshipElement.querySelector('.editBtn');
            const deleteBtn = scholarshipElement.querySelector('.deleteBtn');
    
            if (editBtn) {
                editBtn.addEventListener('click', function () {
                    const index = this.getAttribute('data-index');
                    editScholarship(index);
                });
            }
    
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function () {
                    const index = this.getAttribute('data-index');
                    deleteScholarship(index);
                });
            }
        } else {
            console.log('Scholarship Invalid');
            deleteScholarship(index);

        }
    
        return scholarshipElement;
    }
    

    function editScholarship(index) {
        editingIndex = index; // Set the editingIndex when the edit button is clicked
        scholarshipEditor.style.display = 'block';
        // Set the input fields in the editor with the data from the clicked scholarship
        const scholarship = getCurrentScholarship(index);
        document.getElementById('scholarshipName').value = scholarship.name;
        document.getElementById('scholarshipNotes').value = scholarship.notes;
        document.getElementById('dueDate').value = scholarship.dueDate;
        document.getElementById('fundingAmount').value = scholarship.fundingAmount;
    }

    function deleteScholarship(index) {
        chrome.storage.sync.get('scholarships', function (result) {
            const scholarships = result.scholarships || [];
            const deletedScholarship = scholarships.splice(index, 1)[0];

            chrome.storage.sync.set({ 'scholarships': scholarships }, function () {
                console.log('Scholarship deleted:', deletedScholarship);
            });

            // Load scholarships after deletion
            loadScholarships();
        });
    }

    function updateScholarship(index, data) {
        chrome.storage.sync.get('scholarships', function (result) {
            const scholarships = result.scholarships || [];

            if (index !== null && index >= 0 && index < scholarships.length) {
                scholarships[index] = data;

                chrome.storage.sync.set({ 'scholarships': scholarships }, function () {
                    console.log('Scholarship data updated:', data);
                });
            } else {
                scholarships.push(data);

                chrome.storage.sync.set({ 'scholarships': scholarships }, function () {
                    console.log('New scholarship added:', data);
                });
            }
        });
    }

    function getCurrentScholarship(index) {
        const scholarships = JSON.parse(JSON.stringify(result.scholarships || []));
        return scholarships[index];
    }

    function clearEditorFields() {
        document.getElementById('scholarshipName').value = '';
        document.getElementById('scholarshipNotes').value = '';
        document.getElementById('dueDate').value = '';
        document.getElementById('fundingAmount').value = '';
    }

    // Initial load of scholarships
    loadScholarships();
});

