const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const URL_BASE = 'https://consorcio365.vercel.app';
const OCUPANTE_EMAIL = 'juan@mail.com';
const OCUPANTE_PASSWORD = 'Cambiar123!';
const TIMEOUT = 30000;

describe('Test E2E - Crear incidencia como ocupante', () => {
  let driver;

  beforeAll(async () => {
	const options = new chrome.Options();
	options.addArguments('--window-size=1280,800');
	driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  }, TIMEOUT);

  afterAll(async () => {
	if (driver) await driver.quit();
  });

  test('El ocupante crea un reclamo y lo ve en la lista', async () => {
	await driver.get(URL_BASE + '/login');

	const inputEmail = await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
	const inputPassword = await driver.findElement(By.css('input[type="password"]'));
	await inputEmail.sendKeys(OCUPANTE_EMAIL);
	await inputPassword.sendKeys(OCUPANTE_PASSWORD);

	const botonIngresar = await driver.findElement(By.xpath('//button[contains(text(),"INGRESAR")]'));
	await botonIngresar.click();

	await driver.wait(until.urlContains('/ocupante'), TIMEOUT);

	await driver.get(URL_BASE + '/ocupante/reclamos');

	const botonNuevo = await driver.wait(
  	until.elementLocated(By.xpath('//button[contains(text(),"Nuevo Reclamo")]')),
  	TIMEOUT
	);
	await botonNuevo.click();

	const tituloUnico = 'Reclamo Selenium ' + Date.now();

	const inputTitulo = await driver.wait(
  	until.elementLocated(By.xpath('//input[@placeholder="Título *"]')),
  	TIMEOUT
	);
	await inputTitulo.sendKeys(tituloUnico);

	const inputDescripcion = await driver.findElement(
  	By.xpath('//textarea[@placeholder="Descripción del reclamo *"]')
	);
	await inputDescripcion.sendKeys('Reclamo creado automaticamente por test E2E');

	const inputUbicacion = await driver.findElement(
  	By.xpath('//input[contains(@placeholder,"Ubicación")]')
	);
	await inputUbicacion.sendKeys('Unidad 1A');

	const selectCategoria = await driver.findElement(By.xpath('//select[option[@value="plomeria"]]'));
	await selectCategoria.sendKeys('Plomería');

	const selectPrioridad = await driver.findElement(By.xpath('//select[option[@value="alta"]]'));
	await selectPrioridad.sendKeys('Media');
    await driver.sleep(2000);
	const botonCrear = await driver.findElement(By.xpath('//button[normalize-space()="Crear"]'));
	await botonCrear.click();

	await driver.wait(
  	until.elementLocated(By.xpath('//*[contains(text(),"con éxito")]')),
  	TIMEOUT
	);

	const botonAceptar = await driver.findElement(
  	By.xpath('//button[contains(text(),"Aceptar") or contains(text(),"Cerrar")]')
	);
	await botonAceptar.click();

	await driver.wait(
  	until.elementLocated(By.xpath('//*[contains(text(),"' + tituloUnico + '")]')),
  	TIMEOUT
	);

	const reclamoEnLista = await driver.findElement(
  	By.xpath('//*[contains(text(),"' + tituloUnico + '")]')
	);
	const textoReclamo = await reclamoEnLista.getText();
	expect(textoReclamo).toContain(tituloUnico);
  }, TIMEOUT);
});

