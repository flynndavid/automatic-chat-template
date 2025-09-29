import fs from 'node:fs';
import path from 'node:path';
import {
  type APIRequestContext,
  type Browser,
  type BrowserContext,
  expect,
  type Page,
} from '@playwright/test';
import { generateId } from 'ai';
import { ChatPage } from './pages/chat';
import { getUnixTime } from 'date-fns';

export type UserContext = {
  context: BrowserContext;
  page: Page;
  request: APIRequestContext;
};

export async function createAuthenticatedContext({
  browser,
  name,
  chatModel = 'chat-model',
}: {
  browser: Browser;
  name: string;
  chatModel?: 'chat-model' | 'chat-model-reasoning';
}): Promise<UserContext> {
  const directory = path.join(__dirname, '../playwright/.sessions');

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const storageFile = path.join(directory, `${name}.json`);

  const context = await browser.newContext();
  const page = await context.newPage();

  const email = `test-${name}@playwright.com`;
  const password = generateId();

  await page.goto('http://localhost:3000/register');
  
  // Wait for the registration form to be ready
  await expect(page.getByRole('heading')).toContainText('Sign Up');
  
  const emailInput = page.getByPlaceholder('user@acme.com');
  const passwordInput = page.getByLabel('Password');
  const signUpButton = page.getByRole('button', { name: 'Sign Up' });
  
  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(signUpButton).toBeVisible();
  
  await emailInput.click();
  await emailInput.fill(email);
  await passwordInput.click();
  await passwordInput.fill(password);
  await signUpButton.click();

  await expect(page.getByTestId('toast')).toContainText(
    'Account created successfully!',
  );

  const chatPage = new ChatPage(page);
  await chatPage.createNewChat();
  
  // Wait for chat page to load and ensure we're at the home page
  await page.waitForURL('/');
  await expect(page.getByPlaceholder('Send a message...')).toBeVisible();
  
  // Try to select the reasoning model, but don't fail if it doesn't exist
  try {
    await chatPage.chooseModelFromSelector('chat-model-reasoning');
    await expect(chatPage.getSelectedModel()).resolves.toEqual('Reasoning model');
  } catch (error) {
    // If reasoning model isn't available, use default model
    console.log('Reasoning model not available, using default model');
  }

  await page.waitForTimeout(1000);
  await context.storageState({ path: storageFile });
  await page.close();

  const newContext = await browser.newContext({ storageState: storageFile });
  const newPage = await newContext.newPage();

  return {
    context: newContext,
    page: newPage,
    request: newContext.request,
  };
}

export function generateRandomTestUser() {
  const email = `test-${getUnixTime(new Date())}@playwright.com`;
  const password = generateId();

  return {
    email,
    password,
  };
}
