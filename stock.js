$(document).ready(function () {
  // Fetch data from the local data.json file
  $.getJSON('data.json', function (data) {

    // Initialize DataTable with the data
    $('#stockTable').DataTable({
      data: data,
      columns: [
        { data: 'name' },
        { data: 'id' },
        { data: 'queue_count' },
        { data: 'queue_vol' },
        { data: 'price' },
        { data: 'sell_vol' },
        { data: 'total_queue_price' },
        { data: 'growth' }
      ]
    });
  });
});
