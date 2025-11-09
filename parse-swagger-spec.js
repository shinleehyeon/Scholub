import fs from 'fs';

const fileContent = fs.readFileSync('/Users/shinleehyeon/Dev/Projects/Scholub/swagger-ui-init.js', 'utf-8');

// swaggerDoc 객체 시작과 끝 찾기
const startMarker = '"swaggerDoc":';
const startIdx = fileContent.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find swaggerDoc');
  process.exit(1);
}

// 중괄호 매칭으로 객체 끝 찾기
let braceCount = 0;
let inString = false;
let escapeNext = false;
let startBraceIdx = -1;

for (let i = startIdx + startMarker.length; i < fileContent.length; i++) {
  const char = fileContent[i];
  
  if (escapeNext) {
    escapeNext = false;
    continue;
  }
  
  if (char === '\\') {
    escapeNext = true;
    continue;
  }
  
  if (char === '"') {
    inString = !inString;
    continue;
  }
  
  if (inString) continue;
  
  if (char === '{') {
    if (startBraceIdx === -1) {
      startBraceIdx = i;
    }
    braceCount++;
  } else if (char === '}') {
    braceCount--;
    if (braceCount === 0 && startBraceIdx !== -1) {
      // swaggerDoc 객체 추출
      const swaggerDocStr = fileContent.substring(startBraceIdx, i + 1);
      
      // JSON 파싱
      let swaggerDoc;
      try {
        swaggerDoc = JSON.parse(swaggerDocStr);
      } catch (e) {
        console.error('Failed to parse as JSON:', e.message);
        // JavaScript 객체로 평가 시도
        try {
          swaggerDoc = eval('(' + swaggerDocStr + ')');
        } catch (e2) {
          console.error('Failed to parse:', e2.message);
          process.exit(1);
        }
      }
      
      // API 엔드포인트 상세 정보 추출
      const apiDetails = [];
      
      if (swaggerDoc && swaggerDoc.paths) {
        Object.entries(swaggerDoc.paths).forEach(([path, methods]) => {
          Object.entries(methods).forEach(([method, operation]) => {
            const detail = {
              path,
              method: method.toUpperCase(),
              operationId: operation.operationId || '',
              tags: operation.tags || [],
              summary: operation.summary || '',
              description: operation.description || '',
              parameters: [],
              requestBody: null,
              responses: {}
            };
            
            // Parameters
            if (operation.parameters) {
              operation.parameters.forEach(param => {
                const paramDetail = {
                  name: param.name,
                  in: param.in,
                  required: param.required || false,
                  description: param.description || '',
                  schema: param.schema || {}
                };
                
                if (param.example !== undefined) {
                  paramDetail.example = param.example;
                }
                
                detail.parameters.push(paramDetail);
              });
            }
            
            // Request Body
            if (operation.requestBody) {
              detail.requestBody = {
                description: operation.requestBody.description || '',
                required: operation.requestBody.required || false,
                content: {}
              };
              
              if (operation.requestBody.content) {
                Object.entries(operation.requestBody.content).forEach(([contentType, content]) => {
                  detail.requestBody.content[contentType] = {
                    schema: content.schema || {}
                  };
                  
                  if (content.example !== undefined) {
                    detail.requestBody.content[contentType].example = content.example;
                  }
                });
              }
            }
            
            // Responses
            if (operation.responses) {
              Object.entries(operation.responses).forEach(([statusCode, response]) => {
                detail.responses[statusCode] = {
                  description: response.description || '',
                  content: {}
                };
                
                if (response.content) {
                  Object.entries(response.content).forEach(([contentType, content]) => {
                    detail.responses[statusCode].content[contentType] = {
                      schema: content.schema || {}
                    };
                    
                    if (content.example !== undefined) {
                      detail.responses[statusCode].content[contentType].example = content.example;
                    }
                  });
                }
              });
            }
            
            apiDetails.push(detail);
          });
        });
      }
      
      // 결과 저장
      fs.writeFileSync(
        '/Users/shinleehyeon/Dev/Projects/Scholub/api-details.json',
        JSON.stringify(apiDetails, null, 2)
      );
      
      // 태그별로 그룹화
      const groupedByTag = {};
      apiDetails.forEach(api => {
        const tag = api.tags[0] || 'Uncategorized';
        if (!groupedByTag[tag]) {
          groupedByTag[tag] = [];
        }
        groupedByTag[tag].push(api);
      });
      
      // 상세 리포트 생성
      let report = '# API 엔드포인트 상세 정보\n\n';
      report += `총 ${apiDetails.length}개의 엔드포인트\n\n`;
      
      Object.keys(groupedByTag).sort().forEach(tag => {
        report += `## ${tag} (${groupedByTag[tag].length}개)\n\n`;
        
        groupedByTag[tag].forEach(api => {
          report += `### ${api.method} ${api.path}\n\n`;
          if (api.summary) {
            report += `**요약**: ${api.summary}\n\n`;
          }
          if (api.description) {
            report += `${api.description}\n\n`;
          }
          
          if (api.parameters.length > 0) {
            report += `#### Parameters\n\n`;
            api.parameters.forEach(param => {
              report += `- **${param.name}** (${param.in})${param.required ? ' [required]' : ''}\n`;
              if (param.description) {
                report += `  - ${param.description}\n`;
              }
              if (param.schema && param.schema.type) {
                report += `  - Type: ${param.schema.type}\n`;
              }
              if (param.example !== null && param.example !== undefined) {
                report += `  - Example: ${JSON.stringify(param.example)}\n`;
              }
              report += `\n`;
            });
          }
          
          if (api.requestBody) {
            report += `#### Request Body\n\n`;
            if (api.requestBody.description) {
              report += `${api.requestBody.description}\n\n`;
            }
            if (api.requestBody.required) {
              report += `**Required**: Yes\n\n`;
            }
            
            Object.entries(api.requestBody.content).forEach(([contentType, content]) => {
              report += `**Content-Type**: ${contentType}\n\n`;
              if (content.schema && Object.keys(content.schema).length > 0) {
                report += `**Schema**:\n\`\`\`json\n${JSON.stringify(content.schema, null, 2)}\n\`\`\`\n\n`;
              }
              if (content.example !== null && content.example !== undefined) {
                report += `**Example**:\n\`\`\`json\n${JSON.stringify(content.example, null, 2)}\n\`\`\`\n\n`;
              }
            });
          }
          
          if (Object.keys(api.responses).length > 0) {
            report += `#### Responses\n\n`;
            Object.entries(api.responses).forEach(([statusCode, response]) => {
              report += `**${statusCode}**: ${response.description}\n\n`;
              
              Object.entries(response.content).forEach(([contentType, content]) => {
                report += `**Content-Type**: ${contentType}\n\n`;
                if (content.schema && Object.keys(content.schema).length > 0) {
                  report += `**Schema**:\n\`\`\`json\n${JSON.stringify(content.schema, null, 2)}\n\`\`\`\n\n`;
                }
                if (content.example !== null && content.example !== undefined) {
                  report += `**Example**:\n\`\`\`json\n${JSON.stringify(content.example, null, 2)}\n\`\`\`\n\n`;
                }
              });
            });
          }
          
          report += `---\n\n`;
        });
      });
      
      fs.writeFileSync(
        '/Users/shinleehyeon/Dev/Projects/Scholub/API_DOCUMENTATION.md',
        report
      );
      
      console.log(`\n✅ 추출 완료:`);
      console.log(`   - 총 ${apiDetails.length}개 엔드포인트`);
      console.log(`   - ${Object.keys(groupedByTag).length}개 태그`);
      console.log(`\n📄 파일 저장:`);
      console.log(`   - api-details.json: JSON 형식 상세 정보`);
      console.log(`   - API_DOCUMENTATION.md: 마크다운 형식 문서`);
      
      // 간단한 요약 출력
      console.log(`\n=== 태그별 요약 ===`);
      Object.keys(groupedByTag).sort().forEach(tag => {
        console.log(`\n${tag} (${groupedByTag[tag].length}개):`);
        groupedByTag[tag].forEach(api => {
          console.log(`  ${api.method} ${api.path}`);
        });
      });
      
      break;
    }
  }
}
