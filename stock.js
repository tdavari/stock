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
        { data: "buy_power" },
        { data: "vol_ratio" },
        { data: "group" },
      ],
      order: [[1, "desc"]],
    });
  });

  // Fetch data from the API for the TSE descriptions table
  const apiURL = "https://cdn.tsetmc.com/api/Msg/GetMsgByFlow/0/200";
  $.getJSON(apiURL, function (response) {
    // Filter messages to include only those with the specific phrase
    const filteredMessages = response.msg.filter((msg) =>
      msg.tseDesc.includes("با محدوديت دامنه نوسان قيمت بازگشايي") || msg.tseDesc.includes("گره")
    );

    // Initialize the DataTable with filtered data
    $("#tseDescTable").DataTable({
      data: filteredMessages,
      columns: [
        { data: "tseDesc" }, // Display only the tseDesc column
      ],
    });
  });

});
