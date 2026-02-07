import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to C++ Converter Online Free - Structs & nlohmann/json',
  description: 'Convert JSON to C++ structs and classes instantly. Free online tool generates code for nlohmann/json, RapidJSON, Boost.JSON with C++11/14/17/20 support.',
  keywords: ['json to c++', 'json to cpp', 'json to c++ converter', 'json to nlohmann json', 'json to rapidjson', 'c++ struct generator'],
  openGraph: { title: 'JSON to C++ Converter - Structs & Classes', description: 'Convert JSON to C++ structs with nlohmann/json support. Free online tool.', type: 'website', url: 'https://dataformatterpro.com/json-to-cpp' },
  twitter: { card: 'summary_large_image', title: 'JSON to C++ Converter', description: 'Convert JSON to C++ structs instantly. Free online tool.' },
  alternates: { canonical: 'https://dataformatterpro.com/json-to-cpp' },
};

export default function JsonToCppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
