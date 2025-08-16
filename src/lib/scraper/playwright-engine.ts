import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { complianceEngine, ComplianceResult } from '../compliance';
import { ScrapedData as ScrapedDataArray, ScrapedDataItem } from '@/lib/types/scraper';

export interface PlaywrightConfig {
  url: string;
  selectors: Record<string, string>;
  options?: {
    browserType?: 'chromium' | 'firefox' | 'webkit';
    headless?: boolean;
    timeout?: number;
    waitTime?: number;
    retries?: number;
    proxy?: ProxyConfig;
    userAgent?: string;
    viewport?: { width: number; height: number };
    locale?: string;
    timezone?: string;
    geolocation?: { latitude: number; longitude: number };
    cookies?: Array<{ name: string; value: string; domain?: string; path?: string }>;
    headers?: Record<string, string>;
    javascript?: boolean;
    images?: boolean;
    waitConditions?: WaitCondition[];
    antiDetection?: AntiDetectionConfig;
  };
}

export interface ProxyConfig {
  server: string;
  username?: string;
  password?: string;
  type?: 'http' | 'socks5';
}

export interface WaitCondition {
  type: 'selector' | 'text' | 'url' | 'timeout' | 'networkidle';
  value?: string;
  timeout?: number;
}

export interface AntiDetectionConfig {
  randomizeFingerprint?: boolean;
  spoofWebGL?: boolean;
  spoofCanvas?: boolean;
  randomizeTimezone?: boolean;
  randomizeLocale?: boolean;
  stealthMode?: boolean;
}

// Local ScrapedData interface for internal use - extends the imported type
export interface LocalScrapedData {
  [key: string]: string | string[] | null;
}

// Export for compatibility with existing imports
export type { LocalScrapedData as ScrapedData };

export interface PlaywrightResult {
  success: boolean;
  data?: LocalScrapedData[];
  error?: string;
  timestamp: Date;
  url: string;
  dataPointsCount?: number;
  executionTime?: number;
  screenshot?: string; // Base64 encoded screenshot
  complianceResult?: ComplianceResult;
  metrics?: {
    pageLoadTime: number;
    networkRequests: number;
    failedRequests: number;
    resourceSizes: Record<string, number>;
  };
}

class PlaywrightScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private activeSessions = new Set<string>();

  async initialize(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium') {
    if (this.browser) return;

    const launchOptions: {
      headless: boolean;
      args: string[];
      proxy?: { server: string; username?: string; password?: string };
    } = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    };

    switch (browserType) {
      case 'chromium':
        this.browser = await chromium.launch(launchOptions);
        break;
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }
  }

  async scrape(config: PlaywrightConfig): Promise<PlaywrightResult> {
    const startTime = Date.now();
    const sessionId = `${Date.now()}-${Math.random()}`;
    this.activeSessions.add(sessionId);

    let page: Page | null = null;
    const metrics = {
      pageLoadTime: 0,
      networkRequests: 0,
      failedRequests: 0,
      resourceSizes: {} as Record<string, number>
    };
    let complianceResult: ComplianceResult | null = null;

    try {
      // Initialize browser if not already done
      await this.initialize(config.options?.browserType);

      if (!this.browser) {
        throw new Error('Browser failed to initialize');
      }

      // Check compliance first
      complianceResult = await complianceEngine.checkCompliance(
        config.url,
        config.options?.userAgent || 'ScrapeFlowAI/1.0'
      );

      if (!complianceResult.allowed) {
        return {
          success: false,
          error: complianceResult.reason,
          timestamp: new Date(),
          url: config.url,
          complianceResult
        };
      }

      // Apply compliance delay if required
      if (complianceResult.delay) {
        await this.delay(complianceResult.delay);
      }

      // Create browser context with anti-detection features
      this.context = await this.createStealthContext(config);

      // Create page
      page = await this.context.newPage();

      // Set up network monitoring
      this.setupNetworkMonitoring(page, metrics);

      // Apply anti-detection measures
      await this.applyAntiDetection(page, config.options?.antiDetection);

      // Set custom headers
      if (config.options?.headers) {
        await page.setExtraHTTPHeaders(config.options.headers);
      }

      // Set cookies
      if (config.options?.cookies) {
        await this.context.addCookies(config.options.cookies);
      }

      // Navigate to page
      const navigationStart = Date.now();

      await page.goto(config.url, {
        waitUntil: 'domcontentloaded',
        timeout: config.options?.timeout || 30000
      });

      metrics.pageLoadTime = Date.now() - navigationStart;

      // Apply wait conditions
      if (config.options?.waitConditions) {
        await this.processWaitConditions(page, config.options.waitConditions);
      } else {
        // Default wait
        await this.delay(config.options?.waitTime || 2000);
      }

      // Extract data
      const data = await this.extractData(page, config.selectors);

      // Take screenshot for debugging
      const screenshot = await page.screenshot({
        type: 'jpeg',
        quality: 50,
        fullPage: false
      });

      // Apply PII redaction to extracted data
      const redactedData = this.redactPIIFromData(data);

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: redactedData,
        timestamp: new Date(),
        url: config.url,
        dataPointsCount: redactedData.length,
        executionTime,
        screenshot: screenshot.toString('base64'),
        complianceResult,
        metrics
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date(),
        url: config.url,
        executionTime,
        complianceResult: complianceResult || undefined,
        metrics
      };

    } finally {
      // Cleanup
      if (page) {
        await page.close().catch(console.error);
      }

      if (this.context) {
        await this.context.close().catch(console.error);
        this.context = null;
      }

      this.activeSessions.delete(sessionId);
    }
  }

  private async createStealthContext(config: PlaywrightConfig): Promise<BrowserContext> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const contextOptions: {
      viewport?: { width: number; height: number };
      locale?: string;
      timezoneId?: string;
      geolocation?: { latitude: number; longitude: number };
      permissions?: string[];
      ignoreHTTPSErrors?: boolean;
      javaScriptEnabled?: boolean;
      acceptDownloads?: boolean;
      proxy?: { server: string; username?: string; password?: string };
      userAgent?: string;
    } = {
      viewport: config.options?.viewport || { width: 1920, height: 1080 },
      locale: config.options?.locale || 'en-US',
      timezoneId: config.options?.timezone || 'America/New_York',
      geolocation: config.options?.geolocation,
      permissions: [],
      ignoreHTTPSErrors: true,
      javaScriptEnabled: config.options?.javascript !== false,
      acceptDownloads: false
    };

    // Proxy configuration
    if (config.options?.proxy) {
      contextOptions.proxy = {
        server: config.options.proxy.server,
        username: config.options.proxy.username,
        password: config.options.proxy.password
      };
    }

    // User agent with realistic browser signature
    const userAgent = config.options?.userAgent || this.generateRandomUserAgent();
    contextOptions.userAgent = userAgent;

    return await this.browser.newContext(contextOptions);
  }

  private async applyAntiDetection(page: Page, antiDetection?: AntiDetectionConfig): Promise<void> {
    if (!antiDetection || !antiDetection.stealthMode) return;

    // Override navigator properties
    await page.addInitScript(() => {
      // Hide webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Spoof plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Spoof languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Override permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters: PermissionDescriptor) => {
        if (parameters.name === 'notifications') {
          return Promise.resolve({
            state: Notification.permission,
            name: 'notifications',
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true
          } as PermissionStatus);
        }
        return originalQuery(parameters);
      };
    });

    // Spoof WebGL fingerprint
    if (antiDetection.spoofWebGL) {
      await page.addInitScript(() => {
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
            return 'Intel Inc.';
          }
          if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
            return 'Intel Iris OpenGL Engine';
          }
          return getParameter.call(this, parameter);
        };
      });
    }

    // Spoof Canvas fingerprint
    if (antiDetection.spoofCanvas) {
      await page.addInitScript(() => {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(...args) {
          // Add slight noise to canvas fingerprint
          const context = this.getContext('2d');
          if (context) {
            const imageData = context.getImageData(0, 0, this.width, this.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
              imageData.data[i] += Math.floor(Math.random() * 3) - 1; // Small random noise
            }
            context.putImageData(imageData, 0, 0);
          }
          return originalToDataURL.apply(this, args);
        };
      });
    }
  }

  private setupNetworkMonitoring(page: Page, metrics: {
    networkRequests: number;
    failedRequests: number;
    resourceSizes: Record<string, number>;
  }): void {
    page.on('request', (request) => {
      metrics.networkRequests++;
    });

    page.on('requestfailed', (request) => {
      metrics.failedRequests++;
    });

    page.on('response', (response) => {
      const url = response.url();
      const resourceType = response.request().resourceType();
      const size = parseInt(response.headers()['content-length'] || '0');

      if (!metrics.resourceSizes[resourceType]) {
        metrics.resourceSizes[resourceType] = 0;
      }
      metrics.resourceSizes[resourceType] += size;
    });
  }

  private async processWaitConditions(page: Page, conditions: WaitCondition[]): Promise<void> {
    for (const condition of conditions) {
      try {
        switch (condition.type) {
          case 'selector':
            if (condition.value) {
              await page.waitForSelector(condition.value, {
                timeout: condition.timeout || 10000
              });
            }
            break;

          case 'text':
            if (condition.value) {
              await page.waitForFunction(
                (text) => document.body.innerText.includes(text),
                condition.value,
                { timeout: condition.timeout || 10000 }
              );
            }
            break;

          case 'url':
            if (condition.value) {
              await page.waitForURL(condition.value, {
                timeout: condition.timeout || 10000
              });
            }
            break;

          case 'timeout':
            await this.delay(condition.timeout || 1000);
            break;

          case 'networkidle':
            await page.waitForLoadState('networkidle', {
              timeout: condition.timeout || 10000
            });
            break;
        }
      } catch (error) {
        console.warn(`Wait condition failed: ${condition.type}`, error);
      }
    }
  }

  private async extractData(page: Page, selectors: Record<string, string>): Promise<LocalScrapedData[]> {
    const data: LocalScrapedData[] = [];

    // Execute extraction in page context
    const extractedData = await page.evaluate((selectors) => {
      const results: Record<string, string | string[] | null>[] = [];

      // Find all possible data rows/items first
      const dataContainers = document.querySelectorAll('body, main, .content, .container, [data-item], .item, .product, .listing, .result');

      if (dataContainers.length === 0) {
        // No containers found, extract from entire page
        const result: Record<string, string | string[] | null> = {};

        for (const [key, selector] of Object.entries(selectors)) {
          try {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
              result[key] = null;
            } else if (elements.length === 1) {
              result[key] = elements[0].textContent?.trim() || null;
            } else {
              result[key] = Array.from(elements)
                .map(el => el.textContent?.trim())
                .filter((text): text is string => Boolean(text));
            }
          } catch (error) {
            result[key] = null;
          }
        }

        results.push(result);
      } else {
        // Try to extract from each container
        for (const container of Array.from(dataContainers).slice(0, 100)) { // Limit to 100 items
          const result: Record<string, string | string[] | null> = {};
          let hasData = false;

          for (const [key, selector] of Object.entries(selectors)) {
            try {
              const elements = container.querySelectorAll(selector);
              if (elements.length === 0) {
                // Try global selector if local fails
                const globalElements = document.querySelectorAll(selector);
                if (globalElements.length > 0) {
                  result[key] = globalElements[0].textContent?.trim() || null;
                  hasData = true;
                } else {
                  result[key] = null;
                }
              } else if (elements.length === 1) {
                result[key] = elements[0].textContent?.trim() || null;
                if (result[key]) hasData = true;
              } else {
                const filteredTexts = Array.from(elements)
                  .map(el => el.textContent?.trim())
                  .filter((text): text is string => Boolean(text));
                result[key] = filteredTexts;
                if (filteredTexts.length > 0) hasData = true;
              }
            } catch (error) {
              result[key] = null;
            }
          }

          if (hasData) {
            results.push(result);
          }
        }
      }

      return results;
    }, selectors);

    return extractedData.length > 0 ? extractedData : [];
  }

  private redactPIIFromData(data: LocalScrapedData[]): LocalScrapedData[] {
    return data.map(item => {
      const redactedItem: LocalScrapedData = {};

      for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'string') {
          const { redacted } = complianceEngine.redactPII(value);
          redactedItem[key] = redacted;
        } else if (Array.isArray(value)) {
          redactedItem[key] = value.map(v => {
            if (typeof v === 'string') {
              const { redacted } = complianceEngine.redactPII(v);
              return redacted;
            }
            return v;
          });
        } else {
          redactedItem[key] = value;
        }
      }

      return redactedItem;
    });
  }

  private generateRandomUserAgent(): string {
    const versions = ['109.0.0.0', '108.0.0.0', '107.0.0.0', '106.0.0.0'];
    const version = versions[Math.floor(Math.random() * versions.length)];

    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  getActiveSessions(): number {
    return this.activeSessions.size;
  }
}

