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

### `Navito` Class  

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

---

### **RouteContext**  
An object passed to route handlers and hooks:  

```ts
type RouteContext = {
  current_location: string;     // e.g., "/products/1"
  route_params: Record<string, string>;  // e.g., { id: "1" }
  query_params: URLSearchParams;  // URL query params
  query_string: string;           // Raw query string (e.g., "?order=desc")
};
```

---

### **RouteIntercepter**  
Returned by `intercept()`, allowing hooks for a specific route:  

| Method | Description |
|--------|-------------|
| `before(...hooks)` | Runs **before** the route handler (if returns `false`, the handler is skipped). |
| `after(...hooks)` | Runs **after** the route handler. |

---

### **NavitoLink**  
A custom HTML element for navigation:  

```html
<navito-link to="/about" label="About"></navito-link>
```
- `to`: Path to navigate to.  
- `label`: Link text.  

---

## 📖 Examples  

### **Basic Routing**  
```js
const router = new Navito("/app");

router.intercept("/", (context) => {
  console.log("Context:", context);
});

router.intercept("/products/:id", ({ route_params }) => {
  console.log("Product ID:", route_params.id); // e.g., "123"
}).before((ctx) => {
  console.log("Before product load:", ctx.current_location);
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

### **Custom Link Element**  
```js
const link = Navito.Link("/about", "About Us");
document.body.appendChild(link);
```
Or in HTML:  
```html
<navito-link to="/about">About Us</navito-link>
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
PRs and issues are welcome!  

---

**Made with ❤️ by Naceja**