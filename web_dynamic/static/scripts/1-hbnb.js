$(document).ready(() => {
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
  