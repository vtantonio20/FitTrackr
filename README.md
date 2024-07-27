(Windows OS)
to install -
    cd server
    python -m venv venv
    .\env\Scripts\activate
    pip install -r requirements.txt
    
to run -
    cd server
    .\venv\Scripts\activate
    $env:FLASK_APP="server.py"
    $env:FLASK_ENV="development"
    flask run --host=0.0.0.0 --debug

(Mac OS)
to install - 
    cd server
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

to run:
    cd server
    source venv/bin/activate
    export FLASK_APP=server.py
    export FLASK_ENV=development
    flask run --host=0.0.0.0 --port=5001 --debug

cd client
npx expo start

eas build --profile development-simulator --platform ios