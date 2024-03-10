from flask import Flask, render_template, Response, stream_template, request
from markupsafe import escape
from flask_cors import CORS
from openai import OpenAI
import os

from server_modules.api_response import default_response, elaborate_response, explain_response

application = Flask(__name__)
CORS(application)

client = OpenAI(api_key = os.getenv('api_key'))

@application.route("/")
def index():

    return render_template('index.html')

@application.route('/openai_api_response', methods=['POST'])
def default_completion():

    print('Default request received')

    if request.method == 'POST':

        messages = request.json['messages']

        def event_stream():

            print('Initiating stream.')

            try:

                for line in default_response(messages=messages):

                    text = line.choices[0].delta.content

                    try:

                        if len(text):

                            yield text

                    except:

                        print('End of stream.')
                        break
            
            except GeneratorExit:

                print('Stream failed.')
        
        return Response(event_stream(), mimetype='text/event-stream')
    
    else:

        print('Response method is not POST.')

        return stream_template('./chat.html')
    
@application.route('/openai_api_elaborate', methods=['POST'])
def elaborate_completion():

    print('Elaboration request received')

    if request.method == 'POST':

        messages = request.json['messages']

        def event_stream():

            print('Initiating stream.')

            try:

                for line in default_response(messages=messages):

                    text = line.choices[0].delta.content

                    try:

                        if len(text):

                            yield text

                    except:

                        print('End of stream.')
                        break
            
            except GeneratorExit:

                print('Stream failed.')
        
        return Response(event_stream(), mimetype='text/event-stream')
    
    else:

        print('Response method is not POST.')

        return stream_template('./chat.html')
    
@application.route('/openai_api_explain', methods=['POST'])
def explain_completion():

    print('Explanation request received')

    if request.method == 'POST':

        messages = request.json['messages']

        def event_stream():

            print('Initiating stream.')

            try:

                for line in default_response(messages=messages):

                    text = line.choices[0].delta.content

                    try:

                        if len(text):

                            yield text

                    except:

                        print('End of stream.')
                        break
            
            except GeneratorExit:

                print('Stream failed.')
        
        return Response(event_stream(), mimetype='text/event-stream')
    
    else:

        print('Response method is not POST.')

        return stream_template('./chat.html')

if __name__ == '__main__':

    application.run( debug = False, port = 3000 )