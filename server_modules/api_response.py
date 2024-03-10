from openai import OpenAI
from flask import jsonify
from dotenv import load_dotenv
import os
import json

def configure():

    load_dotenv()

configure()

client = OpenAI(api_key = os.getenv('api_key'))

instruction_messages = { # Dictionary of the different possible instruction messages to guide the model's style and behavior

    'default' : 'As a helpful assistant, maintain a polite and instructional tone while delivering responses. Ensure that each response is concise, containing no more than 100 words. Break down information into segments or lists for improved readability. When presenting multiple points, limit lists to a maximum of 5 items.',
    'elaborate' : 'Please provide a thorough and detailed elaboration of the following message. Consider expanding on each point, providing context, examples, and any relevant information to ensure a comprehensive response. Use clear and concise language to explain the key concepts.',
    'explain' : "Please provide a comprehensive explanation for the given message. Break down its key components, analyze the context, and offer insights into any ambiguous or complex elements. Pay attention to details, and include relevant background information that enhances the understanding of the message. If there are specific terms or concepts that require clarification, ensure to provide clear explanations. Your response should be thorough and aimed at helping the reader gain a complete understanding of the message's content and implications."

}

def create_instruction_message(message, sender):

    return {'role': sender, 'content': instruction_messages[message]}

def default_response(messages):

    messages.insert(0, create_instruction_message('default', 'assistant'))

    print('Getting default API response')

    try:

        return client.chat.completions.create(

        model = 'gpt-3.5-turbo',
        messages = messages,
        stream = True

        )

    except Exception as e:

        print(f'Error in getting OpenAI API response (default_response): ${e}')

        return f'Error: ${str(e)}'
    
def elaborate_response(messages):

    print('Formatting messages.')

    value = messages.pop()
    value = messages.pop()
    value = value['content']

    instruction = create_instruction_message('elaborate', 'user')
    instruction['content'] = instruction['content'] + f'\n\n###\n\n{value}'

    messages.append(instruction)

    print('Getting default API response')

    try:

        return client.chat.completions.create(

        model = 'gpt-3.5-turbo',
        messages = messages,
        stream = True

        )

    except Exception as e:

        print(f'Error in getting OpenAI API response (default_response): {e}')

        return f'Error: ${str(e)}'
    
def explain_response(messages):

    print('Formatting messages.')

    value = messages.pop()
    value = messages.pop()
    value = value['content']

    instruction = create_instruction_message('explain', 'user')
    instruction['content'] = instruction['content'] + f'\n\n###\n\n{value}'

    messages.append(instruction)

    print('Getting default API response')

    try:

        return client.chat.completions.create(

        model = 'gpt-3.5-turbo',
        messages = messages,
        stream = True

        )

    except Exception as e:

        print(f'Error in getting OpenAI API response (default_response): {e}')

        return f'Error: ${str(e)}'