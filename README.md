## NeightborHood Map

This is a web application developed using knockoutjs. This application displays list of coffee shops and their locations on the google map. Coffee shop location marker show some information regarding coffee shop. Applicationalso allows user to to filter location by typing any keyword in search filter in the left side.

To get started, check out source from git repository and follow the instructions to build the source.

`NOTE: Before you getting started, make sure you have nodejs install on your system.`

### Build Source

Here is the list of steps which will help you build source:

1. Check out the repository
2. Create your google account if not available. Create one project in google API console and enable google map API related services.
3. Replace token 'MAP_API_KEY' with your map api key in index.html at line#61.
4. Create account in foursquare.com. Once you create account, they will provide client ID and Client Secret.
5. Replace tokens '###CLIENT_ID###' and '###CLIENT_SECRET###' with your Client ID and Client Secret.
6. Install grunt client if you have not installed it by executing following command in console. 3. 

  ```bash
  npm install -g grunt-cli
  ```
7. Install grunt modules by executing following command in console. It will install all the modules provided in the **package.json**

  ```bash
  npm install
  ```

8. Execute following command to build the project. It will create the dist folder with all the optimized resources.
  ```bash
  grunt
  ```
9. Open the dist/index.html to view index page 

`NOTE: To run application on a local server, you can use IIS or python server.`

### About application

- When you load the index.html, it will load the default coffee shops in Ahmedabad city.
- It will shows list of coffee shops on the left side bar and related markers on the map.
- It will allow user to filter coffee shops using search filter. 
- When user filter the locations, markers, on the map, are also filtered based on search text.
- User can select any location by clicking on list item or map marker to see more information related to location.
