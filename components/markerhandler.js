var tableNumber = null;

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    if (tableNumber == null) {
      this.askTableNumber();
    }

    var dishes = await this.getDish();

    this.el.addEventListener("markerFound", () => {
    //  alert("marker is found");
      if (tableNumber !== null) {
        var markerId = this.el.id;
        this.HandleMakerFound(dishes, markerId);
      }
    });
    this.el.addEventListener("markerLost", () => {
     // alert("marker is lost");
      this.HandleMakerLost();
    });
  },
  HandleMakerFound: function (dishes, markerId) {
    var todayDate = new Date();
    var todaysDay = todayDate.getDay();
    console.log(todaysDay);
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    var dish = dishes.filter((dish) => dish.id === markerId)[0];
    if (dish.unavailable_days.includes(days[todaysDay])) {
      swal({
        icon: "warning",
        title: dish.dish_name.toUpperCase(),
        text: "This dish is not available today!!",
        timer: 2500,
        buttons: false,
      });
    } else {
      //alert("dish is available")
      var model = document.querySelector(`#model-${dish.id}`);
      model.setAttribute("visible", true);

      var mainPlane = document.querySelector(`#main-plane-${dish.id}`);
      mainPlane.setAttribute("visible", true);

      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("rating-button");
      var orderButton = document.getElementById("order-button");

      ratingButton.addEventListener("click", function () {
        swal({
          icon: "warning",
          title: "Rate Dish",
          text: "Your order will be served shortly!",
        });
      });

      orderButton.addEventListener("click", function () {
        var tNumber;
        tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
        this.handleorder(tNumber, dish);
        swal({
          icon: "success",
          title: "Thanks for ordering!",
          text: "Work in Progress...",
        });
      });
    }
  },

  HandleMakerLost: function () {
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },

  getDish: async function () {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data());
      });
  },

  askTableNumber: function () {
    swal({
      title: "Welcome to Hunger-Bunger Cafe!!",
      icon: "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png",
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your Table Number",
          type: "number",
          min: 1,
        },
      },
      closeOnClickOutside: false,
    }).then((inputValue) => {
      tableNumber = inputValue;
    });
  },

  handleorder: function (tNumber, dish) {
    firebase.firestore
      .collection("tables")
      .doc(tNumber)
      .get()
      .then((doc) => {
        var details = doc.data();
        if (details["current_orders"][dish.id]) {
          details["current_orders"][dish.id]["quantity"] += 1;

          var currentQuantity = details["current_orders"][dish.id]["quantity"];
          details["current_orders"][dish.id]["subtotal"] =
            currentQuantity * dish.price;
        } else {
          details["current_orders"][dish.id] = {
            item: dish.dish_name,
            price: dish.price,
            quantity: 1,
            subtotal: dish_price * 1,
          };
        }

        details.total_bill += dish.price;
        firebase.firestore().collection("tables").doc(doc.id).update(details);
      });
  },
});
