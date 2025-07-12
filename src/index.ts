import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class ClarifyMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'clarify-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'clarify_requirements',
            description: 'Ask clarification questions when user specifically requests clarification (when they mention "clarify")',
            inputSchema: {
              type: 'object',
              properties: {
                task: {
                  type: 'string',
                  description: 'The task or request that needs clarification',
                },
                context: {
                  type: 'string',
                  description: 'Additional context about the request',
                },
              },
              required: ['task'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'clarify_requirements') {
        return await this.handleClarifyRequirements(request.params.arguments);
      }
      
      throw new Error(`Unknown tool: ${request.params.name}`);
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'clarify_when_requested',
            description: 'Use this prompt when user specifically asks for clarification',
          },
        ],
      };
    });

    // Handle prompt requests
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      if (request.params.name === 'clarify_when_requested') {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: this.getClarificationPrompt(),
              },
            },
          ],
        };
      }
      
      throw new Error(`Unknown prompt: ${request.params.name}`);
    });
  }

  private async handleClarifyRequirements(args: any) {
    const { task, context = '' } = args;
    
    const questions = this.generateClarificationQuestions(task, context);
    
    return {
      content: [
        {
          type: 'text',
          text: `I'll help clarify the requirements for: "${task}"\n\nHere are some important questions:\n\n${questions.join('\n')}\n\nPlease provide answers so I can better understand your requirements.`,
        },
      ],
    };
  }

  private generateClarificationQuestions(task: string, context: string): string[] {
    const questions: string[] = [];
    
    // Basic requirement questions
    questions.push('1. What is the primary goal or outcome you want to achieve?');
    
    // Technical questions based on task type
    if (task.toLowerCase().includes('code') || task.toLowerCase().includes('program') || task.toLowerCase().includes('app')) {
      questions.push('2. What programming language or framework should I use?');
      questions.push('3. Are there any specific libraries or dependencies you prefer?');
      questions.push('4. What is your target environment (web, mobile, desktop, etc.)?');
    }
    
    if (task.toLowerCase().includes('design') || task.toLowerCase().includes('ui') || task.toLowerCase().includes('interface')) {
      questions.push('2. Who is your target audience?');
      questions.push('3. Do you have any design preferences or brand guidelines?');
      questions.push('4. What devices/screen sizes should this work on?');
    }
    
    if (task.toLowerCase().includes('data') || task.toLowerCase().includes('analysis') || task.toLowerCase().includes('report')) {
      questions.push('2. What is the source and format of your data?');
      questions.push('3. What specific insights are you looking for?');
      questions.push('4. How should the results be presented?');
    }
    
    // General clarification questions
    questions.push(`${questions.length + 1}. Are there any constraints or limitations I should be aware of?`);
    questions.push(`${questions.length + 1}. What does success look like for this project?`);
    
    return questions;
  }

  private getClarificationPrompt(): string {
    return `IMPORTANT: Only use clarification tools when the user specifically mentions "clarify" or asks for clarification.

When a user says something like:
- "Please clarify the requirements for..."
- "Can you clarify what I need for..."  
- "Help me clarify my idea about..."
- Or any message containing the word "clarify"

Then use the clarify_requirements tool to ask relevant questions.

DO NOT automatically ask clarification questions for every request. Only when specifically requested.

Example usage:
User: "clarify what I need for building a web app"
Response: Use clarify_requirements tool with task="building a web app"`;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Clarify MCP Server running on stdio - Manual trigger mode');
  }
}

// Start the server
const server = new ClarifyMCPServer();
server.run().catch(console.error);