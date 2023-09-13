import {
    Button,
    Card,
    Frame,
    IndexFilters,
    IndexTable,
    Modal,
    Page,
    useIndexResourceState,
    useSetIndexFiltersMode,
  } from "@shopify/polaris";
  import {  useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import NameInput from "@/components/presets/NameInput";
  import Products from "@/components/presets/Products";
  import Setup from "@/components/presets/Setup";
  import { plans } from '@/utils/plans.js'
import useFetch from "@/components/hooks/useFetch";
import { deletePreset, getPresets, getSelectedProducts } from "@/apiCalls/setupApis";
import { useRouter } from "next/router";
import mongoose from "mongoose";
import { resetState, setPreset } from "@/store/slices/presetSlice";
  
  function Presets() {
    const [itemStrings, setItemStrings] = useState(["All"]);
    const { shop } = useSelector((state) => state.shop);
    const { preset } = useSelector((state) => state);
    console.log(preset)
    const router = useRouter()
    const [modalProductsLoading ,setModalProductsLoading] = useState(false)
    console.log(preset);
    const tabs = itemStrings.map((item, index) => ({
      content: item,
      index,
      onAction: () => {},
      id: `${item}-${index}`,
      isLocked: index === 0,
    }));
    const { currentPlan } = useSelector(state => state.shop)
  
    // id:7335272972461 OR id:7335269662893
  
   
    const fetch = useFetch();
    const [presets, setPresets] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchPresets = async () => {
      try {
        setLoading(true);
        const res = await getPresets(fetch, shop.myshopifyDomain);
        setPresets(res);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchPresets();
    }, []);
  
    const handleDelete = async (id) => {
      const res = await deletePreset(fetch, id, shop.id);
      res.message && fetchPresets();
    };
  
    const dispatch = useDispatch();
    const { mode, setMode } = useSetIndexFiltersMode();
    const resourceName = {
      singular: "preset",
      plural: "presets",
    };
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
      useIndexResourceState(presets);
    const rowMarkup = presets?.map(
      ({ _id: id, name, timing, productIds, ...more }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>{name}</IndexTable.Cell>
          <IndexTable.Cell>{productIds?.length}</IndexTable.Cell>
          <IndexTable.Cell>{`${timing?.openingTime?.time} ${timing?.openingTime?.format}`}</IndexTable.Cell>
          <IndexTable.Cell>{`${timing?.closingTime?.time} ${timing?.closingTime?.format}`}</IndexTable.Cell>
          <IndexTable.Cell>
            <Button
              size="slim"
              connectedDisclosure={{
                actions: [
                  {
                    content: "Edit",
                    onAction:async() => {
                      try{
                        setModalProductsLoading(true)
                        let selectedProducts = []
                        if(productIds?.length > 0){
                        selectedProducts = await getSelectedProducts(fetch,productIds)
                        }
                        dispatch(
                          setPreset({
                          isEditable: true,
                          name,
                          openingTime: timing.openingTime,
                          closingTime: timing.closingTime,
                          selectedProducts,
                          id,
                          ...more,
                        })
                        )
                        setModalProductsLoading(false)
                      }catch({message}){
                        setModalProductsLoading(false)
                        console.log(message
                          )
                      }
                    }
                  },
                  {
                    content: "Delete",
                    destructive: true,
                    onAction: () => handleDelete(id),
                  },
                ],
              }}
            >
              Actions
            </Button>
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    );
  
    return (
      <Page
        backAction={{ content: "", onAction: () => window.history.back() }}
        title={"Presets"}
        subtitle={`Create templates for bookings that can be used to link products with them (max ${plans[currentPlan?.name].presetLimit})`}
        primaryAction={{
          content: "Add Preset",
          onAction: () => router.push("/presets/add"),
        }}
      >
        <Card padding="0">
          <IndexFilters
            tabs={tabs}
            hideQueryField
            hideFilters
            disableQueryField
            canCreateNewView={false}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable
            loading={loading}
            resourceName={resourceName}
            itemCount={presets ? presets.length : 0}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            sortable={[false, true, true, true, true, true, true]}
            headings={[
              { title: "Name" },
              { title: "Products" },
              { title: "Opening Time" },
              { title: "Closing Time" },
              // { title: "Id" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
        <Modal
          loading={modalProductsLoading}
          large
          title="Edit Preset"
          onClose={() => dispatch(resetState())}
          open={modalProductsLoading || preset.isEditable}
        >
          <Frame>
          <NameInput value={preset?.name} />
          {
            !modalProductsLoading &&
            <Products />
          }
          <Setup fetchPresets={fetchPresets} />
          </Frame>
        </Modal>
      </Page>
    );
  }
  
  export default Presets;
  