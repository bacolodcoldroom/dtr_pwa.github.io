function JBE_REPORT(dtl){
  // Create the content for the new HTML document
  var aaa='rep1.js';
  var htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New HTML Document</title>
      <script type='text/javascript'  src={aaa}></script>
  </head>
  <body>
      <!--h1><span id="aaa">Hello, this is a new HTML document!</span></h1>
      <p>You can add your content here.</p-->
      <div style="width:100%;height:100%;background:lightgray;">
        <div id="pa_prn" style="width:800px;height:100%;margin:0 auto;padding:5px;background:white;border:1px solid red;"></div>
      </div>    
  </body>
  </html>
  `;

  // Open the new HTML document in a new tab
  var newTab = window.open();
  newTab.document.write(htmlContent);
  newTab.document.getElementById('pa_prn').innerHTML=dtl;
  //newTab.mnu_repo();
  newTab.document.close();  
}
