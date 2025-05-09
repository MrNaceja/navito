import NavitoLink from "./navito-link.js";
import { HookHandler, Hooks, NavigationState, Route, RouteContext, RouteHandler, RouteIntercepter } from "./types.js";

/**
 * A simple Vanilla JS router called Navito (Navigate To).
 */
export default class Navito {
    /**
     * The root application path.
     */
    private root_path: string;
    /**
     * The routes intercepters.
     */
    private routes: Map<string, Route> = new Map();
    /**
     * The abort controller to control when route changes and exists active route running.
     */
    private navigation_controller: AbortController | undefined;
    /**
     * The current route running location path.
     */
    private current_running_path: string = '';

    /**
     * Global hooks to execute in all routes.
     */
    private global_hooks: Hooks = {
        before: [],
        after: []
    }

    /**
     * Create a new Navito instance.
     * @param {string} root_path [/] - The root path for the application.
     */
    constructor(root_path: string = '/') {
        this.root_path = '/' + root_path.replace(/^\/|\/$/g, '');
    }

    /**
     * Create a NavitoLink instance to use as link navigation with navito instance.
     * @param {string} to    - The path to navigate 
     * @param {string} label - The link label
     * @returns {NavitoLink}
     */
    public static Link(to: string, label: string): NavitoLink {
        const navito_link = new NavitoLink();
        navito_link.setAttribute('to', to);
        navito_link.append(label);
        return navito_link;
    }

