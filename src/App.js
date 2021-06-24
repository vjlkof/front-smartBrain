import React, {Component} from 'react';
import './App.css';
import Navigation from './Components/Navigation'
import Logo from './Components/Logo'
import ImageLinkForm from './Components/ImageLinkForm'
import FaceRecognition from './Components/FaceRecognition'
import Signin from './Components/Signin'
import Register from './Components/Register'
import Rank from './Components/Rank'
import Particles from 'react-particles-js';

const particlesOptions={
  particles: {
    number:{
      value:60,
      density:{
        enable: true,
        value_area: 800
      }
    }
  }
} 

const initialState= {
  
  input: '',
  imageUrl: '',
  box:[{}],
  route: 'signin',
  isSignedIn:false,
  user: {
    id:'',
    name:'',
    email:'',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

loadUser= (data)=>{
  this.setState({user: {
    id:data.id,
    name:data.name,
    email:data.email,
    entries:data.entries,
    joined:data.joined
  }})
}

/* componentDidMount(){
  fetch('http://localhost:3000/')
  .then(response => response.json())
  .then(console.log)
} */

  calculateFaceLocation =(data) =>{
    /*ori const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box; */
    const image = document.getElementById('inputimage');
    console.log("image: " + image)
    const width = Number(image.width);
    const height = Number(image.height);
    let clarifaiFace = '';
    const results = data.map ((face) => {
      clarifaiFace = face.region_info.bounding_box;
      return {
        leftcol: clarifaiFace.left_col * width,
        toprow: clarifaiFace.top_row * height,
        rightcol: width - (clarifaiFace.right_col * width),
        bottomrow: height - (clarifaiFace.bottom_row * height)
      }
    });       
    return results;
    /*ori return {
      leftcol: clarifaiFace.left_col * width,
      toprow: clarifaiFace.top_row * height,
      rightcol: width - (clarifaiFace.right_col * width),
      bottomrow: height - (clarifaiFace.bottom_row * height),
    } */
    
    /* /* const results = data.map =(result,i) =>{
      clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
      return clarifaiFace
    }
    this.setState({box: results}); */
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box})
  }
  onInputChange = (event) =>{
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    console.log("Pass Image:" + this.state.imageUrl);
    fetch('http://localhost:3001/imageurl',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response){
        fetch('http://localhost:3001/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user, {entries:count}))
        })
        .catch(console.log)
      }
      console.log('display-response: ' + response)
      this.displayFaceBox(this.calculateFaceLocation(response.outputs[0].data.regions))
    })
    .catch(err => console.log(err));
  }
/*      This was the original way to do it   
        function (response) {
          this.calculateFaceLocation(response)  ;
          console.log("Predicted concepts:" + this.state.box);
          /* for (const concept of output.data.concepts) {
              console.log(concept.name + " " + concept.value);
          } */
          /* data needed from the response data from clarifai API, 
             note we are just comparing the two for better understanding 
             would to delete the above console*/ 
          /* console.log(
            response.outputs[0].data.regions[0].region_info.bounding_box
          );
        },
        function (err) {
          // there was an error
          if (err) {
            console.log("Opps")
            throw new Error(err);
          }
       /*  if (response.status.code !== 10000) {
          throw new Error("Post model outputs failed, status: " + response.status.description);
        } */
  onRouteChange =(route) => {
    if (route === 'signout'){
      this.setState(initialState)  
    }else if (route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render(){
    const {isSignedIn, imageUrl, route,box, user} = this.state;
    return (
      <div className="App">
      <Particles className = "particles" params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'
        ? <div>
        <Logo/>
        <Rank name={user.name} entries={user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
        : (
          route === 'signin'
          ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
        }
      </div>
    );
  }
}
export default App;
