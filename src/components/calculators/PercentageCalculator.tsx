"use client";

import { PercentDiamond } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const modes = {
  PERCENTAGE: "Percentage",
  CONVERSION: "Conversion",
};

export function PercentageCalculator() {
  const [mode, setMode] = useState(modes.PERCENTAGE);
  const [inputX, setInputX] = useState<number | string>("");
  const [inputY, setInputY] = useState<number | string>("");
  const [result, setResult] = useState<number | null>(null);
  const [warning, setWarning] = useState<string>("");

  const calculate = () => {
    let calculatedResult: number | null = null;
    setWarning("");

    // Calculation logic for Percentage and Conversion
    switch (mode) {
      case modes.PERCENTAGE:
        if (inputX && inputY) {
          calculatedResult =
            ((Number(inputY) - Number(inputX)) / Number(inputX)) * 100;
        }
        break;
      case modes.CONVERSION:
        if (inputX && inputY) {
          calculatedResult = (Number(inputY) / Number(inputX)) * 100;
        }
        break;
      default:
        break;
    }

    if (calculatedResult === null) {
      setWarning("Please fill in both fields to calculate.");
    } else {
      setResult(calculatedResult);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center gap-4 overflow-hidden rounded-full">
        {Object.values(modes).map((m) => (
          <Button
            key={m}
            className={`px-4 py-2 text-lg font-bold ${mode === m ? "bg-blue-500 text-white" : "bg-gray-200"} flex items-center justify-center rounded-full`}
            onClick={() => setMode(m)}
          >
            <span className="mr-2">
              <PercentDiamond />
            </span>
            {m}
          </Button>
        ))}
      </div>
      <div className="mt-4 py-20 text-center">
        <h3 className="text-4xl font-bold">
          {result !== null ? result : <span className="text-gray-400">%</span>}
        </h3>
        {warning && <p className="text-red-500">{warning}</p>}
      </div>
      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <input
          type="number"
          placeholder="Input X"
          value={inputX}
          onChange={(e) => setInputX(e.target.value)}
          className="w-full border p-2"
        />
        <input
          type="number"
          placeholder="Input Y"
          value={inputY}
          onChange={(e) => setInputY(e.target.value)}
          className="w-full border p-2"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          variant="default"
          size="lg"
          onClick={calculate}
          className="text-2xl rounded-2xl bg-white px-10 py-8 font-bold text-black"
        >
          Calculate
        </Button>
      </div>
    </div>
  );
}
