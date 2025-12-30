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
        { data: "demand_ratio" },
        { data: "base_vol_percent" },
        { data: "each_person_buy" },
        { data: "buy_power" },
        { data: "vol_ratio" },
        { data: "free_float_share" },
        { data: "group" },
        { data: "solid" },
        { data: "order_value" },
      ],
      order: [[1, "desc"]],
    });
  });

  // Fetch data from the local all_stock_growth.json file
  $.getJSON("all_stock_growth.json", function (data) {
    // Initialize DataTable with the data
    $("#stockGrowth").DataTable({
      data: data,
      columns: [
        { data: "Name" },
        { data: "From_2024" },
        { data: "From_2023" },
        { data: "From_2022" },
        { data: "From_2021" },
        { data: "From_2020" },
        { data: "From_2019" },
        { data: "Market" },
        { data: "PE" },
      ],
      order: [[6, "desc"]],
      pageLength: 25,
    });
  });

  // // Fetch data from the API for the TSE descriptions table
  // const apiURL = "https://cdn.tsetmc.com/api/Msg/GetMsgByFlow/0/200";
  // $.getJSON(apiURL, function (response) {
  //   // Filter messages to include only those with the specific phrase
  //   const filteredMessages = response.msg.filter(
  //     (msg) =>
  //       msg.tseDesc.includes("با محدوديت دامنه نوسان قيمت بازگشايي") ||
  //       msg.tseDesc.includes("گره")
  //   );

  //   // Initialize the DataTable with filtered data
  //   $("#tseDescTable").DataTable({
  //     data: filteredMessages,
  //     columns: [
  //       { data: "tseDesc" }, // Display only the tseDesc column
  //     ],
  //   });
  // });
  // Fetch data from the API for the TSE descriptions table
  // Fetch data from the API for the TSE descriptions table
  // Today's date in the same format as dEven (YYYYMMDD)
  const today = new Date();
  const todayFormatted =
    today.getFullYear().toString() +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    today.getDate().toString().padStart(2, "0");

  console.log("Today formatted (for dEven):", todayFormatted);
  const apiURL = "https://cdn.tsetmc.com/api/Msg/GetMsgByFlow/0/200";
  $.getJSON(apiURL, function (response) {
    // Filter messages for today only
    const filteredMessages = response.msg.filter(
      (msg) =>
        msg.dEven === Number(todayFormatted) &&
        (msg.tseDesc.includes("با محدوديت دامنه نوسان قيمت بازگشايي") ||
          msg.tseDesc.includes("گره") ||
          msg.tseDesc.includes("آماده انجام معامله") ||
          msg.tseDesc.includes("با محدوديت دامنه نوسان قيمت امروز"))
    );

    // Initialize DataTable
    $("#tseDescTable").DataTable({
      data: filteredMessages,
      columns: [
        { data: "tseDesc", title: "Description" },
        { data: "hEven", title: "Date" },
      ],
      order: [[1, "desc"]],
    });
  });

  const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

  // Fetch data from the API
  $.getJSON(API_URL + "?_=" + new Date().getTime(), {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 250,
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
        current_price: item.current_price.toFixed(2),
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
