'use strict';
/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <darktempler@gmail.com> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return Matt Labrum (-dt-)
 * ----------------------------------------------------------------------------
 */

var Translation = function(type) {
  type = type + '.xml';
  this.xml = w32Factory('Microsoft.XMLDOM');
  if (type.indexOf('.xml') === -1){ this.translationFile = type + '.xml'; }
  else { this.translationFile = type; }
  this.LoadTranslation();
}


Translation.prototype = {
  'xml' : false,
  'translationFile' : 'en.xml',
  'LanguageFolder' :  MsgPlus.ScriptFilesPath + '\\Lang\\',
  
  'GetAuthor' : function(){
    var author = this.xml.selectNodes('/Translation/Author');
    return (author.length != 0) ? author[0].text : 'Unknown';
  },
  
  'GetWebsite' : function(){
    var website = this.xml.selectNodes('/Translation/Website');
    return (website.length != 0) ? website[0].text : '';
  },
  
  'LoadTranslation' : function(){
     this.xml.load(this.LanguageFolder + this.translationFile);
    if(this.xml.parseError.errorCode){
      var p = this.xml.parseError;
      Debug.Trace('Error loading Translation: Error: ' + p.reason + ' (' + p.errorCode + ') ' + ' Line:' + p.line);
    }
  
  },
  
  'TranslationList' : function(){
    var fso = w32Factory('Scripting.FileSystemObject');
    var returns = [];
    for(var enume = new Enumerator(fso.GetFolder(this.LanguageFolder).Files);!enume.atEnd();enume.moveNext()){
    
      returns[returns.length] = String(enume.item()).match(/([^\\]*)\.xml$/)[1];
    }
    return returns;
  },
  
  'TranslateFile' : function(xmlFile){
    var filePath = xmlFile;
    var inter = w32Factory('Microsoft.XMLDOM');
    inter.load(filePath);
    
    var windows = this.xml.selectNodes('//Window');
    

    var wnd, id, twnd, controls, control, text, cControls, cElements, cColumns, cColumn, cControl, cElement, temp, title;
    for(var i=0;i<windows.length;i++){
      wnd = windows[i];
      id = wnd.getAttribute('Id');
      
      twnd = inter.selectNodes("//Window[@Id='" + id +"']");

      if(twnd.length == 1){
        twnd = twnd[0];
      
        
        if(temp = wnd.selectSingleNode('Caption')){
          title = twnd.selectSingleNode('Attributes/Caption');
          
          if(title){
            title.text = temp.text;
          }
        }
        
        if(temp = wnd.selectSingleNode('TitleBar')){
          title = twnd.selectSingleNode('TitleBar/Title/Text');
          if(title){
            title.text = temp.text;
          }
        }

        controls = wnd.selectNodes('Control');
        for(var x =0;x<controls.length;x++){
          control = controls[x];
          
          if(control.hasChildNodes){
            
            text = control.selectSingleNode('Caption');
            if(text){
              
              temp = twnd.selectSingleNode(".//Control[@Id='" + control.getAttribute('Id')+ "']/Caption");
              if(temp){
                temp.text = text.text;
              }else{
                Debug.Trace('no node found for' + ".//Control[@Id='" + control.getAttribute('Id')+ "']/Caption");
              }
            }


            text = control.selectSingleNode('Help');
            if(text){
              temp = twnd.selectSingleNode(".//Control[@Id='" + control.getAttribute('Id')+ "']/Help");
              if(temp){
                temp.text = text.text;
              }else{
                Debug.Trace('no node found for' + ".//Control[@Id='" + control.getAttribute('Id')+ "']/Help");
              }
            }
            cControls = control.selectNodes('Control');
            cElements = control.selectNodes('Element');

            cColumns  = control.selectNodes('Column');
            
            for(var y=0;y<cControls.length;y++){
              cControl = cControls[y];
              
              if(cControl.hasChildNodes){
                text = cControl.selectSingleNode('Caption');
                if(text){
                  temp = twnd.selectNodes(".//Control[@Id='" + control.getAttribute('Id')+ "']//Control[@Id='" + cControl.getAttribute('Id')+ "']/Caption");
                  for(var z=0;z<temp.length;z++){
                    temp[z].text = text.text;
                  }
                }
              }
            }
            
            for(var y=0;y<cElements.length;y++){
              cElement = cElements[y];
              if(cElement.hasChildNodes){
            
                text = cElement.selectSingleNode('Text');
                if(text){
                
                  temp = twnd.selectNodes(".//Control[@Id='" + control.getAttribute('Id')+ "']//Element[@Id='" + cElement.getAttribute('Id')+ "']/Text");
                  
                  for(var z=0;z<temp.length;z++){
                    temp[z].text = text.text;
                  }
                }
              }
            
            }

            for(var y=0;y<cColumns.length;y++){
              cColumn = cColumns[y];
              if(cColumn.hasChildNodes){
                text = cColumn.selectSingleNode('Label');
                if(text){
                  temp = twnd.selectNodes(".//Control[@Id='" + control.getAttribute('Id')+ "']//Column[ColumnId='" + cColumn.getAttribute('Id')+ "']/Label");
                  for(var z=0;z<temp.length;z++){
                    temp[z].text = text.text;
                  }
                }
              }
            }
            
          }
          
        
        }
        
      
      
      
      }else{
        continue;
      }
    }
    
    inter.save(filePath);
    return xmlFile;
  },
  
  
  'LoadWindow' : function(XmlFile,WindowId){
    var wnd = MsgPlus.CreateWnd(XmlFile, WindowId,1);
    var wndStrings = this.GetWindow(WindowId).ToObject();

    for(x in wndStrings){
      if(x == 'Caption'){
        Interop.Call('User32','SetWindowTextW',wnd.Handle, wndStrings[x]);
      }else if(x == 'Title'){
        //api call to change the title here
        //not a clue how to do this though... :P
      }else{
        wnd.SetControlText(x,wndStrings[x]);
      }
    }
    wnd.Visible = true;
    return wnd;
  },
  
  'GetMenu' : function(menuId){
    var menu = this.xml.selectNodes("/Translation/ScriptMenu[@Id='" + menuId + "']");
    return (menu.length != 0) ? new this.window(menu[0]) : false;
  },
  
  'GetWindow' : function(wndID){
    var wnd = this.xml.selectNodes("/Translation/Window[@Id='" + wndID + "']");
    return (wnd.length != 0) ? new this.window(wnd[0]) : false;
  },
  
  'GetSpecialString' : function(name){
    var elements = this.xml.selectNodes('/Translation/' + name);
    return (elements.length != 0) ? elements[0].text : false;
  },
  
  'GetMessages' : function(){
    var msg = this.xml.selectNodes('/Translation/Messages');
    return (msg.length != 0) ? new this.window(msg[0]) : false;
  },
  
  'Types' : function(){
    var msg = this.xml.selectNodes('/Translation/Types');
    return (msg.length != 0) ? new this.window(msg[0]) : false;
  }
}

