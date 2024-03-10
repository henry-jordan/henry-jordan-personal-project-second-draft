import { default_response, elaborate_response, explain_response } from "../answer_engine/get_response.js";

function remove_children(element) {

    while (element.firstChild) {

        element.removeChild(element.firstChild);

    };

}

function scroll_down() {

    const scroll_element = document.querySelector('.message-scroll');
    scroll_element.scrollTop = scroll_element.scrollHeight;

};

export class user_message {

    constructor(value, id, message_array) {

        this.value = [value.trim()];
        this.value_index = 0;
        this.id = id;
        this.sender = 'user';
        this.message_array = message_array;
        this.response_hash = {
            0 : 0,
        };

        this.activate_message();

    };

    generate_wrapper() {

        return`<div class="user-message-container" id="user-message-${this.id}"></div>`;

    }

    generate_html() {

        if (this.value.length == 1) {
            
            return `
            <div class="user-message">
                <p class="message-text">${this.value[this.value_index]}</p>
            </div>
            <div class="user-message-options">
                <button class="edit-message-button">Edit</button>
            </div>`;
            
        } else {

            return `
            <div class="user-message">
                <p class="message-text">${this.value[this.value_index]}</p>
            </div>
            <div class="user-message-options">
                <button class="edit-message-button">Edit</button>
                <div class="message-selection">
                    <button class="message-selection-button" id="select-back">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11" width="11" viewBox="0 0 320 512"><path fill="#797979" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                    </button>
                    ${this.value_index+1}
                    <button class="message-selection-button" id="select-next">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11" width="11" viewBox="0 0 320 512"><path fill="#797979" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                    </button>
                </div>
            </div>`;

        };

    };

    update_message() {

        try{

            remove_children(document.querySelector(`#user-message-${this.id}`))
        
        } catch (error) {

            document.querySelector('.message-array').insertAdjacentHTML('beforeend', this.generate_wrapper());

        }

        document.querySelector(`#user-message-${this.id}`).insertAdjacentHTML('beforeend', this.generate_html());

    };

    activate_message() {

        this.update_message();
        this.element = document.querySelector(`#user-message-${this.id}`);

        this.element.querySelector('.edit-message-button').onclick = (e) => {this.edit_message(e)};

        if (this.value.length > 1) {   
                            
            this.element.querySelector('#select-back').onclick = () => {this.message_array.message_select(this, -1)};
            this.element.querySelector('#select-next').onclick = () => {this.message_array.message_select(this, 1)};
                       
            
        };
        
    };

    hide_buttons() {

        this.element.querySelector('.user-message-options').classList.add('hidden');

    };

        
    show_buttons() {

        this.element.querySelector('.user-message-options').classList.remove('hidden');

    };

    edit_message(e) {

        e.stopPropagation();
        
        const edit_options = document.querySelector(`.message-edit-options`);
        const text_element = this.element.querySelector('.message-text');
        const initial_value = text_element.innerText;

        if (this.element.classList.contains('editing')) {

            this.edit_message_cancel(initial_value);
            return;

        };
        
        console.log(`Enabled editing for Message ${this.value_index+1}.`);
        this.element.querySelector('.user-message').classList.toggle('editing');

        this.message_array.hide_buttons();

        document.querySelector('.chat-input-container').classList.toggle('hidden');
        edit_options.classList.toggle('show');

        text_element.contentEditable = true;
        text_element.focus();

        const range = document.createRange();
        range.selectNodeContents(text_element);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        edit_options.querySelector('.message-edit-confirm').onclick = () => {this.edit_message_confirm()};
        edit_options.querySelector('.message-edit-cancel').onclick = () => {this.edit_message_cancel(initial_value)};

    };

    edit_message_confirm() {

        for (let i = 0; i < this.value.length; i++) {

            if (this.value[i] == this.element.querySelector('.message-text').innerText) {

                console.log(`Message permutation already exists: Message ${i+1}.`);

                this.value_index = i;

                this.edit_message_cancel();
                this.activate_message();

                return;

            };


        };

        console.log(`Message editing for Message ${this.value_index+1} saved.`)

        this.value.push(this.element.querySelector('.message-text').innerText.trim());
        this.value_index = this.value.length - 1;

        this.edit_message_cancel();
        this.activate_message();

        this.message_array.edit_regeneration(this);

    };

