import {
  CookieNotFound,
  InvalidOAuthError,
  InvalidSession,
} from "@shopify/shopify-api";
import sessionHandler from "@/utils/sessionHandler.js";
import shopify from "@/utils/shopify.js";
import { connectToDatabase } from "@/libs/mongo";
import StoreModel from "@/models/StoreModel";

const handler = async (req, res) => {
  try {
    await connectToDatabase()
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    await sessionHandler.storeSession(session);

    const host = req.query.host;
    const { shop } = session;
    await StoreModel.findOneAndUpdate(
      { shop },
      { isActive: true },
      { upsert: true }
    ); 
    // Redirect to app with shop parameter upon auth
    res.redirect(`/?shop=${shop}&host=${host}`);
  } catch (e) {
    console.error("---> An error occured at /auth/callback", e);
    const { shop } = req.query;
    switch (true) {
      case e instanceof CookieNotFound:
        res.redirect(`/exitframe/${shop}`);
        break;
      case e instanceof InvalidOAuthError:
      case e instanceof InvalidSession:
        res.redirect(`/api/auth?shop=${shop}`);
        break;
      default:
        res.status(500).send(e.message);
        break;
    }
  }
};

export default handler;