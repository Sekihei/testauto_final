import { test as baseTest, request, APIRequestContext } from '@playwright/test';

// Extend Playwright's test object with a custom fixture
type ApiContextFixture = {
    apiContext: APIRequestContext;
  };
  
  // Define the custom fixture for ApiContext
  export const test = baseTest.extend<ApiContextFixture>({
    apiContext: async ({}, use) => {
      const context = await request.newContext({
        baseURL: 'https://hoff.is/store2/api/v1/',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'api_key': 'your_api_key_here', // Replace this if you use an API key
        },
      });
      await use(context);
      await context.dispose(); // Clean up after tests
    },
  });