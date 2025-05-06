import Navito from "./navito.js";

/**
 * The Navito Link component to navigate with Navito instance.
 */
export default class NavitoLink extends HTMLElement {

    constructor() {
        super();
        Object.defineProperty(this, 'navito_instance', {
            get() {
                if ( !this._navito_instance ) {
                    throw new Error('The Navito Instance is required to use NavitoLink and is not defined.');
                }
                return this._navito_instance 
            },
            set(v) {
                if ( !(v instanceof Navito) ) {
                    throw new Error('The specified value is not instance of Navito.');
                }
                this._navito_instance = v;
            }
        })
    }

    /**
     * Hook to use safety navito instance retrieved from window.
     * @returns {Navito}
     */
    private useNavitoInstance() {
        if ( !window.navito ) {
            throw new Error('The Navito Instance is required to use NavitoLink and is not defined.');
        }
        return window.navito;
    }

    /**
     * Called when this element is appended on the DOM.
     */
    connectedCallback() {
        this.addEventListener('click', this.handleClick.bind(this));
    }

    /**
     * Handle click on this link to navigate with navito.
     * @param {MouseEvent} e 
     */
    private handleClick(e: MouseEvent) {
        e.preventDefault();

        const to_path = this.getAttribute('to')
        if ( !to_path ) {
            console.error('The path to navigate is required.');
            return;
        }

        this.useNavitoInstance().to(to_path);
    }

}

/**
 * Define the NavitoLink custom element.
 */
customElements.define('navito-link', NavitoLink);