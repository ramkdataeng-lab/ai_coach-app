@echo off
echo Starting iOS Build and Submission to TestFlight...
echo Ensure you are logged in to Expo and Apple Developer if prompted.
node "node_modules\eas-cli\bin\run" build --platform ios --profile production --auto-submit
pause
