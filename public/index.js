window.onload = () => {
  //fetching view data
  const viewCount = document.querySelector(".view-count");

  //handling routing
  const pageIndex = {
    1: "About",
    2: "Coding",
    3: "Contact",
  };
  let next_page;
  const link_switchers = document.querySelectorAll("[data-switcher]");
  let viewsLoaded = false;
  const link_spread = document.querySelector(".link-spread");
  const dropdown_button = document.querySelector(".dropdown-button");
  const dropdown_button_text = document.querySelector(".dropdown-button-text");
  dropdown_button.addEventListener("click", () => {
    const active_link_spread = document.querySelector(".link-spread.is-active");
    if (active_link_spread) {
      dropdown_button_text.classList.remove("is-active");
      link_spread.classList.remove("is-active");
      return;
    }
    dropdown_button_text.classList.add("is-active");
    link_spread.classList.add("is-active");
  });
  const loading_symbol = document.querySelector(".lds-dual-ring");
  getViews().then((views) => {
    viewsLoaded = true;
    if (next_page) {
      next_page.classList.add("is-active");
      loading_symbol.classList.add("loaded");
    }
    observer(views).observe(viewCount);
  });

  checkCurrentPage(pageIndex);
  //adds event listeners to setup nav links`
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
        dropdown_button_text.classList.remove("is-active");
      }
      if (active_link) {
        active_link.classList.remove("is-active");
      }
      link_switcher.classList.add("is-active");
      switchPage(page_id, pageIndex);
    });
  }
  function switchPage(page_id, pageIndex) {
    //changes css properties to display correct page and updates current url
    const current_page = document.querySelector(".pages .is-active");
    if (current_page) {
      current_page.classList.remove("is-active");
    }

    next_page = document.querySelector(`.pages .page[data-page="${page_id}"]`);
    if (viewsLoaded) {
      next_page.classList.add("is-active");
      loading_symbol.classList.add("loaded");
    }
    history.pushState(
      "data to be passed",
      "Tom Wallwin",
      `/${pageIndex[page_id]}`,
    );
  }
  function checkCurrentPage(pageIndex) {
    // uses url to work out what page to show and invokes switchPage to get to show that page
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
  function getViews() {
    //sends api request to backend to get view array
    return fetch("https://my-website-tw.herokuapp.com/api/views")
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        return body.views;
      });
  }
  function incViews() {
    //sends api request to backend to add a new view
    return fetch("https://my-website-tw.herokuapp.com/api/views", {
      method: "POST",
      mode: "cors",
    });
  }

  async function startCounter(views) {
    //increments view counter html text
    function waitms() {
      return new Promise((resolve) => setTimeout(resolve, 40));
    }

    for (let i = 0; i <= views.length; i++) {
      await waitms();
      if (i < views.length) {
        i += 1;
      }
      viewCount.innerHTML = `${i} Views`;
    }
    incViews();
  }
  let observer = function makeObserver(views) {
    let startedCounting = false;
    return new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedCounting) {
          startCounter(views);
          startedCounting = true;
        }
      },
      { threshold: [0] },
    );
  };
};