    edit_message_cancel(initial_value) {
        
        const edit_options = document.querySelector(`.message-edit-options`);
        const text_element = this.element.querySelector('.message-text');
        
        this.element.querySelector('.user-message').classList.toggle('editing');
        
        this.message_array.show_buttons();

        if (initial_value) {

            console.log(`Message editing for Message ${this.value_index+1} canceled.`)

            text_element.innerText = initial_value;

        };

        edit_options.classList.toggle('show');
        
        document.querySelector('.chat-input-container').classList.toggle('hidden');

        text_element.contentEditable = false;
        
        edit_options.querySelector('.message-edit-confirm').removeEventListener('onclick', this.edit_message_confirm);
        edit_options.querySelector('.message-edit-cancel').removeEventListener('onclick', this.edit_message_cancel);

    };

};

export class response_message {

    constructor(id, message_array) {

        this.value = [];
        this.value_index = 0;
        this.id = id;
        this.sender = 'assistant';
        this.message_array = message_array;
        this.canceled = false;
        this.value_tags = [];

        this.activate_message();
        this.push_response();

    };

    generate_wrapper() {

        return`<div class="engine-message-container" id="engine-message-${this.id}"></div>`;

    };

    generate_html() {

        if(this.value.length <= 1) {

            return `
            <div class="engine-message">
                <p class="message-text">${this.value[this.value_index]}</p>
                </div>
            <div class="engine-message-options">
                <button class="message-tool" id="tools-button">Tools</button>
                <div class="tools-menu hidden-display">
                    <button class="message-tool" id="regenerate-message-button">Regenerate</button>
                    <button class="message-tool" id="elaborate-message-button">Elaborate</button>
                    <button class="message-tool" id="explain-message-button">Explain</button>
                </div>
                <p class="message-tag">${this.tag_text()}</p>
            </div>`;

        } else {

            return `
            <div class="engine-message">
                <p class="message-text">${this.value[this.value_index]}</p>
                </div>
            <div class="engine-message-options">
                <button class="message-tool" id="tools-button">Tools</button>
                <div class="tools-menu hidden-display">
                    <button class="message-tool" id="regenerate-message-button">Regenerate</button>
                    <button class="message-tool" id="elaborate-message-button">Elaborate</button>
                    <button class="message-tool" id="explain-message-button">Explain</button>
                </div>
                <div class="message-selection">
                    <button class="message-selection-button" id="select-back">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11" width="11" viewBox="0 0 320 512"><path fill="#797979" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                    </button>
                    ${this.value_index+1}
                    <button class="message-selection-button" id="select-next">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11" width="11" viewBox="0 0 320 512"><path fill="#797979" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                    </button>
                </div>
                <p class="message-tag">${this.tag_text()}</p>
            </div>`;

        };

    };

    generate_wait() {

        return`<span class="dot-wait" id="dot-wait-1">.</span><span class="dot-wait" id="dot-wait-2">.</span><span class="dot-wait" id="dot-wait-3">.</span>`

    }

    update_message() {

        try{

            remove_children(document.querySelector(`#engine-message-${this.id}`))
        
        } catch (error) {

            document.querySelector('.message-array').insertAdjacentHTML('beforeend', this.generate_wrapper());

        }

        document.querySelector(`#engine-message-${this.id}`).insertAdjacentHTML('beforeend', this.generate_html());

        const text_element = document.querySelector(`#engine-message-${this.id}`).querySelector('.message-text');

        if (text_element.innerHTML == 'undefined') {

            text_element.innerHTML = ' ';

        };

    };

    async activate_message() {

        console.log('Activating message.');

        this.update_message();
        this.element = document.querySelector(`#engine-message-${this.id}`);

        if (this.value.length <= 1) {

            this.buttons = {
    
                tools : this.element.querySelector('#tools-button'),
                regenerate : this.element.querySelector('#regenerate-message-button'),
                elaborate : this.element.querySelector('#elaborate-message-button'),
                explain : this.element.querySelector('#explain-message-button'),
    
            };
    
            
        } else {
                        
            this.buttons = {
                
                tools : this.element.querySelector('#tools-button'),
                regenerate : this.element.querySelector('#regenerate-message-button'),
                elaborate : this.element.querySelector('#elaborate-message-button'),
                explain : this.element.querySelector('#explain-message-button'),
                back: this.element.querySelector('#select-back'),
                next: this.element.querySelector('#select-next'),
                
            };
            
        };

        this.element.addEventListener('mouseleave', () => {

            this.element.querySelector('.tools-menu').classList.add('hidden-display');
            this.element.querySelector('#tools-button').classList.remove('open');

            try {

                this.element.querySelector('.message-selection').classList.remove('hidden');
    
            } catch (error) {};
    
            const tools_button = this.element.querySelector('#tools-button')
    
            tools_button.innerHTML = 'Tools';

        })

        this.activate_buttons(); // I don't understand why I still need this here, but everything breaks if I change it.
        
        if (Boolean(this.value_tags[this.value_index])) {

            this.element.querySelector('#tools-button').classList.add('hidden-display');

        };

    };