Translation.prototype.window = function(windowObj){
  this.xml = windowObj;
}

Translation.prototype.window.prototype = {
  'GetString' : function(id){
    var str = this.xml.selectNodes("String[@Id='" + id + "']");
    return (str.length != 0) ? str[0].text : false;
  },
  
  'GetStringBundle' : function(id){
    var bundle = this.xml.selectNodes("StringBundle[@Id='" + id + "']");
    return (bundle.length != 0) ? new this.StringBundle(bundle[0]) : false;
  },
  
  'ToObject' : function(){
    var elements = this.xml.selectNodes('*');
    var returns = {};
    for(var i=0;i<elements.length;i++){
      if(elements[i].nodeType == 1){

        if(elements[i].tagName == 'String'){
          returns[elements[i].getAttribute('Id')] = elements[i].text;
        }else if(elements[i].tagName == 'StringBundle'){
          var bundle = new this.StringBundle(elements[i]);
          returns[elements[i].getAttribute('Id')] = bundle.GetDefault();
        }else{
          returns[elements[i].tagName] = elements[i].text;
        }
      }
    }
    return returns;
  },
  
  'StringBundle' : function(bundleObj){
    this.xml = bundleObj;
    
  }
}

Translation.prototype.window.prototype.StringBundle.prototype = {
  'ToObject' : function(){
    var nodes = this.xml.selectNodes('String');
    var returns = {};
    for(var i=0;i<nodes.length;i++){
      if(nodes[i].nodeType == 1){
        returns[nodes[i].getAttribute('Id')] = nodes[i].text;
      }
    }
    return returns;
  },
  
  'GetDefault' : function(){
    var str = this.xml.selectNodes('Default');
    return (str.length != 0) ? str[0].text : false;
  },
  
  'GetString' : function(id){
    var str = this.xml.selectNodes("String[@Id='" + id + "']");
    return (str.length != 0) ? str[0].text : false;
  }

}
