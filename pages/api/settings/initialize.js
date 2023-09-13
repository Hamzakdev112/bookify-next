import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";


export default withMiddleware("verifyRequest")(initializeSettings);

async function initializeSettings(req, res){
  if (req.method === "POST") {
    try {
        const { shop, zone } = req.body;
        const payload = 
        {
          timeZone: {
            offset: zone,
            format: "24",
          },
          theme: "material_blue",
          themeLabel:'Date',
          themePlaceholder:'Pick your date',
          elementSelectors: {
            addToCart: "button[type='submit']",
            checkout: ".checkout-btn",
          },
        }
        const { client } = await clientProvider.graphqlClient({
          req,
          res,
          isOnline: false,
        });
        await client.query({
          tries:3,
          data: `
                mutation {
                    metafieldsSet(
                      metafields: {
                        namespace: "bookify"
                        ownerId: "${shop}"
                        key: "settings"
                        value: """${JSON.stringify(payload)}"""
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
        res.status(200).json(payload);
      } catch (error) {
        console.log(error);
        res.status(500).json({error});
      }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

