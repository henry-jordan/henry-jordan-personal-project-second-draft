export class home_page {

    constructor(parent) {

        this.parent = parent;
        this.parent_page = null;

    };

    activate_page() {

        this.parent.innerHTML = this.generate_html();
        this.bind_buttons();

    }

    generate_html() {

        return`
        <div class="placeholder-home-container">
            <h1>Placeholder Home Page</h1>
            <button id="switch-button">Switcher Page</button>
        </div>`;

    };

    bind_buttons() {

        this.parent.querySelector('#switch-button').onclick = () => {this.switch_button()};

    };

    switch_button(){

        const switchEvent = new CustomEvent('switch_page', {detail : {page : 'assignment'}});
    
        document.dispatchEvent(switchEvent);

    };

};