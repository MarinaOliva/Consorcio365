const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const URL_BASE = 'https://consorcio365.vercel.app';
const PROVEEDOR_EMAIL = 'hugo.albanil@mail.com';
const PROVEEDOR_PASSWORD = 'Cambiar123!';
const TIMEOUT = 30000;

describe('Test E2E - Cambio de estado de trabajo por proveedor', () => {
  let driver;

  beforeAll(async () => {
	const options = new chrome.Options();
	options.addArguments('--window-size=1280,800');
	driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  }, TIMEOUT);

  afterAll(async () => {
	if (driver) await driver.quit();
  });

  test('El proveedor abre un trabajo activo y ve sus opciones', async () => {
	// 1. Login
	await driver.get(URL_BASE + '/login');

	const inputEmail = await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
	const inputPassword = await driver.findElement(By.css('input[type="password"]'));
	await inputEmail.sendKeys(PROVEEDOR_EMAIL);
	await inputPassword.sendKeys(PROVEEDOR_PASSWORD);

	const botonIngresar = await driver.findElement(By.xpath('//button[contains(text(),"INGRESAR")]'));
	await botonIngresar.click();

	await driver.wait(until.urlContains('/proveedor'), TIMEOUT);

	// 2. Esperar a que cargue el panel
	await driver.sleep(2000);

	// 3. Verificar que aparece la sección "Trabajos Activos"
	const tituloTrabajosActivos = await driver.wait(
  	until.elementLocated(By.xpath('//*[contains(text(),"Trabajos Activos")]')),
  	TIMEOUT
	);
	const textoTitulo = await tituloTrabajosActivos.getText();
	expect(textoTitulo).toContain('Trabajos Activos');

	// 4. Verificar que aparece la especialidad del proveedor
	const banner = await driver.findElement(By.xpath('//*[contains(text(),"Especialidad:")]'));
	const textoBanner = await banner.getText();
	expect(textoBanner).toContain('Especialidad:');

	// 5. Verificar que hay al menos un trabajo en la lista (Hugo tiene el de humedad asignado)
	const trabajoEnLista = await driver.findElement(
  	By.xpath('//*[contains(text(),"Humedad")]')
	);
	const textoTrabajo = await trabajoEnLista.getText();
	expect(textoTrabajo.length).toBeGreaterThan(0);

	// 6. Click en el ojo de ese trabajo para abrir el detalle
	const botonVerDetalle = await driver.findElement(
  	By.xpath('//*[contains(text(),"Humedad")]/ancestor::div[contains(@class,"rounded-lg")]//button[@aria-label]')
	);
	await botonVerDetalle.click();

	// 7. Esperar a que aparezca el modal con el botón de finalizar
	const botonFinalizar = await driver.wait(
  	until.elementLocated(By.xpath('//button[contains(text(),"Marcar como finalizado")]')),
  	TIMEOUT,
  	'No apareció el botón de finalizar trabajo'
	);

	const textoBoton = await botonFinalizar.getText();
	expect(textoBoton).toContain('finalizado');
  }, TIMEOUT);
});

