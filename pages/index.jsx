'use client'

import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Banner, Box, Button, Frame, HorizontalStack, Label, Layout, LegacyCard, Loading, Page, VerticalStack } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { StoreMajor } from "@shopify/polaris-icons";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "@/components/hooks/useFetch";
import { setShop } from "@/store/slices/shopSlice";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const HomePage = () => {
  const router = useRouter();
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const fetch = useFetch();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function fetchShop(){
    setLoading(true)
    const res = await fetch('/api/shop')
    const data = await res.json()
    const payload = {}
    if (data?.shop) {
      const { shop } = data;
      console.log(shop);
      const zone =
      "UTC" +
        shop.timezoneOffset.slice(0, 3) +
        ":" +
        shop.timezoneOffset.slice(3);
        payload.shop =  {
          id: shop.id,
          myshopifyDomain: shop.myshopifyDomain,
          zone,
          name:shop.name
        }
        payload.settings = shop.metafield?.value ? JSON.parse(shop.metafield.value) : null
      const activeSubscriptions = data.appInstallation.activeSubscriptions;
      if(activeSubscriptions?.length > 0){
        payload.currentPlan = {
          name: activeSubscriptions[0].name,
          status: activeSubscriptions[0].status,
          id:activeSubscriptions[0].id
        }
      }
      else{
        payload.currentPlan = {
          name:"Free",
          status:'ACTIVE'
        }
      }
      dispatch(setShop(payload));
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchShop()
            }, [])
 
  const {shop, settings, currentPlan} = useSelector(state=>state.shop)
  return (
    <Frame>
    {loading && (
      <>
        <Loading />
      </>
    )}
    <Page
      title="Home"
      primaryAction={<Button  connectedDisclosure={{
      actions:[
          {
            content:(
              <Box width="300px">
              <VerticalStack  gap={2}>
            <Button primary>Starter Guide</Button>
            <Label>A starter guide for people starting out. This guide will take you through all the steps you need to take in order to get your booking store up and running.</Label>
            </VerticalStack>
              </Box>
              )
          },
        ]
      }}>
          Help
        </Button>}
    >
      <Layout>
          <Layout.Section>
          <Banner title={!shop?.name ? "Fetching shop details..." : shop.name }  icon={StoreMajor}>
            {
               shop?.name &&
              (
                <VerticalStack as="div" gap={5}>
                  <VerticalStack gap={1}>
                <p><b>Zone:</b> {settings ? settings.timeZone.offset : shop.zone}</p>
                <p><b>Current Plan</b>: {currentPlan.name}</p>
                  </VerticalStack>
                <HorizontalStack gap={2}>
                <Button onClick={()=>router.push('/presets')} primary>Presets</Button>
                <Button onClick={()=>router.push('/settings')}>Settings</Button>
                </HorizontalStack>
                </VerticalStack>
              )
            }
          </Banner>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            title="Bookings"
            sectioned
            primaryFooterAction={{
              content: "Go",
              onAction: () => {
                router.push("/bookings");
              },
            }}
          >
            <p>Edit your Bookings</p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            title="Custom Bookings"
            sectioned
            primaryFooterAction={{
              content: "Go",
              onAction: () => {
                router.push("/custom-bookings");
              },
            }}
          >
            <p>Create custom bookings manually</p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            title="Plans"
            sectioned
            primaryFooterAction={{
              content: "Explore",
              onAction: () => {
                router.push("/plans");
              },
            }}
          >
            <p>Manage your plans here</p>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section oneHalf>
          <LegacyCard
            title="Google Calender"
            sectioned
            primaryFooterAction={{
              content: "Explore",
              onAction: () => {
                router.push("/calender");
              },
            }}
          >
            <p>Track your orders here</p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            title="Webhooks"
            sectioned
            primaryFooterAction={{
              content: "Explore",
              onAction: () => {
                router.push("/webhooks");
              },
            }}
          >
            <p>List of Active webhooks</p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  </Frame>
  );
};

export default HomePage;
