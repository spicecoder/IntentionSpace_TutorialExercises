
// Select a dish and display its details using PulseHelpers
// Depends on: pulse-helpers.js 

(function () {

  
  const dishPulses = [
    {
      prompt: "dish",
      responses: [
        ["META", "name", "price", "chef", "cook_time"],
        ["Vegetable Biryani", "$12.99", "Kumar", "30 min"]
      ],
      trivalence: "Y",
    },

    {
      prompt: "dish",
      responses: [
        ["META", "name", "price", "chef", "cook_time"],
        ["Vegetable Pulao", "$13.99", "Ramkrishna", "30 min"]
      ],
      trivalence: "N",
    },
    {
      prompt: "dish",
      responses: [
        ["META", "name", "price", "chef", "cook_time"],
        ["Pasta", "$9.99", "Anita", "20 min"]
      ],
      trivalence: "Y",
    },
    {
      prompt: "dish",
      responses: [
        ["META", "name", "price", "chef", "cook_time"],
        ["Fried Rice", "$8.50", "Ravi", "25 min"]
      ],
      trivalence: "UN",
    }
  ];


  function dishSelect() {
    const select = document.getElementById("dishSelect");

    if (!select) {
      console.error("dishSelect element not found");
      return;
    }

    dishPulses.forEach((pulse, index) => {
        if (!PulseHelpers.isStructuredPulse(pulse)) return;

      const name = PulseHelpers.getFieldValue(pulse, "name");
      if (!name) return;

      const option = document.createElement("option");
      option.value = index;
      option.textContent = name;

      // disable unavailable dishes
      if (pulse.trivalence === "N") {
        option.disabled = true;

      }

      select.appendChild(option);
    });
  }

  
     //DISPLAY DISH DETAILS
  window.showDishDetails = function () {
    const select = document.getElementById("dishSelect");
    const container = document.getElementById("dishDetails");

    if (!select || !container) return;

    if (select.value === "") {
      container.innerHTML = "";
      return;
    }

    const pulse = dishPulses[select.value];

    if (!PulseHelpers.isStructuredPulse(pulse)) {
      container.innerHTML = "Invalid dish data";
      return;
    }

    const dish = PulseHelpers.toObject(pulse);

    container.innerHTML = `
      <h3>${dish.name}</h3>
      <p><strong>Price:</strong> ${dish.price}</p>
      <p><strong>Chef:</strong> ${dish.chef}</p>
      <p><strong>Cook Time:</strong> ${dish.cook_time}</p>
      <p><strong>Status:</strong> ${pulse.trivalence}</p>
    `;
  };

  window.addEventListener("DOMContentLoaded", dishSelect);

})();
