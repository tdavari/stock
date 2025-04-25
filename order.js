(function () {
  console.log("Hello, Trader!");

  // Utility: get query params from script tag
  function getQueryParams() {
    const currentScript = document.currentScript;
    const url = new URL(currentScript.src);
    const interval = Number(url.searchParams.get("interval")) || 333;
    const duration = Number(url.searchParams.get("duration")) || 2;

    console.log("⏱️ Interval between clicks (ms):", interval);
    console.log("⏳ Total duration (min):", duration);

    return { interval, duration };
  }

  const params = getQueryParams();

  let button = document.querySelector("#send_order_btnSendOrder") || 
               document.querySelector(".footer .send");

  if (!button) {
    alert("🚫 دکمه خرید پیدا نشد! لطفاً مطمئن شو در صفحه‌ی خرید هستی.");
  } else {
    const workerCode = `
      (function() {
        let intervalId;
        let endTime;
        let startTime = Date.now();

        self.onmessage = function(e) {
          const { action, interval, duration } = e.data;

          if (action === 'start') {
            endTime = Date.now() + (duration * 60 * 1000);
            intervalId = setInterval(() => {
              const currentTime = Date.now();
              const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
              const remaining = endTime - currentTime;

              if (remaining <= 0) {
                clearInterval(intervalId);
                self.postMessage({ action: 'stop', elapsed: elapsedSeconds });
              } else {
                self.postMessage({ action: 'click', elapsed: elapsedSeconds });
              }
            }, interval);
          } else if (action === 'stop') {
            if (intervalId) clearInterval(intervalId);
          }
        };
      })();
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    const startTime = Date.now();

    worker.onmessage = function(e) {
      if (e.data.action === 'click') {
        button.click();
        console.log("✅ Clicked");
      } else if (e.data.action === 'stop') {
        const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        console.log("✅ عملیات کلیک متوقف شد. (کل زمان: " + totalSeconds + " ثانیه)");
      }
    };

    worker.postMessage({
      action: 'start',
      interval: params.interval,
      duration: params.duration
    });
  }
})();
