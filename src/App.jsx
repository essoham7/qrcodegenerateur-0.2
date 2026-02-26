import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import HeroSection from "./components/Hero";
import Templates from "./components/Templates";

function App() {
  return React.createElement(
    Router,
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      },
    },
    React.createElement(
      "div",
      { className: "App min-h-screen bg-gray-50" },
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 },
        },
        React.createElement(Navbar),
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: "/",
            element: React.createElement(HeroSection),
          }),
          React.createElement(Route, {
            path: "/templates",
            element: React.createElement(Templates),
          }),
        ),
      ),
      React.createElement(Toaster, { position: "top-right", richColors: true }),
    ),
  );
}

export default App;
