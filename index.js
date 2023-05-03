const puppeteer = require('puppeteer');

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 10
    });
    const page = await browser.newPage();
    await page.goto('https://trello.com/b/QvHVksDa/personal-work-goals');

    //Guardo en una variable el array de la lista de Trello
    const tasks = await page.$$eval('.list-card-title', elements => elements.map(el => el.textContent));

    console.log('Tareas:', tasks);

    // Ingresar a todoist
    const todoist = await browser.newPage();
    await todoist.goto('https://todoist.com/users/showlogin');
    //await page.waitForSelector('#email');

    // Login en Todoist
    await todoist.type('input[type="email"]', 'pablo_ontiveros1@outlook.com');
    await todoist.type('input[type="password"]', '***********');
    await todoist.click('button[type="submit"]');
    await todoist.waitForNavigation();

    // Empiezo a agregar las tareas a Todoist
    await todoist.goto('https://todoist.com/app/project/2312345253');
    //await todoist.waitForNavigation();
    await todoist.waitForSelector('button.plus_add_button', {
        visible: true
    });
    await todoist.evaluate(() => {
        const boton = document.querySelector('button.plus_add_button');
        boton.click();
    });
    new Promise(r => setTimeout(r, 2000));

    //En este for voy a automatizar las tareas de trello
    for (let i = 0; i < 5 && i < tasks.length; i++) {
        await todoist.type('p.is-empty.is-editor-empty', tasks[i]);
        await todoist.keyboard.press('Enter');
        console.log('Tarea ' + tasks[i] + 'completada.')
    }
    new Promise(r => setTimeout(r, 2000));
    // Cerrar el navegador
    await browser.close();
}


main();