import { NavitoLinkVariant } from "./types.js";

/**
 * The Navito Link component to navigate with Navito instance.
 */
export default class NavitoLink extends HTMLElement {

    /**
     * The shadow root ref for closed mode.
     */
    private shadow_root: ShadowRoot;

    /** A underlined variant (as link) */
    static readonly VARIANT_UNDERLINE = 'underline';
    /** A filled variant (as button filled) */
    static readonly VARIANT_FILL = 'fill';
    /** A outlined variant (as button wiht border and label with same color) */
    static readonly VARIANT_OUTLINE = "outline";
    /** A ghosted variant (as text with button smoothy style when hover) */
    static readonly VARIANT_GHOST = "ghost";

    /**
     * Create a navito custom link element instance.
     */
    constructor() {
        super();
        this.shadow_root = this.attachShadow({ mode: 'closed' });
        this.shadow_root.innerHTML = '<slot></slot>';
    }

    /**
     * Secure getter for navito instance.
     * @return {Navito}
     * @throws {Error} - When Navito Instance not defined on window (will be set when navito.on() is called)
     */
    private get navito() {
        if ( !window.navito ) {
            throw new Error('The Navito Instance is required to use NavitoLink and is not defined.');
        }
        return window.navito;
    }

    /**
     * Getter for current variant in use. NONE if anyone defined. 
     * @return {NavitoLinkVariant}
     */
    private get variant() {
        return this.normalizeVariant(this.getAttribute('variant'));
    }

    /**
     * Normalize the variant value to clamp in possible values.
     * @param {undefined | null | string} v 
     * @return {NavitoLinkVariant}
     */
    private normalizeVariant(v?: string | null) {
        return (
            (
                !v || 
                (v && ![ NavitoLink.VARIANT_FILL, NavitoLink.VARIANT_GHOST, NavitoLink.VARIANT_OUTLINE, NavitoLink.VARIANT_UNDERLINE ].includes(v))
            ) 
            ? undefined 
            : v
        ) as NavitoLinkVariant;
    }

    /**
     * Define a variant in use.
     * @param {NavitoLinkVariant} v
     */
    private set variant(v: NavitoLinkVariant) {
        if ( typeof v == 'undefined' ) { // no variant...
            this.removeAttribute('variant');
            return;
        }

        this.setAttribute('variant', v);
    }

    /**
     * Return observed attributes to react and reflect changes.
     * @return {string[]}
     */
    static get observedAttributes() {
        return ['variant'];
    }

    /**
     * Callback to handle when observed attributes changes.
     * @param {string} name     - The attribute name changed
     * @param {string} old_value - The old attribute value
     * @param {string} new_value - The new attribute value
     */
    attributeChangedCallback(attr: string, old_value: string, new_value: string) {  
        if ( attr == 'variant' ) {
            this.beautify();
        }
    }

    /**
     * Called when this element is appended on the DOM.
     */
    connectedCallback() {
        this.beautify();
        this.addEventListener('click', this.handleClick.bind(this));
    }

    /**
     * Define to don´t use variant, util to full customization.
     * @returns {NavitoLink}
     */
    public noVariant() {
        this.variant = undefined;
        return this;
    }

    /**
     * Define to use FILL variant.
     * @returns {NavitoLink}
     */
    public variantFill() {
        this.variant = NavitoLink.VARIANT_FILL;
        return this;
    }

    /**
     * Define to use GHOST variant.
     * @returns {NavitoLink}
     */
    public variantGhost() {
        this.variant = NavitoLink.VARIANT_GHOST;
        return this;
    }

    /**
     * Define to use OUTLINE variant.
     * @returns {NavitoLink}
     */
    public variantOutline() {
        this.variant = NavitoLink.VARIANT_OUTLINE;
        return this;
    }

    /**
     * Define to use UNDERLINE variant.
     * @returns {NavitoLink}
     */
    public variantUnderline() {
        this.variant = NavitoLink.VARIANT_UNDERLINE;
        return this;
    }

    /**
     * Beautify (stylize) the host element.
     * @returns {NavitoLink}
     */
    private beautify() {
        if ( typeof this.variant == 'undefined' ) return; // no variant;

        const style = document.createElement('style');

        const variant_style = {
            [NavitoLink.VARIANT_GHOST]: `
                :host {
                    color: black;
                    background: transparent;
                }
                :host(:hover) {
                    background: rgba(0,0,0,.15);
                }
            `,
            [NavitoLink.VARIANT_UNDERLINE]: `
                :host {
                    color: black;
                }
                :host(:hover) {
                    color: var(--highlight-color);
                    text-decoration: underline;
                }
            `,
            [NavitoLink.VARIANT_OUTLINE]: `
                :host {
                    color: var(--highlight-color);
                    background: transparent;
                    border: 1px solid var(--highlight-color);
                }
                :host(:hover) {
                    background: var(--highlight-color);
                    color: white;
                }
            `,
            [NavitoLink.VARIANT_FILL]: `
                :host {
                    color: white;
                    background: var(--highlight-color);
                }
                :host(:hover) {
                    background: color-mix(in srgb, var(--highlight-color) 90%, white 10%);
                }
            `,
        }[this.variant];

        style.textContent = `
            :host {
                --highlight-color: crimson;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                cursor: pointer;
            }
            ${variant_style}
        `;

        this.shadow_root.querySelector('style')?.remove();
        this.shadow_root.append(style);
        return this;
    }

    /**
     * Handle click on this link to navigate with navito.
     * @param {MouseEvent} e
     */
    private handleClick(e: MouseEvent) {
        e.preventDefault();

        const to_path = this.getAttribute('to');
        if ( !to_path ) {
            console.error('The path to navigate is required.');
            return;
        }

        this.navito.to(to_path);
    }

}

/**
 * Define the NavitoLink custom element.
 */
customElements.define('navito-link', NavitoLink);