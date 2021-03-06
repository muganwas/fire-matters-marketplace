import React from 'react';
import { connect } from 'react-redux';
//import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ProfileImage } from 'components';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './sideBar.css';
import { ownerOccupierOptions, serviceProviderOptions, menuIconTitles } from 'extras/config';

@connect((store)=>{
    return {
        userInfo: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info
    }
})
class SideBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let userType = (JSON.parse(sessionStorage.getItem('loginSession'))).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "Owner/Occupier" || userType === "owner-occupier" || userType === "owner_occupier"){
            genInfo.defaultProps.sideBarOptions = ownerOccupierOptions;
            genInfo.defaultProps.leftMenuClass = "left-menu oo";
            genInfo.defaultProps.sideBarClass = "side-bar oo";
        }else{
            genInfo.defaultProps.sideBarOptions = serviceProviderOptions;
            genInfo.defaultProps.leftMenuClass = "left-menu sp";
            genInfo.defaultProps.sideBarClass = "side-bar sp";
        }
        this.props.dispatch(dispatchedGenInfo(genInfo));
        
    }

    removeSelcected = ()=>{
        return new Promise((resolve, reject)=>{
            document.getElementById('left-menu').getElementById('selected').className = "selected";
            resolve("removed");
        });  
    }

    select = (e)=>{

        let id = e.target.id,
        genInfo = {...this.props.genInfo},
        sideBarOptions = this.props.genInfo.defaultProps.sideBarOptions;
        document.getElementById(id).className="selected";
        setTimeout(()=>{
            Object.keys(sideBarOptions).map(key=>{
                if(key === id){
                    genInfo.sideBar.currentTab = key;
                    this.props.dispatch(dispatchedGenInfo(genInfo));
                    document.getElementById(key).className="selected";
                }else
                    document.getElementById(key).className="";        
            });
        }, 20);      
    }

    clickParent=(e)=>{
        let name = e.target.getAttribute('name');
        document.getElementById(name).click();
    }

    menuItems = (key)=>{
        let sideBarOptions = this.props.genInfo.defaultProps.sideBarOptions,
        selected = this.props.genInfo.sideBar.currentTab;
        return(
            <span name="menuItems" className = { key===selected?"selected":""} id={ key } onClick={ this.select } key={ key }>
                <div name={ key} onClick={ this.clickParent }>
                    <i name={ key } onClick={ this.clickParent } className="material-icons left">{ menuIconTitles[key]}</i>
                    <div name={ key } onClick={ this.clickParent } className="item left">{ sideBarOptions[key] }</div>
                </div>
                <div className = "clear"></div>
            </span>
        )
    }
    render(){
        let userName = (JSON.parse(sessionStorage.getItem('loginSession'))).fullName,
        sideBarOptions = this.props.genInfo.defaultProps.sideBarOptions,
        sideBarClass = this.props.genInfo.defaultProps.sideBarClass,
        leftMenuClass = this.props.genInfo.defaultProps.leftMenuClass;
        return(
            <div className={ sideBarClass }>
                <ProfileImage />
                <span id="greeting">Hi, { userName }</span>
                <div id="left-menu" className={ leftMenuClass }>
                    { Object.keys(sideBarOptions).map(this.menuItems) }
                </div>
            </div>
        )
    }
}

SideBar.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SideBar.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default withRouter(SideBar);