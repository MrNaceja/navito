import Navito from './navito.module.min.js';

const navito = new Navito('/');

const nav = document.querySelector('nav');
const link_to_home = Navito.Link('/', 'Home');
const link_to_product = Navito.Link('/products/1', 'Product');
nav.append(link_to_home, link_to_product);

navito.before((ctx) => console.log('Global before hook has called with this context: ', ctx));

navito.intercept('/', (ctx) => {
    console.log(ctx);
    alert('Welcome to the home page!');
})

navito.intercept('/products/:id', async (ctx) => {
    await new Promise(ok => setTimeout(ok, 2000))
    console.log(ctx);
})
.before(() => {
    console.log('Before hook called')
})
.after(() => {
    console.log('After hook called.')
})

navito.on();