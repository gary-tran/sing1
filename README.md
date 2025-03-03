# 聲(sing1)

A web application that offers Cantonese song lyrics with 11 different romanization systems, helping users accurately sound out each word, understand pronunciation, and sing along with confidence. This tool makes it easy to explore lyrics in both Simplified and Traditional Chinese while seamlessly switching between romanization styles.

## 📌 Features

-   Quickly search for Cantonese songs by title, artist, or album.
-   View full song lyrics with integrated romanizations.
-   Supports 11 different Cantonese romanization systems for pronunciation assistance.
-   Toggle between Simplified and Traditional Chinese lyrics.
-   Choose between side-by-side translations or inline romanizations below each character of the lyrics.
-   Select the correct pronunciation for Cantonese words that have different pronunciations depending on the context.

## 🔗 Demo

A live demo is available for users to explore the app's functionality at sing1.vercel.app.

**How to Explore the Demo:**

1. Visit [sing1.vercel.app](https://sing1.vercel.app).

2. Search for "**菠蘿之家**" or "**gary**" in the search bar to trigger a sample result.

3. Click on the result to view the lyrics along with their romanizations.

4. Use the dropdown menus to switch between viewing modes, toggle simplified or traditional Chinese lyrics, select different Cantonese romanization systems, and choose the appropriate context-based romanizations for certain characters.

5. Navigate the app using the home button in the navbar or perform another search to explore additional features.

## 🔧 Tech Stack

**Front-end:** React, CSS

**Back-end:** Spring Boot

**Database:** PostgreSQL

**Scripting:** Shell, SQL, Python

## ⚙️ Prerequisites

-   Node.js and npm
-   Java (23 or higher)
-   PostgreSQL (local installation)
-   Python3
-   Spotify Developer Account

To access the Spotify Web API, you'll need a Spotify Developer account to obtain the required Client ID and Client Secret.

1. Log in to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) using your existing Spotify account.

    - If you don’t already have a Spotify account, you can create one at [Spotify's sign up page](https://www.spotify.com/us/signup).

2. Follow these instructions to set up your app and get the credentials: [Spotify Developer Apps Guide](https://developer.spotify.com/documentation/web-api/concepts/apps).

These credentials are necessary for authenticating your app and interacting with the Spotify Web API.

## 🚀 Project Setup

Follow the steps below to set up and run the application on your local machine.

### Installation

#### 1. Clone the Repository

```
git clone https://github.com/gary-tran/sing1.git
```

#### 2. Navigate into the Project Directory

```
cd sing1
```

### Python Virtual Environment Setup

#### 1. Make the `.sh` File Executable (if necessary)

If the script is not already executable, you will need to change its permissions. Use the following command to make it executable:

```
chmod +x myenv_setup.sh
```

#### 2. Run the `.sh` Script

You can run it using the following command:

```
./myenv_setup.sh
```

### Database Setup

#### 1. Configure Database

Set up your environment variables by adding your credentials to the `.env` file:

-   Copy and paste your Spotify Client ID and Client Secret from your Spotify Web API App.
-   Add your PostgreSQL username and password.

Your `.env` (located at `backend/.env`) file should look like this:

```
DB_USER="your_postgresql_username"
DB_PASSWORD="your_postgresql_password"
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
```

Update the `application.properties` (located at `backend/src/main/resources/application.properties`) file with your PostgreSQL credentials:

```
spring.datasource.username=your_postgresql_username
spring.datasource.password=your_postgresql_password
```

Replace "your_postgresql_username" with your PostgreSQL username in the `database_setup.sh` file and run the following command to set up the database:

```
psql -U your_postgresql_username -d postgres -f backend/scripts/setup_database.sql
```

#### 2. Make the `.sh` File Executable (if necessary)

If the script is not already executable, you will need to change its permissions. Use the following command to make it executable:

```
chmod +x database_setup.sh
```

#### 3. Run the `.sh` Script

You can run it using the following command:

```
./database_setup.sh
```

If you want more options for updating and adding tracks to your database with additional customization, check out the `populate_database.py` (located at `backend/scripts/populate_database.py`) script.

### Back-end Setup

#### 1. Navigate to the `backend` Directory

```
cd backend
```

#### 2. Build the Back-end

Since the back-end uses Maven, you can build the back-end using the following command:

```
./mvnw clean install
```

#### 3. Run the Back-end

To run the Spring Boot application:

```
./mvnw spring-boot:run
```

The back-end will run on http://localhost:8080 by default.

### Front-end Setup

#### 1. Navigate to the `frontend` Directory

```
cd frontend
```

#### 2. Install Front-end Dependencies

Run the following command to install the necessary dependencies:

```
npm install
```

#### 3. Run the Front-end

Start the React development server:

```
npm run dev
```

The front-end will run on http://localhost:5173 by default.

## 📜 License

Copyright (C) 2025 Gary Tran

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

## ⚠️ Disclaimer

This project does not provide or distribute any copyrighted lyrics. It allows users to fetch lyrics via API calls and store them in their own database. All data is retrieved directly by the user from third-party services, and the user is solely responsible for any data they store.

By using this project, you acknowledge that compliance with copyright laws and the terms of service of third-party APIs, such as Spotify and lyric providers, is your responsibility. The creator of this project assumes no liability for how it is used or for any data stored by the user. If you intend to use this project, ensure that you have the necessary rights and permissions to store and display any retrieved content.

## 📝 Credits

This project utilizes the **開放粵語字典\_(粵拼版).txt** file from [kfcd/yyzd](<(https://github.com/kfcd/yyzd)>) and **pingyambiu** file from [kfcd/pingyam](https://github.com/kfcd/pingyam).  
© 2009 kaifangcidian.com  
Website: http://www.kaifangcidian.com  
These dictionaries are licensed under the Creative Commons Attribution 3.0 Unported License.  
For full license details, visit: [http://creativecommons.org/licenses/by/3.0/](https://creativecommons.org/licenses/by/3.0/)  
Last Updated: March 30, 2023 (**開放粵語字典\_(粵拼版).txt**), April 28, 2024 (**pingyambiu**)

## 👨‍💻 Author

**聲(sing1)** was created by **Gary Tran** ([@gary-tran](https://www.github.com/gary-tran)).  
© 2025 Gary Tran. All rights reserved.
