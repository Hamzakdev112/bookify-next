import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Button,
    Box,
    Thumbnail,
  } from "@shopify/polaris";
  import React, { useEffect, useState, useRef } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useInView } from "react-intersection-observer";
import { addSelectedProduct, removeSelectedProduct } from "@/store/slices/presetSlice";
import useFetch from "../hooks/useFetch";
import { getProducts } from "@/apiCalls/setupApis";
  
  const ProductsList = ({
    products,
    setProducts,
    setOpen,
    pageInfo,
    setPageInfo,
  }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState();
    const fetch = useFetch();
    const { selectedProducts } = useSelector((state) => state.preset);
    const [ref, inView] = useInView({
      threshold: 0,
    });
    const placeholderRef = useRef();
  
    useEffect(() => {
      if (inView) {
        if (pageInfo.hasNextPage === false) return;
        setLoading(true);
        getProducts(fetch, pageInfo)
          .then(({ edges, pageInfo }) => {
            setPageInfo({
              afterCursor: pageInfo.endCursor,
              hasNextPage: pageInfo.hasNextPage,
            });
            setProducts((state) => [...state, ...edges]);
          })
          .catch((err) => console.log(err))
          .finally(() => setLoading(false));
      }
    }, [inView]);
  
  
    const resourceName = {
      singular: "product",
      plural: "products",
    };
  
    useIndexResourceState(products);
  
    const rowMarkup = products?.map((product, index) => {
      const { title, id, images } = product.node;
      const isSelected = selectedProducts?.find(({ node }) => node.id === id);
      console.log(images)
      return (
        <IndexTable.Row id={id} key={id} position={index}>
          <IndexTable.Cell>
            <Thumbnail
            size="large"
            source={images?.nodes[0]?.url}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>{title}</IndexTable.Cell>
          <IndexTable.Cell>
            <Button
              primary={!isSelected}
              onClick={() =>{
                isSelected ?
                dispatch(removeSelectedProduct(product.node.id))
                : 
                dispatch(addSelectedProduct(product))
              }
              }
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  
    return (
      <LegacyCard>
  
        {products && (
          <IndexTable
            hasMoreItems={true}
            selectable={false}
            resourceName={resourceName}
            itemCount={products?.length}
            headings={[{ title: "Image" }, { title: "Title" }]}
          >
            {rowMarkup}
          </IndexTable>
        )}
        <Box ref={ref} width="100%" align="center">
          <Button loading={loading}>Load more</Button>
        </Box>
      </LegacyCard>
    );
  };
  
  export default ProductsList;
  