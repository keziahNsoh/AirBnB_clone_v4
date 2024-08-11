$(document).ready(() => {
  const HOST = 'http://0.0.0.0';

  // Function to update API status
  function checkApiStatus () {
    $.ajax({
      type: 'GET',
      url: `${HOST}:5001/api/v1/status/`,
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
  const checkedStates = {};
  const checkedCities = {};

  function updateCheckedItems ($checkbox, checkedItems, headerSelector) {
    const itemId = $checkbox.data('id');
    const itemName = $checkbox.data('name');

    if ($checkbox.is(':checked')) {
      checkedItems[itemId] = itemName;
    } else {
      delete checkedItems[itemId];
    }

    const itemList = Object.values(checkedItems).join(', ');
    $(headerSelector).text(itemList);
  }

  $('.amenities input[type="checkbox"]').change(function () {
    updateCheckedItems($(this), checkedAmenities, '.amenities h4');
  });

  $('.locations #state').change(function () {
    updateCheckedItems($(this), checkedStates, '.locations h4');
  });

  $('.locations #city').change(function () {
    updateCheckedItems($(this), checkedCities, '.locations h4');
  });

  // Function to create place articles
  function createPlaceArticle (place, user) {
    // Get owner info
    return `
        <article>
            <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
            </div>
            <div class="user">
              <b>Owner:</b> ${user.first_name} ${user.last_name}
            </div>
            <div class="description">
                ${place.description}
            </div>
            <div class="reviews">
                <h2>Reviews <span class="toggle-reviews" data-place-id="${place.id}">show</span></h2>
                <ul class="review-list"></ul>
            </div>
        </article>
    `;
  }

  $.ajax({
    url: `${HOST}:5001/api/v1/places_search/`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (places) {
      $('section.places').empty();
      places.forEach(function (place) {
        $.ajax({
          type: 'GET',
          url: `${HOST}:5001/api/v1/users/${place.user_id}`,
          dataType: 'json',
          success: function (user) {
            $('section.places').append(createPlaceArticle(place, user));
          }
        });
      });
    }
  });

  $('section.filters button').click(function () {
    const filters = {
      amenities: Object.keys(checkedAmenities),
      states: Object.keys(checkedStates),
      cities: Object.keys(checkedCities)
    };

    $.ajax({
      url: `${HOST}:5001/api/v1/places_search/`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (places) {
        $('section.places').empty();
        places.forEach(function (place) {
          $.ajax({
            type: 'GET',
            url: `${HOST}:5001/api/v1/users/${place.user_id}`,
            dataType: 'json',
            success: function (user) {
              $('section.places').append(createPlaceArticle(place, user));
            }
          });
        });
      }
    });
  });

  // Add click event listener for reviews toggle
  $(document).on('click', '.toggle-reviews', function () {
    const $toggleSpan = $(this);
    const placeId = $toggleSpan.data('place-id');
    const $reviewList = $toggleSpan.closest('.reviews').find('.review-list');

    if ($toggleSpan.text() === 'show') {
      // Fetch and display reviews
      $.ajax({
        url: `${HOST}:5001/api/v1/places/${placeId}/reviews`,
        type: 'GET',
        success: function (reviews) {
          $reviewList.empty();
          reviews.forEach(function (review) {
            // Get user info
            $.ajax({
              type: 'GET',
              url: `${HOST}:5001/api/v1/users/${review.user_id}`,
              dataType: 'json',
              success: function (user) {
                // Render review
                $reviewList.append(`
                            <li>
                                <h3>From ${user.first_name} ${user.last_name} the ${new Date(review.created_at).toDateString()}</h3>
                                <p>${review.text}</p>
                            </li>
                        `);
                $toggleSpan.text('hide');
              }
            });
          });
        }
      });
    } else {
      // Hide reviews
      $reviewList.empty();
      $toggleSpan.text('show');
    }
  });
});
