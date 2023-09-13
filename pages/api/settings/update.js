import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

export default withMiddleware("verifyRequest")(updateSettings);

async function updateSettings(req, res){
  if (req.method === "PUT") {
    try {
        const { shopId } = req.query;
        const jsonString = JSON.stringify(req.body.settings);
        const { client } = await clientProvider.graphqlClient({
          req,
          res,
          isOnline: false,
        });
        const response = await client.query({
          data: `
                mutation {
                    metafieldsSet(
                      metafields: {
                        namespace: "bookify"
                        ownerId: "${shopId}"
                        key: "settings"
                        value: """${jsonString}"""
                        type:"json_string"
                      }
                    ) {
                       metafields{
                        id
                        key
                        namespace
                        value
                      }
                      userErrors {
                        field
                        message
                      }
                    }
            }
                `,
        });
        if(response.body)return res.status(200).json(response);
        res.status(400).json(response)
      } catch (err) {
        console.log(err);
        res.status(500).json({error:"There was an error while updating your settings"})
      }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

