$(document).ready(function () {
    const labels = [];
    const values = [];
  
    //---------------------------------------------------
    // Chart
    //---------------------------------------------------
  
    const ctx = document.getElementById("watchChart");
  
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Indicator",
            data: values,
            borderColor: "blue",
            fill: false,
            tension: 0.2,
          },
        ],
      },
    });
  
    //---------------------------------------------------
    // Helpers
    //---------------------------------------------------
  
    function cleanChar(str) {
      return str
        .replace(/\u200c/g, "")
        .replace(/ك/g, "ک")
        .replace(/ي/g, "ی");
    }
  
    function parseMarketWatch(rawData) {
      const stocks = {};
  
      const rows = rawData.split(";");
  
      rows.forEach((row) => {
        const fields = row.split(",");
  
        // اطلاعات اصلی سهم
        if (fields.length > 20) {
          const inscode = fields[0];
  
          stocks[inscode] = {
            info: {
              inscode: fields[0],
              symbol: cleanChar(fields[2]),
              name: cleanChar(fields[3]),
              last_price: Number(fields[7]),
              close_price: Number(fields[6]),
              volume: Number(fields[9]),
              value: Number(fields[10]),
              yesterday_price: Number(fields[13]),
            },
  
            orderbook: [],
          };
        }
  
        // Order Book
        else if (fields.length === 8) {
          const inscode = fields[0];
  
          if (!stocks[inscode]) return;
  
          stocks[inscode].orderbook.push({
            row: Number(fields[1]),
            buy_count: Number(fields[3]),
            sell_count: Number(fields[2]),
            buy_price: Number(fields[4]),
            sell_price: Number(fields[5]),
            buy_volume: Number(fields[6]),
            sell_volume: Number(fields[7]),
          });
        }
      });
  
      return stocks;
    }
    //---------------------------------------------------
    // Symbol filter
    //---------------------------------------------------

    function filterSymbol(symbol) {
        if (!symbol) return false;
        // شروع با ض یا ط
        if (symbol.startsWith("ض") || symbol.startsWith("ط")) {
        return false;
        }
    
        // پایان با ح
        if (symbol.endsWith("ح")) {
        return false;
        }
    
        // پایان با عدد
        if (/\d$/.test(symbol)) {
        return false;
        }
    
        return true;
    }
    //---------------------------------------------------
    // Average market growth
    //---------------------------------------------------

    function avgGrowth(stocks) {
        let sumGrowth = 0;
        let count = 0;
    
        for (const inscode in stocks) {
        const stock = stocks[inscode];
        const info = stock.info;
    
        const symbol = info.symbol;
    
        // اعمال فیلتر
        if (!filterSymbol(symbol)) continue;
    
        const lastPrice = info.last_price;
        const yesterdayPrice = info.yesterday_price;
    
        // جلوگیری از تقسیم بر صفر
        if (!yesterdayPrice) continue;
    
        const growth =
            ((lastPrice - yesterdayPrice) / yesterdayPrice) * 100;
    
        sumGrowth += growth;
        count++;
        }
    
        if (count === 0) return 0;
    
        return sumGrowth / count;
    }
    //---------------------------------------------------
    // Update
    //---------------------------------------------------
  
    async function updateChart() {
      try {
        const rawData = await $.ajax({
          url: "https://old.tsetmc.com/tsev2/data/MarketWatchInit.aspx?h=0&r=0",
          method: "GET",
          dataType: "text",
        });
  
        const stocks = parseMarketWatch(rawData);
  
        console.log(stocks);
  
        //---------------------------------------------------
        // محاسبات دلخواه
        //---------------------------------------------------
  
        const result = avgGrowth(stocks);
  
        //---------------------------------------------------
  
        const now = new Date().toLocaleTimeString();
  
        labels.push(now);
        values.push(result);
  
        if (labels.length > 100) {
          labels.shift();
          values.shift();
        }
  
        chart.update();
      } catch (err) {
        console.error(err);
      }
    }
  
    updateChart();
  
    setInterval(updateChart, 60 * 1000);
  });
