import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import './moreHoriz.css';
import { dispatchedGenInfo, dispatchedSubContractorsInfo, dispatchedTendersInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        genInfo: store.genInfo,
        tendersInfo: store.tenders.info,
        subContractorsInfo: store.subContractors.info
    }
})
class MoreHoriz extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    
    toggleMenu = ()=>{
        let genInfo = { ...this.props.genInfo.info },
        subContractorsInfo = { ...this.props.subContractorsInfo},
        tendersInfo = { ...this.props.tendersInfo },
        listName = this.props.listName;
        //dispatch issues let to duplication
        if(listName === "subContractors"){
            if(this.props.className === "hidden"){
                subContractorsInfo[listName][this.props.id].moreMenuClassName = "dropDownMenu";
                Object.keys(subContractorsInfo[listName]).map((key)=>{
                    if(key !== this.props.id)
                        subContractorsInfo[listName][key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedSubContractorsInfo(subContractorsInfo));  
                this.forceUpdate();         
            }else{
                subContractorsInfo[listName][this.props.id].moreMenuClassName = "hidden";
                this.props.dispatch(dispatchedSubContractorsInfo(subContractorsInfo));
                this.forceUpdate(); 
            }
        }else if(listName === "tenders"){
            if(this.props.className === "hidden"){
                tendersInfo[listName][this.props.id].moreMenuClassName = "dropDownMenu";
                Object.keys(tendersInfo[listName]).map((key)=>{
                    if(key !== this.props.id)
                        tendersInfo[listName][key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedTendersInfo(tendersInfo));  
                this.forceUpdate();         
            }else{
                tendersInfo[listName][this.props.id].moreMenuClassName = "hidden";
                this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                this.forceUpdate(); 
            }
        }else{
            if(this.props.className === "hidden"){
                genInfo[listName][this.props.id].moreMenuClassName = "dropDownMenu";
                Object.keys(genInfo[listName]).map((key)=>{
                    if(key !== this.props.id)
                        genInfo[listName][key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedGenInfo(genInfo));
                this.forceUpdate();           
            }else{
                genInfo[listName][this.props.id].moreMenuClassName = "hidden";
                this.props.dispatch(dispatchedGenInfo(genInfo));
                this.forceUpdate(); 
            } 
        }           
    }

    detailedElement = (key)=>{
        let element = this.props.element;
        return(
            <div key={key}>
                <span>{ element[key] }</span>
            </div>
        )
    }

    options = (key)=>{
        let options = this.props.options,
        onClick = key === "sendMessage"?this.props.onClick: key === "delete"? this.props.onDelete : this.props.onClickAlt;
        return(
            <div className="more-li" id={ this.props.id } autoid = { this.props.autoid } email={ this.props.email } onClick={ onClick } key={key}>{ options[key] }</div>
        )
    }

    render(){ 
        let click = this.props.toggle?()=>this.props.toggle(this.props.id):this.toggleMenu;
        return(
            <div id={ this.props.id }>
                <div  onClick={ click } className="more">
                    <i class="material-icons yellow">more_horiz</i>
                </div>
                <div className={ this.props.className }>
                    { Object.keys(this.props.options).map(this.options) }
                </div>
            </div>
        )
    }
}

MoreHoriz.defaultProps = {
    user: {},
    genInfo: {},
    className: null,
    options: null
}

MoreHoriz.propTypes = {
    user: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    element: PropTypes.object,
    id: PropTypes.string,
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    autoId: PropTypes.string,
    email: PropTypes.string
}

export default MoreHoriz;