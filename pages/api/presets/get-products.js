import { connectToDatabase } from "@/libs/mongo";
import clientProvider from "@/utils/clientProvider";
import * as presetsService from '../../../services/presets'




async function getProducts(req, res){
  connectToDatabase()
  if (req.method === "GET") {
    try {
        const { pageSize, afterCursor, hasNextPage, query } = req.query;
        const { client } = await clientProvider.graphqlClient({
          req,
          res,
          isOnline: false,
        });
        const {shop} = res;
        const response = await presetsService.getProducts(shop, client, {
          pageSize,
          afterCursor,
          hasNextPage,
          query
        });
        res.status(200).json(response);
      } catch (err) {
        res.status(500).json(err);
      }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

export default getProducts

