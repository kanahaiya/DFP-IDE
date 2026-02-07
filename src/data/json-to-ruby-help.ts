/**
 * Help documentation for JSON to Ruby Converter
 */

export interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

export const jsonToRubyHelp: HelpSection[] = [
  {
    title: 'Getting Started',
    content: `The JSON to Ruby converter transforms your JSON data into Ruby code.

**Quick Start:**
1. Paste your JSON in the input editor
2. Select your preferred output mode
3. Configure hash syntax and options
4. Copy or download the generated Ruby code

**Output Modes:**
- **Hash** - Ruby hash literal
- **Struct** - Struct.new with keyword_init
- **OpenStruct** - Dynamic attribute object
- **Class** - Full Ruby class with methods
- **Data** - Ruby 3.2+ Data.define`,
  },
  {
    title: 'Hash Syntax',
    content: `Ruby supports multiple hash syntax styles:

**Symbol Keys (Modern)**
\`\`\`ruby
{ name: 'value', count: 42 }
\`\`\`

**Hashrockets (Classic)**
\`\`\`ruby
{ :name => 'value', :count => 42 }
\`\`\`

**String Keys**
\`\`\`ruby
{ 'name' => 'value', 'count' => 42 }
\`\`\`

Use modern symbol syntax for new projects. Use hashrockets for Ruby 1.8 compatibility or when keys aren't valid symbols.`,
  },
  {
    title: 'Output Modes',
    content: `**Hash**
Simple key-value structure, best for configuration or passing data.

**Struct**
Lightweight class with named attributes. Faster than Hash for attribute access.
\`\`\`ruby
Person = Struct.new(:name, :age, keyword_init: true)
\`\`\`

**OpenStruct**
Dynamic attributes, slower but flexible. Good for prototyping.
\`\`\`ruby
person = OpenStruct.new(name: 'John', age: 30)
\`\`\`

**Class**
Full Ruby class with initialize, accessors, and optional serialization methods.

**Data.define (Ruby 3.2+)**
Immutable value objects. Best for representing API responses or domain values.
\`\`\`ruby
Person = Data.define(:name, :age)
\`\`\``,
  },
  {
    title: 'Class Options',
    content: `When generating classes, you can enable:

**attr_accessor**
Generates getter and setter methods for all attributes.

**initialize method**
Creates a constructor with keyword arguments.

**to_json / to_h**
Adds serialization methods to convert back to Hash/JSON.

**from_json**
Adds a class method to parse JSON strings directly.

\`\`\`ruby
class Person
  attr_accessor :name, :age

  def initialize(name: nil, age: nil)
    @name = name
    @age = age
  end
end
\`\`\``,
  },
  {
    title: 'Frozen String Literal',
    content: `The \`# frozen_string_literal: true\` pragma makes all string literals frozen (immutable).

**Benefits:**
- Performance improvement (string reuse)
- Prevents accidental mutations
- Encouraged by RuboCop

**When to Use:**
- All new Ruby files
- Libraries and gems
- Performance-critical code

**When to Skip:**
- Legacy codebases
- Files that modify strings in place`,
  },
  {
    title: 'Best Practices',
    content: `**Choosing Data Structures:**
- Use Hash for simple, temporary data
- Use Struct for known, fixed attributes
- Use Class when you need methods/behavior
- Use Data.define for immutable value objects

**Rails Projects:**
- Enable frozen_string_literal
- Use symbol key syntax
- Consider ActiveModel::Attributes for complex models

**Performance Tips:**
- Struct is faster than Hash for repeated access
- OpenStruct is slow - avoid in loops
- Frozen strings reduce memory allocations`,
  },
];
