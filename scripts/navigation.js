/**
 * This handles the navi.js processing, etc
 */

const mainNavContainer = document.getElementById("nav-items");
const extrasNavContainer = document.getElementById("nav-items-extras");
const nestNavContainer = document.getElementById("nav-items-nest");
const navTopContainer = document.getElementById("nav-top-container");
const settingsBtn = document.querySelector(".settings-btn");
const extrasBtn = document.querySelector(".extras-btn");
const frame = document.getElementById("frame");

let isExtrasPanelActive = false;
let activeNestParent = null;
let lastSelectedNestUrl = null;

function updateExtrasPanelVisibility(visible) {
  isExtrasPanelActive = visible;
  navTopContainer.classList.toggle("extras-active", visible);
  extrasBtn.classList.toggle("active", visible);
}

function hideNestPanel() {
  navTopContainer.classList.remove("nest-active");
}

function showNestPanel(nestKey, parentElement) {
  const items = navData[nestKey]; 
  if (!items) {
    console.error("FATAL ERROR: Nest data for '" + nestKey + "' was not found in the navData object! Check navi.js.");
    return;
  }
  
  updateExtrasPanelVisibility(false);
  navTopContainer.classList.add("nest-active");
  activeNestParent = parentElement;

  nestNavContainer.innerHTML = '';
  const backLink = document.createElement("a");
  backLink.className = "nav-item";
  backLink.innerHTML = `<div class="icon-container"><i class="fa-regular fa-chevron-left"></i></div><span class="nav-text">Back</span>`;
  backLink.href = "#";
  backLink.onclick = (e) => {
    e.preventDefault();
    hideNestPanel();
    updateActiveStates(activeNestParent);
  };
  nestNavContainer.appendChild(backLink);
  nestNavContainer.appendChild(document.createElement("div")).className = "nav-divider";
  populateNav(nestNavContainer, items, false);
}

function updateActiveStates(activeElement) {
  document.querySelectorAll(".nav-item, .quick-action-btn").forEach(el => el.classList.remove("active"));

  if (activeElement) {
    activeElement.classList.add("active");
    if (extrasNavContainer.contains(activeElement)) {
      extrasBtn.classList.add("active");
    }
  }
  
  if (activeNestParent) {
    activeNestParent.classList.add("active");
  }
}

function createNavItem(item, container, isInitialLoad) {
  if (item.type === "divider") {
    container.appendChild(document.createElement("div")).className = "nav-divider";
    return;
  }

  const navLink = document.createElement("a");
  navLink.className = "nav-item";

  if (isInitialLoad && item.title === "Home") {
    navLink.classList.add("active");
    frame.src = item.url;
  }

  let iconClasses = item.icon;
  if (!/fa-(solid|regular|brands)/.test(iconClasses)) iconClasses = `fa-regular ${iconClasses}`;
  
  const nestChevron = item.nest ? `<i class="fa-regular fa-chevron-right nav-chevron"></i>` : '';

  navLink.innerHTML = `<div class="icon-container"><i class="${iconClasses}"></i></div><span class="nav-text">${item.title}${nestChevron}</span>`;
  navLink.href = "#";

  if (container === nestNavContainer && item.url === lastSelectedNestUrl) {
    navLink.classList.add('active');
  }

  navLink.onclick = (e) => {
    e.preventDefault();

    if (item.nest) {
      showNestPanel(item.nest, navLink);
      updateActiveStates(navLink);
      return;
    }

    if (container === mainNavContainer) {
      frame.src = item.url;
      activeNestParent = null;
      lastSelectedNestUrl = null; 
      hideNestPanel();
      updateExtrasPanelVisibility(false);
      updateActiveStates(navLink);
    } else if (container === extrasNavContainer) {
      if (item.selectable) {
        const currentActiveLink = document.querySelector(".nav-item.active");
        if (currentActiveLink) currentActiveLink.classList.remove("active");
        settingsBtn.classList.remove('active');
        navLink.classList.add("active");
        frame.src = item.url;
      } else {
        if (item.url.startsWith("https://")) window.open(item.url, "_blank");
      }
    } else if (container === nestNavContainer) {
      frame.src = item.url;
      lastSelectedNestUrl = item.url;
      updateActiveStates(navLink);
    }
  };

  container.appendChild(navLink);
}

extrasBtn.onclick = () => {
  hideNestPanel();
  updateExtrasPanelVisibility(!isExtrasPanelActive);
  settingsBtn.classList.remove("active");
};

settingsBtn.onclick = () => {
  frame.src = "page/options.html";
  hideNestPanel();
  updateActiveStates(settingsBtn);
  updateExtrasPanelVisibility(false);
};

function populateNav(container, items, isInitial) {
  if (isInitial) container.innerHTML = "";
  items.forEach((item) => createNavItem(item, container, isInitial));
}

populateNav(mainNavContainer, navItems, true);
populateNav(extrasNavContainer, extraNavItems, true);