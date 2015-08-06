/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = React;

var url = "http://ios3.app.i4.cn/getNoticeList.xhtml?toolversion=520&model=iPhone7,1&pageno=1&idfa=149DD67B-A5BB-4EE8-A83E-BE91EBE7ECE4&idfv=1C1D819E-5D0D-4059-83A5-AB1E6F9B7C2D&openudid=667ee68f513ddd228edfc1c0eeab5f008dbb4733&osversion=8.1.3&udid=(null)&macaddress=020000000000&model=iPhone7,1&certificateid=0&bundleid=0&isAuth=1&isjail=0&authtime=1431077211&serialnumber=C39N9422G5QR&cid=200025&toolversion=520"

var DOMParser = require('xmldom').DOMParser

var AisiAnnounce = React.createClass({ 

  getInitialState: function() {
    return {
      datasource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => {console.log("row1 :" + row1.height + "row 2:" + row2.height);  return true},
      }),
      expanedCell:[],
      data:[],
    };
  },

  componentDidMount: function(){
    this.getAnnounces();
  }, 
  
  getAnnounces: function() {
      console.log("start request") 
      fetch(url).then(response => response.text()).then(responseText => {
	var results = new Array()
	var parser = new DOMParser()
	var doc = parser.parseFromString(responseText,"text/xml").documentElement
	var listNode = doc.getElementsByTagName("noticelist")[0]
	var list = listNode.getElementsByTagName("notice")
	for(var i=0;i<list.length;i++)
	{
	   var announce = new Object()
	   var emElement = list.item(i)
	   announce.title = emElement.getElementsByTagName("title")[0].firstChild.data
	   announce.time = emElement.getElementsByTagName("time")[0].firstChild.data
	   announce.detail = emElement.getElementsByTagName("detail")[0].firstChild.data
	   announce.height=0
           
	   results[i]=announce
	}
        this.state.data= results;
	this.setState({
	  datasource: this.state.datasource.cloneWithRows(results),
	})
      });     
  }, 

  rowClick: function(announce){
    var selectedCells = this.state.expanedCell
    if(announce.height==1) 
    {
       selectedCells.pop(announce) 
       announce.height =0;
       this.setState({
          datasource: this.state.datasource.cloneWithRows(this.state.data),
	  rowViewExpaned:selectedCells,
       });
    }
    else
    {
      selectedCells.push(announce)
       announce.height=1
       this.setState({
           datasource: this.state.datasource.cloneWithRows(this.state.data),
	  rowViewExpaned:selectedCells,
       });
    }
  },


  rowStyle: function(announce){
    if(announce.height==1) 
      return styles.rowViewExpaned
    else 
      return styles.rowView
  },

  renderListRow: function(announce){
	return (
            <TouchableHighlight onPress={()=>{this.rowClick(announce)}}>
	      <View>
	        <View  style={this.rowStyle(announce)} ref='Name'>
		  <Text style={styles.title}>{announce.title}</Text>
		  <Text style={styles.time}>{announce.time}</Text>
		  <Text style={styles.detail}>{announce.detail}</Text>
		</View>
		<View style={styles.seprator}/>
	       </View>
	    </TouchableHighlight>
	);
  },

  render: function() {
    return (
     <ListView style={styles.container}
        dataSource={this.state.datasource}
        renderRow={this.renderListRow}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  rowView:{ 
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    height:45,
    overflow:'hidden',
  },
  rowViewExpaned:
  {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  title:{ 
    paddingTop:5,
    fontSize:14,
    height:25,
  },
  time:{ 
    height:20,
    fontSize:12,
  },
  detail:{
    fontSize:12,
    paddingBottom:10,
  },
  seprator:{
    backgroundColor: '#eeeeee',
    height:10,
    paddingBottom:5,
  },

});

AppRegistry.registerComponent('AisiAnnounce', () => AisiAnnounce);
