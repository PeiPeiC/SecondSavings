// Profile base avatar
document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to avatar icon
    var avatarIcon = document.querySelector(".user-icon .bi-person-circle");
    if (avatarIcon) {
        avatarIcon.addEventListener("click", function() {
            // Trigger image editing functionality
            console.log("Edit Avatar");

            // Open file chooser dialog for user to select new avatar image file
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onload = function(event) {
                    // Update avatar icon style
                    avatarIcon.style.backgroundImage = "url('" + event.target.result + "')";
                    // Set tooltip text
                    avatarIcon.title = "Click to Change Avatar";
                    // New avatar can be submitted to server for saving here
                    console.log("New avatar has been submitted:", event.target.result);
                };
                reader.readAsDataURL(file);
            };
            input.click();
        });

        // Add mouse hover tooltip
        avatarIcon.title = "Click to Edit Avatar";
    }
});