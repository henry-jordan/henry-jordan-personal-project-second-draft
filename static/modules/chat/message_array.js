import { user_message, response_message } from './message.js';

function scroll_down() {

    const scroll_element = document.querySelector('.message-scroll');
    scroll_element.scrollTop = scroll_element.scrollHeight;

};

function find_key_by_value(hash, value) {
    
    for (let key in hash) {
        
        if (hash[key] == value) {
            
            return Number(key);
            
        } else if (typeof hash[key] == 'object') {
            
            for (let i = 0; i < hash[key].length; i++) {
                
                if (hash[key][i] == value) {
                    
                    return Number(key);
                    
                };
                
            };
            
        };
        
    };
    
};

export class message_array {

    constructor(parent) {

        this.array = [];
        this.parent = parent;

    };

    submit_user_message(value) {

        const message = new user_message(value, Date.now(), this);

        this.array.push(message);

        scroll_down();

    };

    submit_response_message() {

        const message = new response_message(Date.now(), this);

        this.array.push(message);

        scroll_down();

    };

    get_conversation(stop = this.array[this.array.length]) {

        let conversation = [];

        for (let message of this.array) {

            if (message == stop) break;

            conversation.push({

                role: message.sender, content: message.value[message.value_index]

            });

        };

        if (conversation[conversation.length - 1].content == ':test-response:') {

            return ':test-response:';

        };
        
        return conversation;

    };

    hide_buttons() {

        console.log('Hiding buttons.');

        this.array.forEach((element) => {

            element.hide_buttons();

        });

    };

    show_buttons() {

        console.log('Showing buttons.');

        this.array.forEach((element) => {

            element.show_buttons();

        });

    };

    cancel_message() {

        this.array.forEach((element) => {

            if (element.sender == 'assistant') {

                element.canceled = true;

            };

        });

    };

    edit_regeneration(message) {

        this.array[this.array.indexOf(message)+1].regenerate_message('new');

    };

    update_response_hash(message, method) { // Updates the hash that determines which responses pertain to which requests for responsive message selection

        const user_message = this.array[this.array.indexOf(message)-1]; // Method called by response message, which always follows a user message
        const user_index = user_message.value_index;
        const response_index = message.value.length-1;

        if (method == 'new') { // If message is being edited (new request)

            user_message.response_hash[user_index] = response_index; // Creates new entry with single value
            message.value_tags.push('');

        } else if (method == 'regenerate' || method == 'elaborate' || method == 'explain') { // If message is being regenerated

            if (typeof user_message.response_hash[user_index] == 'object') { // If the value is already an array (subsequent regeneration)

                user_message.response_hash[user_index] = [...user_message.response_hash[user_index], response_index]; // Append to value

            } else { // If it's the first time that a message has been regenerated

                user_message.response_hash[user_index] = [user_message.response_hash[user_index], response_index]; // Sets value type to array since it was previously a single integer

            };

            if (method == 'regenerate') {

                message.value_tags.push('Regenerated');

            } else if (method == 'elaborate') {

                message.value_tags.push('Elaborated');

            } else if (method == 'explain') {

                message.value_tags.push('Explained');

            };

        } else {

            message.value_tags.push('');

        };

        this.order_messages(message);
        user_message.response_hash = this.order_object(user_message.response_hash);

    };

    order_object(object) { // Orders response hash so that all values and values within message arrays are in ascending order

        const transformed_object = {};
        const values = Object.values(object).flatMap(val => Array.isArray(val) ? val : [val]); // Gets flattened values of object

        const sorted_values = values.sort((a, b) => a - b); // Sorts values
        let sorted_index = 0; // Index so that arrays can be sorted properly with integer values

        Object.keys(object).forEach((key) => { // Maps object to sorted values

            const value = object[key];

            if (Array.isArray(value)) { // If the value is an array of messages

                transformed_object[key] = sorted_values.slice(sorted_index, sorted_index + value.length); // Sorts array
                sorted_index += value.length; // Updates index

            } else {

                transformed_object[key] = sorted_values[sorted_index++]; // Sorts value

            };

        });

        return transformed_object;

    };

    order_messages(message) { // Sorts response messages and response index

        const user_message = this.array[this.array.indexOf(message)-1];

        let order = Object.values(user_message.response_hash).flat(); // Desired order of response messages
        let ordered_tags = order;
        let pointer = message.value[message.value.length-1]; // Current response index
    
        order = order.map(index => message.value[index]); // Maps response messages to desired order
        ordered_tags = ordered_tags.map(index => message.value_tags[index]);
        pointer = order.indexOf(pointer); // Updates response index to the updated position of the selected message

        message.value = order;
        message.value_tags = ordered_tags;
        message.value_index = pointer;

    };

    message_select(message, action) { // Changes message selection (forward or backward). All messages are sorted upon generation

        // Action = +/- 1
        // Declare variables with var to permit function scope

        console.log('Switching message selection.');

        if (message.sender == 'user') {

            var user_message = message;
            var response_message = this.array[this.array.indexOf(message)+1];

        } else {

            var response_message = message;
            var user_message = this.array[this.array.indexOf(message)-1];

        };


        const hash = user_message.response_hash;
        let index_1 = user_message.value_index;
        let index_2 = response_message.value_index;

        // Checks if action would place message selection out of bounds

        if (index_2 + action == Object.values(hash).flat().length) {
        
            console.log('Out of bounds.');
            return;
            
        } else if (index_2 + action == -1) {
            
            console.log('Out of bounds');
            return;
            
        };

        if (message.sender == 'user') { // Selection for when sender == user

            index_1 += action; // Increments user index
            index_2 = hash[index_1]; // Sets response index to the value corresponding to the user index

            // Sets response index to the beginning or end of response array if the value is an array

            if (action < 0 && typeof index_2 == 'object') {
            
                index_2 = Math.max(...index_2);
                
            } else if (typeof index_2 == 'object') {
                
                index_2 = Math.min(...index_2);  
                
            };

        } else if (message.sender == 'assistant') { // Selection for when sender == assistant (ai)

            index_2 += action; // Increment response index
            index_1 = find_key_by_value(hash, index_2); // Sets user index to the key corresponding to the response index

        };

        // Updates messages

        user_message.value_index = index_1;
        response_message.value_index = index_2;

        user_message.activate_message();
        response_message.activate_message();

    };
 
};