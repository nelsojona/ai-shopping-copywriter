# AI Shopping Copywriter

"AI Copywriter for Google Shopping" is a Google Apps Script that automates product title and description generation using OpenAI. The script reads from a Google Sheets product feed, processes each product link with OpenAI, and writes back the results. It features customizable OpenAI prompts, scheduled runs, and smart timeout handling.

## Setting Up Google Merchant Center Product Feed

Before you start, you will need to create a product feed in Google Merchant Center. Here are the steps to do this:

1. Log in to your Google Merchant Center account.
2. Click on 'Products' in the dashboard, then select 'Feeds'.
3. Click the blue '+' button to create a new feed.
4. Follow the prompts to set up your feed. Choose 'Google Sheets' as your input method.

## Install

Now that you have your product feed, you can set up the script. Follow the steps below:

1. Open your product feed in Google Sheets.
2. Click on 'Extensions' > 'Apps Script'.
3. Delete any code in the script editor.
4. Copy the code from the "AI Copywriter for Google Shopping" script and paste it into the script editor.
5. Click on 'File' > 'Save'. Name your project.

## Google Sheets Configuration

- Ensure that columns B and C are named "Title" and "Description" respectively. These will be used for your product title and description.
- Column D should be named "Link". The script will not work without this column, as it will be used to generate the title and description using OpenAI.

## OpenAI Model Selection

- The script uses the OpenAI model to generate product details. You can update the model to any supported version, like GPT-4, depending on your needs.

## Google Apps Script Scheduling

- Set this script as a scheduled script in Google Apps Script.
  - Go to 'Edit' > 'Current Project's Triggers' in the script editor.
  - Click 'Add Trigger' at the bottom right.
  - Select the function to run, the deployment, the event source (time-driven), and the type and time of timing (for example, every 5 minutes).
- Note: The script will timeout after 6 minutes. If your feed is lengthy, it may take several cycles to finish.

## Script Properties and Memory Management

- The script stores results in memory using PropertiesService. To reset this:
  - Go to 'Project Settings' > 'Script Properties'.
  - Delete the "processedUrls" property and value.

## Spreadsheet ID

- Provide the ID of your Google Sheet for the variable `spreadsheetID`. The ID is found in the URL of the Google Sheet.

## Brand Details

- Fill out the `brandName` and `brandUrl` variables with your brand's name and website URL respectively.

## Custom Instructions

- The variables `instructionTitle` and `instructionDescription` can be updated to your liking. If you find a prompt that improves your results, we encourage you to share it.

Your feedback is important to us. If you have any suggestions for improvements, or encounter any issues, please let us know. Your input helps us make this tool better for everyone.
