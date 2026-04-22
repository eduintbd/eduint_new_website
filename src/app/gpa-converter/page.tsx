import GPAConverter from "@/components/gpa/GPAConverter";
import { Calculator } from "lucide-react";

export const metadata = {
  title: "GPA Converter",
  description: "Convert your GPA across different scales - 4.0, 5.0, 10.0, and percentage.",
};

export default function GPAConverterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4">
          <Calculator className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">GPA Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert your GPA across different grading scales used worldwide.
        </p>
      </div>

      <GPAConverter />

      <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-200 mb-2">About GPA Scales</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>&bull; <strong>4.0 Scale:</strong> Used in US, Canada, and many international universities</li>
          <li>&bull; <strong>5.0 Scale:</strong> Common in Bangladesh, Nigeria, and parts of South Asia</li>
          <li>&bull; <strong>10.0 Scale:</strong> Used in India, France, and some European countries</li>
          <li>&bull; <strong>Percentage:</strong> Universal scale, easily convertible to other formats</li>
        </ul>
      </div>
    </div>
  );
}
