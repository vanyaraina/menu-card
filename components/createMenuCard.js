AFRAME.registerComponent("create-menucard", {
  init: async function () {
    var dishes = await this.getDish();
    //console.log(dishes)

    dishes.map((dish, index) => {
      var scene = document.querySelector("#scene");
      var marker = document.createElement("a-marker");
      marker.setAttribute("id", dish.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", dish.marker_pattern_url);
      marker.setAttribute("markerhandler", {});
      scene.appendChild(marker);

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
      //console.log("check_database_day: ", dish.unavailable_days.includes(days[todaysDay]))

      if (!dish.unavailable_days.includes(days[todaysDay])) {
        var model = document.createElement("a-entity");
        model.setAttribute("id", `model-${dish.id}`);
        model.setAttribute("position", dish.model_geometry.position);
        model.setAttribute("rotation", dish.model_geometry.rotation);
        model.setAttribute("scale", dish.model_geometry.scale);
        model.setAttribute("gltf-model", `url(${dish.model_url})`);
        model.setAttribute("visible", false);
        model.setAttribute("gesture-handler", {});
        marker.appendChild(model);
       // console.log(marker);

        var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${dish.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 1.7);
        mainPlane.setAttribute("height", 1);
        mainPlane.setAttribute("visible", false);
        marker.appendChild(mainPlane);

        var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${dish.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 1.65);
        titlePlane.setAttribute("height", 0.3);
        titlePlane.setAttribute("material", { color: "orange" });
        mainPlane.appendChild(titlePlane);

        var dishtitle = document.createElement("a-entity");
        titlePlane.setAttribute("id", `dish-title-${dish.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 0, z: 1 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        dishtitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: dish.dish_name.toUpperCase(),
        });
        titlePlane.appendChild(dishtitle);

        var ingredients = document.createElement("a-entity");
        ingredients.setAttribute("id", `ingredients-${dish.id}`);
        ingredients.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
        ingredients.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        ingredients.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 2,
          align: "center",
          value: `${dish.ingredients.join("\n\n")}`,
        });
        mainPlane.appendChild(ingredients);
      }
    });
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
});
