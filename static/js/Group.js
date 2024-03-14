//Create btn eventListener
document.getElementById('create-group-button').addEventListener('click', function() {

    var groupName = document.getElementById('group-name').value;
    // Let users enter group passwords
    var groupKey = prompt("Please enter a key for the group:");
    if (groupKey === null || groupKey === "") {
        alert('You must enter a key for the group.');
        return;  // If no password is entered, terminate the operation
    }
    
    var formData = new FormData();
    formData.append('name', groupName);
    formData.append('key', groupKey);  

    // Send an AJAX request to the backend 
    fetch('/secondSavings/create_group/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), // Getting a CSRF token from a cookie
        }
    })
    .then(response => response.json())
    .then(data => {
        
        if (data.success) {
           // Display the newly created group column on the page without refreshing.
            var table = document.querySelector('.table tbody');
            var tr = document.createElement('tr');

            var tdName = document.createElement('td');
            var link = document.createElement('a');
            link.setAttribute('href', '/secondSavings/groupStudy/' + data.groupId); 
            link.textContent = data.groupName;
            tdName.appendChild(link);

            var tdAccess = document.createElement('td');
            tdAccess.textContent = data.creatorNickName;

            // adding a delete button
            var tdDelete = document.createElement('td');
            var deleteButton = document.createElement('a');
            deleteButton.setAttribute('class', 'btn btn-secondary');
            deleteButton.setAttribute('href', '#');
            deleteButton.setAttribute('data-group-id', data.groupId);
            deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"> <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path></svg>';
            // Logic for creating a delete button
            deleteButton.addEventListener('click', function(e) {
                e.preventDefault();
                var groupId = this.dataset.groupId;
                var rowElement = this.closest('tr');
                deleteGroup(groupId, rowElement);
            });
            tdDelete.appendChild(deleteButton);


            tr.appendChild(tdName);
            tr.appendChild(tdAccess);
            tr.appendChild(tdDelete);  
            table.appendChild(tr);

            // Empty the input box
            document.getElementById('group-name').value = '';

            alert('Group created successfully!');
        } else {
            alert('Error creating group: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


function deleteGroup(groupId, rowElement) {
    var isConfirmed = confirm("Are you sure you want to delete this group? This action cannot be undone.");
    if (isConfirmed){
        fetch('/secondSavings/delete_group/' + groupId + '/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'), // Getting a CSRF token from a cookie
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Delete successful, remove row
                rowElement.remove();
            } else {
                alert('Error deleting group: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

}

document.querySelectorAll('.delete-group-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        var groupId = this.dataset.groupId; // Get Group ID
        var rowElement = this.closest('tr'); // Find the line element where the button is located
        deleteGroup(groupId, rowElement); // Calling the delete function
    });
});

//function of search btn
document.getElementById('search-button').addEventListener('click', function(event) {
    event.preventDefault();
    var groupName = document.getElementById('group-name').value;
    console.log("1")
    fetch('/secondSavings/search_group/', {
        method: 'POST',
        body: JSON.stringify({ 'groupName': groupName }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("draw search list")
        searchGroupList(data.groups);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

//draw serach Group List on frontend
function searchGroupList(groups) {
    var table = document.querySelector('.table tbody');
    table.innerHTML = ''; // Empty existing groups

    groups.forEach(group => {
        var tr = document.createElement('tr');

        var tdName = document.createElement('td');
        tdName.textContent = group.name;
        tr.appendChild(tdName);

        var tdAccess = document.createElement('td');
        tdAccess.textContent = group.creator__username;
        tr.appendChild(tdAccess);

        var tdAdd = document.createElement('td');
        var addButton = document.createElement('button');
        addButton.textContent = 'Join';
        addButton.setAttribute('data-group-id', group.id);
        addButton.addEventListener('click', function() {
            // Logic for joining groups
            var groupId = this.dataset.groupId;
            var groupKey = prompt("Please enter the key:");
            if (groupKey !== null) {
                console.log(groupKey)
                joinGroup(groupId, groupKey);
            }
        });
        tdAdd.appendChild(addButton);
        tr.appendChild(tdAdd);

        table.appendChild(tr);
    });
}
//method of join btn
function joinGroup(groupId, groupKey) {
    console.log(groupKey)
    fetch('/secondSavings/join_group/' + groupId + '/', {
        method: 'POST',
        body: JSON.stringify({ 'key': groupKey }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Joined group successfully!');
            //updateGroupListForUser();
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

$(document).ready(function() {
    $.ajax({
        url: '/secondSavings/get_user_groups/',  
        method: 'GET',
        success: function(data) {
            updateGroupList(data.groups);
        },
        error: function(error) {
            console.log('Error:', error);
        }
    });
});


//method to reset button
document.getElementById('reset-button').addEventListener('click', function() {
    fetch('/secondSavings/get_user_groups/', {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(response => response.json())
    .then(data => {
        updateGroupList(data.groups);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


function updateGroupList(groups) {
    var table = document.querySelector('.table tbody');
    table.innerHTML = ''; // Empty existing groups

    groups.forEach(group => {
        var tr = document.createElement('tr');

        var tdName = document.createElement('td');
        var link = document.createElement('a');
        link.setAttribute('href', '/secondSavings/groupStudy/' + group.id +'/');   
        link.textContent = group.name;
        tdName.appendChild(link);
        //tdName.textContent = group.name;
        tr.appendChild(tdName);

        var tdAccess = document.createElement('td');
        tdAccess.textContent = group.creatorNickName;
        tr.appendChild(tdAccess);

        var tdAction = document.createElement('td');
        var actionButton = document.createElement('button');
        if (group.is_creator) {
            actionButton.setAttribute('class', 'btn btn-secondary');
            actionButton.setAttribute('href', '#');
            actionButton.setAttribute('data-group-id', group.id);
            actionButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"> <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path></svg>';
            // Add logic for deleting groups
            actionButton.addEventListener('click', function(e) {
                e.preventDefault();
                var groupId = this.dataset.groupId;
                var rowElement = this.closest('tr');
                deleteGroup(groupId, rowElement);
            });
        } else {
            actionButton.textContent = 'Quit Group';
            actionButton.addEventListener('click', function() {
                var groupId = this.dataset.groupId;
                quitGroup(groupId, this.closest('tr'));
            });
            
        }
        actionButton.setAttribute('data-group-id', group.id);
        tdAction.appendChild(actionButton);
        tr.appendChild(tdAction);

        table.appendChild(tr);
    });
}


function quitGroup(groupId, rowElement) {
    fetch('/secondSavings/quit_group/' + groupId + '/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('You have successfully quit the group.');
            rowElement.remove(); 
        } else {
            alert('Error quitting group: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}





// Function to get CSRF token from cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
