$(document).ready(function () {
  // Fetch data from the local data.json file
  $.getJSON("data.json", function (data) {
    // Initialize DataTable with the data
    $("#stockTable").DataTable({
      data: data,
      columns: [
        { data: "name" },
        { data: "queue_order_count" },
        { data: "total_queue_value" },
        { data: "growth" },
        { data: "chance" },
        { data: "market" },
        { data: "days_lock" },
        { data: "vol_ratio" },
        { data: "group" },
      ],
      order: [[1, "desc"]],
    });
  });
});
