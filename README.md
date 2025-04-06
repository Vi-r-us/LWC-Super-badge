# LWC Superbadge Project

This repository contains the implementation of the **LWC Superbadge** project, which demonstrates the use of Salesforce Lightning Web Components (LWC), Apex, and other Salesforce technologies to build a robust and interactive application for managing boats and their details.

---

## Features

### 1. **Boat Search**
- **Component:** `boatSearch`
- Allows users to search for boats based on various criteria such as type, price range, length, and year.
- Displays a loading spinner while the search is in progress.
- Integrates with Apex methods to fetch boat data dynamically.

### 2. **Boat Search Results**
- **Component:** `boatSearchResults`
- Displays the list of boats matching the search criteria in a data table.
- Supports inline editing for boat details like name, length, price, and description.
- Publishes messages using the Lightning Message Service (LMS) to notify other components of updates.
- Includes toast notifications for success and error messages.

### 3. **Boat Tile**
- **Component:** `boatTile`
- Displays individual boat details in a tile format.
- Dynamically sets the background image and CSS class based on the boat's properties.
- Fires custom events (`boatselect`) when a boat is selected.

### 4. **Similar Boats**
- **Visualforce Page:** `SimilarBoats.page`
- Displays detailed information about a selected boat, including its length, price, year built, and picture.
- Uses Apex controllers to fetch and display similar boats based on the selected boat's attributes.

### 5. **Similar Boats Component**
- **Component:** `SimilarBoatsComponent`
- Displays a list of boats similar to the selected boat.
- Uses attributes to pass data from the parent component to the Apex controller.
- Includes detailed sections for each boat, such as length, price, year, and picture.

---

## Project Structure

### **Lightning Web Components (LWC)**
The `force-app/main/default/lwc` folder contains the LWC components used in this project.

#### 1. `boatSearch`
- **File:** `boatSearch.js`
- **Description:** Handles the search functionality and integrates with Apex methods to fetch boat data.

#### 2. `boatSearchResults`
- **File:** `boatSearchResults.js`
- **Description:** Displays search results in a data table and supports inline editing.

#### 3. `boatTile`
- **File:** `boatTile.js`
- **Description:** Displays individual boat details in a tile format and handles boat selection events.

---

### **Apex**
The project uses Apex controllers to handle server-side logic and data fetching.

#### 1. `SimilarBoatsController`
- Fetches details about the selected boat and similar boats based on attributes like price, length, and year.

#### 2. `BoatDataService`
- Provides methods to fetch and update boat data.

---

### **Visualforce Pages**
The `force-app/main/default/pages` folder contains Visualforce pages used in this project.

#### 1. `SimilarBoats.page`
- Displays detailed information about a selected boat and its similar boats.

---

### **Components**
The `force-app/main/default/components` folder contains Visualforce components used in this project.

#### 1. `SimilarBoatsComponent`
- Displays a list of similar boats with detailed sections for each boat.

---

## Project Visualization

```md
LWC Superbadge Project
├── boatSearch
│   ├── boatSearch.html
│   ├── boatSearch.js
│   ├── boatSearch.css
│   └── boatSearch.js-meta.xml
│   ├── Children:
│       ├── boatSearchResults
│       │   ├── boatSearchResults.html
│       │   ├── boatSearchResults.js
│       │   ├── boatSearchResults.css
│       │   └── boatSearchResults.js-meta.xml
│       │   ├── Children:
│       │       └── boatTile
│       │           ├── boatTile.html
│       │           ├── boatTile.js
│       │           ├── boatTile.css
│       │           └── boatTile.js-meta.xml
│       ├── boatDetailTabs
│           ├── boatDetailTabs.html
│           ├── boatDetailTabs.js
│           ├── boatDetailTabs.css
│           └── boatDetailTabs.js-meta.xml
│           ├── Children:
│               ├── boatMap
│               │   ├── boatMap.html
│               │   ├── boatMap.js
│               │   ├── boatMap.css
│               │   └── boatMap.js-meta.xml
│               └── boatReviews
│                   ├── boatReviews.html
│                   ├── boatReviews.js
│                   ├── boatReviews.css
│                   └── boatReviews.js-meta.xml
│                   ├── Children:
│                       └── boatAddReviewForm
│                           ├── boatAddReviewForm.html
│                           ├── boatAddReviewForm.js
│                           ├── boatAddReviewForm.css
│                           └── boatAddReviewForm.js-meta.xml
│       └── SimilarBoatsComponent
│           ├── SimilarBoatsComponent.html
│           ├── SimilarBoatsComponent.js
│           ├── SimilarBoatsComponent.css
│           └── SimilarBoatsComponent.js-meta.xml
├── Apex Classes
│   ├── BoatDataService.cls
│   ├── BoatDataService.cls-meta.xml
│   ├── SimilarBoatsController.cls
│   └── SimilarBoatsController.cls-meta.xml
```

---

## Development Tools and Configuration

### **Prettier**
- The project uses Prettier for code formatting.
- **Configuration File:** `.prettierrc`
- Includes plugins for Apex and XML formatting.

### **ESLint**
- The project uses ESLint for linting JavaScript code.
- **Configuration File:** `.eslintrc.json`
- Extends the recommended configuration for LWC.

### **Husky and Lint-Staged**
- Husky is used to run pre-commit hooks.
- Lint-staged ensures that only staged files are linted and formatted before committing.

---

## How to Run the Project

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd LWC-Superbadge
2. **Authorize a Salesforce Org**
   ```bash
   sfdx auth:web:login
3. **Push Source to Org**
   ```bash
   sfdx force:source:push
4. **Assign the Permission Set**
   ```bash
   sfdx force:user:permset:assign -n LWC_Superbadge
5. **Run the Application**
    - Open the Salesforce org and navigate to the app to test the functionality.

---

## Key Files

| File/Folder                              | Description                                                                 |
|------------------------------------------|-----------------------------------------------------------------------------|
| `force-app/main/default/lwc`             | Contains all Lightning Web Components.                                     |
| `force-app/main/default/pages`           | Contains Visualforce pages.                                                |
| `force-app/main/default/components`      | Contains Visualforce components.                                           |
| `.prettierrc`                            | Prettier configuration for code formatting.                                |
| `.eslintrc.json`                         | ESLint configuration for linting JavaScript code.                          |
| `sfdx-project.json`                      | Salesforce DX project configuration.                                       |
| `.forceignore`                           | Specifies files and folders to ignore during source push/pull operations.  |

---

## Future Enhancements

- Add unit tests for LWC components using Jest.
- Implement pagination for the search results.
- Enhance the UI with additional styling and responsiveness.
- Add more filters for boat search, such as manufacturer and model.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.