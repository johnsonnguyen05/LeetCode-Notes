# LeetCode Notes

An Obsidian plugin that integrates your LeetCode submissions directly into your vault.

## Features

-   **Create problem notes** - Automatically fetch your latest accepted LeetCode submission and create a formatted note with the problem statement, solution code, difficulty level, and topic tags
-   **Insert recent question** - Insert just the problem description into your current note
-   **Insert recent code** - Paste your latest accepted solution code into your editor
-   **Duplicate detection** - Prevents overwriting existing notes with the same problem title

## Setup

### Getting Your Credentials

1. Log in to [leetcode.com](https://leetcode.com) in Chrome
2. Open Developer Tools (F12)
3. Click **Application** tab
4. Expand **Storage → Cookies**
5. Copy the values for:
    - `csrftoken` → CSRF Token
    - `LEETCODE_SESSION` → LeetCode Session

### Configuring the Plugin

1. Configure your LeetCode credentials in **Settings → Community plugins → LeetCode Notes**:

    - Username
    - CSRF Token
    - LeetCode Session Cookie

2. Use the commands:
    - **Insert recent submission** - Creates a new note with full problem details and solution
    - **Insert recent question** - Adds problem description to active note
    - **Insert recent code** - Adds solution code to active note

## Notes

-   Only works with accepted submissions
-   Duplicates are detected by filename to prevent accidental overwrites
