import { connectToDatabase } from "@/libs/mongo";
import clientProvider from "@/utils/clientProvider";
import { generateSelectedProductIdsQuery } from "@/utils/queryBuilder";

async function getSelectedProducts(req, res){
  connectToDatabase()
  if (req.method === "POST") {
    try {
        const {productIds} = req.body;
        const query = generateSelectedProductIdsQuery(productIds)
        const { client } = await clientProvider.graphqlClient({
            req,
            res,
            isOnline: false,
          });
          console.log(query)
          const {body} = await client.query({
            data:`
            query{
                products(first:100 query:"${query}"){
                  edges{
                    node{
                      title
                      id
                      images(first:1){
                        nodes{
                          url
                        }
                      }
                    }
                  }
                }
              }
            `,
            tries:3,
          })
          if(body?.data?.products?.edges){
              res.status(200).json(body.data.products.edges)
            }
            else{
                res.status(500).json({message:'Could not fetch products for some reason'})
            }

      } catch (err) {
        console.log(err)
        res.status(500).json(err);
      }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

export default getSelectedProducts

