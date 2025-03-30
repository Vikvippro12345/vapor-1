// THIS FILE REGISTERS THE SW.

"use strict";
const stockSW = "/vpr/sw.js";

const swAllowedHostnames = ["localhost", "127.0.0.1"];

export async function registerSW() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");

    throw new Error("Your browser doesn't support service workers.");
  }

  await navigator.serviceWorker.register(stockSW);
}

// we love vaprox -everyone
