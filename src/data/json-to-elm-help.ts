/**
 * Help documentation for JSON to Elm Converter
 */

export interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

export const jsonToElmHelp: HelpSection[] = [
  {
    title: 'Getting Started',
    content: `The JSON to Elm converter generates type aliases, decoders, and encoders.

**Quick Start:**
1. Paste your JSON in the input editor
2. Select output options (types, decoders, encoders)
3. Choose decoder style (pipeline or mapN)
4. Copy or download the generated Elm module

**Output Options:**
- **Types Only** - Just type aliases
- **With Decoders** - Types + Json.Decode functions
- **With Encoders** - Types + Json.Encode functions
- **Full** - Types, decoders, and encoders`,
  },
  {
    title: 'Type Aliases',
    content: `Generated type aliases represent your JSON structure:

\`\`\`elm
type alias User =
    { id : Int
    , name : String
    , email : String
    , active : Bool
    }
\`\`\`

**Type Mappings:**
- JSON string → String
- JSON number (integer) → Int
- JSON number (decimal) → Float
- JSON boolean → Bool
- JSON null → Maybe a
- JSON array → List a
- JSON object → nested type alias`,
  },
  {
    title: 'Decoders',
    content: `Decoders convert JSON to Elm types.

**Pipeline Style (recommended):**
\`\`\`elm
userDecoder : Decoder User
userDecoder =
    Decode.succeed User
        |> required "id" Decode.int
        |> required "name" Decode.string
        |> required "email" Decode.string
        |> required "active" Decode.bool
\`\`\`

**Standard MapN Style:**
\`\`\`elm
userDecoder : Decoder User
userDecoder =
    Decode.map4 User
        (Decode.field "id" Decode.int)
        (Decode.field "name" Decode.string)
        (Decode.field "email" Decode.string)
        (Decode.field "active" Decode.bool)
\`\`\`

Pipeline requires: \`elm install NoRedInk/elm-json-decode-pipeline\``,
  },
  {
    title: 'Encoders',
    content: `Encoders convert Elm values to JSON:

\`\`\`elm
encodeUser : User -> Encode.Value
encodeUser record =
    Encode.object
        [ ( "id", Encode.int record.id )
        , ( "name", Encode.string record.name )
        , ( "email", Encode.string record.email )
        , ( "active", Encode.bool record.active )
        ]
\`\`\`

Use with Json.Encode.encode to get a JSON string:
\`\`\`elm
Json.Encode.encode 0 (encodeUser user)
\`\`\``,
  },
  {
    title: 'Handling Null/Maybe',
    content: `Elm has no null - use Maybe types instead.

**Nullable Field:**
\`\`\`elm
type alias Response =
    { data : Maybe String
    }

responseDecoder =
    Decode.succeed Response
        |> optional "data" (Decode.nullable Decode.string) Nothing
\`\`\`

**Encoding Maybe:**
\`\`\`elm
encodeMaybe : (a -> Value) -> Maybe a -> Value
encodeMaybe encoder maybe =
    case maybe of
        Just value -> encoder value
        Nothing -> Encode.null
\`\`\``,
  },
  {
    title: 'Best Practices',
    content: `**Use Pipeline for 3+ Fields:**
Pipeline style is more readable and maintainable for types with many fields.

**Keep Types Small:**
Break large JSON objects into smaller, focused types.

**Handle Errors:**
Always handle decoder errors in your update function:
\`\`\`elm
case Decode.decodeString userDecoder jsonString of
    Ok user -> -- success
    Err error -> -- handle error
\`\`\`

**Test Your Decoders:**
Use elm-test to verify decoders work with sample JSON.`,
  },
];
