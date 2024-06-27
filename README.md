cd server
.\venv\Scripts\activate
$env:FLASK_APP="server.py"
$env:FLASK_ENV="development"
flask run --host=0.0.0.0 --debug

cd client
npx expo start

build ios
cd client
eas build -p ios   ORRR  eas build -p ios --profile development