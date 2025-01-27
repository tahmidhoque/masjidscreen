# MasjidScreen

**MasjidScreen** is a web application designed to display prayer times and important announcements within a mosque setting. This tool aims to enhance the worship experience by providing timely and relevant information to congregants.

## Features

- **Prayer Times Display**: Automatically updates daily prayer times based on the mosque's location.
- **Announcements**: Administrators can post important messages or events to inform attendees.
- **Customizable Themes**: Offers various themes to match the mosque's aesthetic preferences.
- **Responsive Design**: Ensures optimal viewing on various screen sizes, including large displays and mobile devices.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/tahmidhoque/masjidscreen.git
   cd masjidscreen
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the Application**:

   ```bash
   npm start
   ```

   The application will run on `http://localhost:3000`.

## Usage

- **Admin Panel**: Accessible at `/admin` for managing prayer times and announcements.
- **Display Mode**: Navigate to `/display` to view the screen intended for public display within the mosque.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
