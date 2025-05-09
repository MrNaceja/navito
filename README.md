# Navito 🚀  

**Navito** _(Navigate To)_ is a simple Vanilla JavaScript router designed to be lightweight and easy to use. It allows you to create dynamic routes and manage navigation in web applications efficiently.  

---

## 📦 Installation  
Include the script in your HTML file:  

```html
<script src="path/to/navito.js"></script>
```

---

## 🛠️ API Documentation  

### `Navito` Router  

#### **Constructor**  
```js
new Navito(root_path?: string)
```
- `root_path` (optional): The base path for your application (default: `"/"`).  

#### **Methods**  

| Method | Description | Returns |
|--------|-------------|---------|
| `before(...hooks)` | Adds global **before** hooks (executed before every route). | `Navito` |
| `after(...hooks)` | Adds global **after** hooks (executed after every route). | `Navito` |
| `intercept(path, handler)` | Registers a route handler for a given path. | `RouteIntercepter` |
| `on()` | Initializes the router (must be called after defining routes). | `Navito` |
| `to(path)` | Navigates to the specified path. | `Navito` |
| `static Link(to, label)` | Creates a custom `<navito-link>` element for navigation. | `NavitoLink` |
| `whenNotFound(handler)` | Add a not found (404) handler. | `Navito` |

---

### `NavitoLink` Element 
A custom HTML element for navigation:  

Using directly into DOM:
```html
<navito-link to="/about" variant="fill">About</navito-link>
```
- `to`: Path to navigate to.  
- `variant`: The link style variants.
  * `underline`: A underlined variant (as link).
  * `fill`: A filled variant (as button filled). 
  * `outline`: A outlined variant (as button wiht border and label with same color).
  * `ghost`: A ghosted variant (as text with button smoothy style when hover).
  * or don´t define the "variant" attribute to full customization.

or create programmatically

```js
const link = Navito.Link('/about', 'About');
// with variant definition:
link.variantFill();
link.variantGhost();
link.variantUnderline();
link.variantOutline();
// or withour variant (to full customization):
link.noVariant();
```
#### **Methods**  
| Method | Description | Returns |
|--------|-------------|---------|
| `noVariant()` | Define to don´t use variant, util to full customization. | `NavitoLink` |
| `variantFill` | Define to use FILL variant. | `NavitoLink` |
| `variantGhost()` | Define to use GHOST variant. | `NavitoLink` |
| `variantOutline()` | Define to use OUTLINE variant. | `NavitoLink` |
| `variantUnderline()` | Define to use UNDERLINE variant. | `NavitoLink` |

---

### 🔗 Some Types  

#### **RouteContext**  
An object passed to route handlers and hooks:  

```ts
type RouteContext = {
  current_location: string;     // e.g., "/products/1"
  route_params: Record<string, string>;  // e.g., { id: "1" }
  query_params: URLSearchParams;  // URL query params
  query_string: string;           // Raw query string (e.g., "?order=desc")
};
```

Example:

```ts
const product_handler: RouteHandler = (ctx: RouteContext) => {
  alert('Product ID: ' + ctx.route_params.id);
}
navito.intercept('/products:/id', product_handler)
```
---

#### **RouteIntercepter**  
Returned by `Navito.intercept()`, allowing hooks for a specific route:  

| Method | Description |
|--------|-------------|
| `before(...hooks)` | Runs **before** the route handler (if returns `false`, the handler is skipped). |
| `after(...hooks)` | Runs **after** the route handler. |

Example:

```ts
navito.intercept('/home', () => {
  // /home logic...
})
.before(() => {
  document.title = "Welcome to Navito";
})
```

---

## 📖 Examples  

### **Basic Routing**  
```js
const router = new Navito("/");

const HomePage = () => {
  const home = document.createElement('section');
  document.body.append(home);
}
router.intercept("/", HomePage);

const ProductPage = async ({ route_params: { id } }) => {
  const product_details = await (await fetch(`/products/${id}`)).json();
  const product = document.createElement('section');
  product.textContent(`Buy Product ${product_details.name} - R$${product_details.price}`);
  document.body.append(product);
}
router.intercept("/products/:id", ProductPage).before((ctx) => {
  console.log("Product ID:", ctx.route_params.id); // e.g., "123"
});

router.on(); // Initialize
```

### **Global Hooks**  
```js
router.before((ctx) => {
  console.log("Global before hook:", ctx.current_location);
});

router.after((ctx) => {
  console.log("Global after hook:", ctx.current_location);
});
```

### **Programmatic Navigation**  
```js
router.to("/contact"); // Navigates to "/contact"
```

---

## 🎯 Features  
✅ Lightweight (~3.5KB)  
✅ Zero dependencies  
✅ Dynamic route params (`/user/:id`)  
✅ Query string support (`?search=term`)  
✅ Global and per-route hooks  
✅ Custom navigation links  

---

## 🤝 Contributing  

1. Clone this project.
2. Run `npm i`. 
3. Run `npm run start`.

### Project Development scripts
  * `npm run example`: Runs the example HTML test server.
  * `npm run build`: Generates the bundles and types on dist directory.
  * `npm run start`: Generates the bundles and types on dist directory AND Runs the example HTML test server.
---

**Made with ❤️ by Naceja**