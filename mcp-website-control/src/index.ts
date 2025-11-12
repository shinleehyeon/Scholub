#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import puppeteer, { Browser, Page } from "puppeteer";

interface BrowserInstance {
  browser: Browser;
  page: Page;
}

const browsers = new Map<string, BrowserInstance>();

async function createBrowser(sessionId: string): Promise<BrowserInstance> {
  if (browsers.has(sessionId)) {
    return browsers.get(sessionId)!;
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const instance = { browser, page };
  browsers.set(sessionId, instance);

  browser.on("disconnected", () => {
    browsers.delete(sessionId);
  });

  return instance;
}

async function getBrowser(
  sessionId: string = "default"
): Promise<BrowserInstance> {
  return createBrowser(sessionId);
}

const tools: Tool[] = [
  {
    name: "navigate",
    description: "Navigate to a URL in the browser",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to navigate to",
        },
        sessionId: {
          type: "string",
          description: "Browser session ID (default: 'default')",
          default: "default",
        },
        waitUntil: {
          type: "string",
          description: "When to consider navigation succeeded",
          enum: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
          default: "load",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "click",
    description: "Click on an element using a CSS selector",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of the element to click",
        },
        sessionId: {
          type: "string",
          description: "Browser session ID (default: 'default')",
          default: "default",
        },
        waitForSelector: {
          type: "number",
          description: "Timeout in milliseconds to wait for selector",
          default: 30000,
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "type",
    description: "Type text into an input field",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of the input field",
        },
        text: {
          type: "string",
          description: "Text to type",
        },
        sessionId: {
          type: "string",
          description: "Browser session ID (default: 'default')",
          default: "default",
        },
        clear: {
          type: "boolean",
          description: "Clear the field before typing",
          default: true,
        },
      },
      required: ["selector", "text"],
    },
  },
  {
    name: "screenshot",
    description: "Take a screenshot of the current page",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "Browser session ID (default: 'default')",
          default: "default",
        },
        fullPage: {
          type: "boolean",
          description: "Capture full page screenshot",
          default: false,
        },
        path: {
          type: "string",
          description: "Path to save the screenshot (optional)",
        },
      },
    },
  },
  {
    name: "get_content",
    description: "Get the text content or HTML of elements",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description:
            "CSS selector (optional, if not provided returns page content)",
        },
        sessionId: {
          type: "string",
          description: "Browser session ID (default: 'default')",
          default: "default",
        },
        asHtml: {
          type: "boolean",
          description: "Return HTML instead of text",
          default: false,
        },
      },
    },
  },
  {
    name: "wait_for_selector",
    description: "Wait for an element to appear on the page",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector to wait for",
        },
        sessionId: {
          type: "string",
          description: "Browser session ID (default: 'default')",
          default: "default",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds",
          default: 30000,
        },
        visible: {
          type: "boolean",
          description: "Wait for element to be visible",
          default: true,
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "evaluate",
    description: "Execute JavaScript code in the page context",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "JavaScript code to execute",
        },
        sessionId: {
          type: "string",
          description: "Browser session ID (default: 'default')",
          default: "default",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "close_browser",
    description: "Close a browser session",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "Browser session ID to close (default: 'default')",
          default: "default",
        },
      },
    },
  },
];

const server = new Server(
  {
    name: "website-control",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "navigate": {
        const {
          url,
          sessionId = "default",
          waitUntil = "load",
        } = args as {
          url: string;
          sessionId?: string;
          waitUntil?: string;
        };
        const { page } = await getBrowser(sessionId);
        await page.goto(url, {
          waitUntil: waitUntil as any,
          timeout: 60000,
        });
        return {
          content: [
            {
              type: "text",
              text: `Navigated to ${url}`,
            },
          ],
        };
      }

      case "click": {
        const {
          selector,
          sessionId = "default",
          waitForSelector = 30000,
        } = args as {
          selector: string;
          sessionId?: string;
          waitForSelector?: number;
        };
        const { page } = await getBrowser(sessionId);
        await page.waitForSelector(selector, {
          timeout: waitForSelector,
          visible: true,
        });
        await page.click(selector);
        return {
          content: [
            {
              type: "text",
              text: `Clicked on ${selector}`,
            },
          ],
        };
      }

      case "type": {
        const {
          selector,
          text,
          sessionId = "default",
          clear = true,
        } = args as {
          selector: string;
          text: string;
          sessionId?: string;
          clear?: boolean;
        };
        const { page } = await getBrowser(sessionId);
        await page.waitForSelector(selector, { timeout: 30000 });
        if (clear) {
          await page.click(selector, { clickCount: 3 });
        }
        await page.type(selector, text);
        return {
          content: [
            {
              type: "text",
              text: `Typed "${text}" into ${selector}`,
            },
          ],
        };
      }

      case "screenshot": {
        const {
          sessionId = "default",
          fullPage = false,
          path,
        } = args as {
          sessionId?: string;
          fullPage?: boolean;
          path?: string;
        };
        const { page } = await getBrowser(sessionId);
        const screenshot = await page.screenshot({
          fullPage,
          path,
          encoding: path ? "binary" : "base64",
        });
        return {
          content: [
            {
              type: "text",
              text: path
                ? `Screenshot saved to ${path}`
                : `Screenshot taken (base64): ${Buffer.from(
                    screenshot as Buffer
                  )
                    .toString("base64")
                    .substring(0, 100)}...`,
            },
          ],
        };
      }

      case "get_content": {
        const {
          selector,
          sessionId = "default",
          asHtml = false,
        } = args as {
          selector?: string;
          sessionId?: string;
          asHtml?: boolean;
        };
        const { page } = await getBrowser(sessionId);
        let content: string;
        if (selector) {
          if (asHtml) {
            content = await page.$eval(selector, (el: Element) => el.outerHTML);
          } else {
            content = await page.$eval(
              selector,
              (el: Element) => el.textContent || ""
            );
          }
        } else {
          if (asHtml) {
            content = await page.content();
          } else {
            content = await page.evaluate(
              () => (document.body as HTMLElement).innerText
            );
          }
        }
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      case "wait_for_selector": {
        const {
          selector,
          sessionId = "default",
          timeout = 30000,
          visible = true,
        } = args as {
          selector: string;
          sessionId?: string;
          timeout?: number;
          visible?: boolean;
        };
        const { page } = await getBrowser(sessionId);
        await page.waitForSelector(selector, {
          timeout,
          visible,
        });
        return {
          content: [
            {
              type: "text",
              text: `Element ${selector} appeared on the page`,
            },
          ],
        };
      }

      case "evaluate": {
        const { code, sessionId = "default" } = args as {
          code: string;
          sessionId?: string;
        };
        const { page } = await getBrowser(sessionId);
        const result = await page.evaluate(code);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "close_browser": {
        const { sessionId = "default" } = args as {
          sessionId?: string;
        };
        const instance = browsers.get(sessionId);
        if (instance) {
          await instance.browser.close();
          browsers.delete(sessionId);
          return {
            content: [
              {
                type: "text",
                text: `Browser session ${sessionId} closed`,
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: `Browser session ${sessionId} not found`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Website Control MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
