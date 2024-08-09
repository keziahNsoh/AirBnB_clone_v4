$(document).ready(function () {
    const apiStatusDiv = $('#api_status');

    function updateApiStatus() {
        $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
            if (data.status === 'OK') {
                apiStatusDiv.addClass('available');
            } else {
                apiStatusDiv.removeClass('available');
            }
        }).fail(function () {
            apiStatusDiv.removeClass('available');
        });
    }

    // Initial check
    updateApiStatus();

    // Optionally, set an interval to periodically check the status
    // setInterval(updateApiStatus, 60000); // Check every 60 seconds
});

