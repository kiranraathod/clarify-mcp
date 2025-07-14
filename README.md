# Clarify-MCP Server

A Model Context Protocol (MCP) server that helps Claude ask clarification questions when explicitly requested by users. This server integrates with Claude Desktop to provide structured requirement gathering when you need it.

## Features

- **Manual Trigger**: Only activates when users explicitly mention "clarify" 
- **Smart Questions**: Generates relevant questions based on task type (coding, design, data analysis)
- **Non-intrusive**: Won't interrupt normal Claude conversations
- **Customizable**: Easy to modify question templates for your needs

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Claude Desktop
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kiranraathod/clarify-mcp.git
   cd clarify-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Configure Claude Desktop**
   
   Copy `claude_desktop_config.template.json` to `claude_desktop_config.json` and update the path:
   ```json
   {
     "mcpServers": {
       "clarify-mcp": {
         "command": "node",
         "args": ["/full/path/to/your/clarify-mcp/dist/index.js"],
         "env": {}
       }
     }
   }
   ```

5. **Add to Claude Desktop configuration**
   
   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   **Linux**: `~/.config/Claude/claude_desktop_config.json`

6. **Restart Claude Desktop**

## Usage

### When Clarification is Triggered

The server **only** activates when you explicitly mention "clarify" in your request:

✅ **Will trigger clarification:**
- "Can you **clarify** what I need for building a web app?"
- "Please **clarify** the requirements for this data analysis"
- "Help me **clarify** my idea about creating a mobile app"
- "**Clarify** what framework I should use"

❌ **Won't trigger (normal behavior):**
- "Build a todo app" → Claude starts building immediately
- "Create a dashboard" → Claude starts creating immediately


### Example Interaction

**User:** "Can you clarify what I need for building a calculator app?"

**Claude:** "I'll help clarify the requirements for: 'building a calculator app'

Here are some important questions:
1. What is the primary goal or outcome you want to achieve?
2. What programming language or framework should I use?
3. Are there any specific libraries or dependencies you prefer?


## 🔧 Configuration

### Claude Desktop Configuration

If you have existing MCP servers, add clarify-mcp to your configuration:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "clarify-mcp": {
      "command": "node",
      "args": ["/path/to/clarify-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

### Question Types

The server generates different questions based on task keywords:

- **Programming/Code**: Language, framework, environment questions
- **Design/UI**: Audience, design preferences, device compatibility
- **Data/Analysis**: Data sources, insights, presentation format
- **General**: Constraints, success criteria

## Development

### Available Scripts

```bash
npm run build    # Compile TypeScript to JavaScript
npm run start    # Run the compiled server
npm run dev      # Run in development mode with ts-node
```

### Project Structure

```
clarify-mcp/
├── src/
│   ├── index.ts              # Main server implementation
│   ├── tools/                # Tool definitions (future expansion)
│   └── prompts/              # Prompt definitions (future expansion)
├── dist/                     # Compiled JavaScript (auto-generated)
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Customizing Questions

To modify the clarification questions, edit the `generateClarificationQuestions` method in `src/index.ts`:

```typescript
private generateClarificationQuestions(task: string, context: string): string[] {
  const questions: string[] = [];
  
  // Add your custom questions here
  questions.push('1. Your custom question?');
  
  // Add conditional questions based on task type
  if (task.toLowerCase().includes('your-keyword')) {
    questions.push('2. Your specific question for this task type?');
  }
  
  return questions;
}
```



### Questions Not Generating

1. **Use trigger words**: Make sure to include "clarify" in your request
2. **Check task description**: Provide a clear task description for better questions
3. **Review logs**: Check the console output for any errors

## 🔗 Related

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [Anthropic MCP SDK](https://github.com/modelcontextprotocol/sdk)

