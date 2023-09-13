import PresetModel from "@/models/PresetModel";
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

export default withMiddleware("verifyProxy")(getPreset);

async function getPreset(req, res){
  if (req.method === "POST") {
    try{  
      const {productId} = req.body
        const {shop} = req.query //only valid if coming from proxy router
        const preset = await PresetModel.findOne({
          $and: [{ productIds: { $in: [productId] } }, { shop }]
        })
        console.log('preset', preset)
        res.status(200).json(preset)
      }
      catch(err){
        res.status(500).json(err)
      }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

