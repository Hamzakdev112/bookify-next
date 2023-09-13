import { Session } from "@shopify/shopify-api";
import cryption from "./cryption.js";
import SessionModel from "@/models/SessionModel.js";

const storeSession = async (session) => {
  await SessionModel.findOneAndUpdate(
    { id: session.id },
    {
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    },
    { upsert: true }
  );

  return true;
};

const loadSession = async (id) => {
  const sessionResult = await SessionModel.findOne({ id });
  if (sessionResult === null) {
    return undefined;
  }
  if (sessionResult.content.length > 0) {
    const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
    const returnSession = new Session(sessionObj);
    return returnSession;
  }
  return undefined;
};

const deleteSession = async (id) => {
  await SessionModel.deleteMany({ id });
  return true;
};

const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;
