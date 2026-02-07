/**
 * Help documentation for JSON to Haskell Converter
 */

export interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

export const jsonToHaskellHelp: HelpSection[] = [
  {
    title: 'Getting Started',
    content: `The JSON to Haskell converter generates record types with Aeson instances.

**Quick Start:**
1. Paste your JSON in the input editor
2. Select Aeson instance style (Generic, TH, or Manual)
3. Configure deriving options
4. Copy or download the generated Haskell module

**Instance Styles:**
- **Generic** - DeriveGeneric with automatic instances
- **Template Haskell** - Uses deriveJSON from Aeson.TH
- **Manual** - Hand-written FromJSON/ToJSON`,
  },
  {
    title: 'Record Types',
    content: `Generated Haskell record types:

\`\`\`haskell
data User = User
  { userName :: Text
  , userEmail :: Text
  , userAge :: Int
  }
  deriving (Show, Eq, Generic)
\`\`\`

**Type Mappings:**
- JSON string → Text
- JSON number (integer) → Int
- JSON number (decimal) → Double
- JSON boolean → Bool
- JSON null → Maybe a
- JSON array → [a]
- JSON object → nested data type`,
  },
  {
    title: 'Generic Deriving',
    content: `Using DeriveGeneric for Aeson instances:

\`\`\`haskell
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

import Data.Aeson
import GHC.Generics (Generic)

data User = User
  { userName :: Text
  , userEmail :: Text
  }
  deriving (Show, Eq, Generic)

instance FromJSON User where
  parseJSON = genericParseJSON defaultOptions
    { fieldLabelModifier = drop 4 }

instance ToJSON User where
  toJSON = genericToJSON defaultOptions
    { fieldLabelModifier = drop 4 }
\`\`\`

The fieldLabelModifier drops the type name prefix from field names.`,
  },
  {
    title: 'Template Haskell',
    content: `Using deriveJSON from Data.Aeson.TH:

\`\`\`haskell
{-# LANGUAGE TemplateHaskell #-}

import Data.Aeson.TH

data User = User
  { userName :: Text
  , userEmail :: Text
  }
  deriving (Show, Eq)

$(deriveJSON defaultOptions
  { fieldLabelModifier = drop 4 } ''User)
\`\`\`

TH generates instances at compile time for potentially better performance.`,
  },
  {
    title: 'Manual Instances',
    content: `Hand-written Aeson instances:

\`\`\`haskell
instance FromJSON User where
  parseJSON = withObject "User" $ \\v -> User
    <$> v .: "name"
    <*> v .: "email"

instance ToJSON User where
  toJSON User{..} = object
    [ "name" .= userName
    , "email" .= userEmail
    ]
\`\`\`

Manual instances give you full control over JSON encoding/decoding.`,
  },
  {
    title: 'Best Practices',
    content: `**Use Generic Deriving:**
Generic deriving is the simplest and provides good error messages.

**Field Naming:**
Use a consistent prefix (e.g., userName, userEmail) to avoid name clashes.

**Strict Fields:**
Enable StrictData for better performance with large data structures.

**Required Extensions:**
\`\`\`haskell
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
\`\`\`

**Package Dependencies:**
- aeson
- text
- (optional) aeson-pretty for formatted output`,
  },
];
