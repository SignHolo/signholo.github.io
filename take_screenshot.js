import puppeteer from 'puppeteer'

async function run() {
  console.log('Launching Chrome via Puppeteer...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 1200 })

  console.log('Navigating to http://127.0.0.1:4173...')
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle2' })

  const screenshotPath = 'C:/Users/Asus/.gemini/antigravity/brain/bcba4892-a011-40e2-8512-8c75c71cecbf/personal_page_full.png'
  await page.screenshot({ path: screenshotPath, fullPage: true })
  console.log('Full-page personal screenshot saved to:', screenshotPath)

  // Navigate to Professional page
  console.log('Navigating to http://127.0.0.1:4173/professional...')
  await page.goto('http://127.0.0.1:4173/professional', { waitUntil: 'networkidle2' })
  const proPath = 'C:/Users/Asus/.gemini/antigravity/brain/bcba4892-a011-40e2-8512-8c75c71cecbf/professional_page_full.png'
  await page.screenshot({ path: proPath, fullPage: true })
  console.log('Full-page professional screenshot saved to:', proPath)

  // Navigate to Editor page (unlock with PIN 1234)
  console.log('Navigating to http://127.0.0.1:4173/editor...')
  await page.goto('http://127.0.0.1:4173/editor', { waitUntil: 'networkidle2' })
  await page.type('input[type="password"]', '1234')
  await page.click('button[type="submit"]')
  await new Promise(r => setTimeout(r, 500))
  const editorPath = 'C:/Users/Asus/.gemini/antigravity/brain/bcba4892-a011-40e2-8512-8c75c71cecbf/editor_page_full.png'
  await page.screenshot({ path: editorPath, fullPage: true })
  console.log('Editor page screenshot saved to:', editorPath)

  await browser.close()
}

run().catch((err) => {
  console.error('Puppeteer error:', err)
  process.exit(1)
})
