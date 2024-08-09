$(document).ready(() => {
    // Store selected amenities IDs in a Set to avoid duplicates
    const selectedAmenities = new Set();

    // Event listener for changes to checkbox inputs
    $('input[type="checkbox"]').on('change', function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if ($(this).is(':checked')) {
            // Add amenity ID to the set
            selectedAmenities.add(amenityId);
        } else {
            // Remove amenity ID from the set
            selectedAmenities.delete(amenityId);
        }

        // Update the h4 tag with selected amenities
        const selectedAmenitiesNames = [];
        $('input[type="checkbox"]:checked').each(function() {
            selectedAmenitiesNames.push($(this).data('name'));
        });

        $('#amenities h4').text(`Amenities: ${selectedAmenitiesNames.join(', ')}`);
    });
});

