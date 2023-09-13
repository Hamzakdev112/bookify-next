import {
    Badge,
    Box,
    Button,
    Frame,
    HorizontalStack,
    LegacyCard,
    Loading,
    Modal,
    SkeletonBodyText,
    SkeletonPage,
    SkeletonTabs,
    Text,
    TextField,
    Thumbnail,
    VerticalStack,
  } from "@shopify/polaris";
  import React, { useCallback, useState } from "react";
  import ProductsList from "./ProductList";
  import { useDispatch, useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import { getProducts } from "@/apiCalls/setupApis";
import { removeSelectedProduct } from "@/store/slices/presetSlice";
  
  const Products = () => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const { selectedProducts } = useSelector((state) => state.preset);
    const [pageInfo, setPageInfo] = useState({
      afterCursor: null,
      hasNextPage: true,
    });
    console.log(selectedProducts);
    const handleChange = useCallback((newValue) => setSearchValue(newValue), []);
    const fetch = useFetch();
    const dispatch = useDispatch()
    return (
      <LegacyCard title="Products" sectioned>
        <VerticalStack gap={5}>
        <TextField
          value={searchValue}
          onChange={handleChange}
          connectedRight={
            <Button
              onClick={async () => {
                setOpen(true);
                setLoading(true);
                getProducts(fetch, pageInfo, searchValue)
                  .then(({ edges, pageInfo }) => {
                    setPageInfo({
                      afterCursor: pageInfo.endCursor,
                      hasNextPage: pageInfo.hasNextPage,
                    });
                    setProducts((state) => [...state, ...edges]);
                  })
                  .catch((err) => console.log(err))
                  .finally(() => setLoading(false));
              }}
            >
              {searchValue?.length < 1 ? "All" : "Search"}
            </Button>
          }
          placeholder="Search Products"
        />
        <VerticalStack gap={3}>
        {selectedProducts?.map(({node})=>(
          <VerticalStack gap={2}  key={node.id}>
            <Thumbnail
              size="large"
              source={node?.images?.nodes[0]?.url}
            />
            <Text variant="headingMd" as="h6" fontWeight="regular">
              {node?.title}
            </Text>
            <div style={{width:'50px'}}>
            <Button
              destructive
              onClick={()=>dispatch(removeSelectedProduct(node.id))}
              size="slim" status="critical-strong-experimental">
                Remove
              </Button>
              </div>
          </VerticalStack>
        )) }
        </VerticalStack>
        </VerticalStack>
        <Modal
          title="Products"
          open={open} 
          onClose={() => {
            setProducts([]);
            setPageInfo({
              afterCursor: null,
              hasNextPage: true,
            })
            setOpen(false);
          }}
        >
          <Modal.Section>
            <Frame>
              {loading ? (
                <>
                <Loading />
                <SkeletonPage title=" ">
                <SkeletonTabs />
                <div style={{padding:'15px', display:'flex', flexDirection:'column', gap:'20px'}}>
                <SkeletonBodyText lines={3} />
                <SkeletonBodyText lines={3} />
                <SkeletonBodyText lines={3} />
                </div>
                </SkeletonPage>
                </>
              ) : (
                <div className="custom-bookings-products-list-container">
                  <ProductsList
                    setPageInfo={setPageInfo}
                    setProducts={setProducts}
                    pageInfo={pageInfo}
                    setOpen={setOpen}
                    products={products}
                  />
                </div>
              )}
            </Frame>
          </Modal.Section>
        </Modal>



      </LegacyCard>
    );
  };
  
  export default Products;
  