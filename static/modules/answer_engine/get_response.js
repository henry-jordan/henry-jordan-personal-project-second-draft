const default_url = '/openai_api_response';
const elaborate_url = '/openai_api_elaborate';
const explain_url = '/openai_api_explain';

export async function default_response(conversation) {

    console.log('Standard response initated.')

    try {

        console.log('Fetching response.');

        const response = await fetch(default_url, {
    
            method: 'POST',
            headers: {
    
                "Content-Type": "application/json",
    
            },
    
            body: JSON.stringify({messages : conversation}),
    
        });

        return response;

    } catch (error) {

        console.log('Response failed.');
        console.error('Error: ', error);

    };

    console.log('Response completed.');

};

export async function elaborate_response(conversation) {

    console.log('Elaboration response initated.')

    try {

        console.log('Fetching response.');

        const response = await fetch(elaborate_url, {
    
            method: 'POST',
            headers: {
    
                "Content-Type": "application/json",
    
            },
    
            body: JSON.stringify({messages : conversation}),
    
        });

        return response;

    } catch (error) {

        console.log('Response failed.');
        console.error('Error: ', error);

    };

    console.log('Response completed.');

};

export async function explain_response(conversation) {

    console.log('Explanation response initated.')

    try {

        console.log('Fetching response.');

        const response = await fetch(explain_url, {
    
            method: 'POST',
            headers: {
    
                "Content-Type": "application/json",
    
            },
    
            body: JSON.stringify({messages : conversation}),
    
        });

        return response;

    } catch (error) {

        console.log('Response failed.');
        console.error('Error: ', error);

    };

    console.log('Response completed.');

};