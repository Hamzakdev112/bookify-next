import { initializeSettings, updateSettings } from "@/apiCalls/settingsApi";
import useFetch from "@/components/hooks/useFetch";
import Theme from "@/components/settings/theme";
import TimeZone from "@/components/settings/timezone";
import { setSettings } from "@/store/slices/shopSlice";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Frame, Layout, Page, EmptyState, Text, Box, Toast } from "@shopify/polaris";
import { useRouter } from "next/router";
import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
  const fetch = useFetch();
  const app = useAppBridge();
  const router = useRouter()
  const { settings, shop } = useSelector((state) => state.shop);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const handleUpdateSettings = async () => {
    try {
      setIsUpdating(true);
      const res = await updateSettings(fetch, shop.id, settings);
      if(res.body)setUpdateSuccess("Successfully updated settings")
      if(res.error)setUpdateError(res.error)
      setIsUpdating(false);
    } catch (err) {
      console.log(err);
      setIsUpdating(false);
    }
  }
  const dispatch = useDispatch()
  return (
    <Frame>
      <Page
        primaryAction={
          settings && {
            content: "Save",
            onAction: handleUpdateSettings,
            loading: isUpdating,
          }
        }
        title="Settings"
        subtitle="These are global settings and will apply to all presets"
        backAction={{ content: "Home", onAction: () => router.push("/") }}
      >
        {
          updateSuccess || updateError ?
          <Toast  content={updateSuccess || updateError} error={updateError} onDismiss={()=>updateSuccess ? setUpdateSuccess(null) : setUpdateError(null)} />
          : 
          null
        }
        {!settings ? (
          <EmptyState
            // image="/no-settings.webp"
            fullWidth
            action={{
              content: "Initialize Settings",
              onAction: async() => {
                setIsUpdating(true)
                const settings = await initializeSettings(fetch, shop.id, shop.zone)
                dispatch(setSettings(settings))
                setIsUpdating(false)
                setUpdateSuccess("Settings Initialized")
              },
              loading:isUpdating
            }}
            footerContent={
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Text>
                  Looks like there are no settings setup right now. Let's change
                  that.
                </Text>
              </Box>
            }
          />
        ) : (
          <Layout>
            <Layout.Section>
              <TimeZone />
              <Theme />
            </Layout.Section>
          </Layout>
        )}
      </Page>
    </Frame>
  );
};

export default Settings;
