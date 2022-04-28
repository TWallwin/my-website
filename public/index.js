window.onload = () => {
  //fetching view data
  const viewCount = document.querySelector(".view-count");
  fetch("https://my-website-tw.herokuapp.com/api/views", {
    method: "POST",
    mode: "cors",
  });

  getDownloads().then((views) => {
    viewCount.innerHTML = `${views.length} Views`;
  });

  //handling routing
  const pageIndex = {
    1: "About",
    2: "Coding",
    3: "Contact",
  };
  const link_switchers = document.querySelectorAll("[data-switcher]");

  const link_spread = document.querySelector(".link-spread");
  const dropdown_button = document.querySelector(".dropdown-button");
  dropdown_button.addEventListener("click", () => {
    const active_link_spread = document.querySelector(".link-spread.is-active");
    if (active_link_spread) {
      link_spread.classList.remove("is-active");
      return;
    }
    link_spread.classList.add("is-active");
  });
  const loading_symbol = document.querySelector(".lds-dual-ring");
  loading_symbol.classList.add("loaded");
  checkCurrentPage(pageIndex);
  for (let i = 0; i < link_switchers.length; i++) {
    const link_switcher = link_switchers[i];
    const page_id = link_switcher.dataset.link;
    link_switcher.addEventListener("click", () => {
      const active_link = document.querySelector(".link-spread .is-active");
      const active_link_spread = document.querySelector(
        ".link-spread.is-active",
      );
      if (active_link_spread) {
        active_link_spread.classList.remove("is-active");
      }
      if (active_link) {
        active_link.classList.remove("is-active");
      }
      link_switcher.classList.add("is-active");
      switchPage(page_id, pageIndex);
    });
  }
};

function switchPage(page_id, pageIndex) {
  const current_page = document.querySelector(".pages .is-active");
  if (current_page) {
    current_page.classList.remove("is-active");
  }

  const next_page = document.querySelector(
    `.pages .page[data-page="${page_id}"]`,
  );
  next_page.classList.add("is-active");
  history.pushState(
    "data to be passed",
    "Tom Wallwin",
    `/${pageIndex[page_id]}`,
  );
}
function checkCurrentPage(pageIndex) {
  const splitUrl = window.location.href.split("/");

  let path = splitUrl[splitUrl.length - 1];

  if (path[path.length - 1] === "#") {
    path = path.slice(0, path.length - 1);
  }
  if (splitUrl[splitUrl.length - 1] === "") {
    path = "About";
  }
  if (Object.values(pageIndex).indexOf(path) === -1) {
    const error_page = document.getElementById("error");
    error_page.classList.add("is-active");
    return;
  }

  for (let i = 1; i <= Object.keys(pageIndex).length; i++) {
    if (pageIndex[i] === path) {
      const link_switchers = document.querySelectorAll("[data-switcher]");
      const link_switcher = link_switchers[i - 1];
      link_switcher.classList.add("is-active");
      switchPage(i, pageIndex);
      break;
    }
  }
}
function getDownloads() {
  return fetch("https://my-website-tw.herokuapp.com/api/views")
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      console.log(body);
      return body.data.views;
    });
}