// Batch scraping functionality
class BatchScraper {
  private maxConcurrent: number;
  private activeJobs = new Set<string>();

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  async scrapeBatch(configs: PlaywrightConfig[]): Promise<PlaywrightResult[]> {
    const results: PlaywrightResult[] = [];
    const chunks = this.chunkArray(configs, this.maxConcurrent);

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (config, index) => {
        const jobId = `batch-${Date.now()}-${index}`;
        this.activeJobs.add(jobId);

        try {
          const scraper = new PlaywrightScraper();
          const result = await scraper.scrape(config);
          await scraper.close();
          return result;
        } finally {
          this.activeJobs.delete(jobId);
        }
      });

      const chunkResults = await Promise.allSettled(chunkPromises);
      results.push(...chunkResults.map(r =>
        r.status === 'fulfilled' ? r.value : {
          success: false,
          error: r.reason?.message || 'Unknown error',
          timestamp: new Date(),
          url: 'unknown'
        }
      ));
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  getActiveJobs(): number {
    return this.activeJobs.size;
  }
}

// Create a singleton instance
export const playwrightScraper = new PlaywrightScraper();

// Convenience function to run a scrape job
export async function runScraper(config: PlaywrightConfig): Promise<PlaywrightResult> {
  await playwrightScraper.initialize();
  return await playwrightScraper.scrape(config);
}

export { PlaywrightScraper, BatchScraper };
