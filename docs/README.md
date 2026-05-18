# The Breed Explorer 
**Live Link** [https://inst-377-final-7g6191ndg-benjamin-sim-s-projects.vercel.app/]

A clean and clutter free visual reference for new pet discovery.

### Description
This web tool offers animal shelter workers and prospective pet owners a clean image gallery to look up specific breeds quickly and save specific pictures onto a bookmark timeline if you wanted to go back and look at them.

### Target Browsers
* Desktop browsers: Google Chrome, Mozilla Firefox, Safari, Microsoft Edge.
* Mobile browsers: Safari and Android Chrome.

### Developer Manual Link
[Developer manual link](#developer-manual)

---

## Developer Manual

### Setup and Installation Instructions
1. Clone the repository onto your local workspace.
2. Run the command `npm install` inside the root directory.
3. Configure your local configuration files with a `.env` file and add your own valid `SUPABASE_URL` and `SUPABASE_KEY` tokens.

### Running the Application Server
1. Start the local backend server with `node index.js`
2. Point any web browser to  `http://localhost:3000`.

### Testing the system:
* **API Integration Test**: Select a dog breed from the dropdown menu and confirm that the correct random image is shown
* **Database write test**: Click the save button on a displayed dog image, and make sure it shows up in the saved carousel at the bottom.

### Server Application Routing API Documentation
* GET `/api/dog-image/:breed`: Queries dog API to extract a random image link.
* POST `/api/favorites`: Saves the dog breed name and image URL to Supabase database.
* GET `/api/favorites`: Returns list containing all saved favorites.
* GET `/api/breeds-list` Queries the Dog API to get and return all available dog breeds.

### Known Bugs & Development Roadmap
* **Known Bug:** Sometimes depending on the image, it might be cut off on the sides or top and bottom in the splide carousel.
* **Roadmap Feature:** Implement a search query input field to skip searching down manual select dropdown components.
