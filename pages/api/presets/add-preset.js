import { connectToDatabase } from "@/libs/mongo";
import PresetModel from "@/models/PresetModel";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

export default withMiddleware("verifyRequest")(addPreset);

async function addPreset(req, res) {
  if (req.method === "POST") {
    await connectToDatabase()
    try {
      const { productIds, timing, duration, gap, maintenanceTime, name, } = req.body;
      const { shop } = res;
      // if (count > maxPresetCount) return res.status(500).json({message:'Maximum preset count exceeded for the shop.'})
      const newPreset = await PresetModel.create({
        shop,
        productIds,
        name,
        timing,
        duration,
        gap,
        maintenanceTime,
      });
      return res.status(200).json(newPreset);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ message: "There was an error while adding your preset" })
    }


  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

