const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const URL_BASE = 'https://consorcio365.vercel.app';
const ADMIN_EMAIL = 'admin@consorcio365.com';
const ADMIN_PASSWORD = 'Admin123!';
const TIMEOUT = 30000;

describe('Test E2E - Login del administrador', () => {
  let driver;

  beforeAll(async () => {
	const options = new chrome.Options();
	// Si querés que NO se abra el navegador (modo invisible), descomentá la línea siguiente:
	// options.addArguments('--headless=new');
	options.addArguments('--window-size=1280,800');

	driver = await new Builder()
  	.forBrowser('chrome')
  	.setChromeOptions(options)
  	.build();
  }, TIMEOUT);

  afterAll(async () => {
	if (driver) await driver.quit();
  });

  test('El admin puede loguearse y ver el panel general', async () => {
	// 1. Abrir la página de login
	await driver.get(`${URL_BASE}/login`);

	// 2. Esperar a que aparezcan los campos
	const inputEmail = await driver.wait(
  	until.elementLocated(By.css('input[type="email"]')),
  	TIMEOUT
	);
	const inputPassword = await driver.findElement(By.css('input[type="password"]'));

	// 3. Escribir credenciales
	await inputEmail.sendKeys(ADMIN_EMAIL);
	await inputPassword.sendKeys(ADMIN_PASSWORD);

	// 4. Click en el botón de login
	const botonIngresar = await driver.findElement(By.xpath('//button[contains(text(),"INGRESAR")]'));
	await botonIngresar.click();

	// 5. Esperar a que la URL cambie a /admin
	await driver.wait(
  	until.urlContains('/admin'),
  	TIMEOUT,
  	'No se redirigió al panel del admin después del login'
	);

	// 6. Verificar que estamos en /admin
	const urlActual = await driver.getCurrentUrl();
	expect(urlActual).toContain('/admin');

	// 7. Verificar que aparezca algún texto del panel
	const tituloPagina = await driver.wait(
  	until.elementLocated(By.xpath('//*[contains(text(),"Panel general")]')),
  	TIMEOUT
	);
	const textoTitulo = await tituloPagina.getText();
	expect(textoTitulo).toContain('Panel general');
  }, TIMEOUT);
});