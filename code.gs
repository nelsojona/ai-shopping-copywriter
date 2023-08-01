// v1.0 Google Sheets Copywriter for Google Shopping Feed by Jonathan Nelson
// Requirements: Apify API key, OpenAI API key

// Configuration area for APIs - replace with your own keys
var apifyConfig = {
  apiKey: "your-apify-api-key",
  apiUrl: "https://api.apify.com/v2/acts/drobnikj~extended-gpt-scraper/runs?token="
};

var openAIKey = "your-openai-api-key";
var spreadsheetId = "your-google-sheet-id";
var brandName = "Your Brand Name";
var brandUrl = "https://www.your-brand-url.com";

function BatchProcessTest() {
  // funcName must equal the function name we're using for batch processing, in this case, 'generateText'.
  const funcName = 'generateText';
  
  // We retrieve the index from the ScriptProperties, it represents where we left off in the batch processing.
  // If it's the first time running the script, or if we finished the batch, it will be null, so we set it to 0.
  let startIndex = PropertiesService.getScriptProperties().getProperty(funcName);
  startIndex = startIndex ? parseInt(startIndex) : 0;
  
  // If it's the first time running the script, we log the start of the batch process.
  if (startIndex === 0) {
    Logger.log('--- BatchProcessTest command started. ---');
  }

  try {
    // We start our batch process, which will only run once for this script.
    for (let i = startIndex; i < 1; i++) {
      Logger.log('Processing: ' + i);

      // We call our main function, generateText()
      generateText();

      Logger.log('Processing Done!: ' + i);

      // We save our progress by setting the index in the ScriptProperties. This is especially useful if our batch process has to stop prematurely.
      // Next time we run the script, it will continue from where it left off.
      PropertiesService.getScriptProperties().setProperty(funcName, i + 1);
    }
  }
  catch (e) {
    // If there is any error in the script, we log the error message.
    Logger.log(e);
  }
  finally {
    // After the loop, whether it finished successfully or an error was thrown, we check if the batch process is done.
    const finished = PropertiesService.getScriptProperties().getProperty(funcName) == '1';
    
    // If the batch process is finished, we log the completion of the command and delete the property, so next time we start from 0.
    if (finished) {
      Logger.log('--- BatchProcessTest command finished. ---');
      PropertiesService.getScriptProperties().deleteProperty(funcName);
    }
  }
}

// This is the main function that initiates the script
function main() {
  const funcName = 'generateText';
  // Get the starting index for processing
  let startIndex = PropertiesService.getScriptProperties().getProperty(funcName);
  startIndex = startIndex ? parseInt(startIndex) : 0;

  if (startIndex === 0) {
    console.log('--- Command started. ---');
  }

  // Loop for processing text generation
  for (let i = startIndex; i < 1; i++) {
    console.log('Processing: ' + i);
    generateText();
    console.log('Processing Done!: ' + i);
    // Update the script properties with the new index
    PropertiesService.getScriptProperties().setProperty(funcName, i + 1);
  }

  // Check if the processing is finished
  const finished = PropertiesService.getScriptProperties().getProperty(funcName) == '1';
  if (finished) {
    console.log('--- Command finished. ---');
    // Delete the property if processing is finished
    PropertiesService.getScriptProperties().deleteProperty(funcName);
  }
}

// Create an object to store processed URLs. If it does not exist yet, initialize as an empty object.
let processedUrls = JSON.parse(PropertiesService.getScriptProperties().getProperty('processedUrls')) || {};

