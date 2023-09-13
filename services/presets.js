import PresetModel from "@/models/PresetModel";
import { generateProductQuery } from "@/utils/queryBuilder.js";

export const getProducts = async (shop, client, options) => {
  try {
    const { pageSize, afterCursor, hasNextPage, query: searchQuery } = options;
    const productsWithIds = await PresetModel.find({ shop }).select(
      "productIds"
    );
    const excludedIds = productsWithIds?.flatMap(
      ({ productIds }) => productIds
    );
    const query = generateProductQuery(excludedIds, searchQuery);
      console.log(excludedIds)
    const GetProductsQuery = `
        query {
          products(query:"${query}", first: ${pageSize}, ${
      afterCursor == "null" ? "" : `after: "${afterCursor}"`
    }) {
            pageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
              node {
                title
                id
                metafield(key:"setup" namespace:"bookify"){
                    value
                    namespace
                  }
                images(first:1){
                    nodes{
                      url
                    }
                }
              }
            }
          }
        }
      `;
    while (hasNextPage) {
      const products = await client.query({
        data: GetProductsQuery,
      });
      if (products.body) {
        const { pageInfo, edges } = products.body.data.products;
        return { edges, pageInfo };
      } else if (products.response) {
        return products.response.errors;
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return Promise.reject(error);
  }
};
export const getPresets = async (shop) => {
  try {
    const presets = await PresetModel.find({ shop });
    return presets;
  } catch (err) {
    return Promise.reject({ message: "Failed to fetch presets." });
  }
};

export async function getPreset(productId, shop) {
  const preset = await PresetModel.findOne({
    $and: [{ productIds: { $in: [productId] } }, { shop }],
  });
  return preset
}

export const addPreset = async (payload) => {
  try {
    const maxPresetCount = 5;
    const { shop } = payload;
    const count = await PresetModel.countDocuments({ shop });
    if (count < maxPresetCount) {
      const newPreset = await PresetModel.create(payload);
      return newPreset;
    } else {
      return Promise.reject({
        message: "Maximum preset count exceeded for the shop.",
      });
    }
  } catch ({ message }) {
    return Promise.reject({ message });
  }
};

export const deletePreset = async (id) => {
  try {
    const preset = await PresetModel.findByIdAndDelete(id);
    if (preset == null)
      return Promise.reject({ message: `Preset with id ${id} not found.` });
    return preset;
  } catch (err) {
    console.log({ message });
    return Promise.reject({ message });
  }
};
