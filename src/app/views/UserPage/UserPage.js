import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { dispatchedGenInfo } from 'extras/dispatchers';
import { HeaderMain, Footer, SideBar, ProfileTab } from 'components';
import './userPage.css';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT,
tokenVerificationEndPoint = process.env.TOKEN_VERIFICATION_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo.info,
        tabs: store.genInfo.info.sideBar.profilePage.tabs,
        currentTab: store.genInfo.info.sideBar.currentTab,
    }
})
class UserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    componentWillMount(){
        let info = {...this.props.genInfo};
        let sessionInfo = sessionStorage.getItem('loginSession')?JSON.parse(sessionStorage.getItem('loginSession')): {},
        token = sessionInfo.token,
        tokenCheckURL = baseUrl + tokenVerificationEndPoint;
        if(!token)
            this.props.history.push('/login');
        axios.post(tokenCheckURL, {token}).
        then(res=>{
            if(!res.data.uid){
                info.alternatingNavigation.home = "/home";
                info.alternatingNavigation.headerClass = "App-header";
                this.props.dispatch(dispatchedGenInfo(info));
                sessionStorage.removeItem('loginSession');
                this.props.history.push('/login');
            }
            info.alternatingNavigation.headerClass = "App-header-loggedin";
            this.props.dispatch(dispatchedGenInfo(info));    
        }).
        catch(error=>{
            console.log(error);
            info.alternatingNavigation.home = "/home";
            info.alternatingNavigation.headerClass = "App-header";
            this.props.dispatch(dispatchedGenInfo(info));
            sessionStorage.removeItem('loginSession');
            this.props.history.push('/login');
        });
    }

    activate = (e)=>{
        let id = e.target.id,
        genInfo = {...this.props.genInfo},
        tabs = this.props.tabs;
        genInfo.sideBar.currentHorizontalTab = id;
        this.props.dispatch(dispatchedGenInfo(genInfo));
        document.getElementById(id).className="active";
        setTimeout(()=>{
            Object.keys(tabs).map(key=>{
                if(key === id)
                    document.getElementById(key).className="active";
                else
                    document.getElementById(key).className="";        
            });
        }, 20);
    }

    tabTitle=(key)=>{
        let tabs = this.props.tabs;
        return (
            <span id={key} onClick={ this.activate } className={ key==="personnel"?"active":null} key={ key }>{ tabs[key] }</span>
        )
    }
    
    render(){
        let tabs = this.props.tabs,
        currentTab = this.props.currentTab;
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="user-page mid">
                    <div className="twenty left">
                        <SideBar />
                    </div>
                    <div className="hanad left">
                        <div className="content">
                            <div className="tabs">{ Object.keys(tabs).map(this.tabTitle) }</div>
                            {currentTab==="ProfileTab"?<ProfileTab />:null}
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="bottom-alt">
                    <Footer />
                </div>
            </div>
        )
    }
}

UserPage.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

UserPage.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default withRouter(UserPage);