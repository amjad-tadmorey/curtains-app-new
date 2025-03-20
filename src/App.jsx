import { Route, Routes } from "react-router-dom";
import Orders from "./pages/Orders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast"
import AppLayout from "./ui/AppLayout";
import Accounts from "./pages/Accounts";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import OrderPrint from "./pages/OrderPrint";
import OrderView from "./pages/OrderView";
import MyAccount from "./pages/MyAccount";
import AdminRoute from "./features/auth/AdminRoute";

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

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Orders />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/view/:orderId" element={<OrderView />} />
          <Route path="orders/print/:orderId" element={<OrderPrint />} />
          <Route path="products" element={<AdminRoute><Products /></AdminRoute>} />
          <Route path="products/:productId" element={<ProductView />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="accounts" element={<AdminRoute><Accounts /></AdminRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}

export default App
