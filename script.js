document.addEventListener("DOMContentLoaded", () => {
  // Function to check and display the current balance
  function checkCredit() {
    // API endpoint and request body for checking credit balance
    const url =
      "https://smsvas.vlserv.com/VLSMSPlatformResellerAPI/CheckCreditApi/api/CheckCredit";
    const body = JSON.stringify({
      UserName: "PineriumAPI",
      Password: "IeN;&Yt#b%",
    });

    // Fetch request to check credit balance
    fetch(url, {
      method: "POST",
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Balance Check Response:", data);
        if (data && data.Balance !== undefined) {
          updateBalanceDisplay(data.Balance);
        } else {
          console.error("No balance information found.");
          updateBalanceDisplay("Unable to fetch balance");
        }
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
        updateBalanceDisplay("Error fetching balance");
      });
  }

  // Function to update the balance display in the modal
  function updateBalanceDisplay(balance) {
    const balanceDisplay = document.getElementById("currentBalance");
    if (balanceDisplay) {
      balanceDisplay.textContent = `Current Balance: ${balance}`;
    } else {
      console.error("Balance display element not found.");
    }
  }

  // Event listener for modal open to fetch balance
  $("#smsModal").on("show.bs.modal", function () {
    checkCredit(); // Call the function to check balance when the modal opens
  });

  function sendSMS(phone, message) {
    const requestData = {
      UserName: "PineriumAPI",
      Password: "IeN;&Yt#b%",
      SMSText: message,
      SMSLang: "e",
      SMSSender: "Pinerium",
      SMSReceiver: phone,
      SMSID: uuidv4(),
    };

    const request = {
      url: "https://smsvas.vlserv.com/VLSMSPlatformResellerAPI/NewSendingAPI/api/SMSSender/SendSMS",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Send SMS Response:", data);
        if (data && data.success) {
          showNotification("SMS sent successfully!", "success");
        } else {
          showNotification("Failed to send SMS. Please try again.", "error");
        }
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
        showNotification("Error sending SMS. Please try again.", "error");
      });
  }

  function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16)
    );
  }

  function showNotification(message, type) {
    const notification = document.getElementById("notification");
    if (notification) {
      const alertType = type === "success" ? "alert-success" : "alert-danger";
      notification.innerHTML = `<div class="alert ${alertType}" role="alert">${message}</div>`;
    } else {
      console.error("Notification element not found.");
    }
  }

  // Populate contacts table
  const contacts = [
    { name: "Habiba Omran", phone: "+201273079322" },
    { name: "Habiba MD", phone: "+201019181011" },
  ];

  const contactsTable = document.getElementById("contactsTable");
  contacts.forEach((contact) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.phone}</td>
      <td>
        <button class="btn btn-primary send-sms-btn" data-phone="${contact.phone}" data-toggle="modal" data-target="#smsModal">Send SMS</button>
      </td>`;
    contactsTable.appendChild(row);
  });

  // Handle modal show event
  $("#smsModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget);
    const phone = button.data("phone");
    const modal = $(this);
    modal.find("#phoneNumber").text("Phone Number: " + phone);
  });

  // Event listener for the send button inside the modal
  const smsForm = document.getElementById("smsForm");
  if (smsForm) {
    smsForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission
      const phone = document
        .getElementById("phoneNumber")
        .textContent.replace("Phone Number: ", "");
      const messageElement = document.getElementById("messageBody");
      const message = messageElement ? messageElement.value : "";
      sendSMS(phone, message);
    });
  } else {
    console.error("SMS form element not found.");
  }

  // Initialize balance check
  checkCredit();
});
