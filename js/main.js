"use strict";
let container = document.querySelector(".container");
let overlay = document.querySelector(".overlay");
let search = document.getElementById("search");
let addBtn = document.getElementById("addBtn");
let totalPrice = document.getElementById("totalPrice");
let Name = document.getElementById("name");
let price = document.getElementById("price");
let date = document.getElementById("date");
let list = document.querySelector(".list");
let addItemBtn = document.getElementById("addItemBtn");
let closeBtn = document.getElementById("close");
let updateItemBtn = document.getElementById("updateItemBtn");
let heading = document.getElementById("heading");
String.prototype.toCamelCase = function () {
    let str = this.split(" ").reduce((preVal, val) => {
        return preVal + " " + val.charAt(0).toUpperCase() + val.substring(1);
    });
    return str.charAt(0).toUpperCase() + str.substring(1);
};
function getLocalStorage() {
    let data = localStorage.getItem("shopping-lists");
    if (data) {
        let total = 0;
        let lists = JSON.parse(data);
        lists.forEach((obj) => {
            addToList(obj);
            total += obj.price;
        });
        totalPrice.innerHTML = `&#8377; ${total}`;
    }
}
getLocalStorage();
function showOverlay() {
    container.style.display = "none";
    overlay.style.display = "flex";
    date.min = new Date().toISOString().split("T")[0];
}
function hideOverLay() {
    container.style.display = "flex";
    overlay.style.display = "none";
}
addBtn.addEventListener("click", showOverlay);
closeBtn.addEventListener("click", hideOverLay);
addItemBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (Name.value == "") {
        alert("Item name should not be empty");
        return;
    }
    addToList(ToObject());
    document.forms[0].reset();
});
function removeEl() {
    this.parentElement.remove();
    setToLocalStorage();
}
function editFun() {
    let parent = this.parentElement.parentElement.children;
    window.NameEl = parent[0].children[1];
    window.DateEl = parent[0].children[2];
    window.hidden = parent[0].children[3];
    window.PriceEl = parent[1];
    showOverlay();
    Name.value = parent[0].children[1].textContent;
    price.value = parent[1].textContent.replace(/^\D+/g, "");
    date.value = parent[0].children[3].textContent;
    updateItemBtn.style.display = "";
    addItemBtn.style.display = "none";
    heading.textContent = "Update List";
}
function setToLocalStorage() {
    let lis = document.querySelectorAll(".li-item");
    let arr = [];
    let total = 0;
    lis.forEach((el) => {
        var _a, _b, _c, _d, _e;
        let obj = {
            name: (_a = el.querySelector("#itemName")) === null || _a === void 0 ? void 0 : _a.textContent,
            price: Number((_c = (_b = el.querySelector(".price")) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.replace(/^\D+/g, "")),
            date: (_d = el.querySelector(".date")) === null || _d === void 0 ? void 0 : _d.textContent,
            exp: (_e = el.querySelector("#exp")) === null || _e === void 0 ? void 0 : _e.textContent,
        };
        total += obj.price;
        arr.push(obj);
    });
    totalPrice.innerHTML = `&#8377; ${total}`;
    localStorage.setItem("shopping-lists", JSON.stringify(arr));
}
function addToList(obj) {
    let li = document.createElement("li");
    li.className = "li-item";
    let item = document.createElement("span");
    item.className = "item";
    let edit = document.createElement("span");
    edit.className = "material-symbols-outlined";
    edit.style.cursor = "pointer";
    edit.textContent = "edit";
    edit.onclick = editFun;
    let itemName = document.createElement("span");
    itemName.textContent = obj.name;
    itemName.id = "itemName";
    let dateSpan = document.createElement("p");
    dateSpan.textContent = obj.date;
    dateSpan.className = "date";
    let hiddenDate = document.createElement("samp");
    hiddenDate.textContent = obj.exp;
    hiddenDate.style.display = "none";
    hiddenDate.id = "exp";
    item.appendChild(edit);
    item.appendChild(itemName);
    item.appendChild(dateSpan);
    item.appendChild(hiddenDate);
    let spanPrice = document.createElement("span");
    spanPrice.className = "price";
    spanPrice.innerHTML = `&#8377; ${obj.price}`;
    let deleteSpan = document.createElement("span");
    deleteSpan.className = "delete material-symbols-outlined";
    deleteSpan.textContent = "delete";
    deleteSpan.onclick = removeEl;
    li.appendChild(item);
    li.appendChild(spanPrice);
    li.appendChild(deleteSpan);
    list.appendChild(li);
    hideOverLay();
    setToLocalStorage();
}
updateItemBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (Name.value == "") {
        alert("Item name should not be empty");
        return;
    }
    let obj = ToObject();
    window.NameEl.textContent = obj.name;
    window.DateEl.textContent = obj.date;
    window.PriceEl.textContent = obj.price;
    window.hidden.textContent = obj.exp;
    updateItemBtn.style.display = "none";
    addItemBtn.style.display = "";
    setToLocalStorage();
    hideOverLay();
    heading.textContent = "Add To List";
    document.forms[0].reset();
});
function ToObject() {
    let shoppingDate;
    if (date.value == "") {
        shoppingDate = new Intl.RelativeTimeFormat("en-in", {
            style: "long",
            numeric: "auto",
        }).format(1, "day");
    }
    else {
        let date1 = new Date(date.value);
        let date2 = new Date();
        const diffTime = Number(date1) - Number(date2);
        const diffDays = Number.parseInt(`${diffTime / (1000 * 60 * 60 * 24)}`);
        shoppingDate = new Intl.RelativeTimeFormat("en-in", {
            style: "long",
            numeric: "auto",
        }).format(diffDays, "day");
    }
    let now = new Date();
    let obj = {
        name: Name.value.toCamelCase().toString(),
        price: Number(price.value),
        date: shoppingDate,
        exp: date.value != ""
            ? date.value
            : new Date(now.setDate(now.getDate() + 1)).toISOString().split("T")[0],
    };
    return obj;
}
search.addEventListener("keyup", () => {
    document.querySelectorAll(".li-item").forEach((el) => {
        var _a;
        if ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes(search.value)) {
            el.style.display = "";
        }
        else {
            el.style.display = "none";
        }
    });
});
