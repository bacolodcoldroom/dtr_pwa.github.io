function mnu_repo(){  
  var jmenu=  
  '<div style="width:100%;height:100%;">'+
    '<div onclick="JBE_PRINTDIV(&quot;printableArea&quot;,&quot;REPORT&quot;)" style="float:left;width:20%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jprn.png" alt="call image" />'+
        '<span>Front</span>'+
      '</div>'+
    '</div>'+       
    '<div onclick="print_back()" style="float:left;width:20%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jprn.png" alt="call image" />'+
        '<span>Back</span>'+
      '</div>'+
    '</div>'+       
    '<div onclick="JBE_PRINT_PDF(&quot;printableArea&quot;,&quot;REPORT&quot;)" style="float:left;width:20%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jpdf.png" alt="call image" />'+
        '<span>PDF</span>'+
      '</div>'+
    '</div>'+       
    /*
    '<div onclick="get_app_default();snackBar(&quot;Refreshed...&quot;)" style="float:left;width:20%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jrefresh.png" alt="call image" />'+
        '<span>Refresh</span>'+
      '</div>'+
    '</div>'+       
    */
    '<div onclick="showMainPage()" style="float:right;width:20%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jclose.png"  alt="home image" />'+
        '<span>Close</span>'+
      '</div>'+
    '</div>'+
  '</div>';
  dispMenu(false,jmenu);  
}

function mnu_repo2(){  
  var jmenu=  
  '<div style="width:100%;height:100%;">'+
    '<div onclick="JBE_PRINTDIV(&quot;printableArea2&quot;,&quot;REPORT&quot;)" style="float:left;width:20%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jprn.png" alt="call image" />'+
        '<span>Print</span>'+
      '</div>'+
    '</div>'+       
    /*
    '<div onclick="print_back()" style="float:left;width:20%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jprn.png" alt="call image" />'+
        '<span>Back</span>'+
      '</div>'+
    '</div>'+       
    '<div onclick="JBE_PRINT_PDF(&quot;printableArea&quot;,&quot;REPORT&quot;)" style="float:left;width:20%;height:100%;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jpdf.png" alt="call image" />'+
        '<span>PDF</span>'+
      '</div>'+
    '</div>'+       
    /*
    '<div onclick="get_app_default();snackBar(&quot;Refreshed...&quot;)" style="float:left;width:20%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jrefresh.png" alt="call image" />'+
        '<span>Refresh</span>'+
      '</div>'+
    '</div>'+       
    */
    '<div onclick="closeREPO2()" style="float:right;width:20%;height:100%;background:none;">'+
      '<div class="class_footer">'+
        '<img src="gfx/jclose.png"  alt="home image" />'+
        '<span>Close</span>'+
      '</div>'+
    '</div>'+
  '</div>';
  dispMenu(false,jmenu);  
}

function closeREPO2(){
  mnu_repo();
  JBE_CLOSE_VIEW();
  
  return true;
}
