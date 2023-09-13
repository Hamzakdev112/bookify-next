import { connectToDatabase } from "@/libs/mongo";
import StoreModel from "@/models/StoreModel";

const isShopAvailable = async (context) => {
  const shop = context.query.shop;
  connectToDatabase()
  if (shop) {
    const isShopAvailable = await StoreModel.findOne({shop})

    if (!isShopAvailable || !isShopAvailable?.isActive) {
      return {
        redirect: {
          destination: `${process.env.SHOPIFY_APP_URL}/api/auth?shop=${shop}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        user_shop: context.query.shop,
      },
    };
  }
  return { props: { data: "ok" } }; //We HAVE to return something
};

export default isShopAvailable;