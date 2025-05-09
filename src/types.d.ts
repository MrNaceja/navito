import Navito from "./navito.js";

type RouteHandler = (context: RouteContext) => Promise<void> | void;
type HookHandler  = (context: RouteContext) => Promise<boolean | void> | (boolean | void);

type RouteContext = {
    /**
     * The intercepted route location path.
     * @example /products/1
     */
    current_location: string;
    /**
     * The intercepted route params.
     * @example /products/:id -> { id: string }
     */
    route_params: Record<string, string>;
    /**
     * The intercepted route query params (as URLSearchParams).
     * @example ...?order=desc -> URLSearchParams({ order: 'desc' })
     */
    query_params: URLSearchParams;
    /**
     * The intercepted route query params (as query string)
     */
    query_string: string;

    /**
     * The current navigation state.
     */
    state?: Record<string, any>
}

type Hooks = {
    /**
     * Before call handler hooks.
     * If hook returns explicit false, the route handler don´t called.
     */
    before: HookHandler[];
    /**
     * After call hanlder hooks.
     */
    after: HookHandler[];
}

type Route = {
   /**
    * The path to route intercept.
    * @example /products/:id
    */ 
    path: string;
    /**
     * The regex to path route intercept.
     */
    regex: RegExp;
    /**
     * The route param names.
     * @example /products/:id -> [ id ]
     */
    paramNames: string[];
    /**
     * The intercepted route handler to execute.
     */
    handler: RouteHandler;
    /**
     * The route hooks to middleware execution.
     */
    hooks: Hooks;
}

type RouteIntercepter = {
    /**
     * Add a Before call handler hook.
     * If hook returns explicit false, the route handler don´t called.
     */
    before: (...hooks: HookHandler[]) => void;
    /**
     * Add a After call handler hook.
     */
    after: (...hooks: HookHandler[]) => void;
}

type NavitoLinkVariant = 'fill' | 'outline' | 'ghost' | 'underline' | undefined;

type NavigationState = {
    path: string,
    data?: Record<string, any>
}


declare global {
    interface Window {
        navito?: Navito;
    }
}