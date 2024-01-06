# AI Shopping Copywriter

"AI Copywriter for Google Shopping" is a Google Apps Script that automates product title and description generation using OpenAI. The script reads from a Google Sheets product feed, processes each product link with OpenAI, and writes back the results. It features customizable OpenAI prompts, scheduled runs, and smart timeout handling. This script now includes additional support for Shopify using the InstaSheets app.

## For Shopify Users

### Requirements:

1. **Install InstaSheets**: Add the [InstaSheets app](https://apps.shopify.com/google-sheets-1) to your Shopify store to link your products with a Google Sheet.
2. **Google Sheet Template**: Copy the provided [Google Sheet template](https://docs.google.com/spreadsheets/d/1B3GQZbgD14ik_ZWO51M_ooAt0BwKShlHNYMrVLx2S4E/edit#gid=0). This will serve as the starting point for your product feed.
3. **Field Mapping**: In InstaSheets, map any additional fields you require to the corresponding columns in the Google Sheet Template.

### Setup:

Once InstaSheets is installed and your Google Sheet template is ready, ensure that the product data in Shopify corresponds correctly to the fields in the Google Sheet. This might include product titles, descriptions, URLs, and any other information the AI Copywriter will use.

## General Requirements

### OpenAI

1. Visit the [OpenAI](https://openai.com/blog/openai-api) website.
2. Sign up for an account if you don't already have one.
3. Navigate to the API section in your account settings.
4. Create a new API key and save it safely.

### Apify

1. Go to the [Apify](https://console.apify.com/sign-up) website.
2. Sign up for a new account if needed.
3. In your account settings, navigate to the API section.
4. Copy your new API key and save it for later use.

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

## Trigger for Automated Scheduling

Automate the running of your "AI Copywriter for Google Shopping" script with Google Apps Script Trigger to ensure your product feed is always up to date.

### How to Set Up Trigger:

1. In the Google Sheets menu, click on 'Extensions' > 'Apps Script'.
2. Navigate to 'Edit' > 'Current project's triggers' in the Apps Script editor.
3. Click on the '+ Add Trigger' button at the bottom-left corner of the page.
4. Make the following selections for your trigger:
   - Choose which function to run: `BatchProcessTest`
   - Choose which deployment should run: `Head`
   - Select event source: `Time-driven`
   - Then, choose the type of time-based trigger you want (e.g., Hour timer, Day timer, etc.) and set the frequency.

### Failure Notification Settings:

1. To stay informed about any issues with the scheduled script, configure failure notifications:
   - Click on the 'Failure notification settings' (usually represented by a bell icon).
   - Choose your preferred notification frequency, such as 'Notify me daily'.
   
By setting up these triggers, your script will run automatically, processing your Shopify-based Google Shopping Feed at regular intervals without any manual intervention. This ensures that any changes or additions to your product catalog are reflected promptly in your feed.

### Important Notes:

- The script execution has a timeout limit set by Google Apps Script, which is currently 6 minutes. If your feed processing exceeds this limit, consider splitting your feed or running the script more frequently in smaller batches to ensure all products are updated.
- Regularly review your script's execution logs to monitor for any errors or timeouts and adjust your scheduling or script logic as necessary.

## Feedback and Contributions

We're constantly looking to improve the functionality and user experience of the AI Shopping Copywriter. Your feedback is crucial, so if you have any suggestions for improvements, face any issues, or have found a custom prompt that works wonders, don't hesitate to reach out or post an issue in the repository. Together, we can make this tool even better for the community.

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

Your feedback is important to me. If you have any suggestions for improvements, or encounter any issues, please post an issue. Your input helps me us make this tool better for everyone.
