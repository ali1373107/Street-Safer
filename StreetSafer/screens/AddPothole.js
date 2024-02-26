import { useState } from 'react';
import {View,TextInput,Button,StyleSheet,Model} from 'react-native';

function AddPothole(props){
    const [enteredText,setEnteredText]= useState('')
    
    function inputHandeler(input){
        setEnteredText(input)
      }
      function addGoalHandelr(){
        props.onAddGoal(enteredText)
        setEnteredText('')
      }
    return(
            <View style={styles.inputContainer}>
                <TextInput style={styles.textInput}
                placeholder="Your Goals"
                onChangeText={inputHandeler
                }
                value={enteredText}
                />

                <Button title="Add Goals" onPress={addGoalHandelr}/>
        </View>
    
    )
};
export default  AddPothole;

const styles = StyleSheet.create({
    inputContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      paddingBottom:24,
      borderBottomWidth:1,
      borderBottomColor:'#cccccc'
    },
    textInput:{
      borderWidth:1,
      borderColor:'#cccccc',
      width:'70%',
      marginRight:8,
      padding:8
    },
  

  });