    /**
     * Compile a route path into a regex and extract parameter names.
     * @param {string} path - The route path to compile.
     * @returns {{ regex: RegExp, paramNames: string[] }}
     */
    private compileRoutePath(path: string) {
        const paramNames: string[] = [];
        const regex = new RegExp(
            '^' +
            path
                .replace(/([:*])(\w+)/g, (_, type, name) => {
                    paramNames.push(name);
                    return type === '*' ? '(.*)' : '([^/]+)';
                })
                .replace(/\//g, '\\/') +
            '(?:\\/?)?$'
        );
        return { regex, paramNames };
    }

     /**
     * Add a global before hooks.
     * @param {HookHandler[]} hooks - The after global hooks.
     * @returns {Navito}
     */
    public before(...hooks: HookHandler[]) {
        this.global_hooks.before.push(...hooks);
        return this;
    }

    /**
     * Add a global after hooks.
     * @param {HookHandler[]} hooks - The before global hooks.
     * @returns {Navito}
     */
    public after(...hooks: HookHandler[]) {
        this.global_hooks.after.push(...hooks)
        return this;
    }

    /**
     * Define a not found (404) hanlder to router.
     * @param handler - The handler to not found routes
     * @returns {Navito}
     */
    public whenNotFound(handler: RouteHandler) {
        this.intercept('404', handler).before(() => {
            this.updateNavigationState({ path: '/404'});
        });
        return this;
    }

    /**
     * Intercept a route path and register a handler for it.
     * The handler will be called when the route is matched.
     * @param {string} path          - The route path to intercept.
     * @param {RouteHandler} handler - The handler function to call when the route is matched.
     * @returns {RouteIntercepter}
     */
    public intercept(path: string, handler: RouteHandler): RouteIntercepter {
        const { regex, paramNames } = this.compileRoutePath(path);
        this.routes.set(path, {
            path,
            regex,
            paramNames,
            handler,
            hooks: { before: [], after: [] }
        });

        const route_intercepter: RouteIntercepter = {
            before: (...hooks) => {
                this.routes.get(path)!.hooks.before.push(...hooks);
                return route_intercepter;
            },
            after: (...hooks) => {
                this.routes.get(path)!.hooks.after.push(...hooks);
                return route_intercepter;
            }
        };

        return route_intercepter;
    }

    /**
     * Initialize the Navito instance and set up event listeners.
     * This method should be called after all routes have been defined.
     * @returns {Navito}
     */
    public on(): Navito {
        window.navito = this;
        window.addEventListener('popstate', this.react.bind(this));
        this.react(); // To react on the initial page load (when the page is loaded directly by paste url on the browser).
        return this;
    }

    /**
     * React to changes in the current path location.
     * @returns {void}
     */
    private react(): void {
        if (this.navigation_controller) {
            this.navigation_controller.abort();
        }
        this.navigation_controller = new AbortController();

        const current_path = this.useCurrentPathLocation();
        if (current_path === this.current_running_path) return;
        this.current_running_path = current_path;

        const route = this.useRouteByPath(current_path);
        if ( !route ) return;

        this.run(route);
        
    }

    /**
     * Run the route handler and hooks for the given route.
     * @param route - The route to run.
     * @returns {Promise<void>}
     */
    private async run(route: Route): Promise<void> {
        const context = this.useContext(route);

        /**
         * @todo Improve this code...
         */
        try {
            /**
             * Running the global before hooks.
             */
            for (const hook of this.global_hooks.before) {
                if (this.navigation_controller!.signal.aborted) return;
                let result = hook(context);
                if ( result instanceof Promise ) {
                    result = await result;
                }

                if (result === false) return;
            }

                for (const hook of route.hooks.before) {
                    if (this.navigation_controller!.signal.aborted) return;
                    let result = hook(context);
                    if ( result instanceof Promise ) {
                        result = await result;
                    }

                    if (result === false) return;
                }

                if (this.navigation_controller!.signal.aborted) return;
                await route.handler(context);

                for (const hook of route.hooks.after) {
                    if (this.navigation_controller!.signal.aborted) return;
                    await hook(context);
                }

            /**
             * Running the global after hooks.
             */
            for (const hook of this.global_hooks.after) {
                if (this.navigation_controller!.signal.aborted) return;
                await hook(context);
            }

        } catch (err) {
            console.error('Route navigation error:', err);
        }
    }

    /**
     * Update navigation state changing browser url and set new route state.
     * @param {NavigationState} state 
     * @returns {Navito}
     */
    private updateNavigationState({ path, data } : NavigationState): Navito {
        history.pushState(data, '', path);
        return this;
    }

    /**
     * Navigate to a specified path route.
     * @param path - The path to navigate to.
     * @returns {Navito}
     */
    public to(path: string): Navito {
        // Ensure the path includes the root_path
        if (!path.startsWith(this.root_path)) {
            path = this.root_path.replace(/\/$/, '') + path;
        }
        this.updateNavigationState({ path });
        this.react();
        return this;
    }

    /**
     * Hook to use a route specified to intercepted path.
     * @param {string} path - The path to intercepted route
     * @returns {Route | null}
     */
    private useRouteByPath(path: string): Route | undefined {
        for (const route of this.routes.values()) {
            if ( route.regex.test(path) ) {
                return route;
            }
        }
        return this.routes.get('404');
    }

    /**
     * Hook to use the current path location without the root path.
     * @returns {string} - The current path without the root path.
     */
    private useCurrentPathLocation(): string {
        let path = window.location.pathname;

        // Remove the root_path prefix if it exists
        if (this.root_path !== '/' && path.startsWith(this.root_path)) {
            path = path.slice(this.root_path.length);
        }
    
        // Ensure the path starts with '/' or defaults to '/'
        return path.replace(/\/$/, '') || '/';
    }

    /**
     * Hook to use the route context.
     * @param route - The route to use.
     * @returns {RouteContext} - The context of the route.
     */
    private useContext(route: Route): RouteContext {
        const match = this.current_running_path.match(route.regex)!;
        const params: Record<string, string> = {};
        
        route.paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
        });

        return {
            current_location: this.current_running_path,
            route_params: params,
            query_params: new URLSearchParams(window.location.search),
            query_string: window.location.search,
            state: history.state
        };
    }
}