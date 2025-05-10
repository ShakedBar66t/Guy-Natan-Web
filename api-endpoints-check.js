const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const ADMIN_API_BASE_URL = `${API_BASE_URL}/admin`;
const YNET_ADMIN_API_BASE_URL = `${ADMIN_API_BASE_URL}/ynet`;

// Test a single endpoint
async function testEndpoint(url, method = 'GET', data = null) {
  console.log(`Testing ${method} ${url}...`);
  try {
    let response;
    if (method === 'GET') {
      response = await axios.get(url);
    } else if (method === 'POST') {
      response = await axios.post(url, data);
    } else if (method === 'PUT') {
      response = await axios.put(url, data);
    } else if (method === 'DELETE') {
      response = await axios.delete(url);
    }
    
    console.log(`✅ Success: ${method} ${url} (Status: ${response.status})`);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    console.log(`❌ Error: ${method} ${url} (Status: ${error.response?.status || 'Unknown'})`);
    console.log(`   ${error.message}`);
    if (error.response?.data) {
      console.log(`   Response: ${JSON.stringify(error.response.data)}`);
    }
    return { success: false, status: error.response?.status, error: error.message };
  }
}

// Check all potentially useful endpoints
async function checkAllEndpoints() {
  console.log('CHECKING YNET API ENDPOINTS');
  console.log('==========================');
  
  // 1. Test public endpoints
  console.log('\n📊 Testing public endpoints:');
  await testEndpoint(`${API_BASE_URL}/ynet`);
  
  // 2. Test admin auth verification
  console.log('\n🔐 Testing admin authentication:');
  await testEndpoint(`${ADMIN_API_BASE_URL}/verify-auth`);
  
  // 3. Test YNET admin endpoints
  console.log('\n📰 Testing YNET admin endpoints:');
  await testEndpoint(`${YNET_ADMIN_API_BASE_URL}/delete-all-articles`);
  
  // 4. Test individual article functions
  console.log('\n📝 Testing article endpoints:');
  
  // Check if add-article endpoint works with GET parameters
  console.log('\nTesting adding a single article with GET parameters:');
  const testArticle = {
    title: "Test Article Title",
    publishedAt: new Date().toISOString(),
    link: "https://www.ynet.co.il/capital/article/test123",
    slug: "test-article-title-123456",
    isPublished: true
  };
  
  const queryParams = Object.entries(testArticle)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
    
  await testEndpoint(`${YNET_ADMIN_API_BASE_URL}/add-article?${queryParams}`);
  
  // Check if add-articles endpoint works with POST
  console.log('\nTesting adding multiple articles with POST:');
  await testEndpoint(`${YNET_ADMIN_API_BASE_URL}/add-articles`, 'POST', [testArticle]);
  
  // Check if there's an API to add a single article with POST
  console.log('\nTesting adding a single article with POST:');
  await testEndpoint(`${YNET_ADMIN_API_BASE_URL}/add-article`, 'POST', testArticle);
  
  console.log('\n==========================');
  console.log('API ENDPOINT CHECK COMPLETE');
}

// Run the tests
checkAllEndpoints().catch(err => {
  console.error('Error running tests:', err);
}); 