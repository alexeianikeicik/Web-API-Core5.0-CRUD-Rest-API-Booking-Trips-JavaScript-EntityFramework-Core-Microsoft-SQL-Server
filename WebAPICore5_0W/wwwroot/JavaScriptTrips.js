// Получение всех поездок
async function GetTrips(startLocation = "", finishLocation = "") {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/trips?startLocation=" + startLocation + "&finishLocation=" + finishLocation, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const trips = await response.json();
        let rows = document.querySelector("tbody");
        trips.forEach(trip => {
            // добавляем полученные элементы в таблицу
            if (trip.ordered == false) {
                rows.append(row(trip));
            }
        });
    }
}
// Получение одного пользователя
async function GetTrip(id) {
    const response = await fetch("/api/trips/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const trip = await response.json();
        const form = document.forms["tripForm"];
        form.elements["id"].value = trip.idTrip;
        form.elements["start_location"].value = trip.startLocation;
        form.elements["finish_location"].value = trip.finishLocation;
        form.elements["price"].value = trip.price;
        form.elements["ordered"].checked = trip.ordered;
    }
}
// Добавление поездки
async function CreateTrip(tripStartLocation, tripFinishLocation, tripPrice, tripOrdered) {

    const response = await fetch("api/trips", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            StartLocation: tripStartLocation,
            FinishLocation: tripFinishLocation,
            Price: parseInt(tripPrice, 10),
            Ordered: tripOrdered
        })
    });

    if (response.ok === true) {
        const trip = await response.json();
        reset();
        if (trip.ordered == false) {
            document.querySelector("tbody").append(row(trip));
        } else {
            const responseOrder = await fetch("api/orders", {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: 0,
                    Fio: "",
                    IdTrip: trip.idTrip
                })
            });
            if (responseOrder.ok === true) {
                alert("The trip is booked");
            }
        }
    }
}
// Изменение поездки
async function EditTrip(tripId, tripStartLocation, tripFinishLocation, tripPrice, tripOrdered) {

    const response = await fetch("api/trips/" + tripId, {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            IdTrip: tripId,
            StartLocation: tripStartLocation,
            FinishLocation: tripFinishLocation,
            Price: parseInt(tripPrice, 10),
            Ordered: tripOrdered

        })
    });

    if (response.ok === true) {
        const trip = await response.json();
        reset();

        if (trip.ordered == false) {
            document.querySelector("tr[data-rowid='" + trip.idTrip + "']").replaceWith(row(trip));
        } else {
            const responseOrder = await fetch("api/orders", {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: 0,
                    Fio: "",
                    IdTrip: trip.idTrip
                })
            });
            if (responseOrder.ok === true) {
                document.querySelector("tr[data-rowid='" + trip.idTrip + "']").remove();
                alert("The trip is booked");
            }
        }
    }
}
// Удаление поездки
async function DeleteTrip(id) {

    const response = await fetch("/api/trips/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const trip = await response.json();
        document.querySelector("tr[data-rowid='" + trip.idTrip + "']").remove();
    }
}

// сброс формы
function reset() {
    const form = document.forms["tripForm"];
    form.reset();
    form.elements["id"].value = 0;
}
// создание строки для таблицы
function row(trip) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", trip.idTrip);

    const idTd = document.createElement("td");
    idTd.append(trip.idTrip);
    tr.append(idTd);

    const StartLocationTd = document.createElement("td");
    StartLocationTd.append(trip.startLocation);
    tr.append(StartLocationTd);

    const FinishLocationTd = document.createElement("td");
    FinishLocationTd.append(trip.finishLocation);
    tr.append(FinishLocationTd);

    const PriceTd = document.createElement("td");
    PriceTd.append(trip.price);
    tr.append(PriceTd);

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", trip.idTrip);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Change");
    editLink.addEventListener("click", e => {
        e.preventDefault();
        GetTrip(trip.idTrip);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", trip.idTrip);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Delete");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        DeleteTrip(trip.idTrip);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
//document.getElementById("resetbutton").click(function (e) {
//e.preventDefault();
//reset();
//})
resetbutton.onclick = function (e) {
    e.preventDefault();
    reset();
}

// отправка формы
document.forms["tripForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["tripForm"];
    const id = form.elements["id"].value;
    const startLocation = form.elements["start_location"].value;
    const finishLocation = form.elements["finish_location"].value;
    const price = form.elements["price"].value;
    const ordered = form.elements["ordered"].checked;

    if (id == 0)
        CreateTrip(startLocation, finishLocation, price, ordered);
    else {
        if (id != -1) EditTrip(id, startLocation, finishLocation, price, ordered);
    }
});


// отправка формы
document.forms["filterForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["filterForm"];
    const startLocation = form.elements["startLocation"].value;
    const finishLocation = form.elements["finishLocation"].value;
    document.getElementById("tableTripstbody").innerHTML = "";
    GetTrips(startLocation, finishLocation);
});

// загрузка поездок
GetTrips();