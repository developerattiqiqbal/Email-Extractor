function updateEmails() {
  chrome.storage.local.get(["allEmails"], (result) => {
    const emailsArray = result.allEmails ? result.allEmails.split(',').map(email => email.trim().replace(/^"|"$/g, '').replace(/""/g, '"')).filter(Boolean) : [];
    const csvContent = emailsArray.map(email => email + ',').join('\n');
    document.getElementById("allEmailsContent").value = csvContent;
  });
}

function clearEmails() {
  chrome.storage.local.set({ allEmails: '', currentEmails: '' }, () => {
    document.getElementById("allEmailsContent").value = '';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  updateEmails();
  
  document.getElementById('clearButton').addEventListener('click', clearEmails);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "get_emails" }, (response) => {
      if (response) {
        const emailsArray = response.allEmails.split(',').map(email => email.trim().replace(/^"|"$/g, '').replace(/""/g, '"')).filter(Boolean);
        const csvContent = emailsArray.map(email => email + ',').join('\n');
        document.getElementById("allEmailsContent").value = csvContent;
      }
    });
  });
});