console.log("Hello, Trader!");

(function () {
  // Cleanup if previously running
  if (window.__autoClickIntervalId) {
    clearInterval(window.__autoClickIntervalId);
    window.__autoClickIntervalId = null;
    console.log("⛔️ Previous interval cleared.");
  }

  function getQueryParams() {
    const currentScript = document.currentScript;
    const url = new URL(currentScript.src);
    return {
      interval: Number(url.searchParams.get("interval")) || 333,
      duration: Number(url.searchParams.get("duration")) || 2,
    };
  }

  const { interval, duration } = getQueryParams();
  console.log("🔁 Interval (ms):", interval);
  console.log("⏱ Duration (min):", duration);

  const desktopButton = document.querySelector("#send_order_btnSendOrder");
  const mobileButton = document.querySelector(".footer .send");
  const targetButton = desktopButton || mobileButton;

  if (!targetButton) {
    alert("🚫 دکمه خرید پیدا نشد! لطفاً مطمئن شو در صفحه‌ی خرید هستی.");
    return;
  }

  let clicksSent = 0;
  const startTime = Date.now();
  const endTime = startTime + duration * 60 * 1000;
  let nextClickTime = startTime;

  window.__autoClickIntervalId = setInterval(() => {
    const now = Date.now();

    while (now >= nextClickTime && now <= endTime) {
      targetButton.click();
      clicksSent++;
      console.log(`✅ Clicked`);
      nextClickTime += interval;
    }

    if (now > endTime) {
      clearInterval(window.__autoClickIntervalId);
      window.__autoClickIntervalId = null;
      console.log("🛑 عملیات کلیک متوقف شد.");
      alert("🛑 عملیات کلیک متوقف شد.");
    }
  }, 100); // check more frequently (every 100ms) to stay responsive
})();
