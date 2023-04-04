import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import {I18nextProvider} from "react-i18next/dist/es";
import i18n from "./i18n.js";
export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
      <I18nextProvider i18n={i18n}>
        <PolarisProvider>
          <BrowserRouter>
            <AppBridgeProvider>
              <QueryProvider>
                <NavigationMenu
                    navigationLinks={[
                      {
                        label: "Page name",
                        destination: "/pagename",
                      },
                    ]}
                />
                <Routes pages={pages}/>
              </QueryProvider>
            </AppBridgeProvider>
          </BrowserRouter>
        </PolarisProvider>
      </I18nextProvider>
  );
}
