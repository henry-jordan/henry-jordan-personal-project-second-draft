import { message_array } from "../chat/message_array.js";

export class assignment {

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
        <div class="content">Assignment Page</div>`;

    };

    bind_buttons() {

        // this.parent.querySelector('#home-button').onclick = () => {this.home_button()};
        // this.parent.querySelector('#chat-button').onclick = () => {this.chat_button()};
        // this.parent.querySelector('#doc-button').onclick = () => {this.switch_button()};
        // this.parent.querySelector('#source-button').onclick = () => {this.switch_button()};

    };

    home_button() {

        const switchEvent = new CustomEvent('switch_page', {detail : {page : 'home_page'}});
        document.dispatchEvent(switchEvent);

    };

    chat_button() {

        const switchEvent = new CustomEvent('switch_page', {detail: {page : 'chat_page'}})
        document.dispatchEvent(switchEvent);

    };
};

export class chat_page extends assignment {

    constructor(parent) {

        super(parent);
        this.parent_page = 'assignment';
        this.message_array = new message_array(this.parent);
        this.pressed_keys = {};
        this.height_map = [];
        this.input_placeholder = true;
        
    };

    activate_page() {

        this.parent.innerHTML = '<div class="content"></div>';
        this.parent.querySelector('.content').innerHTML = this.generate_html();
        document.querySelector('main').insertAdjacentHTML('beforeend', '<p class="credit">@henry jordan</p>');

        this.bind_buttons();

    };

    generate_html() {

        return`
        <div class="message-scroll"><div class="message-array"></div></div>
        <div class="message-edit-options">
            <button class="message-edit-confirm">Confirm</button>
            <button class="message-edit-cancel">Cancel</button>
        </div>
        <div class="chat-input-container">
            <div id="chat-input" contentEditable="true">Type here...</div>
            <button id="chat-submit">
                <svg xmlns="http://www.w3.org/2000/svg" id="submit-icon" height="16px" width="16px" viewBox="0 0 512 512"><style>svg{fill:#fdfdfd}</style><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>
            </button>
            <button id="chat-cancel" class="hidden-display">
                <svg xmlns="http://www.w3.org/2000/svg" id="cancel-icon" height="16" width="16" viewBox="0 0 512 512"><path fill="#fdfdfd" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm192-96H320c17.7 0 32 14.3 32 32V320c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32z"/></svg>
            </button>
        </div>`;

    };

    bind_buttons() {

        this.parent.querySelector('#chat-submit').onclick = () => this.submit_message();
        this.parent.querySelector('#chat-cancel').onclick = () => this.cancel_message();

        this.parent.querySelector('#chat-input').addEventListener('input', (e) => {this.chat_input_filter(e)});
        
        this.parent.querySelector('#chat-input').addEventListener('focus', (e) => {this.input_focus()});
        this.parent.querySelector('#chat-input').addEventListener('focusout', (e) => {this.input_focus_out()});

        document.addEventListener('copy', (e) => {this.normalize_clipboard(e)});
        document.querySelector('.content').addEventListener('paste', (e) => {

            e.preventDefault();
            e.target.innerText += e.clipboardData.getData("text/plain");

        });

        document.addEventListener('keydown', (e) => { this.pressed_keys[e.key] = true });
        document.addEventListener('keyup', (e) => { delete this.pressed_keys[e.key] })

        document.addEventListener('input-revert', (e) => {this.input_revert()});

    };

    async submit_message() {

        const element = this.parent.querySelector('#chat-input');
        const input = element.innerText;

        if (element.innerText.trim().length == 0 || element.innerText.trim() == 'Type here...') {

            return;

        }

        this.message_array.submit_user_message(input);
        this.parent.querySelector('#chat-input').value = '';
        
        this.message_array.submit_response_message();

    };

    cancel_message() {

        this.message_array.cancel_message();

    };

    input_focus() {

        const chat_input = this.parent.querySelector('#chat-input');

        if (this.input_placeholder) {

            this.input_placeholder = false;

            chat_input.innerHTML = '';
            chat_input.classList.add('editing');

        };

    };

    input_focus_out() {

        const chat_input = this.parent.querySelector('#chat-input');

        if (chat_input.innerText.trim().length == 0) {


            chat_input.innerText = 'Type here...';
            chat_input.classList.remove('editing');

    
            this.input_placeholder = true;
    
        };

    };

    input_revert() {

        console.log('Reverting chat input.');

        const chat_input = this.parent.querySelector('#chat-input');

        this.input_placeholder = true;

        chat_input.innerHTML = 'Type here...';
        chat_input.classList.remove('editing');

        chat_input.blur();

    }

    chat_input_filter(e) {

        const element = this.parent.querySelector('#chat-input');
        const submit_element = this.parent.querySelector('#chat-submit');

        if (e.inputType === "insertParagraph" && !(this.pressed_keys['Shift'])) {

            if (element.innerText.trim().length > 1 && !(submit_element.classList.contains('hidden-display'))) {

                this.submit_message();

            } else {

                const value = `${element.value.substring(0, element.value.length - 1)}`;
                element.value = value;

            };

        };
    
    };

    normalize_clipboard(e) {

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const content = range.cloneContents();
      
        const normalizedContent = content.textContent.trim();
      
        e.clipboardData.setData('text/plain', normalizedContent);
        e.preventDefault();

    };

};