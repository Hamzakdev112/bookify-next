// If you have the recommended extension installed, create a new page and type `createapi` to generate api endpoint boilerplate

//TEMP

import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

export default withMiddleware("verifyRequest")(getShop);
async function getShop(req, res){
  if (req.method === "GET") {
    try {
      const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: true,
      });
      const {body} = await client.query({
        data: `
          {
                shop {
                  id
                  myshopifyDomain
                  timezoneOffset
                  name
                  metafield(namespace: "bookify", key: "settings") {
                    key
                    value
                  }
                }
                appInstallation {
                  activeSubscriptions {
                    name
                    id
                    status
                    lineItems {
                      plan {
                        pricingDetails {
                          ... on AppRecurringPricing {
                            price {
                              amount
                              currencyCode
                            }
                            interval
                          }
                        }
                      }
                    }
                    test
                  }
                }
              }
    `,
      });
      if(body?.data?.shop){
          return res.status(200).json(body.data);
      }
      else{
        return res.status(400).json({text:'Could not fetch the shop.'})
      }

    } catch (e) {
      console.error(`---> An error occured`, e);
      return res.status(400).send({ text: "Bad request" });
    }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

