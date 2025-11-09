import puppeteer from 'puppeteer';

async function extractAPIDetails() {
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
    
    console.log('Extracting detailed API information...');
    
    // 먼저 모든 태그를 펼치기
    await page.evaluate(() => {
      const tagButtons = document.querySelectorAll('.opblock-tag-section');
      tagButtons.forEach(btn => {
        if (btn instanceof HTMLElement) {
          btn.click();
        }
      });
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 모든 엔드포인트의 상세 정보 추출
    const apiDetails = await page.evaluate(async () => {
      const details = [];
      
      // 모든 operation 블록 찾기
      const operations = Array.from(document.querySelectorAll('.opblock-summary'));
      
      console.log(`Found ${operations.length} operations`);
      
      for (let i = 0; i < Math.min(operations.length, 10); i++) { // 처음 10개만 테스트
        try {
          const op = operations[i];
          
          // 태그 찾기
          let tag = 'Unknown';
          let parent = op.closest('.opblock-tag');
          if (parent) {
            const tagSection = parent.querySelector('.opblock-tag-section');
            if (tagSection) {
              tag = tagSection.textContent?.trim();
            }
          }
          
          // 메서드와 경로 추출
          const methodEl = op.querySelector('.opblock-summary-method');
          const pathEl = op.querySelector('.opblock-summary-path');
          const descriptionEl = op.querySelector('.opblock-summary-description');
          
          if (!methodEl || !pathEl) {
            console.log(`Skipping operation ${i}: missing method or path`);
            continue;
          }
          
          const method = methodEl.textContent?.trim();
          const path = pathEl.textContent?.trim();
          const description = descriptionEl?.textContent?.trim() || '';
          
          console.log(`Processing: ${method} ${path}`);
          
          // 클릭하여 펼치기
          op.click();
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const detail = {
            tag,
            method,
            path,
            description,
            parameters: [],
            requestBody: null,
            responses: {},
            rawHtml: ''
          };
          
          // 펼쳐진 operation 블록 찾기
          const opBlock = op.closest('.opblock');
          if (opBlock) {
            detail.rawHtml = opBlock.innerHTML.substring(0, 1000);
            
            // Parameters 추출
            const paramContainers = opBlock.querySelectorAll('.parameters-container, .opblock-parameters');
            paramContainers.forEach(container => {
              const rows = container.querySelectorAll('tbody tr, .parameter-row');
              rows.forEach(row => {
                const nameEl = row.querySelector('.parameter__name, .col_header');
                const inEl = row.querySelector('.parameter__in');
                const requiredEl = row.querySelector('.parameter__required');
                const typeEl = row.querySelector('.parameter__type, .parameter__type__select');
                const descriptionEl = row.querySelector('.parameter__description');
                
                if (nameEl) {
                  detail.parameters.push({
                    name: nameEl.textContent?.trim(),
                    in: inEl?.textContent?.trim() || '',
                    required: requiredEl?.textContent?.trim() === 'required' || requiredEl?.textContent?.trim() === 'true',
                    type: typeEl?.textContent?.trim() || '',
                    description: descriptionEl?.textContent?.trim() || ''
                  });
                }
              });
            });
            
            // Request Body 추출
            const requestBodySection = opBlock.querySelector('.opblock-body, .request-body');
            if (requestBodySection) {
              const bodyText = requestBodySection.textContent?.trim();
              if (bodyText && bodyText.length > 0) {
                detail.requestBody = {
                  description: bodyText.substring(0, 1000)
                };
                
                // JSON 스키마 찾기
                const schemaEl = requestBodySection.querySelector('.model-box, .model-container, .model');
                if (schemaEl) {
                  detail.requestBody.schema = schemaEl.textContent?.trim();
                }
              }
            }
            
            // Responses 추출
            const responseSection = opBlock.querySelector('.responses-wrapper, .opblock-responses');
            if (responseSection) {
              const responseRows = responseSection.querySelectorAll('tbody tr, .response');
              responseRows.forEach(row => {
                const codeEl = row.querySelector('.response-col_status, .response_status');
                const descriptionEl = row.querySelector('.response-col_description, .response_description');
                
                if (codeEl) {
                  const code = codeEl.textContent?.trim();
                  const description = descriptionEl?.textContent?.trim() || '';
                  
                  detail.responses[code] = {
                    description,
                    schema: null
                  };
                  
                  // 응답 스키마 찾기
                  const schemaEl = row.querySelector('.model-box, .model-container, .model');
                  if (schemaEl) {
                    detail.responses[code].schema = schemaEl.textContent?.trim();
                  }
                }
              });
            }
          }
          
          details.push(detail);
          
        } catch (error) {
          console.log(`Error processing operation ${i}:`, error.message);
        }
      }
      
      return details;
    });
    
    console.log(`\nExtracted ${apiDetails.length} API endpoints`);
    
    // 결과를 JSON으로 저장
    const fs = await import('fs');
    fs.writeFileSync(
      '/Users/shinleehyeon/Dev/Projects/Scholub/api-details.json',
      JSON.stringify(apiDetails, null, 2)
    );
    
    console.log('Details saved to api-details.json');
    
    // 상세 출력
    apiDetails.forEach((api, index) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`${index + 1}. [${api.method}] ${api.path}`);
      console.log(`Tag: ${api.tag}`);
      console.log(`Description: ${api.description}`);
      
      if (api.parameters.length > 0) {
        console.log(`\nParameters:`);
        api.parameters.forEach(param => {
          console.log(`  - ${param.name} (${param.in})${param.required ? ' [required]' : ''}: ${param.type}`);
          if (param.description) {
            console.log(`    ${param.description}`);
          }
        });
      }
      
      if (api.requestBody) {
        console.log(`\nRequest Body:`);
        console.log(`  ${api.requestBody.description.substring(0, 200)}`);
        if (api.requestBody.schema) {
          console.log(`\nSchema:\n${api.requestBody.schema.substring(0, 300)}`);
        }
      }
      
      if (Object.keys(api.responses).length > 0) {
        console.log(`\nResponses:`);
        Object.entries(api.responses).forEach(([code, resp]) => {
          console.log(`  ${code}: ${resp.description}`);
          if (resp.schema) {
            console.log(`    Schema: ${resp.schema.substring(0, 200)}`);
          }
        });
      }
    });
    
    await browser.close();
    
    return apiDetails;
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    await browser.close();
    throw error;
  }
}

extractAPIDetails()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed:', error.message);
    process.exit(1);
  });
