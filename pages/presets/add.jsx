import { useAppBridge } from "@shopify/app-bridge-react";
import { Modal, Button, Frame, Layout, LegacyCard, Loading, Page, TextField } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import NameInput from "@/components/presets/NameInput";
import Products from "@/components/presets/Products";
import Setup from "@/components/presets/Setup";
import useFetch from "@/components/hooks/useFetch";

const AddPreset = () => {
  const fetch  = useFetch()
  const app = useAppBridge();
  const {name} = useSelector(state=>state.preset)
  const dispatch = useDispatch()
  return (
    <Frame>
    <Page
    title="Add Preset"
    subtitle="Create reusable presets that can be used all across the store"
    backAction={{ content: "Home",  onAction: () => window.history.back() }}
    >
      <Layout  >
        <Layout.Section>
          <NameInput value={name} />
            <Products />
            <Setup />

        </Layout.Section>
      </Layout>
    </Page>
    </Frame>
  );
};

export default AddPreset;
