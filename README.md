# GreenFront
Angular web app for Exactum Greenhouse course. The front end designed to represent the data gathered by Arduino Uno.
The data is fetched from Firebase and angular charts are being used for the representation.

# Requirements
-npm <br>
-bower <br>
-grunt <br>

# Usage
Go to the root of GreenFront project. <br>
Run: $npm install <br>
Run: $bower install <br>
Run: $grunt serve <br>
Now the project should be running on your localhost. <br>

# Deployment
Run: $grunt <br>
($grunt --force might be required) <br>
Deploy dist folder to your chosen location. Heroku for example. <br>

# How it works
GreenFront fetches data that we have stored in Firebase and shows it in angular charts. We can view the last 1 hour,
the current day, last 7 days or last 30 days.
