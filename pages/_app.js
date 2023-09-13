import { NavigationMenu } from "@shopify/app-bridge-react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import { useRouter } from "next/router";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store/store";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider>
        <ReduxProvider store={store}>
        <Component {...pageProps} />
        </ReduxProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}
