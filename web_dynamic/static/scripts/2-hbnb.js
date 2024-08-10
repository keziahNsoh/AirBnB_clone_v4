$(document).ready(() => {
  // Function to update API status
  function checkApiStatus () {
    $.ajax({
      type: 'GET',
      url: 'http://0.0.0.0:5001/api/v1/status/',
      dataType: 'json',
      success: function (response) {
        if (response.status === 'OK') {
          $('#api_status').addClass('available');
        } else {
          $('#api_status').removeClass('available');
        }
      }
    });
  }

  // Check API status when page loads
  checkApiStatus();

  /* List checked amenitie */
  const checkedAmenities = {};
  $('.amenities input[type="checkbox"]').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if (this.checked) {
      checkedAmenities[amenityId] = amenityName;
    } else {
      delete checkedAmenities[amenityId];
    }
    $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
  });
});
