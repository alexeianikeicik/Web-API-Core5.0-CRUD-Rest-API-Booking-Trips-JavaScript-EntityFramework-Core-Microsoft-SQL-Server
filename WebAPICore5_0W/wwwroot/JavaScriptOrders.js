// Получение всех поездок
async function GetOrders(fio = "") {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/orders?fio=" + fio, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const orders = await response.json();
        let rows = document.querySelector("tbody");
        orders.forEach(async order => {
            // отправляет запрос и получаем ответ
            const responsetrip = await fetch("/api/trips/" + order.idTrip, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            // если запрос прошел нормально
            if (responsetrip.ok === true) {
                const trip = await responsetrip.json();
                // добавляем полученные элементы в таблицу
                rows.append(row(order, trip));
            }
        });
    }
}
// Получение одного пользователя
async function GetOrder(id) {
    const response = await fetch("/api/orders/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (response.ok === true) {
        const order = await response.json();
        const form = document.forms["orderForm"];
        form.elements["id"].value = order.id;
        form.elements["idTrip"].value = order.idTrip;
        form.elements["fio"].value = order.fio;

        const responsetrip = await fetch("/api/trips/" + order.idTrip, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        // если запрос прошел нормально
        if (responsetrip.ok === true) {
            const trip = await responsetrip.json();
            form.elements["ordered"].checked = trip.ordered;
        }
    }
}
// Изменение поездки
async function EditOrder(orderId, idTrip, fio, ordered) {

    const response = await fetch("api/orders/" + orderId, {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            Id: orderId,
            Fio: fio,
            IdTrip: idTrip
        })
    });

    if (response.ok === true) {
        const order = await response.json();
        reset();
        const responsetrip = await fetch("/api/trips/" + order.idTrip, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        // если запрос прошел нормально
        if (responsetrip.ok === true) {
            const trip = await responsetrip.json();
            if (ordered == true) {
                //изменение полученного элемента в таблице
                document.querySelector("tr[data-rowid='" + order.id + "']").replaceWith(row(order, trip));
            } else {
                await DeleteBookingTrip(order, trip, false);
            }
        }
    }
}
// Удаление поездки
async function DeleteOrder(id) {

    const response = await fetch("/api/orders/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const order = await response.json();
        document.querySelector("tr[data-rowid='" + order.id + "']").remove();
    }
}

//Отмена бронирования поездки
async function DeleteBookingTrip(order, trip, ordered) {
    const responsetripput = await fetch("api/trips/" + trip.idTrip, {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            IdTrip: trip.idTrip,
            StartLocation: trip.startLocation,
            FinishLocation: trip.finishLocation,
            Price: parseInt(trip.price, 10),
            Ordered: ordered
        })
    });
    if (responsetripput.ok === true) {
        DeleteOrder(order.id);
        alert("Cancellation of the reservation");
    }
}

// сброс формы
function reset() {
    const form = document.forms["orderForm"];
    form.reset();
    form.elements["id"].value = 0;
    form.elements["idTrip"].value = 0;
    form.elements["fio"].value = "";
}
// создание строки для таблицы
function row(order, trip) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", order.id);

    const idTd = document.createElement("td");
    idTd.append(order.id);
    tr.append(idTd);

    const IdTripTd = document.createElement("td");
    IdTripTd.append(order.idTrip);
    tr.append(IdTripTd);

    const FioTd = document.createElement("td");
    FioTd.append(order.fio);
    tr.append(FioTd);

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
    editLink.setAttribute("data-id", order.idorder);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Change");
    editLink.addEventListener("click", e => {
        e.preventDefault();
        document.getElementById('submit').disabled = false;
        document.getElementById('resetbutton').disabled = false;
        GetOrder(order.id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", order.idorder);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Delete");
    removeLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await DeleteBookingTrip(order, trip, false);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
resetbutton.onclick = function (e) {
    e.preventDefault();
    reset();
    document.getElementById('submit').disabled = true;
    document.getElementById('resetbutton').disabled = true;
}

// отправка формы
document.forms["orderForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["orderForm"];
    const id = form.elements["id"].value;
    const fio = form.elements["fio"].value;
    const idTrip = form.elements["idTrip"].value;
    const ordered = form.elements["ordered"].checked;

    if (id != -1) EditOrder(id, idTrip, fio, ordered);
    document.getElementById('submit').disabled = true;
    document.getElementById('resetbutton').disabled = true;
});


// отправка формы
document.forms["filterForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["filterForm"];
    const fio = form.elements["fio"].value;
    document.getElementById("tableOrderstbody").innerHTML = "";
    GetOrders(fio);
});

// загрузка поездок
GetOrders();
window.onload = function () {
    document.getElementById('submit').disabled = true;
    document.getElementById('resetbutton').disabled = true;
};