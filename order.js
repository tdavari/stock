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

// const button = document.querySelector("#send_order_btnSendOrder");
// Determine which version we're on (desktop or mobile)
let button;

// Try finding the desktop button first
button = document.querySelector("#send_order_btnSendOrder");

// If not found, try finding the mobile version
if (!button) {
  button = document.querySelector(".footer .send");
}

if (!button) {
  alert("🚫 دکمه خرید پیدا نشد! لطفاً مطمئن شو در صفحه‌ی خرید هستی.");
} else {
  const intervalId = setInterval(() => {
    button.click();
    console.log("✅ Clicked");
  }, interval);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("✅ عملیات کلیک متوقف شد.");
  }, duration * 60 * 1000);
}