    activate_buttons() {

        if (this.value.length <= 1) {

            this.buttons.tools.addEventListener('click', () => {this.open_tools()});
            this.buttons.regenerate.addEventListener('click', () => {this.regenerate_message()});
            this.buttons.elaborate.addEventListener('click', () => {this.regenerate_message('elaborate')});
            this.buttons.explain.addEventListener('click', () => {this.regenerate_message('explain')});

        } else {

            this.buttons.tools.addEventListener('click', () => {this.open_tools()});
            this.buttons.regenerate.addEventListener('click', () => {this.regenerate_message()});
            this.buttons.elaborate.addEventListener('click', () => {this.regenerate_message('elaborate')});
            this.buttons.explain.addEventListener('click', () => {this.regenerate_message('explain')});
            this.buttons.back.onclick = () => {this.message_array.message_select(this, -1)};
            this.buttons.next.onclick = () => {this.message_array.message_select(this, 1)};

        }

    };

    async fetch_response(input, method) {
        
        document.dispatchEvent(new CustomEvent('input-revert'));

        try {

            this.canceled = false;

            if (method == 'elaborate') {

                var stream = await elaborate_response(input);

            } else if (method == 'explain') {

                var stream = await explain_response(input);

            } else {

                var stream = await default_response(input);

            };

            console.log('Response stream received.');

            const text_element = document.querySelector(`#engine-message-${this.id}`).querySelector('.message-text');

            try {

                const decoder = new TextDecoder();

                const reader = stream.body.getReader();
                let chunks = '';

                console.log('Updating message.');

                this.message_array.hide_buttons();
                text_element.innerText = ' ';

                while (true) {

                    const { done, value } = await reader.read();

                    if (this.canceled) {

                        this.value.push(`${text_element.innerText}... Response canceled prematurely.`);
                        text_element.innerText = this.value[this.value.length-1];
                        console.log('Message canceled.');
                        return;

                    };
                    
                    if (done) break;
                    
                    chunks += decoder.decode(value);

                    for (let i = text_element.innerText.length; i < chunks.length; i++) {

                        if (this.canceled) {

                            this.value.push(`${text_element.innerText}... Response canceled prematurely.`);
                            text_element.innerText = this.value[this.value.length-1];
                            console.log('Message canceled.');
                            return;
    
                        };
    
                        text_element.innerText = chunks.slice(0, i + 1);
            
                        await new Promise(resolve => setTimeout(resolve, 6));
            
                    };

                };

            } catch(error) {

                if (error.name == 'AbortError') {

                    console.log('Response cancelled');
        
                } else {

                    console.log('Response failed.');
                    console.error('Error: ', error);

                };

            };

            this.value.push(text_element.innerText);
            console.log('Message updated.');

        } catch (error) {

            console.log('Response failed.');
            console.error('Error: ', error);

        };

        
    };
    
    async push_response(method) {
        
        const conversation = this.message_array.get_conversation(this);
        
        document.querySelector('#chat-submit').classList.toggle('hidden-display');
        document.querySelector('#chat-cancel').classList.toggle('hidden-display');
        
        await this.fetch_response(conversation, method);
        
        document.querySelector('#chat-cancel').classList.toggle('hidden-display');
        document.querySelector('#chat-submit').classList.toggle('hidden-display');
                
        this.message_array.show_buttons();
        this.message_array.update_response_hash(this, method);

    };

    open_tools() {

        this.element.querySelector('.tools-menu').classList.toggle('hidden-display');
        this.element.querySelector('#tools-button').classList.toggle('open');

        try {

            this.element.querySelector('.message-selection').classList.toggle('hidden');

        } catch (error) {};

        const tools_button = this.element.querySelector('#tools-button')

        if (tools_button.innerHTML == 'Tools') {

            tools_button.innerHTML = '< Tools';

        } else {

            tools_button.innerHTML = 'Tools';

        }

    };

    async regenerate_message(method = 'regenerate') {

        console.log('Message regenerating');

        await this.push_response(method);

        this.activate_message();

    };

    hide_buttons() {

        this.element.querySelector('.engine-message-options').classList.add('hidden');

    };

    show_buttons() {

        this.element.querySelector('.engine-message-options').classList.remove('hidden');

    };

    tag_text() {

        if (this.value_tags.length == 0) {

            return '';

        } else {

            return this.value_tags[this.value_index];

        };

    }

};