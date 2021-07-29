const nameInput = document.querySelector(".name");
const emojiPanel = document.querySelector(".emojiPanel");
const emojiSearchBar = document.querySelector(".emojiSearchBar");
const searchButton = document.querySelector(".search");
const messageContainer = document.querySelector(".messageHolder");
const messageText = document.querySelector(".messageText");
const okBtn = document.querySelector(".okBtn");
const postBtn = document.querySelector(".postBtn");
const messageList = document.querySelector(".messageList");
const crossBtn = document.querySelector(".cross");
const welcome = document.querySelector(".welcome");
const init = document.querySelector(".init");
const upper = document.querySelector(".upper");
let nameValue;
let active = false;
let isSearched = false;

//functions for displaying gif
const randomGif = async function () {
  const APIKEY = "ZCOFl92RiPuwPPOAnZ091fxMff3pipb0";
  const response = await fetch(
    `https:///api.giphy.com/v1/gifs/trending?api_key=${APIKEY}&limit=20`
  );
  const data = await response.json();
  data.data.forEach((obj) => {
    const gif = document.createElement("img");
    gif.classList.add("gif");
    gif.src = obj.images.downsized_still.url;
    gif.setAttribute("newSrc", obj.images.downsized.url);
    emojiPanel.append(gif);
  });
};

randomGif();

const searchedGif = async function () {
  isSearched = false;
  emojiPanel.innerHTML = "";
  const APIKEY = "ZCOFl92RiPuwPPOAnZ091fxMff3pipb0";
  const response = await fetch(
    `https:///api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=20&q=${emojiSearchBar.value}`
  );
  const data = await response.json();
  data.data.forEach((obj, i) => {
    const gif = document.createElement("img");
    gif.classList.add("gif");
    gif.src = obj.images.downsized_still.url;
    gif.setAttribute("newSrc", obj.images.downsized.url);

    emojiPanel.append(gif);
  });
};
//controls the display of emoji panel
const emojiSearchBtn = document.querySelector(".emojiSearchBtn");
emojiSearchBtn.addEventListener("click", function () {
  if (active === true) {
    emojiPanel.classList.add("hidden");
    active = false;
  } else {
    if (isSearched) {
      emojiPanel.innerHTML = "";
      randomGif();
    }
    emojiPanel.classList.remove("hidden");
    active = true;
  }
});
//search for gif
searchButton.addEventListener("click", function () {
  if (emojiSearchBar.value.trim().length > 0) {
    searchedGif();
    isSearched = true;
    emojiPanel.classList.remove("hidden");
  } else {
    alert("input feild cannot be empty!");
  }
});

emojiPanel.addEventListener("click", function (e) {
  //managing the clicks
  if (!e.target.classList.contains("gif")) return;
  const newGif = document.createElement("img");
  newGif.src = e.target.getAttribute("newSrc");
  newGif.classList.add("newGif");
  messageContainer.append(newGif);
});

okBtn.addEventListener("click", function () {
  if (messageText.value.trim().length > 0) {
    const messageBody = document.createElement("div");
    messageBody.textContent = messageText.value;
    messageContainer.append(messageBody);
    messageText.value = "";
  }
});
//on clicking post btn.
postBtn.addEventListener("click", async function () {
  //creation of posted by div
  const name = document.createElement("div");
  name.textContent = `Posted by :${nameValue}`;
  name.classList.add("name");
  const close = document.createElement("button");
  close.classList.add("btn");
  close.classList.add("remove");
  close.textContent = "X";
  const top = document.createElement("div");
  top.classList.add("top");
  top.append(name);
  top.append(close);

  //creation of post to be posted
  const post = document.createElement("div");
  post.classList.add("post");
  post.innerHTML = messageContainer.innerHTML;
  post.prepend(top);

  //sending the post to firebase
  const response = await fetch(
    "https://codemancers-default-rtdb.firebaseio.com/msg.json",
    {
      method: "POST",
      body: JSON.stringify({ text: post.innerHTML }),
    }
  );
  messageContainer.innerHTML = "";
  upper.classList.add("hidden");
  window.location.reload();
});
//on loading window all the data stored in database is restored
window.addEventListener("load", async function () {
  //in json
  const response = await fetch(
    "https://codemancers-default-rtdb.firebaseio.com/msg.json"
  );
  //in js
  const data = await response.json();

  for (let item of Object.entries(data)) {
    if (item[1].text !== "") {
      const post = document.createElement("div");
      post.classList.add("post");
      post.innerHTML = item[1].text;
      post.setAttribute("data-value", item[0]);
      messageList.prepend(post);
      post.querySelector(".remove").addEventListener("click", function () {
        console.log(`i will delete`);
        del(item[0]);
      });
    }
  }
});

const del = async function (url) {
  const response = await fetch(
    `https://codemancers-default-rtdb.firebaseio.com/msg/${url}.json`,
    {
      method: "DELETE",
    }
  );
  window.location.reload();
};

//login process!
init.addEventListener("click", function (e) {
  //validation
  if (!nameInput.value.trim().length > 0) {
    alert("name value should not be empty!");
    return;
  }
  upper.classList.remove("hidden");
  nameValue = nameInput.value;
  const name = nameInput.value.split(" ")[0];
  welcome.textContent = `Welcome ${name}`;
  nameInput.value = "";
});
//closing the message entering portal!
crossBtn.addEventListener("click", function () {
  upper.classList.add("hidden");
});
