const mongoose = require("mongoose");

// Organisational unit and division
const UnitSchema = mongoose.Schema({
  unit: {
    type: String,
    required: true,
  },
  divisions: [
    {
      division: {
        type: String,
        required: true,
      },
      repository: [
        {
          title: {
            type: String,
            required: true,
          },
          username: {
            type: String,
            required: true,
          },
          password: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

let Unit = mongoose.model("Unit", UnitSchema);

module.exports = {
  Unit
};
