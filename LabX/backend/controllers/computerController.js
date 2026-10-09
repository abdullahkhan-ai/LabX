import Computer from "../models/Computer.js";

/* =========================================================
   GET ALL COMPUTERS
========================================================= */

export const getComputers =
  async (req, res) => {
    try {
      const computers =
        await Computer.find()
          .sort({
            name: 1,
          });

      return res.status(200).json({
        success: true,
        count: computers.length,
        computers,
      });

    } catch (error) {
      console.error(
        "Get computers error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch computers.",
      });
    }
  };

/* =========================================================
   ADD COMPUTER
========================================================= */

export const addComputer =
  async (req, res) => {
    try {
      const {
        name,
        status,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message:
            "Computer name is required.",
        });
      }

      const cleanName =
        name.trim().toUpperCase();

      const existingComputer =
        await Computer.findOne({
          name: cleanName,
        });

      if (existingComputer) {
        return res.status(409).json({
          success: false,
          message:
            "A computer with this name already exists.",
        });
      }

      const validStatuses = [
        "Available",
        "In Use",
        "Maintenance",
        "Faulty",
      ];

      const computerStatus =
        validStatuses.includes(status)
          ? status
          : "Available";

      const computer =
        await Computer.create({
          name: cleanName,
          status: computerStatus,
        });

      return res.status(201).json({
        success: true,
        message:
          "Computer added successfully.",
        computer,
      });

    } catch (error) {
      console.error(
        "Add computer error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to add computer.",
      });
    }
  };

/* =========================================================
   SEED INITIAL COMPUTERS
========================================================= */

export const seedComputers =
  async () => {
    try {
      const count =
        await Computer.countDocuments();

      if (count > 0) {
        console.log(
          `Computer database already contains ${count} computer(s).`
        );

        return;
      }

      const computers = [
        {
          name: "PC-01",
          status: "Available",
        },
        {
          name: "PC-02",
          status: "Available",
        },
        {
          name: "PC-03",
          status: "In Use",
        },
        {
          name: "PC-04",
          status: "Available",
        },
        {
          name: "PC-05",
          status: "Faulty",
        },
        {
          name: "PC-06",
          status: "In Use",
        },
        {
          name: "PC-07",
          status: "Available",
        },
        {
          name: "PC-08",
          status: "Available",
        },
        {
          name: "PC-09",
          status: "In Use",
        },
        {
          name: "PC-10",
          status: "Available",
        },
        {
          name: "PC-11",
          status: "Maintenance",
        },
        {
          name: "PC-12",
          status: "Available",
        },
        {
          name: "PC-13",
          status: "In Use",
        },
        {
          name: "PC-14",
          status: "Available",
        },
        {
          name: "PC-15",
          status: "Available",
        },
        {
          name: "PC-16",
          status: "In Use",
        },
        {
          name: "PC-17",
          status: "Available",
        },
        {
          name: "PC-18",
          status: "Available",
        },
        {
          name: "PC-19",
          status: "Available",
        },
        {
          name: "PC-20",
          status: "In Use",
        },
        {
          name: "PC-21",
          status: "Available",
        },
        {
          name: "PC-22",
          status: "Available",
        },
        {
          name: "PC-23",
          status: "Available",
        },
        {
          name: "PC-24",
          status: "Maintenance",
        },
      ];

      await Computer.insertMany(
        computers
      );

      console.log(
        "24 initial computers created."
      );

    } catch (error) {
      console.error(
        "Computer seeding failed:",
        error.message
      );
    }
  };