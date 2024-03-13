//get group id
var pathname = window.location.pathname; 
var pathArray = pathname.split('/'); 
var groupId = pathArray[pathArray.length - 2]; 
console.log(groupId)


//top user popup
var isModalOpen = false; // Initial state is off
document.getElementById('show-top-users').addEventListener('click', function () {

    if (!isModalOpen) {
    $.ajax({
        url:'/secondSavings/top_study_times/' + groupId,
        success: function(data) {
            let modalContent = '<ul>';
            data.top_users.forEach(function(user) {
                modalContent += '<li>' + user.username + ' - ' + user.study_time + '</li>';
            });
            modalContent += '</ul>';
            $('#top-users-modal').html(modalContent).show();
            isModalOpen = true; 
        }
    });
    } else {
        $('#top-users-modal').hide(); 
        isModalOpen = false;
    }
});



//Live Updates
$(document).ready(function() {
    function updateGroupStudy() {
        $.ajax({
            //url: "{% url 'TimeTracker:group_study' group.id %}",
            url:'/secondSavings/groupStudy/' + groupId,
            success: function(data) {
                $('#group-study-container').html(''); // clear all elements in contianer
                $('#group-study-container').html(data);
                
            }
        });
    }
    setTimeout(updateGroupStudy, 5000);
});