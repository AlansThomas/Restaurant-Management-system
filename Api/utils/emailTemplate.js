// emailTemplate.js

const emailTemplate = `
  <!DOCTYPE html>
  <html>

  <head>
      <title>Welcome to Wanderlust Tours</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
          }
  
          .header {
              background-color: #f9f9f9;
              padding: 20px;
              text-align: center;
          }
  
          h2 {
              color: #333333;
              margin-bottom: 10px;
          }
  
          .content {
              padding: 20px;
              text-align: left; /* Align the text to the left */
              max-width: 600px; /* Set a maximum width to control the layout */
              margin: 0 auto; /* Center the content horizontally */
          }
  
          .content p {
              margin: 10px 0; /* Add margin to separate paragraphs */
          }
  
          .content .highlight {
              font-weight: bold;
          }
  
          .button {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin-top: 20px;
              display: block; /* Make the button full-width */
              max-width: 200px; /* Set a maximum width for the button */
              margin: 20px auto; /* Center the button horizontally */
              text-align: center;
          }
      </style>
  </head>
  
  <body>
      <div class="header">
          <h2>Shop Registered Successfully</h2>
      </div>
      <div class="content">
          <p>Hi,</p>
          <p>We are thrilled to welcome you to the Restaurant Management family as the administrator for your shop. Below are your login details:</p>
  
          <p class="highlight">Email ID: {{email}}</p>
          <p class="highlight">Password: {{password}}</p>
          
          <p>Please use the provided login credentials to access your administrator account on our platform. Once logged in, you can manage your shop.</p>
          <p>Thank you for choosing Restaurant Management System.</p>
          <p>Best regards,</p>
          <p>The Restaurant Management Team</p>
      </div>
  </body>
  
  </html>
`;

const userRegEmailTemp = `
<!DOCTYPE html>
<html>

<head>
    <title>Welcome to Restaurant</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f2f2f2;
    }

    .header {
        background-image: linear-gradient(to right, #ff7f50, #ff4c29);
        padding: 25px;
        text-align: center;
        color: #ffffff;
        border-radius: 0 0 50% 50%;
        position: relative;
    }

    h2 {
        font-size: 48px;
        font-family: 'Google Sans';
    }

    .content {
            padding: 20px;
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .content p {
            margin: 10px 0;
            line-height: 1.6;
    }


    .special-offer {
            background-color: #ffefc4;
            padding: 10px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
    }
    .icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            margin-right: 10px;
            background-color: #ffac33;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            color: #fff;
            font-size: 20px;
    }



    </style>
</head>

<body>
    <div class="header">
        <h2 >Welcome to our family</h2>
    </div>
    <div class="content">
        <p >Hi, <strong>{{username}}</strong>!</p>
        <p>Congratulations! 🎉 You have successfully joined the Restaurant Management family.</p>

        <p >Thank you for choosing Restaurant Management System.</p>
        <p >As a token of our appreciation, we have a special first-time welcome offer for you:</p>

        <div class="special-offer ">
            <p><span class="icon">&#x1F60D;</span><strong>Get 20% off on your first meal at our restaurant!</strong></p>
        </div>

        <p >We can't wait to serve you and make your dining experience memorable.</p>
        <p >Best regards,</p>
        <p >The Restaurant Management Team</p>
    </div>
</body>

</html>



`;

module.exports = { emailTemplate, userRegEmailTemp }