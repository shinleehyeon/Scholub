import puppeteer from 'puppeteer';

async function debugSwagger() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to API docs...');
    await page.goto('https://scholub-api.alpa.dev/api/docs#', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    await page.waitForSelector('.swagger-ui', { timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const structure = await page.evaluate(() => {
      const info = {
        selectors: {
          tags: [],
          operations: [],
          methods: [],
          paths: []
        },
        html: {
          firstTag: '',
          firstOperation: ''
        },
        text: document.body.innerText.substring(0, 2000)
      };
      
      // 다양한 선택자로 태그 찾기
      const tagSelectors = [
        '.opblock-tag-section',
        '.opblock-tag',
        '[class*="tag"]',
        '[id*="tag"]'
      ];
      
      tagSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          info.selectors.tags.push({
            selector,
            count: elements.length,
            firstText: elements[0]?.textContent?.trim() || ''
          });
        }
      });
      
      // 다양한 선택자로 operation 찾기
      const opSelectors = [
        '.opblock-summary',
        '.opblock',
        '[class*="opblock"]',
        '[class*="operation"]'
      ];
      
      opSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          info.selectors.operations.push({
            selector,
            count: elements.length,
            firstText: elements[0]?.textContent?.trim()?.substring(0, 100) || ''
          });
        }
      });
      
      // 첫 번째 태그 HTML
      const firstTag = document.querySelector('.opblock-tag-section, .opblock-tag');
      if (firstTag) {
        info.html.firstTag = firstTag.outerHTML.substring(0, 500);
      }
      
      // 첫 번째 operation HTML
      const firstOp = document.querySelector('.opblock-summary, .opblock');
      if (firstOp) {
        info.html.firstOperation = firstOp.outerHTML.substring(0, 1000);
      }
      
      return info;
    });
    
    console.log('\n=== Swagger UI Structure ===');
    console.log(JSON.stringify(structure, null, 2));
    
    // 페이지의 모든 클래스 이름 수집
    const allClasses = await page.evaluate(() => {
      const classes = new Set();
      document.querySelectorAll('*').forEach(el => {
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(cls => {
            if (cls && cls.length > 0) {
              classes.add(cls);
            }
          });
        }
      });
      return Array.from(classes).filter(cls => 
        cls.includes('op') || 
        cls.includes('tag') || 
        cls.includes('method') || 
        cls.includes('path') ||
        cls.includes('swagger')
      ).sort();
    });
    
    console.log('\n=== Relevant CSS Classes ===');
    console.log(allClasses.join('\n'));
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    await browser.close();
    throw error;
  }
}

debugSwagger()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed:', error.message);
    process.exit(1);
  });

