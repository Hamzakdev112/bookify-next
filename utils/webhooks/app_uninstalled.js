import StoreModel from "@/models/StoreModel";
import SessionModel from "@/models/SessionModel";

const appUninstallHandler = async (topic, shop, webhookRequestBody) => {
  try {
    const webhookBody = JSON.parse(webhookRequestBody);
    await StoreModel.findOneAndUpdate({ shop }, { isActive: false });
    await SessionModel.deleteMany({ shop });
  } catch (e) {
    console.log(e);
  }
};

export default appUninstallHandler;
