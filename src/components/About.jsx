// About.js
const About = ({ YAnalisysVersion }) => {
    const width = 600;
    const height = 480;
    const left = (window.outerWidth / 2) + window.screenX - (width / 2);
    const top = (window.outerHeight / 2) + window.screenY - (height / 2);
    const aboutWindow = window.open(
      '',
      'About Y Analysis',
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars=yes`
    );
  
    aboutWindow.document.write(`
      <html>
        <head>
          <title>About Y Analysis</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #2c3e50; color: #ecf0f1; padding: 20px; margin: 0; box-sizing: border-box; }
            h1 { color: #ecf0f1; font-size: 24px; margin-bottom: 10px; }
            p { color: #bdc3c7; font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
            .footer { color: #ecf0f1; font-size: 14px; text-align: center; margin-top: 20px; border-top: 1px solid #7f8c8d; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>About Y Analysis</h1>
          <p>Y Analysis is a cutting-edge financial tool designed to empower users with state-of-the-art market analysis, AI-driven insights, and real-time internet research.</p>
          <p>Our platform leverages advanced artificial intelligence algorithms to provide deep market analysis, enabling users to build and manage portfolios with precision.</p>
          <p>With Y Analysis, you can engage with portfolios using the latest research tools, drawing on real-time data to make informed trading decisions in a dynamic market environment.</p>
          <p>Version: ${YAnalisysVersion}</p>
          <p>Developed by: Y</p>
          <div class="footer">&copy; 2024 Y Analysis. All rights reserved.</div>
        </body>
      </html>
    `);
  };
  
  export default About;