import React, { Component } from 'react';
import {View,Text,FlatList,AsyncStorage,Dimensions,Modal,Image,Picker,TextInput,
	StyleSheet,ScrollView,TouchableOpacity} from 'react-native';
// import CheckBox from 'react-native-checkbox';
import { Icon } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import PopoverTooltip from 'react-native-popover-tooltip';
import {lang} from './languages/languages';
import {URL_HOME,normalize} from '../config';
const MIN_HEIGHT = 20;
const MAX_HEIGHT = 40;
class ListFaQ extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id_faq: this.props.navigation.state.params.id,isLoading:true,
			array_faq: [], page:0,isLoadding: true,count:0,checkItem: true, color:'blue',
			selectedIds:[],array_status: [],_modal: false,_idClick:'',array_id:[],array_local:[],
			comment:'',_langid:'',_lang: lang,_mComment:false,array_comment:[],_showCmt:true,_mChildComment: false,
			_idComment:[],_idChildComment:[],
		};
	};
// _keyExtractor = (item, index) => index;
componentWillMount() {
	// console.log(normalize+'font-size');
	//checklists/id_check?token
	AsyncStorage.getAllKeys((err, keys) => { 
          AsyncStorage.multiGet(keys).then((value)=>{
          	console.log(value);
          	this.setState({
          		_langid: value[1][1]=='vi'?true:false,
          	});
        	fetch('http://96.96.10.10/api/checklists/'+this.state.id_faq+'?token='+value[3][1]).then((response) => 
				response.json()) .then((responseJson) => { 
					this.setState({
						array_faq: responseJson.data,
					});
					// console.log(this.state.array_faq);
				}) .catch((error) => { 
					console.error(error); 
			});
			fetch('http://96.96.10.10/api/chkitemstatus?token='+value[3][1]).then((response) => 
				response.json()).then((responseJson)=>{ 
					// console.log(responseJson);
					this.setState({
						isLoading: false,
						array_status: responseJson,
						});
					// console.log(this.state.array_status);
				}) .catch((error) => { 
					console.error(error); 
				});  
          });
    }); 
};
_onCommentChange(text){
		this.setState({
			comment: text,
		});
};
_onPressComment(el){
	this.setState({
		_idClick: el,
		_mComment: true,
		isLoading: false,
	});
	var  id= el;
	var id_checklist = this.state.id_faq;
	AsyncStorage.getAllKeys((err, keys) => { 
          AsyncStorage.multiGet(keys).then((value)=>{
          	console.log(value);
          	this.setState({
          		_langid: value[1][1]=='vi'?true:false,
          	});
        	fetch(URL_HOME+'/api/comments?token='+value[3][1]+'&checklist_id='+id_checklist+'&id='+id).
        	then((response)=> response.json()).then((responseJson)=>{
        		console.log(responseJson);
				this.setState({
					array_comment: responseJson,
				});
					for(let i =0;i<responseJson.length;i++){
							console.log(responseJson[i].user.fullname);
							console.log('----'+responseJson[i].content);
					}
			}).catch((error)=>{	
				console.log(error);
			});
          });
    });
};
_closeComment(){
	this.setState({
		_mComment: false,
	});
};
_showRepComment(){
	this.setState({
		_showCmt: !this.state._showCmt,
	});
};
_showChildComment(el){
	console.log(this.state._idChildComment+'id===='+el);
	this.setState({
		_mChildComment: !this.state._mChildComment,
		_idChildComment: el,
	});
};
_renderChildComment(){
	var arr = this.state.array_comment;
	// console.log(this.state._idChildComment+"asdad");
	// console.log(arr);
	var temp = [];
	temp.push(
		<View key={'childcontent'+123} style={[styles._mChildComment,{display: 'flex'}]}>
			<View style={styles._mChildUser}>
				<Icon type='font-awesome' color='#F6F7F9' name='user-circle' size={20} />
			</View>
			<View style={styles._mChildContent}>
					<Text>
					  	{arr[0].content}
					</Text>
					<View style={styles._mChildActions}>
						<TouchableOpacity>
							<Text style={[styles._editChildComment,styles.font_size]}>
							  	Sửa
							</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={[styles._delChildComment,styles.font_size]}>
							  	Xóa
							</Text>
						</TouchableOpacity>
					</View>
			</View>
		</View>
	);
	return temp;
}
_renderComment(){
	var arr = this.state.array_comment;
	var temp = [];
	for(let i=0;i<arr.length;i++){
	    temp.push(
	    	<View key={"Comment"+arr[i].id} style={styles._mItemsComment}>
				<View style={[styles._mitemUser,{justifyContent: 'flex-start'}]}>
					<Icon type='font-awesome' color='#F6F7F9' name='user-circle' size={((width-30)/9)} />
				</View>
				<View style={styles._mitemContent}>
					<View style={styles._itemText}>
						<Text style={[styles.font_size,{fontWeight: 'bold',textAlign: 'left'  }]} >
						  	{arr[i].user.fullname} 
						</Text>
					</View>
					<View style={styles._itemText}>
						<View style={styles._mItemText}>
							<TouchableOpacity onPress={()=>{this._showChildComment(arr[i].checklist_chkitem_id)}}>
								<Text>
								  	{arr[i].content}
								</Text>
							</TouchableOpacity>
						</View>
						{arr[i].child.length>0?this._renderChildComment(arr[i].child):<Text>Null</Text>}
					</View>
					<View style={styles._textActions}>
						<TouchableOpacity onPress={()=>{this._showRepComment()}} >
							<Text style={[styles._repComment,styles.font_size]}>
							  	Trả lời
							</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={[styles._editComment,styles.font_size]}>
							  	Sửa
							</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={[styles._delComment,styles.font_size]}>
							  	Xóa
							</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles._actionRepComment,{display: this.state._showCmt?'none':'flex' }]}>
						<View style={[styles._repUser,styles._center]}>
							<Icon type='font-awesome' color='#F6F7F9' name='user-circle' size={15} />
						</View>
						<View style={styles._repTextInput}>
							<TextInput style={{borderWidth: 0.3,borderRadius: 3,fontSize: 10,height: 20,paddingTop: 2,paddingBottom: 2}}
								multiline={true}
								underlineColorAndroid='transparent'>
							</TextInput>
						</View>
						<View style={[styles._repActions,styles._center]}>
							<TouchableOpacity style={{ paddingHorizontal: 1 }} ><Text style={{fontSize:9, color: 'black' }} >Cancel</Text></TouchableOpacity>
							<TouchableOpacity style={{ paddingHorizontal: 1 }} ><Text style={{fontSize:9, color: 'black'}} >Save</Text></TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
	    );
	}
	return temp;
};
_onPressAction(el){
	this.setState({
		_modal: true,
		_idClick: el,
	});
	// console.log(this.state.array_local);
}
_closeStatus(){
	this.setState({
		_modal: !this.state._modal,
	});
	// console.log(this.state.array_local);
}
_renderStatus(id){
	if(this.state.array_local.length>0){
		for(let i=1;i<=12;i++){
			if(this.state.array_local.includes(id+'-'+i)){
			if(i==1||i==2){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.satis:this.state._lang.en.satis}
						</Text>
					);
				}
				else if(i==3||i==4){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.non_satis:this.state._lang.en.non_satis}
						</Text>
					);
				}
				else if(i==5||i==6){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.finding:this.state._lang.en.finding}
						</Text>
					);
				}
				else if(i==7||i==8){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.observation:this.state._lang.en.observation}
						</Text>
					);
				}
				else if(i==9||i==10){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.comment:this.state._lang.en.comment}
						</Text>
					);
				}
				else{
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.not_appli:this.state._lang.en.not_appli}
						</Text>
					);
				}
			}
		}
	}
	else{
		for(let i=1;i<=12;i++){
			if(this.state.array_id.includes(id+'-'+i)){
			if(i==1||i==2){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.satis:this.state._lang.en.satis}
						</Text>
					);
				}
				else if(i==3||i==4){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.non_satis:this.state._lang.en.non_satis}
						</Text>
					);
				}
				else if(i==5||i==6){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.finding:this.state._lang.en.finding}
						</Text>
					);
				}
				else if(i==7||i==8){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.observation:this.state._lang.en.observation}
						</Text>
					);
				}
				else if(i==9||i==10){
					return(
						<Text style={[styles._text,styles._textCenter]}>
							{this.state._langid?this.state._lang.vi.comment:this.state._lang.en.comment}
						</Text>
					);
				}
				else{
					return(
						<Text style={styles._text}>
							{this.state._langid?this.state._lang.vi.not_appli:this.state._lang.en.not_appli}
						</Text>
					);
				}
			}
		}	}
}
_renderIconStatus(id){
	if(this.state.array_local.length>0){
		for(let i=1;i<=12;i++){
			if(this.state.array_local.includes(id+'-'+i)){
			if(i==1||i==2){
					return(
						<Icon type='material-icons' color='#4F81F0'  name='star' size={height/30} />
					);
				}
				else if(i==3||i==4){
					return(
						<Icon type='material-icons' color='#9DD182' name='star' size={height/30} />
					);
				}
				else if(i==5||i==6){
					return(
						<Icon type='material-icons' color='#F0C751' name='star' size={height/30} />
					);
				}
				else if(i==7||i==8){
					return(
						<Icon type='material-icons' color='#67CCF2' name='star' size={height/30} />
					);
				}
				else if(i==9||i==10){
					return(
						<Icon type='material-icons' color='#D67A63' name='star' size={height/30} />
					);
				}
				else{
					return(
						<Icon type='material-icons' color='black' name='star' size={height/30} />
					);
				}
			}
		}
	}
	else{
		for(let i=1;i<=12;i++){
			if(this.state.array_id.includes(id+'-'+i)){
			if(i==1||i==2){
					return(
						<Icon type='material-icons' color='#4F81F0'  name='star' size={height/30} />
					);
				}
				else if(i==3||i==4){
					return(
						<Icon type='material-icons' color='#9DD182' name='star' size={height/30} />
					);
				}
				else if(i==5||i==6){
					return(
						<Icon type='material-icons' color='#F0C751' name='star' size={height/30} />
					);
				}
				else if(i==7||i==8){
					return(
						<Icon type='material-icons' color='#67CCF2' name='star' size={height/30} />
					);
				}
				else if(i==9||i==10){
					return(
						<Icon type='material-icons' color='#D67A63' name='star' size={height/30} />
					);
				}
				else{
					return(
						<Icon type='material-icons' color='black' name='star' size={height/30} />
					);
				}
			}
		}
	}
};
_thisSelectSatus(el){
	var ar= el.split('-');
	var id = this.state._idClick;
	let temp = this.state.array_local.length >0?this.state.array_local:this.state.array_id;
	this.setState({
		array_id: [],
	});
	console.log(temp+' trc khi xu ly');
		for(let m=1;m<=12;m++){
			if(temp.includes(id+'-'+m)){
				if(m==Number(ar[1])){
				}
				else{
					temp.splice(temp.indexOf(id+'-'+m),1);
				}
			}
	}
	temp.push(el);
	console.log(temp+' sau khi xu ly');
	this.setState({
		array_local: temp,
	});
	console.log(this.state.array_local);
}
_sendComment(checklist_id){
	//id la trang thai status
	var arr = this.state.array_local;
	var temp=[];
	for(let m=1;m<=12;m++){
			if(arr.includes(checklist_id+'-'+m)){
				temp.push(m);
			}
	}
	console.log(temp[0]);
	var content = this.state.comment;
	AsyncStorage.getAllKeys((err, keys) => { 
          AsyncStorage.multiGet(keys).then((value)=>{
          	fetch('http://96.96.10.10/api/checklist_checklistitems/'+checklist_id+'?token='+value[3][1], {
				  method: 'PUT',
				  headers: {
				    'Accept': 'application/json',
				    'Content-Type': 'application/json',
				  },
				  body: JSON.stringify({
				    "checklist_id": this.state.id_faq,
				    "comment": content,
				    "id": temp[0],
				  })
				}).then((responseJson)=>{
					console.log(responseJson);
					if(responseJson.status==200){
						this.setState({
							_modal: false,
							comment: '',
						});
					}
				});
          });
    });
};
_thisCheckbox(el){
	//fix loi check 2 state if else with array_local and array_id...
	var id = this.state._idClick;
	var temp= Number(el)%2==0?Number(el)-1:Number(el)+1;
		if(this.state.array_local.length >0){
			if(this.state.array_local.includes(id+'-'+el)){
				return true;
			}
			else if(this.state.array_local.includes(id+'-'+temp)){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			if(this.state.array_id.includes(id+'-'+el)){
				return true;
			}
			else if(this.state.array_id.includes(id+'-'+temp)){
				return true;
			}
			else{
				return false;
			}
		}
}
_eachColor(el){
	console.log(el);
		if(el==1 || el==2){
			return '#4F81F0';
		}
		else if(el==3 || el==4){
			return '#9DD182';
		}
		else if(el==5 || el==6){
			return '#F0C751';
		}
		else if(el==7 || el==8){
			return '#67CCF2';
		}
		else if(el==9 || el==10){
			return '#D67A63';
		}
		else{
			return 'black';
		}
};
_eachStatus(){
	let arr = this.state.array_status;
	let view = [];
	if(arr.length > 0){
		for(let i=0;i<arr.length;i++){
			let item = arr[i];
			view.push(
				<View key={"mActions"+item.id} style={styles._mMainAction}>
					<View style={[styles._mCheckbox,styles._center]}>
						<CheckBox
							center
							iconType='font-awesome'
							checkedIcon='star'
							uncheckedIcon='star-o'
							isChecked={this._thisCheckbox(item.id)}
							checked={this._thisCheckbox(item.id)}
							checkedColor={this._eachColor(item.id)}
							onPress={()=>this._thisSelectSatus(this.state._idClick+'-'+item.id)}
							uncheckedColor='black'
							style={[styles._checkbox]}  />
					</View>
					<View style={[styles._mtextAction,styles._center]}>
						<Text style={[styles._mText,styles._center,styles._colorText,{color: i==0?'#4F81F0':i==1?'#9DD182':i==2?'#F0C751':i==3?'#67CCF2':i==4?'#D67A63':'black'}]}>
						  	{item.name}
						</Text>
					</View>
				</View>
			);
		}
	}
	else{
		// alert('No Data!');
	}
	return view;
}
_eachItem(){
	var arr = this.state.array_faq;
	const lang = this.state.language;
	// console.log(lang);
	var view = [];
	for(let i=0;i < arr.length;i++){
		// console.log(arr[i].group.name+'gr');
		let item = arr[i];
		view.push(
			<View style={[styles._datasContent,{marginTop: height/60}]} key={"namegroup"+item.group.id}>
				<View style={{flexDirection: 'row' }}>
					<Text style={{width: width/4}}>
					  	Group:
					</Text>
					<Text>
					  	{item.group.name+"gr"}
					</Text>
				</View>
			</View>
		);
			for(let a=0;a<arr[i].data.length;a++){
				// console.log(arr[i].data[a].name);
				let item = arr[i].data[a];
				view.push(
					<View style={[styles._datasContent]} key={"nameCheck"+item.id}>
						<View style={{flexDirection: 'row' }}>
							<Text style={{width: width/4,textAlign: 'auto' }}>
							  Answer:
							</Text>
							<Text>
					  			{item.name}
							</Text>
						</View>
					</View>
				);
					for(let b=0;b<arr[i].data[a].checklist_item.length;b++){
						// console.log(arr[i].data[a].checklist_item[b].id);
							let item = arr[i].data[a].checklist_item[b];
							let temp = [];
							// console.log(item);
							this.state.array_id.push(item.pivot.chkitems_id+'-'+item.pivot.chkitemstatus);
							for(let i2=0;i2 <= this.state.array_id.length-1;i2++){
								for(let j=i2+1; j <this.state.array_id.length;j++){
									if(this.state.array_id[i2]==this.state.array_id[j]){
										this.state.array_id.splice(j);
									}
								}
							}
							view.push(
							<View style={[styles._datasContent]} key={"checklist"+item.id}>
								<View style={styles._dataContent}>
									<Text>
							  			{arr[i].data[a].checklist_item[b].content}
									</Text>
								</View>
								<View style={[styles._actionsContent,{borderBottomWidth: 1}]}>
										<View style={[styles._itemAction,styles._center]}>
											<View style={styles._iconAction}>
												<Icon type='foundation' color='#4C88FF' name='comments' size={height/30} />
											</View>
											<View style={styles._textAction}>
												<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Screen_CommentList',{checklist_id: this.state.id_faq,id_answer: item.id})}}>
													<Text style={styles._text}>
													  	Comment
													</Text>
												</TouchableOpacity>
											</View>
										</View>
										<View style={[styles._itemAction,styles._center]}>
											<View style={styles._iconAction}>
												  	{this._renderIconStatus(item.id)}
											</View>
											<View style={styles._textAction}>
												<TouchableOpacity key={"action:key"+item.id} onPress={()=>this._onPressAction(item.id)} >
													{this._renderStatus(item.id)}
												</TouchableOpacity>
											</View>											
										</View>
										<View style={[styles._itemAction,styles._center]}>
											<View style={styles._iconAction}>
												<Icon type='material-icons' name='do-not-disturb' size={height/30} />
											</View>
											<View style={styles._textAction}>
												<Text style={styles._text}>
									  				Refer
												</Text>
											</View>
										</View>
								</View>
							</View>
						);
					}
			}
	}
	return view;
};
// _keyExtractor(){
// 	var arr = this.state.array_faq;
// 	const id =[];
// 	// console.log(arr);
// 	arr.map(function(item){
// 		item.data.map(function(data){
// 			id.push(data.id);
// 		});
// 	});
// 	return id;
// }
render() {
	return (
			<View style={[styles.row]}>
				<Modal 
					animationType="slide"
					transparent={false}
					visible={this.state.isLoading}
					onRequestClose={() => {alert("Modal has been closed.")}} >
						<View style={styles._img}>
							<Image
								style={{justifyContent: 'center', alignItems: 'center',height: height/10,width: height/10}}
								source={require('../images/loading_green.gif')}
							/>
						</View>
				</Modal>
				<Modal 
					animationType="slide"
					transparent={true}
					visible={this.state._mComment}
					onRequestClose={() => {alert("Modal has been closed.")}} >
						
				</Modal>
				<Modal 
					animationType="slide"
					transparent={true}
					visible={this.state._modal}
					onRequestClose={() => {alert("Modal has been closed.")}} >
						<View style={[styles._actionRow,styles._center]}>
							<View style={styles._mcontentAction}>
								<View style={styles._mheadAction}>
									<Text style={[styles._colorText,{fontSize: height/40,}]} >
									  	Actions
									</Text>
								</View>
								<View style={styles._mdataAction}>
									{this._eachStatus()}
								</View>
								<View style={styles._mComment}>
									<Text style={styles._colorText}>
									  	Comement:
									</Text>
									<TextInput style={[styles.input,{height: Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height))} ]}
	         				 			multiline
										underlineColorAndroid='white'
				          				onContentSizeChange={this.handleContentSizeChange}
				          				onChangeText={(text)=>this._onCommentChange(text)}
				          				value={this.state.comment}
	         						/>
								</View>
								<View style={[styles._mfootAction,styles._center]}>
									<View>
										<TouchableOpacity onPress={()=>{this._closeStatus()}}>
											<Text>
											  	Cancel
											</Text>
										</TouchableOpacity>
									</View>
									<View>
										<TouchableOpacity onPress={()=>this._sendComment(this.state._idClick)}>
											<Text>
											  	Save
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
				</Modal>
				<View style={styles._header}>
					<View style={[styles._textHeader,styles._center]}>
						<Text style={[styles._textHead,{borderWidth: 1}]}>
							Checklist company
						</Text>
					</View>
					<View style={styles._startFaQ}>
						
					</View>
				</View>
				<View style={styles._content}>
					<ScrollView>
						<View style={styles._itemsContent}>
							{this._eachItem()}
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}
const {height,width} = Dimensions.get('screen');
const styles= StyleSheet.create({
	_center:{
		justifyContent: 'center',
		alignSelf: 'center',
		alignItems: 'center',
	},
	_textCenter:{
		textAlign: 'center',
		alignSelf: 'center',  
	},
	font_size:{
		fontSize: normalize,
	},
	row:{
		flex: 1,
		flexDirection: 'column',
		backgroundColor: 'rgba(192,192,192,0.5)',
	},
	_mRowComment:{
		width: width,
		height: height,
		padding: 10,
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	_mbodyComment:{
		backgroundColor: 'white',
		width: width-30,
		height: height-15,
		paddingHorizontal: 5,
		paddingTop: 5,
		flexDirection: 'column',
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5, 
	},
	_mheadComment:{
		height: ((height-15)/10),
	},
	_mdataComment:{
		height: ((height-15)/10)*8,
	},
	_mScrolView:{
		height: ((height-15)/10)*8,
	},
	_mItemsComment:{
		flexDirection: 'row',
		borderBottomWidth: 0.3,
	},
	_mitemUser:{
		flex: 0.2,
	},
	_mitemContent:{
		flex: 0.8,
		flexDirection: 'column', 
	},
	_textActions:{
		flexDirection: 'row', 
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingRight: 5,
	},
	_mtextComment:{
		height: ((height-10)/10)*1.5,
	},
	_minputText:{
		flex: 1,
	},
	_mClickComment:{
		flex: 1,
		flexDirection: 'row', 
	},
	_actionRow:{
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
		width: width,
	},
	_mcontentAction:{
		height: (height/4)*2,
		backgroundColor: '#E8E9EC',
		width: width-20,
		paddingVertical: 0,
		flexDirection: 'column', 
	},
	_actionRepComment:{
		paddingLeft: width/20,
		flexDirection: 'row',
		paddingBottom: 2,
	},
	_itemText:{
		flexDirection: 'column', 
	},
	_mChildComment:{
		flexDirection: 'row', 
	},
	_mChildActions:{
		flexDirection: 'row', 
	},
	_mChildContent:{
		flexDirection: 'column',
	},
	_repUser:{
		flex: 0.1,
	},
	_repTextInput:{
		flex: 0.5,
	},
	_repActions:{
		flex: 0.2,
		marginHorizontal: 2,
		flexDirection: 'row',
	},
	_mheadAction:{
		flex: 0.1,
		marginHorizontal: 5,
		marginVertical: 5,
		justifyContent: 'flex-end',
		alignItems: 'center', 
	},
	_mdataAction:{
		flex: 0.55,
		marginHorizontal: 5,
		marginVertical: 5,
		// backgroundColor: 'white',
	},
	_mComment:{
		flex: 0.2,
		backgroundColor: '#E8E9EC',
		flexDirection:  'column',
		marginVertical: 5,
		marginHorizontal: 5,
	},
	_mfootAction:{
		flex: 0.1,
		marginHorizontal: 5,
		// marginVertical: 5,
		marginBottom: 5,
		// backgroundColor: 'white',
		flexDirection: 'row',
		borderWidth: 0.4,
	},
	_mMainAction:{
		flex: 1,
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderColor: 'black',
	},
	_checkbox:{
		backgroundColor: 'rgba(255,255,255,0)',
		paddingLeft: 20,
	},
	_mCheckbox:{
		flex: 0.1,
	},
	_mtextAction:{
		flex: 0.9,
	},
	_img:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',  
	},
	input: {
    // textAlignVertical: "top",
    textAlign: 'left',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#DDDFE2',
    paddingVertical: height/60,
    backgroundColor: 'white',
    // borderColor: "rgb(232,232,232)",
  	},
  	_colorText:{
		fontSize: height/50,
		color: 'black',
  	},
	_header:{
		flex: 0.1,
		backgroundColor: 'white',
		flexDirection: 'column', 
	},
	_textHeader:{
		flex: 1,
	},
	_startFaQ:{
		flex: 1,
		backgroundColor: 'cyan'
	},
	_content:{
		flex: 0.9,
		flexDirection: 'column', 
	},
	_itemsContent:{
		padding: 2,
	},
	_datasContent:{
		backgroundColor: 'white',
		paddingHorizontal: 5,
		flexDirection: 'column',
	},
	_dataContent:{
		flex: 0.7,
	},
	_actionsContent:{
		flex: 0.3,
		padding: 2,
		flexDirection: 'row', 
	},
	_itemAction:{
		flex: 0.3,
}
});
export default ListFaQ;
