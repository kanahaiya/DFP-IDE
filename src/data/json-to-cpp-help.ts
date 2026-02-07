/**
 * Help documentation for JSON to C++ Converter
 */

export interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

export const jsonToCppHelp: HelpSection[] = [
  {
    title: 'Getting Started',
    content: `The JSON to C++ converter generates type-safe C++ structs from your JSON data.

**Quick Start:**
1. Paste your JSON in the input editor
2. Select your preferred JSON library
3. Configure C++ standard and options
4. Copy or download the generated header

**Supported Libraries:**
- nlohmann/json - Modern, intuitive API
- RapidJSON - High performance
- jsoncpp - Broad compatibility
- Boost.JSON - Boost ecosystem`,
  },
  {
    title: 'Library Settings',
    content: `**JSON Library**
Choose which C++ JSON library to generate code for:
- nlohmann/json: Best for most projects, header-only, intuitive STL-like API
- RapidJSON: Fastest parsing, SAX and DOM APIs, header-only
- jsoncpp: Mature library, good documentation
- Boost.JSON: Native Boost integration, modern design

**C++ Standard**
Target a specific C++ standard version:
- C++11: Broadest compatibility
- C++14: constexpr improvements
- C++17: std::optional, std::string_view
- C++20: Concepts, ranges (future)`,
  },
  {
    title: 'Struct Options',
    content: `**Output Mode**
- Struct: Simple data containers (public members)
- Class: Encapsulated with private members
- Header-Only: Single .hpp file
- Header+Source: Separate .hpp and .cpp files

**Type Options**
- Use std::optional: Wrap nullable fields in std::optional (C++17+)
- Use std::string_view: For read-only string access (C++17+)
- Smart Pointers: Use std::shared_ptr for nested objects
- Generate Constructors: Add default constructors

**Naming**
- Root Class Name: Name for the top-level struct
- Namespace Prefix: Optional namespace wrapper`,
  },
  {
    title: 'Serialization',
    content: `**nlohmann/json Macros**
Enable NLOHMANN_DEFINE_TYPE_INTRUSIVE for automatic to_json/from_json:

\`\`\`cpp
struct Person {
    std::string name;
    int age;
    NLOHMANN_DEFINE_TYPE_INTRUSIVE(Person, name, age)
};
\`\`\`

**Boost.Describe**
For Boost.JSON, generates BOOST_DESCRIBE_STRUCT annotations for reflection-based serialization.

**Manual Serialization**
For RapidJSON and jsoncpp, you'll need to implement serialization functions manually.`,
  },
  {
    title: 'Type Mapping',
    content: `**JSON to C++ Type Mapping:**
| JSON Type | C++ Type |
|-----------|----------|
| string | std::string |
| number (int) | int64_t |
| number (float) | double |
| boolean | bool |
| null | std::optional<T> |
| array | std::vector<T> |
| object | nested struct |

**Nullable Fields:**
- C++17+: std::optional<T>
- C++11/14: T* or std::unique_ptr<T>`,
  },
  {
    title: 'Best Practices',
    content: `**Performance Tips:**
- Use RapidJSON for high-throughput parsing
- Consider std::string_view for read-only data
- Prefer structs over classes for simple DTOs

**Maintainability:**
- Use descriptive root class names
- Enable namespace prefixes for library code
- Choose header guards matching your project style

**Compatibility:**
- Test with your target compiler version
- Verify library version compatibility
- Consider forward declarations for large schemas`,
  },
];
