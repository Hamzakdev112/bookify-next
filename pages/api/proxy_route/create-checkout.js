import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

export default withMiddleware("verifyProxy")(createCheckout);

async function createCheckout(req, res) {
  if (req.method === "POST") {
    try {
      const { shop } = req.query;
      const item = {
        title: req.body.title,
        variantId: req.body.variantId,
        price: req.body.price,
        properties: req.body.properties,
        currency: req.body.currency,
        quantity: 1,
      };
      const calculatedItem = calculateBookingPrice(item);
      const lineItemsString = createLineItemString(calculatedItem);
      const { client } = await clientProvider.offline.graphqlClient({ shop });
      const order = await client.query({
        data: `
              mutation{
                  draftOrderCreate(input:{
                      lineItems:[${lineItemsString}]
                  }
                  ){
                    userErrors{
                        field
                        message
                      }
                      draftOrder{
                          invoiceUrl
                      }
                  }
              }
              `,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json(err.message);
      console.error(err.message);
    }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
}

function calculateBookingPrice(item) {
  if (item.properties._Rate.value < 1) return { priceDifference: 0, ...item };
  let originalPrice = Number(item.price);
  let percentageIncrease = Number(item.properties._Rate);
  let newPrice =
    originalPrice + Math.round((originalPrice * percentageIncrease) / 10000);
  let priceDifference = newPrice - originalPrice;
  return { priceDifference, ...item };
}

const createCustomAttribute = (key, value) => {
  return `{
      key: "${key}",
      value: "${value}"
    }`;
};

const createCustomAttributesArray = (properties) => {
  return Object.keys(properties)
    .map((key) => createCustomAttribute(key, properties[key]))
    .join(",\n");
};

const createLineItemString = ({
  title,
  properties,
  quantity,
  variantId,
  priceDifference,
}) => {
  const customAttributes = createCustomAttributesArray(properties);

  return priceDifference > 0
    ? `{
        variantId: "gid://shopify/ProductVariant/${variantId}",
        quantity: ${quantity},
        customAttributes: [
          ${customAttributes}
        ]
      },
      {
        title: "${title} - Additional Booking Price",
        quantity: 1,
        originalUnitPrice: ${priceDifference}
      }`
    : `{
        variantId: "gid://shopify/ProductVariant/${variantId}",
        quantity: ${quantity},
        customAttributes: [
          ${customAttributes}
        ]
      }`;
};
