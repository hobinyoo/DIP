import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../src/pages/Main";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/sso/autologin" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
