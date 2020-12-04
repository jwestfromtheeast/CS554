import React, {Component} from 'react'
import TopBar from "./TopBar"

class Form extends Component{
    constructor(props){
        super(props)
       
        this.state = {
            username: props.user.username,
            url:props.user.profilePic
        }
    }
    handlePicChange = async (event) => {

        let bod = {username: this.state.username, newPhoto: event.target.value}
        console.log(bod)
        const response = await fetch("http://localhost:3001/api/uploadNewPhoto",{
            method: 'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(bod)
        })
        let res = await response.json();
        console.log(res)
        this.props.onProfilePicChange(res);
    }
    render(){
        return(
            <div className="webpage">
      <TopBar></TopBar>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <form>
                    <div>
                        <label>Choose Profile Picture</label>
                        <select onChange={this.handlePicChange}>
                            <option value="banana.jpg">Banana</option>
                            <option value="blueberry.jpg">Blueberry</option>
                            <option value="default.jpg">Default</option>
                            <option value="strawberry.jpg">Strawberry</option>
                            <option value="watermelon.jpg">Watermelon</option>
                        </select>
                    </div>
                </form>
            </div>
            </div>
            </div>
          </div>
        </div>
</div>
        )
    }
}export default Form