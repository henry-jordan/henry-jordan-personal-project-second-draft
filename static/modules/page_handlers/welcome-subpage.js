export class welcome_subpage {

    generate_html() {

        return `
        <div class="welcome-container">
        <div class="welcome-blur"></div> 
            <div class="welcome-content">
                <h2 class="welcome-title">HE Chat Demo</h2>
                <p class="welcome-text">Welcome to the early chat demo of the homework engine project.\n\nPlease note that responses are currently capped at roughly 300 words and may be unreliable for certain tasks such as multiple-choice questions and math problems. Make sure to fact-check responses as it may provide incorrect information.\n\nFeel free to use it as much as you'd like and share it with others. If you encounter any issues, please let me know.</p>
            </div>
        </div>
        `

    };

    insert_html() {

        document.querySelector('.content').insertAdjacentHTML('beforebegin', this.generate_html());
        document.querySelector('.info-button').classList.toggle('hidden');
    
    };

    bind_event() {

        document.addEventListener('click', this.remove_page);

    };

    remove_page() {

        document.removeEventListener('click', this.remove_page);

        try {

            document.querySelector('.welcome-content').addEventListener('animationend', () => {
    
                document.querySelector('main').removeChild(document.querySelector('.welcome-container'));
                document.querySelector('.info-button').classList.toggle('hidden');            
    
            });

            document.querySelector('.welcome-content').classList.add('fade-out');
            document.querySelector('.welcome-blur').classList.add('fade-out');

        } catch(Error) {};

        // document.querySelector('main').removeChild(document.querySelector('.welcome-container'));
        // document.querySelector('.info-button').classList.toggle('hidden');

    };

    activate_page() {

        this.insert_html();
        this.bind_event();

    };

}