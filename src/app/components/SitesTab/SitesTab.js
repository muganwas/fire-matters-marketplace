import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { 
    dispatchedSitesInfo,
    dispatchedListingsInfo, 
    dispatchedGenInfo, 
    dispatchedUserInfo } from 'extras/dispatchers';
import './sitesTab.css';
import { SearchInput, FmButton, ListedPostedSites } from 'components';
import { SitesForm } from 'forms';
import {  
    statesAustralia
} from 'extras/config';
import  { styles, submit_styles } from './styles';


const baseURL = process.env.BACK_END_URL,
sitesEndPoint = process.env.SITES_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        siteData: store.user.info.submitSite.siteDits,
        profileInfo: store.user.info.profileInfo,
        equipment: store.user.info.profileInfo.equipment,
        secondarySelect: store.secondarySelect.info,
        search: store.search,
        genInfo: store.genInfo.info,
        listingsInfo: store.listingsInfo.info,
        sitesInfo: store.sites.info
    }
})
class SitesTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //set initial attributes
        this.fetchSites();
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    fetchSites = ()=>{
        return new Promise(resolve=>{
            let sitesInfo = {...this.props.sitesInfo },
            genInfo = { ...this.props.genInfo },
            userType = this.props.profileInfo.userType,
            userEmail = this.props.profileInfo.emailAddress,
            url = baseURL + sitesEndPoint + "?emailAddress=" + userEmail;
            if(userType){
                if(userType === "owner_occupier"){
                    axios.get(url).then((response)=>{
                        //console.log(response.data);
                        let sites = sitesInfo.sites = genInfo.sites = {...response.data};
                        genInfo.sideBar.profilePage.listCount['sites'] = (response.data).length;
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(sites).map((key)=>{
                            sitesInfo.sites[key].moreMenuClassName = "hidden";
                        })
                        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        resolve("fetched");
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            }
        });    
    }

    renderListingForm = ()=>{
        let listingsInfo = {...this.props.listingsInfo};
        listingsInfo.createForm.show = !listingsInfo.createForm.show;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));               
    }

    renderSitesForm = ()=>{
        let sitesInfo = {...this.props.sitesInfo};
        sitesInfo.createSite.show = ! sitesInfo.createSite.show;
        this.props.dispatch(dispatchedSitesInfo(sitesInfo));               
    }

    checkForErrors(){
        return new Promise((resolve)=>{
            let userInfo = {...this.props.user},
            errors = userInfo.submitSite.errors,
            errCount = Object.keys(errors).length;          
            resolve(errCount);
        }); 
    }

    upload=()=>{
        let siteData = {...this.props.siteData},
        userInfo = {...this.props.user},
        equipment = {...this.props.sitesInfo.createSite.defaultEquipmentObject},
        postInfoUrl = baseURL + sitesEndPoint,
        siteOwner = JSON.parse(sessionStorage.getItem('profileInfo')).emailAddress,
        siteName = siteData.siteName, 
        siteState = siteData.siteState, 
        siteCity = siteData.siteCity, 
        siteArea = siteData.siteArea,
        siteSuburb = siteData.siteSuburb,
        siteStreet = siteData.siteStreet,
        siteContact = siteData.siteContact,
        offerValidity = siteData.offerValidity,
        contractPeriod = siteData.contractPeriod;

        console.log(equipment)

        let postObject = {
            siteOwner,
            siteName, 
            siteState, 
            siteCity,  
            siteArea, 
            siteSuburb,
            siteStreet,
            siteContact,
            offerValidity,
            contractPeriod,
            equipment
        };

        console.log(postObject)
        this.checkForErrors().then(res=>{
            if(res === 0){
                userInfo.submitSite.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, { submitData: postObject }).
                then(res=>{
                    userInfo.submitSite.submitButton.isActive = true;
                    userInfo.submitSite.feedback = "Site posted successfully!";
                    userInfo.submitSite.feedbackClass="success";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(res);
                }).
                catch(err=>{
                    userInfo.submitSite.submitButton.isActive = true;
                    userInfo.submitSite.feedbackClass="error-feedback";
                    userInfo.submitSite.feedback = "Something went wrong, try again later.";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(err);
                });
            }
        });
    };

    dummy= ()=>{
        return Promise.resolve("Nassing");
    }

    save=(e)=>{
        e.persist();
        return new Promise((resolve, reject)=>{
            let userInfo = {...this.props.user},
            id = e.target.id,
            type = e.target.getAttribute('type'),
            origName = e.target.getAttribute("category");
            console.log(type)
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.getAttribute('value');
            value = value?value:e.target.value;
            userInfo.submitSite.siteDits[name] = value;
            userInfo.submitSite.siteDits[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    }

    searchListings = ()=>{

    }

    render(){
        const submitSite = {...this.props.user.submitSite},
        sitesInfo = { ...this.props.sitesInfo},
        showSitesForm = sitesInfo.createSite.show,
        listingAttributes = this.props.siteData,
        errors = {...this.props.user.submitSite.errors},
        userType = this.props.profileInfo.userType,
        feedback = submitSite.feedback,
        feedbackClass = submitSite.feedbackClass;
       
        return(
            <div className="tenders main-content">

                {showSitesForm
                ?<SitesForm
                    feedback = { feedback }
                    feedbackClass = { feedbackClass }
                    errors = { errors }
                    states = {statesAustralia}
                    contractStatusOptions = {{inactive: "Not Active", active: "Active"}}
                    styles = { submit_styles }
                    attributes = { listingAttributes } 
                    close={ this.renderSitesForm }
                    submitButton = { this.props.user.submitSite.submitButton }
                    onBlur={ this.dummy } 
                    upload={ this.upload } 
                    save={ this.save } 
                />
                :null}
                <div className="title-bar">
                    <span id="title">Sites</span>
                    {userType === "owner_occupier"?<span id="search">
                        <FmButton variant="contained" onClick={ this.renderSitesForm } styles={ styles } text="Register New Site" />
                        <SearchInput className="alt-search" placeholder="search for your sites" search={ this.searchListings } />
                    </span>:null}
                </div>
                <ListedPostedSites />
            </div>
        )
    }
}

SitesTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SitesTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default SitesTab;