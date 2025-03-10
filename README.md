# chart
Generate a Last.fm chart of your top albuns

# Requirements

A somewhat recent version of Bun 

# Usage

```
bun install

bun run index.ts [options]
```

## Options

| Name   | CLI Argument | Values                                                     |
| ------ | ------------ | ---------------------------------------------------------- |
| Period | --period     | '7day', '1month', '3month', '6month', '12month', 'overall' |
| Grid Size | --gridSize     | 2..10 |
| Username | --username     | <string> |
| Output | --output     | Optional, if not specified, the root of the project |