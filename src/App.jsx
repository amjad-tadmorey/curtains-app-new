import { BrowserRouter, Route, Routes } from "react-router-dom";
import Orders from "./pages/Orders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast"
import OrderView from "./pages/OrderView";
import AppLayout from "./ui/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import Accounts from "./pages/Accounts";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            className: "z-[99999999999999999999999999999]", // Set a high z-index
            success: {
              duration: 3000
            },
            error: {
              duration: 5000
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: 'var(--color-grey-0)',
              color: 'var(--color-grey-700)',
            }
          }}
        />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* <Route index element={<Dashboard />} /> */}
            <Route index element={<Orders />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderView />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:productId" element={<ProductView />} />
            <Route path="accounts" element={<Accounts />} />
            {/* <Route path="settings" element={<Settings />} /> */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
