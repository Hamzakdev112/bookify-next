import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";
import { plans } from "@/utils/plans";

export default withMiddleware("verifyRequest")(subscribe);

async function subscribe(req, res){
  if (req.method === "POST") {
    try{
    const { plan } = req.body;
    if(!plan)return res.status(500).json({message:'Please provide valid plan'})
    console.log(plan)
    //false for offline session, true for online session
    const { client, shop } = await clientProvider.graphqlClient({
      req,
      res,
      isOnline: true,
    });
    const returnUrl = `${process.env.SHOPIFY_APP_URL}/api/auth?shop=${shop}`;
    const { planName, planPrice, trialDays } = plans[plan];

    const response = await client.query({
      data: `mutation CreateSubscription{
      appSubscriptionCreate(
        name: "${planName}"
        returnUrl: "${returnUrl}"
        test: true
        trialDays: ${trialDays}
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: ${planPrice}, currencyCode: USD }
              }
            }
          }
        ]
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
        appSubscription {
          id
          status
        }
      }
    }
  `,
    });

    if (response.body.data.appSubscriptionCreate.userErrors.length > 0) {
      console.log(
        `--> Error subscribing ${shop} to plan:`,
        response.body.data.appSubscriptionCreate.userErrors
      );
      res.status(400).send({ message: "An error occured." });
      return;
    }

    res.status(200).send({
      confirmationUrl: `${response.body.data.appSubscriptionCreate.confirmationUrl}`,
    });
  } catch ({message}) {
    res.status(500).json({message});
    console.log(message);
  }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

