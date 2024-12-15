File Structure and Authors

Project Name: ITU - Mushroom app

Setup:
1. Clone the repository
2. Run `npm install --legacy-peer-deps` to install dependencies
3. Run `npm run dev`

Root Directory
	•	index.css
	    •	Description: Styles for map.
	    •	Author: Marek Joukl (xjoukl00)
	•	main.jsx
	    •	Author: Generated file
    •	App.jsx
        •	Description: Main application component with layout and routing.
        •	Authors: Everyone

src Directory
1. api/
	•	Purpose: Contains API calls for data communication and external services.
	•	apiMap.js
	    •	Description: Handles API calls related to maps, locations, and uploads.
	    •	Author: Marek Joukl (xjoukl00)
		
	•	apiMushrooms.js
	    •	Description: Fetches and manages mushroom data.
	    •	Author: Ondrej Kozanyi (xkozan01)

	•	apiSimilarMushrooms.js
	    •   Description: Handles API calls related to mushroom similarity groups - creating, removing, modifying.
	    •   Author: Ondrej Kozanyi (xkozan01)
	•	apiRecipes.js
	    •   Description: Handles API calls related to recipes.
	    •   Author: Igor Mikula (xmikul74)

	•	apiUsers.js
	    •   Description: Handles API calls related to users and their favourite posts.
	    •   Author: Aurel Strigac (xstrig00)

2. contexts/
	•	UserContext.js
	•	Description: Manages user global state.
	•	Author: Marek Joukl (xjoukl00)

3. features/
	•	Purpose: Core application features grouped into folders.
	•	map/
        •	Description: Contains all functions manipulating map and locations.
        •	Author: Marek Joukl (xjoukl00)

	•	mushrooms/
        •	Description: Contains all functions manipulating atlas and mushroom entries.
        •	Author: Ondrej Kozanyi (xkozan01)

	•	recepies/
        •	Description: Contains all functions manipulating recipes.
        •	Author: Igor Mikula (xmikul74)

	•	user/
        •	Description: Contains all functions manipulating users and their favourite posts.
        •	Author: Aurel Strigac (xstrig00)

4. ui/
    •	Purpose: Reusable UI components and styles.
    •	Author: Everyone (described in each file header)
