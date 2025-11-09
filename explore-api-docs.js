import puppeteer from 'puppeteer';

async function exploreAPIDocs() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to API docs...');
    await page.goto('https://scholub-api.alpa.dev/api/docs#', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    // 페이지가 로드될 때까지 대기
    await page.waitForTimeout(3000);
    
    // Swagger UI의 모든 엔드포인트 섹션 찾기
    console.log('Extracting API endpoints...');
    
    // Swagger UI 구조에서 엔드포인트 정보 추출
    const endpoints = await page.evaluate(() => {
      const results = [];
      
      // Swagger UI의 operation 태그들 찾기
      const operations = document.querySelectorAll('.opblock-tag, .opblock-summary');
      operations.forEach((op, index) => {
        const tag = op.querySelector('.opblock-tag-section')?.textContent?.trim();
        const method = op.querySelector('.opblock-summary-method')?.textContent?.trim();
        const path = op.querySelector('.opblock-summary-path')?.textContent?.trim();
        const description = op.querySelector('.opblock-summary-description')?.textContent?.trim();
        
        if (tag || method || path) {
          results.push({
            tag: tag || 'Unknown',
            method: method || 'Unknown',
            path: path || 'Unknown',
            description: description || '',
            index
          });
        }
      });
      
      // 대안: 모든 링크에서 엔드포인트 정보 추출
      const links = document.querySelectorAll('a[href*="#/"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent?.trim();
        if (href && href.includes('#/') && text) {
          results.push({
            href,
            text,
            type: 'link'
          });
        }
      });
      
      return results;
    });
    
    console.log('Found endpoints:', JSON.stringify(endpoints, null, 2));
    
    // 페이지의 전체 텍스트 내용도 가져오기
    const pageContent = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    console.log('\n=== Page Content (first 2000 chars) ===');
    console.log(pageContent.substring(0, 2000));
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: '/Users/shinleehyeon/Dev/Projects/Scholub/api-docs-screenshot.png',
      fullPage: true 
    });
    console.log('\nScreenshot saved to api-docs-screenshot.png');
    
    // Swagger UI의 실제 구조를 더 자세히 탐색
    console.log('\n=== Exploring Swagger UI Structure ===');
    const swaggerStructure = await page.evaluate(() => {
      const structure = {
        tags: [],
        paths: []
      };
      
      // 태그 섹션 찾기
      const tagElements = document.querySelectorAll('.opblock-tag-section, .opblock-tag');
      tagElements.forEach(el => {
        const tagText = el.textContent?.trim();
        if (tagText && !structure.tags.includes(tagText)) {
          structure.tags.push(tagText);
        }
      });
      
      // 경로 정보 찾기
      const pathElements = document.querySelectorAll('.opblock-summary-path, .opblock-summary');
      pathElements.forEach(el => {
        const pathText = el.textContent?.trim();
        if (pathText) {
          structure.paths.push(pathText);
        }
      });
      
      return structure;
    });
    
    console.log('Swagger Structure:', JSON.stringify(swaggerStructure, null, 2));
    
    await browser.close();
    
    return { endpoints, pageContent: pageContent.substring(0, 5000), swaggerStructure };
    
  } catch (error) {
    console.error('Error:', error);
    await browser.close();
    throw error;
  }
}

exploreAPIDocs()
  .then(result => {
    console.log('\n=== Final Results ===');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });

