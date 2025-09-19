// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ECGRealtime from "./pages/patient/ECGRealtime";
import NotFound from "./pages/NotFound";


function App() {
  return (
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex min-h-screen flex-col items-center justify-center">
              <h1 className="text-2xl mb-4">Home Page</h1>
              <Button>Click me</Button>
            </div>
          }
        />
        <Route path="/ecg-realtime" element={<ECGRealtime />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
