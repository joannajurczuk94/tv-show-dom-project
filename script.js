//You can edit ALL of the code here
let searchInput = document.getElementById("search");
let showsSelector = document.getElementById("allshows");
let episodesSelector = document.getElementById("showlist");
let allShows = null;
let allEpisodes = null;

// Sorting shows alphabetically
function setup() {
  allShows = getAllShows();
  let showsSorted = allShows.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  createShowsSelectorOptions(showsSorted);
  fillCards(showsSorted, "show");
}

//Getting data from API 
function getEpisodes (showId) {
  const endpoint = `https://api.tvmaze.com/shows/${showId}/episodes`;
return fetch(endpoint).then((response) => response.json());
}

// Search function invoked
searchInput.addEventListener("input", (e) => {
  let searchWord = e.target.value.toLowerCase();
  let searchResult = search(searchWord, allEpisodes);
  fillCards(searchResult);
  showCount(searchResult);
});

//Searching by typing word in names and summaries
function search(word, episodes) {
  const filteredEpisodes = episodes.filter((episode) => {
    const { name, summary } = episode;
    return (
      name.toLowerCase().includes(word) || summary.toLowerCase().includes(word)
    );
  });
  return filteredEpisodes;
}

// Function below count episodes searched and show the number of episodes found and all episodes  on the screen
function showCount(searchedEpisodes) {
  const showCountElement = document.getElementById("count");
  const searchedEpisodesLength = searchedEpisodes.length;
  const wholeEpisodesLength = allEpisodes.length;
  showCountElement.innerText = `Displaying ${searchedEpisodesLength}/${wholeEpisodesLength} episodes`;
}

function removeDisplayCount() {
  const displayCountElement = document.getElementById("count");
  displayCountElement.innerText = "";
}

//Seasons and episodes number convention
function seasonsAndNumbers(episode) {
  const { season, number } = episode;
  let result = "";
  result += season < 10 ? `S0${season}` : `S${season}`;
  result += number < 10 ? `E0${number}` : `E${number}`;
  return result;
}

//Setting episodes names
function createOptionShowList(episode) {
  const option = document.createElement("option");
  option.setAttribute("value", episode.id);
  option.innerText = episode.name;
  return option;
}
// Option Selector for shows
function createShowsSelectorOptions(allEpisodes) {
  showsSelector.appendChild(
    createOptionShowList({ name: "all shows", id: "all" })
  );
  allEpisodes.forEach((episode) => {
    const option = createOptionShowList(episode);
    showsSelector.appendChild(option);
  });
}


//27 Oct 
showsSelector.addEventListener("change", (e) => {
  let showId = e.target.value;
  if (showId === "all") {
    fillCards (allShows, "show");
    removeDisplayCount();
    episodeList([]);
  } else { 
    getEpisodes(showId).then((data) => {
      allEpisodes = data;
      fillCards(allEpisodes);
      showCount(allEpisodes);
      episodeList(allEpisodes);
    });
  }
});

function createOption(episode) {
  const option = document.createElement("option");
  option.setAttribute("value", episode.id);
  let title = seasonsAndNumbers(episode);
  option.innerText= title + `-${episode.name}`;
  return option;
}

function episodeList(allEpisodes) {
  episodesSelector.innerHTML = "";
  allEpisodes.forEach((episode) => {
    const option = createOption(episode);
    episodesSelector.appendChild(option);
  });
}

episodesSelector.addEventListener("change", (e) => {
  let value = e.target.value;
  console.log(value);
  location.href = `#${value}`;
  let clickedCard = document.getElementById(value);
  clickedCard.classList.add("card--active");
  setTimeout(() => {
    clickedCard.classList.remove("card--active");
  }, 2000);
});

//27 Oct - End


function createLeaf(episode, type) {
  const li = document.createElement("li");
  const titleWrapper = document.createElement("div");
  const episodeTitle = document.createElement("p");
  const description = document.createElement("p");
  const image = document.createElement("img");
  const link = document.createElement("a");

  li.setAttribute("class", "card");
  titleWrapper.setAttribute("class", "title-wrapper");
  episodeTitle.setAttribute("class", "episode-title");

  li.setAttribute("id", episode.id);
  if (type !== "show") {
    let title = seasonsAndNumbers(episode);
    episodeTitle.innerText = episode.name + "-" + title;
  } else {
    episodeTitle.innerText = episode.name;
  }

  image.setAttribute("class", "leaf-img");
  image.setAttribute("src", episode.image ? episode.image.medium : "");

  description.setAttribute("class", "leaf-description");
  description.innerHTML = episode.summary;

  link.setAttribute("class", "imageLink");
  link.href = episode.url;
  link.innerText = "Watch me";

  titleWrapper.appendChild(episodeTitle);
  li.appendChild(titleWrapper);
  li.appendChild(image);
  li.appendChild(description);
  li.appendChild(link);
  return li;
}

function clearCards(ul) {
  ul.innerHTML = "";
}

function fillCards(episodeList, type) {
  let ul = document.getElementById("cards");
  clearCards(ul);
  episodeList.forEach((episode) => {
    const li = createLeaf(episode, type);
    ul.appendChild(li);
  });
}

// makePageForEpisodes(allEpisodes);

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   rootElem.textContent = `Got ${episodeList.length} episode(s)`;
// }

window.onload = setup;
