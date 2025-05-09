const navito = new Navito('/');

const nav = document.querySelector('nav');

const link_to_home = Navito.Link('/', 'Home').variantUnderline();
const link_to_contact = Navito.Link('/contact', 'Contact').variantGhost();
const link_to_product = Navito.Link('/products/1', 'Product').variantOutline();
const link_to_products = Navito.Link('/products', 'Product').noVariant();
nav.append(link_to_home, link_to_contact, link_to_product, link_to_products);

navito.before((ctx) => console.log('Global before hook has called with this context: ', ctx));
navito.whenNotFound(() => {
    alert('404 - Page not found');
});

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