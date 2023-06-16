const list = document.querySelector(".list");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const pageText = document.querySelector(".page");
const cards = document.getElementsByClassName("card");
const searchInp = document.querySelector(".search");
const radios = document.querySelectorAll("input[type='radio']");

let page = 1;
let pageTotalCount = 1;

let search = "";
let filter = "";

async function getData() {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character?page=${page}&name=${search}&status=${filter}`
  );
  console.log(filter);
  // для инпута
  if (!response.ok) {
    searchInp.style.outlineColor = "red";
  } else {
    searchInp.style.outlineColor = "";
  }
  const data = await response.json();
  pageTotalCount = data.info.pages;
  return data;
}

render();
async function render() {
  const character = await getData();

  list.innerHTML = "";
  character.results.forEach((item) => {
    list.innerHTML += `
    <div id="${item.status + "," + item.name}" class="card">
        <h2>${item.name}</h2>
        <div class="img">
          <img
            src="${item.image}"
            alt=""
          />
        </div>
    </div>
  `;
  });

  pageText.innerText = `${page} | ${pageTotalCount}`;

  for (let card of cards) {
    card.addEventListener("mouseenter", () => {
      const [status, name] = card.id.split(",");
      card.children[0].innerText = status;
    });
    card.addEventListener("mouseleave", () => {
      const [status, name] = card.id.split(",");
      card.children[0].innerText = name;
    });
  }
}

prev.addEventListener("click", () => {
  if (page <= 1) {
    return;
  }
  page--;
  render();
});

next.addEventListener("click", () => {
  if (page >= pageTotalCount) {
    return;
  }
  page++;
  render();
});

// document.addEventListener("mouseover", (e) => {
//   if (e.target.classList.contains("card")) {
//     const [status, name] = e.target.id.split(",");
//     e.target.children[0].innerText = status;
//   }
// });
// document.addEventListener("mouseleave", (e) => {
//   console.log(e);
//   if (e.target.classList.contains("card")) {
//     const [status, name] = e.target.id.split(",");
//     e.target.children[0].innerText = name;
//   }
// });

//? для инпута

searchInp.addEventListener("input", () => {
  search = searchInp.value;
  page = 1;
  render();
});

//? функионал для фильтра Alive/Dead/Unknown
// console.log(radios);
radios.forEach((item) => {
  item.addEventListener("change", (e) => {
    filter = e.target.id;
    page = 1;

    if (e.target.id == "all") {
      filter = "";
    }

    render();
  });
});
