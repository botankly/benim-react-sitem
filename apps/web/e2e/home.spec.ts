import { test, expect } from '@playwright/test';

test.describe('Trendsepetix Portfolyo E2E Testleri', () => {
  test.beforeEach(async ({ page }) => {
    // Ana sayfaya git
    await page.goto('/');
  });

  test('Sitenin başarıyla açıldığını ve ana başlıkları içerdiğini doğrulamalıdır', async ({ page }) => {
    // Sayfa başlığını veya logosunu doğrula
    await expect(page).toHaveTitle(/Botan Külay/);
    
    const logo = page.locator('.navbar-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText('Botan Külay');

    // Hero başlığı kontrol et
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toHaveText('Botan Külay');
  });

  test('Tema değiştiricinin (Theme Switcher) doğru şekilde çalıştığını doğrulamalıdır', async ({ page }) => {
    const body = page.locator('body');
    const themeBtn = page.locator('.theme-toggle-btn');

    // Varsayılan tema koyu tema olduğu için body'de light-theme sınıfı olmamalıdır
    await expect(body).not.toHaveClass(/light-theme/);

    // Temayı değiştirmek için butona tıkla
    await themeBtn.click();

    // Şimdi body'de light-theme sınıfı olmalıdır
    await expect(body).toHaveClass(/light-theme/);

    // Tekrar tıklayıp eski haline döndüğünü doğrula
    await themeBtn.click();
    await expect(body).not.toHaveClass(/light-theme/);
  });

  test('"Projelerim" alanının listelendiğini doğrulamalıdır', async ({ page }) => {
    // Projelerim başlığı
    const projectsSection = page.locator('#projeler');
    await expect(projectsSection).toBeVisible();
    
    const sectionTitle = projectsSection.locator('.section-title');
    await expect(sectionTitle).toHaveText('Projelerim');

    // Proje kartlarının listelendiğini doğrula
    const projectCards = projectsSection.locator('.card');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);

    // İlk proje kartının bir başlığı olduğunu doğrula
    const firstCardTitle = projectCards.first().locator('h3');
    await expect(firstCardTitle).toBeVisible();
  });
});
