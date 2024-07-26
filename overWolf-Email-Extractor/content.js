(function() {
  let currentEmails = [];
  let allEmails = [];

  function escapeCSV(str) {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function extractEmails() {
    const bodyText = document.body.innerText;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = bodyText.match(emailRegex) || [];

    currentEmails = emails.filter(email => !currentEmails.includes(email));

    // Load previously stored allEmails
    chrome.storage.local.get(["allEmails"], (result) => {
      allEmails = result.allEmails ? result.allEmails.split(',').map(email => email.trim().replace(/^"|"$/g, '').replace(/""/g, '"')) : [];

      currentEmails.forEach(email => {
        if (!allEmails.includes(email)) {
          allEmails.push(email);
        }
      });

      chrome.storage.local.set({
        currentEmails: currentEmails.map(escapeCSV).join(',') + ',',
        allEmails: allEmails.map(escapeCSV).join(',') + ','
      });
    });
  }

  extractEmails();

  new MutationObserver(extractEmails).observe(document.body, {
    childList: true,
    subtree: true
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_emails") {
      sendResponse({
        currentEmails: currentEmails.map(escapeCSV).join(',') + ',',
        allEmails: allEmails.map(escapeCSV).join(',') + ','
      });
    }
  });
})();