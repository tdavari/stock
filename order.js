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

const { interval, duration } = getQueryParams();

const button = document.querySelector("#send_order_btnSendOrder");

if (!button) {
  alert("🚫 دکمه خرید پیدا نشد! لطفاً مطمئن شو در صفحه‌ی خرید هستی.");
} else {
  const intervalId = setInterval(() => {
    button.click();
  }, interval);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("✅ عملیات کلیک متوقف شد.");
  }, duration * 60 * 1000);
}
