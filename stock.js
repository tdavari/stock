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
    const filteredMessages = response.msg.filter(
      (msg) =>
        msg.tseDesc.includes("با محدوديت دامنه نوسان قيمت بازگشايي") ||
        msg.tseDesc.includes("گره")
    );

    // Initialize the DataTable with filtered data
    $("#tseDescTable").DataTable({
      data: filteredMessages,
      columns: [
        { data: "tseDesc" }, // Display only the tseDesc column
      ],
    });
  });

  const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

  // Fetch data from the API
  $.getJSON(API_URL, {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 1000,
    page: 1,
    sparkline: false,
  })
    .done(function (data) {
      // Filter and sort the data based on the given criteria
      const filteredData = data
        .filter(
          (item) =>
            item.market_cap > 1e9 &&
            !item.id.includes("usd") &&
            !item.id.includes("btc") &&
            !item.id.includes("wrapped")
        )
        .sort((a, b) => b.ath_change_percentage - a.ath_change_percentage)
        .filter((item) => item.ath_change_percentage > -10);

      // Prepare the data for DataTable
      const tableData = filteredData.map((item) => ({
        id: item.id,
        market_cap: (item.market_cap / 1e9).toFixed(1), // Convert to billion USD
        ath_change_percentage: item.ath_change_percentage.toFixed(2),
        current_price: item.current_price.toFixed(3),
        ath_date: new Date(item.ath_date).toLocaleDateString(),
      }));

      // Initialize DataTable with the filtered data
      $("#cryptoTable").DataTable({
        data: tableData,
        columns: [
          { data: "id", title: "ID" },
          { data: "market_cap", title: "Market Cap (Billion USD)" },
          { data: "ath_change_percentage", title: "ATH Change Percentage (%)" },
          { data: "current_price", title: "Current Price (USD)" },
          { data: "ath_date", title: "ATH Date" },
        ],
        order: [[2, "desc"]],
      });
    })
    .fail(function () {
      console.error("Error fetching data from the API");
    });
});
