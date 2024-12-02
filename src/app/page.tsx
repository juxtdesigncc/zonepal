import { FAQ } from "@/components/FAQ";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { Bounded } from "@/components/common/Bounded";
import Image from "next/image";
import CalculatorIllustration from "../../public/calculator.svg";
import FingertipIllustration from "../../public/fingertip.svg";
import DeviceIllustration from "../../public/device.svg";
import { Percent } from "lucide-react";

export default function Home() {
  return (
    <Bounded size="widest">
      <div className="">
        <nav className="mb-4 w-full p-4">
          <ul className="flex justify-between">
            <li className="text-2xl">
              <Percent className="w-8 h-8"/>
            </li>
            <div className="flex">
              <li className="mr-4 text-lg">
                <a href="#features" className="p-5">Features</a>
              </li>
              <li className="text-lg">
                <a href="#faq" className="p-5">FAQ</a>
              </li>
            </div>
          </ul>
        </nav>
        <div className="flex-1 p-4">
          <div className="py-10 md:py-30">
            <h1 className="text-center text-3xl md:text-5xl font-bold text-balance">
              Calculate percentage and ratio with ease
            </h1>
          </div>
          <div className="mt-4 rounded bg-gray-100 p-4 my-16">
            <PercentageCalculator />
          </div>
          <section id="features" className="my-16">
            <h2 className="text-xl font-semibold mb-8">Features</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="rounded-2xl border p-8 shadow-solid">
                <h3 className="text-2xl font-bold text-center">Instant Calculations at Your Fingertips</h3>
                <Image src={FingertipIllustration} alt="" />
                <p>Instantly perform complex calculations with a user-friendly interface that simplifies your math tasks.</p>
              </div>
              <div className="rounded-2xl border p-8 shadow-solid">
                <h3 className="text-2xl font-bold text-center">Multiple Modes for Every Need</h3>
              <Image src={DeviceIllustration} alt="" />
                <p>Switch effortlessly between multiple calculation modes tailored for percentages, conversions, and analytics.</p>
              </div>
              <div className="rounded-2xl border p-8 shadow-solid">
                <h3 className="text-2xl font-bold text-center">Simplicity Meets Functionality</h3>
                <Image src={CalculatorIllustration} alt="" />
                <p>Experience a beautifully designed calculator that prioritizes user experience.</p>
              </div>
            </div>
          </section>
          <section id="faq" className="my-16">
            <h2 className="text-xl font-semibold mb-8">FAQ</h2>
            <FAQ />
          </section>
        </div>
      </div>
    </Bounded>
  );
}
