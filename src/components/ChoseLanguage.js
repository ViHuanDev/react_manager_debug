'use strict';

import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { NavigationActions } from 'react-navigation'
import {
  StyleSheet,
  View,Text,Modal,TouchableOpacity,Dimensions,Image,AsyncStorage
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import {lang} from './languages/languages';
const {height,width} = Dimensions.get('screen');
class ChoseLanguage extends Component {
constructor(props) {
  super(props);
  this.state = {
  	loading: true,selectedIds:[],success: false,lang_load: false,_lang: lang.vi,
  };
};
componentWillMount() {
	// console.log(this.state._lang.vi.signout);
	var keyGet = ['@email:key','@password:key','@user_id:key','@token:key','@locale:key'];
  	AsyncStorage.multiGet(keyGet).then((value)=>{
  		// var item = value.map(function(i,v){
  		// 	console.log(i[1][1]);
  		// });
  		if(value[4][1]!=null){
  			// lang = value[4][1];
  			this.setState({
  				selectedIds: [value[4][1]],
  			}); 			
  			if(value[4][1]=='vi'){
  				this.setState({
  				lang_load: true,
  				_lang: lang.vi
  				});
  			}else{
  				this.setState({
  				lang_load: false,
  				_lang: lang.en
  				});
  			}
  		}
  	});
  	// console.log(this.state.selectedIds);
};
_onChangeLanguage(){
	this.setState({
		loading: !this.state.loading,
	});
  	// console.log(this.state.selectedIds[0]);
  	var keyGet = ['@email:key','@password:key','@user_id:key','@token:key'];
  	AsyncStorage.multiGet(keyGet).then((value)=>{
		if(value){
			const token = value[3][1];
			fetch('http://96.96.10.10/api/users/language/update'+'?token='+token,{
				"method": "PUT",
				headers:{
					"Accept":"application/json",
					"Content-Type":"application/json;charset=utf-8"
				},
				body: JSON.stringify({
					"languagedefault": this.state.selectedIds[0],
				})
			})
			.then((response)=>response.json()).then((responseJson) => {
				// console.log(responseJson);
				this.setState({
					success: !this.state.success,
					loading: !this.state.loading,
				});
				AsyncStorage.setItem('@locale:key',this.state.selectedIds[0]);
			}) .catch((error) => { 
				console.error(error); });
		};
	});
};
_onClose(){
	this.setState({
		success: !this.state.success,
	});
};
_renderButtonChange(){
	if(this.state.loading){
		return(
			<TouchableOpacity onPress={()=>{this._onChangeLanguage()}} style={[styles._button,styles._center]} >
							<Text style={styles._buttonText,{textAlign: 'center' }} >
							  	Save Change
							</Text>
			</TouchableOpacity>
		);
	}
	else{
		return (
				<View>
					<Image style={{width: width/10, height:  width/10,}}
					 	 source={require('../images/loading_green.gif')}/>
				</View>
		);
	}
};
_clickCheck(id){
	var temp = this.state.selectedIds;
	if(id=="vi"){
		if(temp.includes("en")){
			temp.splice(temp.indexOf("en"),1); //remove=1 with indexOf, add=0
			temp.push("vi"); //add id for array
		}
		this.setState({
			selectedIds: temp,
		});
		// console.log(this.state.selectedIds[0]);
	}
	else{
		if(temp.includes("vi")){
			temp.splice(temp.indexOf("vi"),1); //remove=1 with indexOf, add=0
			temp.push("en"); //add id for array
		}
		this.setState({
			selectedIds: temp,
		});
		// console.log(this.state.selectedIds[0]);
	}
};
  render() {
    return (
     	<View style={styles._row} >
     		<Modal
            animationType="slide"
            transparent={true}
            visible={this.state.success}
            onRequestClose={() => {alert("Modal has been closed.")}} >
              <View style={[styles._rowModal,styles._center]}>
                <View style={styles._itemsModal}>
                    <View style={[styles._headModal,styles._center]}>
                    	<Text>
                    	  	Update successful
                    	</Text>
                    </View>
                    <View style={[styles._footerModal,styles._center]}>
                        <TouchableOpacity onPress={()=>{this._onClose()}} style={[styles._button,{padding: 5}]} >
                          <Text style={styles._buttonText} >
                              Close
                          </Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>
       </Modal>
			<View style={styles._headChose}>
				<Text>
				  	Select Language
				</Text>
			</View>       
			<View style={styles._contentChose} >
					<View style={styles._itemChose}>
						<View style={[styles._boxLanguage,styles._center]} >
			                <CheckBox
			                	center
								isChecked={true}
								checked={this.state.selectedIds.includes("vi")?true:false}
								onPress={()=>this._clickCheck("vi")}
								checkedColor='blue'
								uncheckedColor='black'
								style={[styles._checkbox]}  />
			            </View>
						<View style={[styles._imageLanguage,styles._center]} >
							<Image
							  style={{}}
							  source={require('../../images/flags/vietnam.png')}
							/>		
						</View>
						<View style={styles._nameLanguage} >
						</View>
					</View>
					<View style={styles._itemChose}>
						<View style={[styles._boxLanguage,styles._center]} >
			                <CheckBox
			                 	center
								isChecked={false}
								checked={this.state.selectedIds.includes("en")?true:false}
								onPress={()=>this._clickCheck("en")}
								checkedColor='blue'
								uncheckedColor='black'
								style={styles._checkbox} />
			            </View>
						<View style={[styles._imageLanguage,styles._center]} >
							<Image
							  style={{}}
							  source={require('../../images/flags/english.png')}
							/>
						</View>
						<View style={styles._nameLanguage} >
			                    
						</View>
					</View>
					<View style={[styles._itemChose,styles._center]}>
						{this._renderButtonChange()}
					</View>
			</View>
     	</View>
    );
  }
}
const styles = StyleSheet.create({
_center:{
	justifyContent: 'center',
	alignItems: 'center',  
},
_row:{
	flex: 1,
	flexDirection: 'column',
	backgroundColor: 'rgba(255,255,255,0.5)', 
},
_rowModal:{
	flex:1,
	backgroundColor: 'rgba(0,0,0,0.3)',
	paddingHorizontal: 15,
},
_itemsModal:{
	height: height/5,
	backgroundColor: 'white',
	borderRadius: 10,
	width: width-30,
},
_headModal:{
	flex: 0.7,
},
_footerModal:{
	flex: 0.3,
},
_headChose:{
	flex: 0.1,

},
_contentChose:{
	flex:0.9,
	// backgroundColor: 'rgba(0,125,0,0.8)',
},
_itemChose:{
	height: height/13,
	borderRadius: 5,
	flexDirection: 'row',
	backgroundColor: 'white',
	marginVertical: 5,
	padding: 5,
},
_boxLanguage:{
	flex:0.1,

},
_imageLanguage:{
	flex: 0.3,
},
_nameLanguage:{
	flex: 0.6,
},
_checkbox:{
	backgroundColor: 'rgba(255,255,255,0)',
	paddingLeft: 20,
},
_imgFlag:{
	height: height/10,
	alignSelf: 'stretch',
	// resizeMode: Image.resizeMode.center, 
},
_button:{
  	borderRadius: 5,
  	borderWidth: 1,
  	borderColor: 'green',
  	backgroundColor: 'rgba(192,192,192,0.2)',
  	padding: 10,
  },
_buttonText:{
  	fontSize: 15,
  	color: 'black',
  },
});
export default ChoseLanguage;