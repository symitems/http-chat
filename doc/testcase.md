# Regression test

- Login with both Github and Google and redirect to /chat
- Submit message
- Clear all message
- Display datetime both UTC and JST
- Logout successfully
- Check if you cannnot see chat page without login
- When visiting chat page with invalid code paramater, you can see
  - Modal window with error message
  - 401 error in console of the developer tool of your browser
- Confirm that new messages go to the top
- the changes are compatible with the previous version (If not, write clearly in the pull-request)