// Function to sanitize output
function sanitizeOutput(output) {
  return output.replace(/['"]+/g, ''); // This will remove all single and double quotes from the output
}

// Function to generate text based on the data in Google Sheet
function generateText() {
  // Open the Google Sheet and get the data
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1'); 
  var data = sheet.getDataRange().getValues(); 

  // Loop through each row of the sheet
  for (var i = 1; i < data.length; i++) {
    // Get the URL and brand from the row
    var url = data[i][3].trim();
    var brand = data[i][8];

    // We are now checking if the URL has been processed already. 
    // If it has not, then we continue processing it. If it has been processed already, then we skip to the next iteration of the loop.
    if (!processedUrls[url]) {
      // Mark the URL as processed. This will prevent the script from processing the same URL again in the future.
      processedUrls[url] = true;
      
      // Update the 'processedUrls' property in the script properties. 
      // We are converting the 'processedUrls' object to a string since the script properties can only store strings.
      PropertiesService.getScriptProperties().setProperty('processedUrls', JSON.stringify(processedUrls));

      // Get the cell for title and description
      var titleCell = sheet.getRange(i + 1, 2);
      var descriptionCell = sheet.getRange(i + 1, 3);

      // If the URL is present and the title and description cells are blank, generate the text
      if (url && titleCell.isBlank() && descriptionCell.isBlank()) {
        // Set instructions for the text generation
        var instructionTitle = "Generate a Google Shopping product title within 1-150 characters, in the format: [Product Name] - [Item Category] - [Item Sub-Category] - [Item Sub-Sub-Category] | " + brand + ". Use professional language and correct grammar. Avoid all caps, quotes, lists, symbols, HTML tags, promotional text, foreign words not widely understood, foreign characters for attention-grabbing, capital letters for emphasis, promotional details such as price or sale information, and extra white spaces. Capitalization is acceptable for abbreviations, phone numbers, countries, and currency. Aim for an SEO-optimized and semantically accurate title.";

        var instructionDescription = "Generate a 1-500 character SEO-friendly description for each product under the specified brand " + brand + " for Google Shopping. Highlight key product features without discussing compatibility or comparisons. Use professional, grammatically correct language and appropriate keywords for SEO. Avoid using all caps, quotes, lists, symbols, promotional text, foreign languages or characters not relevant to the product. Symbols, when necessary in XML or JSON, should use XML entities or escape characters. Don't refer to categorization systems or include links other than the product landing page via the link attribute. Avoid promotional information; each product should have its unique description for optimal SEO and Google Shopping performance.";
        
        // Scrape the title and description from the website
        var scrapedTitle = scrapeWithCURL(url, "title", instructionTitle);
        var scrapedDescription = scrapeWithCURL(url, "description", instructionDescription);
        
        // Sanitize the scraped title and description
        if (scrapedTitle && scrapedTitle.title) {
          var sanitizedTitle = sanitizeOutput(scrapedTitle.title);
          titleCell.setValue(sanitizedTitle);
        }
        if (scrapedDescription && scrapedDescription.description) {
          var sanitizedDescription = sanitizeOutput(scrapedDescription.description);
          descriptionCell.setValue(sanitizedDescription);
        }
      }
    }
  }
}

// Function to scrape website data using CURL
// @param {string} url - URL of the page to scrape
// @param {string} attribute - Attribute to scrape (e.g., "title" or "description")
// @param {string} instruction - Instruction for the scraper
// @return {object|null} - Object containing the scraped data, or null if an error occurred or no data was found
function scrapeWithCURL(url, attribute, instruction) {
  // Regular expression to check if the URL is valid
  var regex = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  if(!regex.test(url)) {
    throw new Error('Invalid URL: ' + url);
  }

  var apiUrl = apifyConfig.apiUrl + apifyConfig.apiKey;

  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    'method' : 'post',
    'headers': headers,
    'payload' : JSON.stringify({
      "openaiApiKey": openAIKey,
      "startUrls": [
        {
          "url": url
        }
      ],
      "globs": [],
      "linkSelector": "a[href]",
      "instructions": instruction,
      "model": "gpt-4",
      "maxCrawlingDepth": 1,
      "maxPagesPerCrawl": 1,
      "schema": {
        "type": "object",
        "properties": {
          [attribute]: {
            "type": "string",
            "description": "Page " + attribute
          }
        },
        "required": [
          attribute
        ]
      },
      "proxyConfiguration": {
        "useApifyProxy": true
      }
    })
  };

  var response = UrlFetchApp.fetch(apiUrl, options);
  var runJson = JSON.parse(response.getContentText());

  console.log("Response from initial fetch: " + JSON.stringify(runJson));

  var runId = runJson.data.id;
  var taskUrl = 'https://api.apify.com/v2/actor-runs/' + runId + '?token=' + apifyConfig.apiKey;

  while (true) {
    Utilities.sleep(1000);

    var runResponse = UrlFetchApp.fetch(taskUrl);
    runJson = JSON.parse(runResponse.getContentText());

    console.log("Response from checking run status: " + JSON.stringify(runJson));

    if (runJson.data.status == 'SUCCEEDED') {
      var datasetUrl = 'https://api.apify.com/v2/datasets/' + runJson.data.defaultDatasetId + '/items?token=' + apifyConfig.apiKey;
      var dataResponse = UrlFetchApp.fetch(datasetUrl);
      var dataJson = JSON.parse(dataResponse.getContentText());

      console.log("Response from fetching dataset: " + JSON.stringify(dataJson));

      if (dataJson && dataJson.length > 0) {
        return {
          [attribute]: dataJson[0].answer
        };
      }
      else {
        return null;
      }
    }
    else if (runJson.data.status == 'FAILED') {
      return null;
    }
  }
}
