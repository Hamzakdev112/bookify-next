import { connectToDatabase } from "@/libs/mongo";
import PresetModel from "@/models/PresetModel";
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

export default withMiddleware("verifyRequest")(getPresets);

  async function getPresets(req, res){
  await connectToDatabase()
  if (req.method === "GET") {
    try {
        const { shop } = res;
        const presets = await PresetModel.find({ shop });
        res.status(200).json(presets)
      } catch (err) {
        console.log(err);
        res.status(500).json({message:"There was an error while Fetching presets"})
      }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

